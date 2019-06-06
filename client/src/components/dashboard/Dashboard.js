import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Navbar from '../layout/Navbar';

const Dashboard = ({ session }) => (
  <Fragment>
    <Navbar />
    <div>
    <h2>Hi {session.username}</h2>
  </div>
  </Fragment>
)

const mapStateToProps = ({ session }) => ({
  session
})

export default connect(mapStateToProps)(Dashboard);