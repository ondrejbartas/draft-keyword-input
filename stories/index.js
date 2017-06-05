import React from 'react'
import { storiesOf } from '@kadira/storybook'
import KeywordInput from '../src/KeywordInput'

const StyledInputDecorator = story => (
  <div style={{ width: 500, border: '1px inset gray', padding: 5, fontFamily: 'Arial', fontSize: 16, margin: 'auto', marginTop: 200 }}>
    {story()}
  </div>
)

storiesOf('KeywordInput', module)
  .addDecorator(StyledInputDecorator)
  .add('acts as regular input', () => (
    <KeywordInput />
  ))
  .add('recognized keyword is highlighted', () => (
    <KeywordInput value="{{keyword}} is here" keywordMap={{ keyword: 'recognized' }} />
  ))
  .add('keyword with modifier', () => (
    <KeywordInput value="There is keyword {{keyword:modifier}} here" keywordMap={{ keyword: 'with modifier' }} />
  ))
  .add('keyword with parametrized modifier', () => (
    <KeywordInput value="There is keyword {{keyword:modifier(5)}} here" keywordMap={{ keyword: 'with parametrized modifier' }} />
  ))
