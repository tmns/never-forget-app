import React from 'react';
import { connect } from 'react-redux';

import {signOut} from '../../actions/session';

const Dashboard = ({ signOut, session }) => (
  <div>
    <h1>Dashboard</h1>
    <h2>Hi {session.username}</h2>
    <button onClick={signOut}>Logout</button>
  </div>
)

const mapStateToProps = ({ session }) => ({
  session
})

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);