import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './components/dashboard/Dashboard';

import RequiresAuth from './components/common/RequiresAuth';

import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Switch>
          <RequiresAuth exact path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
