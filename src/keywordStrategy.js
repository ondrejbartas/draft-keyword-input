// @flow
import { ContentState, ContentBlock } from 'draft-js'

import { ENTITY_TYPE } from './keywordEntity'

import type { KeywordMap } from './types'

export default function keywordStrategy(keywordMap: KeywordMap) {
  return (contentBlock: ContentBlock, callback: Function, contentState: ContentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity()
        if (entityKey === null) {
          return false
        }
        return contentState.getEntity(entityKey).getType() === ENTITY_TYPE
      },
      callback,
    )
  }
}
