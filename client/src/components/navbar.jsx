import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import {AppBar} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = {
  contained: {
    position: 'absolute',
    right:  "1vw",
    top: "1vh",
    fontSize: 10,
    width: "7vw",
    height: "5vh"
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

	render(){
		return (
		  <AppBar position="static">
		  <Toolbar>
		      <div className="logo" style={{margin:"0.5vw"}}>BJNHV</div>
		      <div className="navigtion-bar" style={{width: "70vw"}}>
		        <Link to='/table/persons' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Persons</Button></Link>
		        <Link to='/table/events' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Events</Button></Link>
		        <Link to='/table/networks' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Networks</Button></Link>
		        <Link to='/table/devices' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Devices</Button></Link>
		        <Link to='/control' onClick={this.handleOnClick}><Button style={{margin:"0.5vw"}} variant="contained">Control</Button></Link>
		      </div>
		      { this.props.login && <Button color="secondary" style={styles.contained} onClick={this.props.handleLogout} variant="contained">Logout</Button>}
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