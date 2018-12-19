import React, {Component, Fragment} from 'react';
import { Link } from 'react-router-dom'
import {AppBar} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  logout: {
    position: 'absolute',
    left:  "1vw",
    top: "1vh",
    fontSize: "0.8em",
  },
  avatar: {
  	float: "right",
    margin: "0 1vw",
  }
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
		return (
			<span style={styles.logout}>
				<span>שלום {this.props.useName}</span> { this.props.userPic && <img style={styles.avatar} src={this.props.userPic} alt={this.props.useName}/> }<Button color="secondary"  onClick={this.props.handleLogout} variant="contained">Logout</Button>
			</span>
		)
	}

	render(){
		return (
		  <AppBar position="static">
		  <Toolbar>
		      <div className="logo" style={{margin:"0.5vw"}}>HanApp</div>
		      <div className="navigtion-bar" style={{width: "70vw"}}>
		        <Link to='/patients-list' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Patients List</Button></Link>
		      </div>
		      { this.props.login && this.renderLogout()}
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