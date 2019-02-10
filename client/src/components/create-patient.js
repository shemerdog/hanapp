import React ,{ Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PersonAdd from '@material-ui/icons/PersonAdd';
import DialogTemplate from './dialog';
import CreateSupervisor from './create-supervisor';
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
		margin: '3vh 1vw',
	},
}

const TextInput = function(props) {
	return <FormControl error={props.error} style={styles.input}>
					<InputLabel shrink required={props.required} htmlFor={props.id}>{props.label}</InputLabel>
					<Input autoFocus={props.id === "0"} id={props.id} value={props.val} type={props.type || 'text'} onChange={props.handleChange} />
					<FormHelperText error>{props.errorMsg}</FormHelperText>
				</FormControl>
};

class CreatePatient extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			formValid: true,
			serverError: false,
			serverErrorDuplicate: false,
			dialogOpen: false,
			openSupervisorDialog: false,
			patientData: [
				{key: "firstName", val:"", error: false, label:"שם פרטי", required: true, type:"text", errorMsg:""},
				{key: "lastName", val:"", error: false, label:"שם משפחה", required: true, type:"text", errorMsg:""},
				{key: "id", val:"", error: false, label:"ת.ז", required: true, type:"number", errorMsg:""},
				{key: "phone", val:"", error: false, label:"טלפון", required: true, type:"tel", errorMsg:""},
				{key: "birthDate", val:"", error: false, label:"תאריך לידה", required: false, type:"date", errorMsg:""},
				{key: "email", val:"", error: false, label:"מייל", required: false, type:"email", errorMsg:""},
				{key: "address", val:"", error: false, label:"כתובת", required: false, type:"text", errorMsg:""},
			],
		}
		this.handleChange = this.handleChange.bind(this);
		this.parseServerResponse = this.parseServerResponse.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.exitScreen = this.exitScreen.bind(this);
		this.handleToggleSupervisorDialog = this.handleToggleSupervisorDialog.bind(this);
		this.handleSupervisorExit = this.handleSupervisorExit.bind(this);
	};

	componentWillUnmount() {
		if (this.timeout) {clearTimeout(this.timeout)}
	};

	handleChange(event) {
		let change = [];
		change.patientData = [...this.state.patientData];
		change.patientData[event.target.id].val = event.target.value;
		this.setState(change);
	};

	validateEmail(email){
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};

	validateForm() {
		let change = [];
		change.formValid = true
		change.patientData = [...this.state.patientData];
		for (let item of change.patientData) {
				item.error = false;
			if (item.required && item.val.length === 0) {
				item.error = true;
				item.errorMsg = "שדה חובה"
			}
			if ( item.type === "email" && item.val.length > 0 && !this.validateEmail(item.val) ) {
				item.error = true;
				item.errorMsg = "כתובת מייל לא תקינה"
			}
			if (item.error){ change.formValid = false}
		}
		this.setState(change);
		return change.formValid;
	};

	exitScreen(){
		this.setState({dialogOpen: false});
		this.props.history.push('/patients-list');
	}

	parseServerResponse(res){
		if (res.status === 444) {
			this.setState({serverErrorDuplicate: true})
		} else if (res.status === 200) {
			this.setState({dialogOpen: true});
			this.timeout = setTimeout(this.exitScreen.bind(this), 4000);
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
		const change = {key: "supervisorId", val: supervisorId, error: false, label:"ת.ז. מבוגר", required: false, type:"number", errorMsg:""};
		this.setState( prevState => ({ patientData: prevState.patientData.concat([change])}) );
		this.handleToggleSupervisorDialog();
	}

	handleSubmit(e){
		e.preventDefault();
		this.setState({serverError: false, serverErrorDuplicate: false});

		if(this.validateForm()){
			const formData = this.state.patientData.map( item => {
				return {key: item.key, value: item.val}
			}).concat([{key: 'type', value: 'patient'}])
			fetch('/api/submit-patient-form', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({formData:formData, formMethod: 'create'})
		}).then( this.parseServerResponse )
		};
	}

	render(){
		if ( this.props.data.login === false ) {
			return <Redirect to='/login' />
		}
		else {
			const { patientData, formValid, serverError, serverErrorDuplicate } = this.state;
			return (
				<div style={styles.container}>
					<Typography variant="title">
						מטופל חדש
					</Typography>
					<form >
						{patientData.map((item, index) => <TextInput key={index} id={index.toString()} {...item} handleChange={this.handleChange}/>)}
						<Typography  variant="caption" color='secondary' align="center">
							{!formValid && <span>תקן את השדות האדומים ונסה שוב!</span>}
							{serverErrorDuplicate && <span>ת.ז. קיימת במערכת!</span>}
							{serverError && <span>בעיה בשרתים, אנא נסה שוב או פנה לבוס המעצבן שלי</span>}
						</Typography>
						<Button type="submit" variant="contained" style={styles.button} color="primary" onClick={this.handleSubmit}>
							צור מטופל
							<SaveIcon />
						</Button>
						<Button style={styles.button} color="secondary" onClick={this.handleToggleSupervisorDialog}>
							צור מבוגר אחראי
							<PersonAdd />
						</Button>
					</form>
					<DialogTemplate
						title="המידע נשלח"
						text='יצרת מטופל חדש בהצלחה!'
						open={this.state.dialogOpen}
						onClose={this.exitScreen}
					/>
					<Dialog dir='rtl'
						open={this.state.openSupervisorDialog}
						onClose={this.handleToggleSupervisorDialog}
					>
						<DialogContent>
							<CreateSupervisor handleExit={this.handleSupervisorExit} />
						</DialogContent>
					</Dialog>
				</div>

				
			)
		} 
	}
}

export default withRouter(CreatePatient);