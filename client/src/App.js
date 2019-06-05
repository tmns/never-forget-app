import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthRoute from "./components/common/AuthRoute";

import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthRoute exact path="/signup" component={SignUp} />
        <AuthRoute exact path="/signin" component={SignIn} />
        <Switch>
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
