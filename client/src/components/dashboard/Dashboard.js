import React from 'react';

import {signOut} from '../../util/session'

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <button onClick={signOut}>Logout</button>
  </div>
)

export default Dashboard;