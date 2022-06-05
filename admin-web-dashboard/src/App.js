import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Sidebar from './components/Navbar/Sidebar/Sidebar';
import Headerbar from './components/Navbar/Headerbar/Headerbar';

import HomePage from './pages/Home/homePage'
import CountPage from './pages/Count/countPage'
import DatabasePage from './pages/Database/databasePage'
import DatabasePendingPage from './pages/Database/databasePendingPage'
import DatabaseArchivedPage from './pages/Database/databaseArchivedPage'
import RegulationsPage from './pages/Regulations/regulationsPage'

import Pending7 from 'pages/Database/levels/pendingLevel7';
import Pending8 from 'pages/Database/levels/pendingLevel8';
import Pending9 from 'pages/Database/levels/pendingLevel9';
import Pending10 from 'pages/Database/levels/pendingLevel10';
import Count7 from 'pages/Count/levels/countLevel7';
import Count8 from 'pages/Count/levels/countLevel8';
import Count9 from 'pages/Count/levels/countLevel9';
import Count10 from 'pages/Count/levels/countLevel10';
import SchedulePage7 from './pages/Schedule/schedulePage7';
import SchedulePage8 from './pages/Schedule/schedulePage8';
import SchedulePage9 from './pages/Schedule/schedulePage9';
import SchedulePage10 from './pages/Schedule/schedulePage10';


let App = () => {
  return (
    <Router>
      <div id="container">
        <Sidebar />
        <div id="content">
          <Headerbar />
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/Count' component={CountPage} />
            <Route path='/Database' component={DatabasePage} />
            <Route path='/DatabasePending' component={DatabasePendingPage} />
            <Route path='/DatabaseArchived' component={DatabaseArchivedPage} />
            <Route path='/Regulations' component={RegulationsPage} />

            <Route path='/Schedule_7' component={SchedulePage7} />
            <Route path='/Schedule_8' component={SchedulePage8} />
            <Route path='/Schedule_9' component={SchedulePage9} />
            <Route path='/Schedule_10' component={SchedulePage10} />

            <Route path='/Pending7' component={Pending7} />
            <Route path='/Pending8' component={Pending8} />
            <Route path='/Pending9' component={Pending9} />
            <Route path='/Pending10' component={Pending10} />

            <Route path='/Count7' component={Count7} />
            <Route path='/Count8' component={Count8} />
            <Route path='/Count9' component={Count9} />
            <Route path='/Count10' component={Count10} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
