import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store';
import Header from './containers/Header';
import Spinner from './containers/Spinner';

import HomePage from './components/Home';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import NotFound from './components/NotFound';
import QuestionPage from './components/Question';
import Reloading from './components/Common/Reloading';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Spinner />
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/question/:id" component={QuestionPage} />
          {/* <Route path="/new-question" component={NewQuestion} /> */}
          <Route path="/reload" component={Reloading} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
