import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PersonAdd from '@material-ui/icons/PersonAdd';
import DialogTemplate from './dialog';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const styles = {
	container: {
		maxWidth: 800,
		margin: 'auto',
	},
	input: {
		margin: '1vh 1vw',
		width: 200,
	},
	button: {
		margin: '3vh auto',
	},
}

export const TextInput = function(props) {
	return <FormControl error={props.error} style={styles.input}>
					<InputLabel shrink required={props.required} htmlFor={props.id}>{props.label}</InputLabel>
					<Input inputProps={props.inputProps} autoFocus={props.id === "0"} id={props.id} value={props.value} type={props.type || 'text'} onChange={props.handleChange} />
					<FormHelperText error>{props.errorMsg}</FormHelperText>
				</FormControl>
};

class CreateOrEditProfile extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			formValid: true,
			serverError: false,
			serverErrorDuplicate: false,
			dialogOpen: false,
			openSupervisorDialog: false,
			patientData: [
				{key: "firstName", value: (props.data && props.data[0].value) || "", error: false, label:"שם פרטי", required: true, type:"text", errorMsg:""},
				{key: "lastName", value: (props.data && props.data[1].value) || "", error: false, label:"שם משפחה", required: true, type:"text", errorMsg:""},
				{key: "id", value:(props.data && props.data[2].value) || "", error: false, label:"ת.ז", required: true, type:"number", errorMsg:""},
				{key: "phone", value: (props.data && props.data[3].value) || "", error: false, label:"טלפון", required: true, type:"tel", errorMsg:""},
				{key: "birthDate", value: (props.data && props.data[4].value) || "", error: false, label:"תאריך לידה", required: false, type:"date", errorMsg:""},
				{key: "email", value: (props.data && props.data[5].value) || "", error: false, label:"מייל", required: false, type:"email", errorMsg:""},
				{key: "address", value: (props.data && props.data[6].value) || "", error: false, label:"כתובת", required: false, type:"text", errorMsg:""},
			],


		}
		this.handleChange = this.handleChange.bind(this);
		this.parseServerResponse = this.parseServerResponse.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.closeDialog = this.closeDialog.bind(this);
		this.handleToggleSupervisorDialog = this.handleToggleSupervisorDialog.bind(this);
		this.handleSupervisorExit = this.handleSupervisorExit.bind(this);
	};

	componentWillUnmount() {
		if (this.timeout) {clearTimeout(this.timeout)}
	};

	handleChange(event) {
		let change = [];
		change.patientData = [...this.state.patientData];
		change.patientData[event.target.id].value = event.target.value;
		this.setState(change);
	};

	validateEmail(email){
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};

	validateForm() {
		let formValid = true
		for (let item of this.state.patientData) {
				item.error = false;
			if (item.required && item.value.length === 0) {
				item.error = true;
				item.errorMsg = "שדה חובה"
			}
			if ( item.type === "email" && item.value.length > 0 && !this.validateEmail(item.value) ) {
				item.error = true;
				item.errorMsg = "כתובת מייל לא תקינה"
			}
			if (item.error){ formValid = false}
		}
		this.setState({formValid: formValid});
		return formValid;
	};

	closeDialog(){
		this.setState({dialogOpen: false});
	}

	parseServerResponse(res){
		if (res.status === 444) {
			this.setState({serverErrorDuplicate: true})
		} else if (res.status === 200) {
			this.setState({dialogOpen: true});
			this.timeout = setTimeout(this.closeDialog.bind(this), 2000);
			this.props.handleExit(this.state.patientData[2].value);
		} else {
			this.setState({serverError: true})
		}
	};

	handleToggleSupervisorDialog(){
		this.setState(prevState => ({
			openSupervisorDialog: !prevState.openSupervisorDialog
		}));
	};

	handleSupervisorExit(supervisorId){
		const change = {key: "supervisorId", value: supervisorId, error: false, label:"ת.ז. מבוגר", required: false, type:"number", errorMsg:""};
		this.setState( prevState => ({ patientData: prevState.patientData.concat([change])}) );
		this.handleToggleSupervisorDialog();
	}

	createTitle(actionType, profileType){
		const action = actionType === "create"?  "יצירת" : "עריכת";
		const profile = profileType === "patient" ? "מטופל" : "מבוגר אחראי";
		return action + " " + profile;
	};

	handleSubmit(e){
		e.preventDefault();
		this.setState({serverError: false, serverErrorDuplicate: false});

		if(this.validateForm()){
			const formData = this.state.patientData.map( item => {
				return {key: item.key, value: item.value}
			}).concat([{key: 'type', value: this.props.profileType}])
			fetch('/api/submit-patient-form', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({formData:formData, formMethod: this.props.actionType})
		}).then( this.parseServerResponse )
		};
	}

	render(){
		const { patientData, formValid, serverError, serverErrorDuplicate } = this.state;
		const {	profileType, actionType } = this.props;
		return (
					<div style={styles.container}>
						<Typography variant="title">
							{this.createTitle(actionType, profileType)}
						</Typography>
						<form >
							{patientData.map((item, index) => <TextInput key={index} id={index.toString()} {...item} handleChange={this.handleChange}/>)}
							<Typography  variant="caption" color='secondary' align="center">
								{!formValid && <span>תקן את השדות האדומים ונסה שוב!</span>}
								{serverErrorDuplicate && <span>ת.ז. קיימת במערכת!</span>}
								{serverError && <span>בעיה בשרתים, אנא נסה שוב או פנה לבוס המעצבן שלי</span>}
							</Typography>
							<Button type="submit" variant="contained" style={styles.button} color="primary" onClick={this.handleSubmit}>
								{this.createTitle(actionType, profileType)}
								<SaveIcon />
							</Button>
							{ profileType === "patient" && actionType === "create" && <Button style={styles.button} color="secondary" onClick={this.handleToggleSupervisorDialog}>
								יצירת מבוגר אחראי
								<PersonAdd />
							</Button>}
						</form>
						<DialogTemplate
							title="המידע נשלח"
							text='יצרת מטופל חדש בהצלחה!'
							open={this.state.dialogOpen}
							onClose={this.closeDialog}
						/>
						{profileType === "patient" && actionType === "create" &&
						<Dialog dir='rtl'
							open={this.state.openSupervisorDialog}
							onClose={this.handleToggleSupervisorDialog}
						>
							<DialogContent>
								<CreateOrEditProfile actionType="create" profileType="supervisor" handleExit={this.handleSupervisorExit} />
							</DialogContent>
						</Dialog>}
					</div>
		)
	}
}

export default withRouter(CreateOrEditProfile);