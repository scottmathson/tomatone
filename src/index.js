import 'font-awesome/css/font-awesome.css'

import React      from 'react'
import { render } from 'react-dom'

import RootContainer from './containers/RootContainer'

import './style.css'

const rootEl = document.getElementById('container')

if (process.env.NODE_ENV === 'production') {
  render(
    <RootContainer />,
    rootEl,
  )
} else {
  const AppContainer = require("react-hot-loader").AppContainer; //eslint-disable-line
  render(
    <AppContainer>
      <RootContainer />
    </AppContainer>,
    rootEl,
  )

  if (module.hot) {
    module.hot.accept('./containers/RootContainer', () => {
      const NextRootContainer = require("./containers/RootContainer").default;  // eslint-disable-line
      render(
        <AppContainer>
          <NextRootContainer />
        </AppContainer>,
        rootEl,
      )
    })
  }
}
