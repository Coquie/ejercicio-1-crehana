import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache
} from "@apollo/client";

import Countries from "./Countries";
import Country from "./Country";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div>
      <Switch>
        <Route path="/:code">
          <Country />
        </Route>

        <Route path="/">
          <Countries />
        </Route>
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById("root")
);
