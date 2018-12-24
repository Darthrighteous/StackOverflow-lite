import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound'

const App = () => (
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
);

export default App;
