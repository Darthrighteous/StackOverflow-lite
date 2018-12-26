import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store';
import Header from './containers/Header';
import Spinner from './containers/Spinner';

import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import NotFound from './components/NotFound';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Spinner />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          {/* <Route path="/new-question" component={NewQuestion} /> */}
          {/* <Route path="/question/:id" component={Question} /> */}
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
