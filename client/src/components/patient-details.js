import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import DialogTemplate from '../tools/dialog';
import NextAppointment from './nextAppointment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CreateOrEditProfile from './CreateOrEditProfile';

const styles = {
	list: {
		width: '100%',
		maxWidth: 300,
		margin: 'auto',
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

const numToDay = {
	0: "ראשון",
	1: "שני",
	2: "שלישי",
	3: "רביעי",
	4: "חמישי",
	5: "שישי",
	6: "שבת",
}


class patientDetails extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			appointments:[],
			availableAppointments: [],
			newAppointment:{time:'', date:''},
			edit:false,
			nextAppointmentsApiError: "",
			patientDetailsApiError: "",
			dialogDeleteOpen:false,
			dialogAppointmentOpen:false,
		}

		this.handleChange = this.handleChange.bind(this);
		this.setFormData = this.setFormData.bind(this);
		this.deletePatient = this.deletePatient.bind(this);
		this.exitDeleteDialog = this.exitDeleteDialog.bind(this);
		this.exitAppointmentDialog = this.exitAppointmentDialog.bind(this);
		this.openAppointmentDialog = this.openAppointmentDialog.bind(this);
		this.handleSaveAppointment = this.handleSaveAppointment.bind(this);
		this.handleAppointmentChange = this.handleAppointmentChange.bind(this);
		this.handleToggleEditDialog = this.handleToggleEditDialog.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
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
		let change = {};
		change.newAppointment = {...this.state.newAppointment};
		change.newAppointment[target.type] = target.value;
		if (target.type === "date") {
			this.setState({nextAppointmentsApiError:"", availableAppointments: []})
			fetch('/api/available-appointments?date='+target.value)
			.then(
				res => res.json()
				)
			.then( res => {
				switch(res.message) {
					case "free":
						this.setState({nextAppointmentsApiError: "המטפל בחופש בימים אלו: " + res.days.map(num => numToDay[num])});
						break;
					case "old":
						this.setState({nextAppointmentsApiError: "תאריך זה עבר כבר"});
						break;
					default:
						this.setState({availableAppointments: res});
				}
			})
		}
		this.setState(change)
	};

	exitDeleteDialog(){
		this.setState({dialogDeleteOpen: false});
	}

	exitAppointmentDialog(){
		this.setState({dialogAppointmentOpen: false});
	}

	deletePatient(){
		fetch( '/api/delete-patient?patientId=' + this.props.match.params.patientId );
		this.props.history.push('/patients-list');
	}

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

	openAppointmentDialog(e){
		e.stopPropagation();
		this.setState({dialogAppointmentOpen: true})
	};

	setFormData() {
		this.callDetailsApi()
		.then( res => {
			// TODO: Move the sort to the db query like this: db.mycollection.find().sort({name: 1}, function (err, docs) etc...
			res = res.sort((a,b)=>{return (customSort[a.key]-customSort[b.key])});
			this.setState({ data: res }) 
		}, err => {
				if (err.message === "not found") {
					this.setState({patientDetailsApiError: "מטופל לא קיים במערכת או שאין לך הרשאה"} )
				} else {
					this.setState({patientDetailsApiError: "שגיאה לא מוכרת"} )
				}
		});
		this.callAppointmentsApi()
		.then( res => {
			this.setState( { appointments: res.sort() } )} ) 
	}

	componentDidMount() {
		this.setFormData();
	};


	callDetailsApi = async () => {
		const response = await fetch( '/api/patient-details?userID=' + this.props.data.userID + '&patientId=' + this.props.match.params.patientId );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	callAppointmentsApi = async () => {
		const response = await fetch( '/api/patient-appointments?userID=' + this.props.data.userID + '&patientId=' + this.props.match.params.patientId + '&method=next' );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	handleToggleEditDialog(){
		this.setState(prevState => ({
			edit: !prevState.edit
		}));
	};

	handleSaveChanges(){
		this.setFormData();
		this.handleToggleEditDialog();
	}

	render() {
		const { data, appointments, availableAppointments, newAppointment, patientDetailsApiError, nextAppointmentsApiError, edit } = this.state;

		
				return (
					<div dir="rtl">
						<div>
							{patientDetailsApiError && <Typography  variant="caption" color='secondary' align="center">
									<span>{patientDetailsApiError}</span>
								</Typography>}
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
								error={nextAppointmentsApiError}
							/>
							{ data.map( (item, index) => 
								<ListItem dense button key={index}>
									<ListItemText
										primary={item.label}
										secondary={item.value}
									/>
								</ListItem> ) }
							</List>
							</div>
						{!edit &&
						<div style={styles.fabButtonsWrap}>
							<Button variant="fab" style={styles.fabButton} color="secondary" onClick={()=> { this.setState({dialogDeleteOpen: true}) } }>
								<DeleteIcon />
							</Button>
							<Button variant="fab" style={styles.fabButton} color="primary" onClick={this.handleToggleEditDialog}>
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
						<Dialog dir='rtl'
							open={this.state.edit}
							onClose={this.handleToggleEditDialog}
						>
							<DialogContent>
								<CreateOrEditProfile data={data}actionType="edit" profileType="patient" handleExit={this.handleSaveChanges}/>
							</DialogContent>
						</Dialog>
					</div>
				)
	}
}

export default withRouter( patientDetails );