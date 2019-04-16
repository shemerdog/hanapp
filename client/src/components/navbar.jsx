import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom'
import { navbar as lang} from '../tools/lang.heb.js';
import {AppBar} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  login:{position: 'absolute', left:  "1vw", top:'0.5vh'},
  avatar: {float: "right", margin: "0 1vw"},
  welcome: {
    fontSize: "0.8em",
  	position: 'absolute',
  	left:  "2vw",
  	top: '30px',
  	display: 'inline-block',
  	width: '60vw',
  	overflow: 'hidden',
  	whiteSpace: 'nowrap',
  	textAlign: 'left'
  },
};

class Navbar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false
		}
	};

	closeDialog = () => {
		this.setState({ dialogOpen: false });
	};

	handleOnClick = (e) => {
		if (!this.props.login){
			e.preventDefault();
			this.setState({ dialogOpen: true });
			this.timeout = setTimeout(this.closeDialog.bind(this), 3000);
		}
	};

	componentWillUnmount() {
		if (this.timeout) {clearTimeout(this.timeout)}
	};
	renderLogout() {
		if (this.props.login){
			return (
				<Fragment>
					<Button style={styles.login} color="inherit" onClick={this.props.handleLogout}>{lang.logoutLabel}</Button>
					{ /*this.props.userPic && <img style={styles.avatar} src={this.props.userPic} alt={this.props.useName} height="42" width="42"/> */}
					<div style={styles.welcome}>{lang.greetingText + this.props.useName}</div>
					</Fragment>
			)
		} else return( <Link to='/login' style={styles.login}><Button>{lang.loginLabel}</Button></Link>)
	}

	render(){
		return (
		  <AppBar  position="sticky">
		  <Toolbar>
		      <Link to='/patients-list'>
						<IconButton onClick={this.handleOnClick}>
							<Home />
						</IconButton>
					</Link>
					<Link to='/settings'>
						<IconButton onClick={this.handleOnClick}>
							<Settings />
						</IconButton>
					</Link>
		      <div className="logo" style={{margin:"0.5vw"}}>{this.props.title}</div>
	      	{this.renderLogout()}
		    </Toolbar>
		    <Dialog
					open={this.state.dialogOpen}
					onClose={this.closeDialog}
				>
					<DialogTitle>{lang.dialogTitle}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							{lang.dialogText}
						</DialogContentText>
					</DialogContent>
				</Dialog>
		  </AppBar>
		) }
	}

export default Navbar;
