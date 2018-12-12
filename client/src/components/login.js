import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import LockIcon from '@material-ui/icons/LockOutlined';


class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      userName:'',
      password:'',
    }
    this.handleChange = this.handleChange.bind(this);

  };

  handleChange(event) {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
  };

  handleClick(event){
    const {userName, password} = this.state;
    if ( userName.length > 2  && password.length > 2 ) {
      this.props.loginData.handleLogin();
    }
  };

  render() {
    if (this.props.loginData.login === true) {
      return <Redirect to='/table/persons' />
    }
    return (
      <div>
            <Paper style={style.paper}>
              <div>
                <Avatar style={style.avatar}>
                  <LockIcon />
                </Avatar>
              </div>
              <FormControl style={style.margin}>
                <InputLabel htmlFor="name-simple">Username</InputLabel>
                <Input name="userName" value={this.state.userName} onChange={this.handleChange} />
              </FormControl>
              <br/>
              <FormControl style={style.margin}>
                <InputLabel htmlFor="pass-simple">Password</InputLabel>
                <Input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
              </FormControl>
              <Typography style={style.leftText} variant="caption">
                forgot your password?
              </Typography>
              <br/>
              <Button variant="raised" style={style.margin} onClick={(event) => this.handleClick(event)}>Login</Button>
            </Paper>
      </div>
    );
  }
}
const style = {
  margin: { margin: "1vw" },
  leftText: {textAlign: "center", margin: "auto",     width: "fit-content"},
  paper: { padding: "2vh 2vw", margin: "10vh auto", width: "fit-content"},
  avatar: {padding: "1vh",  margin: "auto"}
};
export default Login;
