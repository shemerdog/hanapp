import React ,{ Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import {callApi} from '../tools/fetch-requests'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import DialogTemplate from './dialog';
import NextAppointment from './nextAppointment';

const styles = {
	list: {
		width: '100%',
		maxWidth: 300,
		margin: 'auto',
	},
	ListItem: {
		textAlign: 'start'
	},
	button: {
		margin: '0 2vw',
	},
	fabButtonsWrap:{position: 'fixed', left: "0px", bottom: '0px'},
	fabButton:{margin: '1vh 1vw'},
};

const customSort = {
	firstName: 1,
	lastName: 2,
	id: 3,
	phone: 4,
	birthDate: 5,
	email: 6,
	address: 7,
}


class PatientDetails extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			appointments:[],
			availableAppointments: [],
			newAppointment:{time:'', date:''},
			edit:false,
			dialogDeleteOpen:false,
			dialogAppointmentOpen:false,
		}

		this.renderDetailesRow = this.renderDetailesRow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleDismissChanges = this.handleDismissChanges.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.setFormData = this.setFormData.bind(this);
		this.deletePatient = this.deletePatient.bind(this);
		this.exitDeleteDialog = this.exitDeleteDialog.bind(this);
		this.exitAppointmentDialog = this.exitAppointmentDialog.bind(this);
		this.openAppointmentDialog = this.openAppointmentDialog.bind(this);
		this.handleSaveAppointment = this.handleSaveAppointment.bind(this);
		this.handleAppointmentChange = this.handleAppointmentChange.bind(this);
	};

	renderDetailesRow( item, index ) {
		if (this.state.edit) {
			return(
				<FormControl key={index}>
					<InputLabel htmlFor={item.key}>{item.label}</InputLabel>
					<Input type="text" name={index.toString()} value={item.value} onChange={this.handleChange} />
				</FormControl>
		)}
		else{
			return(
				<ListItem dense button key={index} style={styles.ListItem}>
					<ListItemText
						primary={item.label}
						secondary={item.value}
					/>
				</ListItem>
			)
		}
	};

	handleChange(event) {
		let change = {}
		change.data = [...this.state.data]
		change.data[event.target.name].value = event.target.value;
		this.setState(change)
	};

	handleSaveAppointment(appointment){
		this.exitAppointmentDialog();
		this.saveAppointment();
		this.setState({newAppointment:{time:'', date:''}, availableAppointments: []})
		this.setFormData();
	}
	
	handleAppointmentChange(target){
		let change = {}
		change.newAppointment = {...this.state.newAppointment}
		change.newAppointment[target.type] = target.value;
		if (target.type === "date") {
			callApi('/api/available-appointments?date='+target.value).then(
				res => this.setState({availableAppointments: res})
			)
		}
		this.setState(change)
	}

	exitDeleteDialog(){
		this.setState({dialogDeleteOpen: false});
	}

	exitAppointmentDialog(){
		this.setState({dialogAppointmentOpen: false});
	}

	deletePatient(){
		fetch( '/api/delete-patient?patientid=' + this.props.match.params.patientId );
		this.props.history.push('/patients-list');
	}

	handleSaveChanges(){
		this.setState({edit: false});
			fetch('/api/submit-patient-form', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({formData:this.state.data, formMethod: 'update'})
		})
	};

	saveAppointment(){
		const data = {
			appointment: this.state.newAppointment.date + " " + this.state.newAppointment.time,
			id: this.props.match.params.patientId
		}
			fetch('/api/submit-patient-appointment', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
		})
	};

	handleDismissChanges(){
		this.setFormData();
		this.setState({edit: false});
	};

	openAppointmentDialog(e){
		e.stopPropagation();
		this.setState({dialogAppointmentOpen: true})
	};

	setFormData() {
		this.callDetailsApi()
		.then( res => {
			res = res.sort((a,b)=>{return (customSort[a.key]-customSort[b.key])})
			this.setState( { data: res } )} )
		this.callAppointmentsApi()
		.then( res => {
			this.setState( { appointments: res.sort() } )} ) 
	}

	componentDidMount() {
		this.setFormData();
	};


	callDetailsApi = async () => {
		const response = await fetch( '/api/patient-details?userid=' + this.props.data.userID + '&patientid=' + this.props.match.params.patientId );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	callAppointmentsApi = async () => {
		const response = await fetch( '/api/patient-appointments?userid=' + this.props.data.userID + '&patientid=' + this.props.match.params.patientId + '&method=next' );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	render() {
		const { data, appointments, availableAppointments, newAppointment, edit } = this.state;

		if ( this.props.data.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				return (
					<div>
						<Typography variant="title">
							פרטי מטופל
						</Typography>
						<div>
							<List style={styles.list}>
							<NextAppointment
								handleChange={this.handleAppointmentChange}
								handleSave={this.handleSaveAppointment}
								handleClose={this.exitAppointmentDialog}
								handleClick={this.openAppointmentDialog}
								open={this.state.dialogAppointmentOpen}
								availableAppointments={availableAppointments}
								appointments={appointments}
								newAppointment={newAppointment}
							/>
							{ data.map( this.renderDetailesRow ) }
							</List>
							{ edit && <div>
									<Button variant="contained" style={styles.button} color="secondary" onClick={this.handleDismissChanges}>
									מחק שינויים
									<DeleteIcon />
								</Button>
								<Button variant="contained" style={styles.button} color="primary" onClick={this.handleSaveChanges}>
									שמור שינויים
									<SaveIcon />
								</Button>
								</div>}
							</div>
						{!edit &&
						<div style={styles.fabButtonsWrap}>
							<Button variant="fab" style={styles.fabButton} color="secondary" onClick={()=> { this.setState({dialogDeleteOpen: true}) } }>
								<DeleteIcon />
							</Button>
							<Button variant="fab" style={styles.fabButton} color="primary" onClick={()=> { this.setState({edit: true}) } }>
								<EditIcon />
							</Button>
							</div>}
						<DialogTemplate
						title="מחיקת מטופל"
						text='אתה בטוח שאתה רוצה למחוק?'
						type='confirmation'
						handleConfirmation={this.deletePatient}
						open={this.state.dialogDeleteOpen}
						onClose={this.exitDeleteDialog}
					/>
					</div>
				)
		}
	}
}

export default withRouter( PatientDetails);