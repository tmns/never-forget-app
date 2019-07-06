import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthRoute from "./components/common/AuthRoute";

import Landing from './components/layout/Landing';
import SignUp from "./components/auth/SignUp";
import SignIn from "./components/auth/SignIn";
import Study from "./components/study/Study";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={Landing} />
        <AuthRoute exact path="/signup" component={SignUp} />
        <AuthRoute exact path="/signin" component={SignIn} />
        <ProtectedRoute exact path="/dashboard" component={Dashboard} />
        <ProtectedRoute exact path="/study" component={Study} />
      </div>
    </BrowserRouter>
  );
}

export default App;
