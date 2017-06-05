/* eslint-disable import/no-extraneous-dependencies */

import { configure } from '@kadira/storybook'

function loadStories() {
  require('../stories')
}

configure(loadStories, module)
