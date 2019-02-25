import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom'
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
  login:{position: 'fixed', left:  "1vw", top:'0.5vh'},
  avatar: {float: "right", margin: "0 1vw"},
  welcome: {
    fontSize: "0.8em",
  	position: 'fixed',
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
					<Button style={styles.login} color="inherit" onClick={this.props.handleLogout}>Logout</Button>
					{ this.props.userPic && <img style={styles.avatar} src={this.props.userPic} alt={this.props.useName} height="42" width="42"/> }
					<div style={styles.welcome}>שלום {this.props.useName}</div>
					</Fragment>
			)
		} else return( <Link to='/login' style={styles.login}><Button>Login</Button></Link>)
	}

	render(){
		return (
		  <AppBar  style={{position: 'fixed'}} position="static">
		  <Toolbar>
		      <div className="logo" style={{margin:"0.5vw"}}>HanApp</div>
		      <Link to='/patients-list'>
						<IconButton >
							<Home />
						</IconButton>
					</Link>
					<Link to='/settings'>
						<IconButton >
							<Settings />
						</IconButton>
					</Link>
	      	{this.renderLogout()}
		    </Toolbar>
		    <Dialog
					open={this.state.dialogOpen}
					onClose={this.closeDialog}
				>
					<DialogTitle>{"u not logged in"}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							need to login for enter this page.
						</DialogContentText>
					</DialogContent>
				</Dialog>
		  </AppBar>
		) }
	}

export default Navbar;