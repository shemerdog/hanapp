import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../css/login.css";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import LockIcon from "@material-ui/icons/LockOutlined";
import DialogTemplate from "../tools/dialog";
import CircularProgress from "@material-ui/core/CircularProgress"


class Login extends Component {
	constructor(props){
		super(props);
		this.state={
			userName:"",
			password:"",
			dialogOpen: false,
		}
		this.handleChange = this.handleChange.bind(this);

	};

	componentDidMount() {
		this.props.loginData.setTitle("hanApp");
	};

	handleChange(event) {
		let change = {}
		change[event.target.name] = event.target.value
		this.setState(change)
	};

	handleClick(event){
		const {userName, password} = this.state;
		if ( userName.length > 2  && password.length > 2 ) {
			this.props.loginData.handleLogin(userName, "123", "");
		}
	};

	closeDialog = () => {
		this.setState({ dialogOpen: false });
	};

	openDialog = () => {
		this.setState({ dialogOpen: true });
	};

	handleFBClick = res => {
		this.props.loginData.stopLoading()
		console.log("got FB res");
		console.log(res);
		this.props.loginData.handleLogin(res.name, res.userID, res.picture.data.url, res.email );
	};
	sendAuthToServer = credentials => {
		const sendAuthDetailsApi = "/api/submit-credentials";
		fetch( sendAuthDetailsApi, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: JSON.stringify({
				tokenId: credentials.tokenId,
				email: credentials.email
			})
		} );
	};
	handleGoogleLogin = res => {
		this.props.loginData.stopLoading();
		// const userData = res.profileObj;
		console.info("Got Google response");
		console.debug( res );
		this.sendAuthToServer( res );
		// this.props.loginData.handleLogin(userData.name, userData.googleId, userData.imageUrl, userData.email );
	};

	render() {
		if (this.props.loginData.login === true) {
			return <Redirect to="/patients-list" />
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
						<InputLabel style={style.label} htmlFor="name-simple">שם משתמש</InputLabel>
						<Input name="userName" value={this.state.userName} onChange={this.handleChange} />
					</FormControl>
					<br/>
					<FormControl style={style.margin}>
						<InputLabel style={style.label} htmlFor="pass-simple">סיסמה</InputLabel>
						<Input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
					</FormControl>
					<Typography style={style.leftText} variant="caption" onClick={this.openDialog}>
						שכחת את הסיסמה?
					</Typography>
					<br/>
					<Button variant="raised" style={style.margin} onClick={(event) => this.handleClick(event)}>התחבר</Button>
					{this.props.loginData.loading && <CircularProgress size={20}/>}
					<div>
						<FacebookLogin
							onClick={this.props.loginData.startLoading}
							appId="384903288929031"
							autoLoad={false}
							fields="name,email,picture"
							callback={this.handleFBClick}
							render={renderProps => (
								<button onClick={renderProps.onClick} className="loginBtn loginBtn--facebook">Login with Facebook</button>
							)}
						/>
					</div>
					<div>
						<GoogleLogin
							onClick={this.props.loginData.startLoading}
							clientId="492489952223-heaivivpdn5dnqun6aerl456clrsclsb.apps.googleusercontent.com"
							scope="https://www.googleapis.com/auth/calendar"
							responseType="code"
							onSuccess={this.handleGoogleLogin}
							onFailure={(res)=>{console.log(res)} }
							render={renderProps => (
								<button onClick={renderProps.onClick} className="loginBtn loginBtn--google">Login with Google</button>
							)}
						/>
					</div>
				</Paper>
				<DialogTemplate
				title="חבל מאוד!"
				text="בעיה שלך, פעם הבאה אל תשכח."
				open={this.state.dialogOpen}
				onClose={this.closeDialog}
				/>
			</div>
		);
	}
}
const style = {
	margin: { margin: "1vw" },
	leftText: {textAlign: "center", margin: "auto",     width: "fit-content"},
	paper: { padding: "2vh 2vw", margin: "10vh auto", width: "fit-content"},
	avatar: {padding: "1vh",  margin: "auto"},
	label: {width: "100%"}
};
export default Login;
