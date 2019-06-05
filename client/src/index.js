import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Provider } from 'react-redux';

import App from "./App";
import configureStore from './store/store';
import { checkLoggedIn } from './util/session';
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({ 
  uri: "http://localhost:4000/graphql", 
  credentials: "include",   
});

const renderApp = preloadedState => {
  const store = configureStore(preloadedState);
  const ApolloApp = AppComponent => (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AppComponent />
      </Provider>
    </ApolloProvider>
  );
  
  ReactDOM.render(ApolloApp(App), document.getElementById("root"));

    // FOR TESTING, remove before production
    window.getState = store.getState;
}

(async () => renderApp(await checkLoggedIn()))();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
