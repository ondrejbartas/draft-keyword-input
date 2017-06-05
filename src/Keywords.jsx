/* @flow */
import React from 'react'

type Props = {
  left: number,
  top: number,
  selectedIndex: number,
  text: string,
};

function Keywords({ left, top, selectedIndex, text }: Props) {
  const typeaheadStyle = {
    backgroundColor: 'red',
    position: 'absolute',
    left,
    top,
  }
  return <h3 style={typeaheadStyle}>Keywords</h3>
}

export default Keywords
