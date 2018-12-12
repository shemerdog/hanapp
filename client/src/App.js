import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Navbar from './components/navbar';
import Login from './components/login';
import Persons from './components/persons';
import TablePage from './components/tablepage';
import Networks from './components/networks';
import Devices from './components/devices';
import Control from './components/control';
import Error from './components/error';

import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      login: true, //need to change to false before production
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

  };

  handleLogin() {
    this.setState({login: true})
  };

  handleLogout() {
    this.setState({login: false})
  };


  render() {
    const loginData ={ login: this.state.login, handleLogin: this.handleLogin };
    return (
      <div className="App">
        <Navbar login={this.state.login} handleLogout={this.handleLogout} />
        <Switch>
          <Route exact path='/' render={(props) => <Login  loginData={loginData} {...props} /> }/>
          <Route path='/login' render={(props) => <Login loginData={loginData} {...props} /> }/>
          <Route path='/events' render={(props) => <Events  login={this.state.login} {...props} /> }/>
          <Route path='/persons' render={(props) => <Persons  login={this.state.login} {...props} /> }/>
          <Route path='/networks' render={(props) => <Networks  login={this.state.login} {...props} /> }/>
          <Route path='/tergets' render={(props) => <Tergets  login={this.state.login} {...props} /> }/>
          <Route path='/control' render={(props) => <Control  login={this.state.login} {...props} /> }/>
          <Route render={(props) => <Error  {...props} /> }/>
        </Switch>
      </div>
    );
  }
}

export default App;
