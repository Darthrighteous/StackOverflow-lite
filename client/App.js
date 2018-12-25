import React from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store';
import Home from './components/Home';
import NotFound from './components/NotFound'

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        {/* <Route path="/signup" component={Signup}/> */}
        {/* <Route path="/login" component={Login}/> */}
        {/* <Route path="/new-question" component={NewQuestion}/> */}
        {/* <Route path="/question/:id" component={Question}/> */}
        <Route component={NotFound}/>
      </Switch>
    </Router>
  </Provider>
);

export default App;
