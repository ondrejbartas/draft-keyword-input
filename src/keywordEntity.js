// @flow
import { EditorState, ContentState, ContentBlock, SelectionState, Modifier } from 'draft-js'

import type { KeywordMap, KeywordModifier } from './types'

export const ENTITY_TYPE = 'KEYWORD'
const ENTITY_MUTABILITY = 'immutable'
const ENTITY_REGEX = /\{\{([^}]+)\}\}/gm
const MODIFIER_REGEX = /([^(]*)(?:\(([\d,]*)\))?/ // https://regex101.com/r/gKUvdC/1

export function createKeywordEntity(
  contentState: ContentState,
  keyword: string,
  modifiers: KeywordModifier[] = [],
): ContentState {
  return contentState.createEntity(
    ENTITY_TYPE, ENTITY_MUTABILITY, { keyword, modifiers },
  )
}

export function expandKeywordEntities(
  editorState: EditorState,
  keywordMap: KeywordMap,
): EditorState {
  const blockMap = editorState.getCurrentContent().getBlockMap()
  return blockMap.reduce((outEditorState: EditorState, contentBlock: ContentBlock) => (
    EditorState.push(outEditorState, expandBlockKeywordEntities(
      contentBlock, outEditorState.getCurrentContent(), keywordMap,
    ))
  ), editorState)
}

function expandBlockKeywordEntities(
  contentBlock: ContentBlock,
  contentState: ContentState,
  keywordMap: KeywordMap,
): ContentState {
  const blockText = contentBlock.getText()

  return findMatches(ENTITY_REGEX, blockText).reduce((outContentState, match) => {
    const [fullMatch, keywordEntry] = match
    const { keyword, modifiers } = parseKeywordEntry(keywordEntry)

    const contentStateWithEntity = createKeywordEntity(outContentState, keyword, modifiers)
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const contentBlockKey = contentBlock.getKey()

    const start = match.index
    const range = SelectionState.createEmpty().merge({
      anchorKey: contentBlockKey,
      anchorOffset: start,
      focusKey: contentBlockKey,
      focusOffset: start + fullMatch.length,
    })

    return Modifier.replaceText(
      contentStateWithEntity,
      range,
      keywordMap[keyword],
      null, // no inline style needed
      entityKey,
    )
  }, contentState)
}

function parseKeywordEntry(keywordEntry: string): { keyword: string, modifiers: KeywordModifier[] } {
  const [keyword, ...modifierEntries] = keywordEntry.split(':')
  return {
    keyword,
    modifiers: modifierEntries.reduce(parseModifierEntry, []),
  }
}

function parseModifierEntry(modifiers: KeywordModifier[], modifierEntry: string): KeywordModifier[] {
  const match = modifierEntry.match(MODIFIER_REGEX)
  if (match) {
    const [, type, argsText] = match
    const args = argsText ? argsText.split(',').map(Number) : []
    modifiers.push({ type, args })
  }
  return modifiers
}

function findMatches(regexp, text) {
  const matches = []
  let match = null
  while ((match = regexp.exec(text)) !== null) {
    matches.push(match)
  }
  return matches.reverse()
}

