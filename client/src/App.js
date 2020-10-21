import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import VideoUploadPage from './components/views/VideoUploadPage/VideoUploadPage';
import SingleVideoPage from './components/views/SingleVideoPage/SingleVideoPage';
import SubscriptionPage from './components/views/SubscriptionPage/SubscriptionPage';

import NavBar from './components/views/NavBar/NavBar';

import Auth from './hoc/auth';

import './App.scss';

function App() {
  return (
    <Router>
      <NavBar />

      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route
            exact
            path="/video/upload"
            component={Auth(VideoUploadPage, true)}
          />
          <Route
            exact
            path="/video/:videoId"
            component={Auth(SingleVideoPage, null)}
          />
          <Route
            exact
            path="/subscription"
            component={Auth(SubscriptionPage, null)}
          />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
