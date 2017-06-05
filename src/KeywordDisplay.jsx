// @flow
import React from 'react'
import { ContentState } from 'draft-js'

type Props = {
  children: React.Element<*>,
  entityKey: string,
  contentState: ContentState,
  onContentChange: (entityData: Object, changeType: string) => void
};

export default function KeywordDisplay({ children, entityKey, contentState, onContentChange }: Props) {
  const onClick = () => {
    onContentChange(contentState.mergeEntityData(entityKey, {
      foo: 'bar',
    }), 'apply-entity')
  }
  const { modifiers } = contentState.getEntity(entityKey).getData()
  return (<span
    style={{ backgroundColor: 'cyan' }}
    onClick={onClick}
  >{children}{`(${modifiers.map(m => `${m.type}[${m.args.join(',')}]`)})`}</span>)
}
