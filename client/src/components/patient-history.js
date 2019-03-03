import React ,{ Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { postRequest } from '../tools/fetch-requests'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

function PatientHistoryButtons(props) {
	if (props.edit) {
		return (
			<Fragment>
				<Button size="small" onClick={() => props.handleCancel(props.index)}>ביטול</Button>
				<Button size="small" color="primary" onClick={ () => props.handleSave(props.index)}>שמור</Button>
			</Fragment> )
	}	else {
		return (
			<Fragment>
				<Button size="small" color="primary" onClick={props.handleEdit}>ערוך</Button>
			</Fragment>)
	}
};

function PatientHistoryContent(props) {
	if (!props.edit) {
		return <Typography variant="subheading">{props.content}</Typography>
	}	else {
		return <TextField
						fullWidth
						multiline
						type="text"
						id={props.index}
						label="עריכת פגישה"
						value={props.content}
						onChange={props.handleChange}
					/>
	}
};

class patientHistory extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			appointments:[],
			apiError:"",
			edit: false,
		}

	};

	formatAppointmentHeader(appointment) {
		const [ startDate, startTime ] = appointment.startTime.split(" ")
		const endTime = appointment.endTime.split(" ")[3];
		return  startDate + " , " + startTime + " - " + endTime;
	};

	componentDidMount() {
		this.getAppointmentsHistoryData();
	}

	getAppointmentsHistoryData = () => {
	this.callAppointmentsApi()
	.then( res => {
		res.forEach( (item, index) => { item.orgSummary = item.summary || ""} ) // add copy of original summary for cancel changes
		this.setState( { appointments: res.sort() } )}, err => {
			if (err.message === "not found") {
				this.setState({apiError: "מטופל לא קיים במערכת או שאין לך הרשאה"} )
			} else {
				this.setState({apiError: "שגיאה לא מוכרת"} )
			}
	}); 
};

	handleToggleEditDialog = () => {
		this.setState(prevState => ({
			edit: !prevState.edit
		}));
	};

	handleContantCancel = (index) => {
		const appointments = [...this.state.appointments];
		appointments[index].summary = appointments[index].orgSummary;
		this.setState({appointments})
		this.handleToggleEditDialog()
	};

	parseSaveServerResponse = (res) => {
		if(res.status !== 200)
			this.setState({apiError: "השמירה בשרת נכשלה, בדוק חיבור לרשת או נסה שוב"})
	}

	handleContentSave = (index) => {
		postRequest('/api/submit-appointment-summary', this.state.appointments[index], this.parseSaveServerResponse)
		const appointments = [...this.state.appointments];
		appointments[index].orgSummary = appointments[index].summary;
		this.setState({appointments})
		this.handleToggleEditDialog();
	};

	handleContentChange = (event) => {
		let change = [];
		change.appointments = [...this.state.appointments];
		change.appointments[event.target.id].summary = event.target.value;
		this.setState(change);
	};


	callAppointmentsApi = async () => {
		const response = await fetch( '/api/patient-appointments?userid=' + this.props.data.userID + '&patientid=' + this.props.match.params.patientId + '&method=history' );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	render() {
		const {  appointments, apiError,  edit } = this.state;
		const noAppointmentsMsg = "אין פגישות בהיסטוריה!"
				return (
					<div dir="rtl">
					{apiError && <Typography color="error" variant="title">{apiError}</Typography>}
					{appointments.length < 1 && <Typography color="error" variant="title"> {noAppointmentsMsg}</Typography>}
					{ appointments.map( (item, index) => 
						<ExpansionPanel key={index}  >
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<div>{this.formatAppointmentHeader(item)}</div>
							</ExpansionPanelSummary>
							<Divider />
							<ExpansionPanelDetails>
								<PatientHistoryContent
									content={item.summary}
									edit={edit}
									index={index.toString()}
									handleChange={this.handleContentChange}
								/>
							</ExpansionPanelDetails>
							<ExpansionPanelActions>
								<PatientHistoryButtons
									index={index.toString()}
									edit={edit}
									handleEdit={this.handleToggleEditDialog}
									handleCancel={this.handleContantCancel} //refresh
									handleSave={this.handleContentSave}
								/>
								</ExpansionPanelActions>
						</ExpansionPanel>
					)}
				</div>
				)
	}
}

export default withRouter( patientHistory );