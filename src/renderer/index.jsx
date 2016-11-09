import React            from "react";
import { render }       from "react-dom";
import { AppContainer } from "react-hot-loader";

import App from "./containers/App";

const rootEl = document.getElementById("container");

render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl,
);

if (module.hot) {
  module.hot.accept("./containers/App", () => {
    const NextApp = require("./containers/App").default;  // eslint-disable-line
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      rootEl,
    );
  });
}