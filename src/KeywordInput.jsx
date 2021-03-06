/* @flow */
import React, { Component } from 'react'
import { EditorState, ContentState, SelectionState, CompositeDecorator, Modifier, convertToRaw } from 'draft-js'
import { compose, pure, withState, withHandlers } from 'recompose'
import { TypeaheadEditor } from 'draft-js-typeahead'

import { createKeywordEntity, expandKeywordEntities } from './keywordEntity'
import Keywords from './Keywords'
import KeywordDisplay from './KeywordDisplay'
import keywordStrategy from './keywordStrategy'

import type { KeywordMap } from './types'

const decorate = compose(
  pure,
  withState('editorState', 'onEditorChange', EditorState.createEmpty()),
  withState('typeaheadState', 'onTypeaheadChange', null),
  withHandlers({
    onContentChange: props => (contentState, changeType) => {
      const editorState = EditorState.push(props.editorState, contentState, changeType)
      props.onEditorChange(editorState)
    },
  }),
)

type Props = {
  value: string,
  keywordMap: KeywordMap,
  editorState: EditorState,
  typeaheadState: Object,
  onEditorChange(EditorState, cb?: Function): void,
  onContentChange(ContentState): void,
  onTypeaheadChange(Object): void,
};

class KeywordInput extends Component {
  props: Props;
  static defaultProps = {
    value: '',
  };
  componentWillMount() {
    this.applyValue(this.props.value)
  }
  componentWillUpdate({ value }: Props) {
    if (value !== this.props.value) {
      this.applyValue(value)
    }
  }
  componentDidUpdate() {
    const { editorState, onEditorChange }: Props = this.props
    // temporary
    if (editorState.getCurrentContent().getLastBlock().getText().endsWith('#')) {
      onEditorChange(addKeywordEntity(editorState, 'test'))
    }
  }
  applyValue(value) {
    const decorator = this.getDecorator()
    const editorState = EditorState.createWithContent(
      ContentState.createFromText(value), decorator,
    )
    this.props.onEditorChange(
      expandKeywordEntities(editorState, this.props.keywordMap),
    )
  }
  getDecorator() {
    return new CompositeDecorator([
      {
        strategy: keywordStrategy(this.props.keywordMap),
        component: KeywordDisplay,
        props: { onContentChange: this.props.onContentChange },
      },
    ])
  }
  renderTypeahead() {
    const { typeaheadState } = this.props
    if (typeaheadState === null) {
      return null
    }
    return <Keywords {...typeaheadState} />
  }
  render() {
    const { editorState, onEditorChange, onTypeaheadChange } = this.props
    return (<div>
      {this.renderTypeahead()}
      <TypeaheadEditor
        editorState={editorState}
        onChange={onEditorChange}
        onTypeaheadChange={onTypeaheadChange}
      />
      <pre>{JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, 2)}</pre>
    </div>)
  }
}

function addKeywordEntity(editorState, keyword) {
  const contentState: ContentState = createKeywordEntity(editorState.getCurrentContent(), keyword)
  const entityKey: string = contentState.getLastCreatedEntityKey()
  const currentSelectionState: SelectionState = editorState.getSelection()

  const keywordInsertedContent = Modifier.insertText(
    contentState,
    currentSelectionState,
    'KEYWORD',
    null, // no inline style needed
    entityKey,
  )

  return EditorState.push(editorState, keywordInsertedContent, 'insert-fragment')
}


export default decorate(KeywordInput)
