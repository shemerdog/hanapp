import React ,{ Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import PracticeDetails from './PracticeDetails';
import { postRequest } from '../tools/fetch-requests';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import Chip from '@material-ui/core/Chip';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import '../css/patient-details.css';

function PatientHistoryButtons(props) {
	if (props.edit && props.index === props.selectedIndex) {
		return (
			<Fragment>
				<Button size="small" onClick={() => props.handleCancel(props.index)}>ביטול</Button>
				<Button size="small" onClick={props.openAddPractice}>הוסף תרגיל</Button>
				<Button size="small" color="primary" onClick={ () => props.handleSave(props.index)}>שמור</Button>
			</Fragment> )
	}	else {
		return (
				<Button size="small" color="primary" onClick={() => props.handleEdit(props.index)}>ערוך</Button>
		)
	}
};

function PatientHistoryContent(props) {
	if (props.edit && props.index === props.selectedIndex) {
		return (<div style={{width: props.practices.length>0 ? '50%' : '100%'}}><TextField
			fullWidth
			multiline
			type="text"
			id={props.index}
			label="עריכת פגישה"
			value={props.content}
			onChange={props.handleContentChange}
		/></div>)
	} else return	<Typography variant="subheading">{props.content}</Typography>
};

function PatientHistoryPractices(props){
	if (props.practices.length === 0 ) { return null };
	if (props.edit && props.index === props.selectedIndex) {
	return (<div className="practicesWrap" dir="ltr">
		{props.practices.map( (item,index) => <Chip
        key={index}
        label={item.label}
        onDelete={() => props.handleDeleteChip(index)}
      />)}
		</div>)
	}	else return (<List style={{margin: "auto"}}>
		<Typography >רשימת תרגילים</Typography>
		{props.practices.map((practice,index)=> <ListItem button onClick={ () => props.showDetails(practice.value)} key={index} >
			<ListItemText	primary={practice.label}
									/></ListItem>)}
		</List>)
}

class patientHistory extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			appointments:[],
			practicesList: [],
			apiError:"",
			edit: false,
			addPracticeDialog: false,
			showPracticeDetailsDialog: false,
			practiceDetailsObject: {},
			practiceSelectedOption: null,
			selectedIndex: 0,
		}
		this.handlePracticeChange = this.handlePracticeChange.bind(this);
	};

	formatAppointmentHeader(appointment) {
		const [ startDate, startTime ] = appointment.startTime.split(" ")
		const endTime = appointment.endTime.split(" ")[3];
		return  startDate + " , " + startTime + " - " + endTime;
	};

	componentDidMount() {
		this.getAppointmentsHistoryData();
		fetch('/api/get-practices-list')
		.then( (res) => res.json() )
		.then( (res) => this.setState({practicesList: res}))
	}

	getAppointmentsHistoryData = () => {
	this.callAppointmentsApi()
	.then( res => {
		res.forEach( (item, index) => {
			item.orgSummary = item.summary || "";
			item.orgPractices = item.practices || [];
		} ) // add copy of original summary for cancel changes
		this.setState( { appointments: res.sort( (a,b) => (a.startTime > b.startTime) ? 1 : -1 ) } )},
		err => {
			if (err.message === "not found") {
				this.setState({apiError: "מטופל לא קיים במערכת או שאין לך הרשאה"} )
			} else {
				this.setState({apiError: "שגיאה לא מוכרת"} )
			}
	}); 
};

	handlePracticeChange (practiceSelectedOption) {
    this.setState({ practiceSelectedOption });
    console.log(`Option selected:`, practiceSelectedOption);
  }

	enableEditDialog = (index) => {
		this.setState({	edit: true,	selectedIndex: index });
	};

	disableEditDialog = () => {
		this.setState({	edit: false,	selectedIndex: null });
	};

	handleToggleAddPracticeDialog = () => {
		if(this.state.addPracticeDialog){
			let change = [];
			change.appointments = [...this.state.appointments];
			change.appointments[this.state.selectedIndex].practices = this.state.practiceSelectedOption;
			this.setState(change);
		}
		else { this.setState({practiceSelectedOption: this.state.appointments[this.state.selectedIndex].practices}) }
		this.setState(prevState => ({
			addPracticeDialog: !prevState.addPracticeDialog
		}));
	};

	handleToggleShowPracticeDetailsDialog = () => {
		this.setState(prevState => ({
			showPracticeDetailsDialog: !prevState.showPracticeDetailsDialog
		}));
	};

	handleDeleteChip = (index, practiceIndex) => {
		let change = [];
			change.appointments = [...this.state.appointments];
			change.appointments[this.state.selectedIndex].practices.splice(practiceIndex,1);
			this.setState(change);
	}

	showPracticeDetails = (practiceName) => {
		fetch('/api/get-practice-details?practiceid='+practiceName)
		.then( (res) => res.json() )
		.then( (res) => this.setState({practiceDetailsObject: res}))
		this.handleToggleShowPracticeDetailsDialog();
	}

	handleContantCancel = (index) => {
		const appointments = [...this.state.appointments];
		appointments[index].summary = appointments[index].orgSummary;
		appointments[index].practices = appointments[index].orgPractices;
		this.setState({appointments})
		this.disableEditDialog()
	};

	parseSaveServerResponse = (res) => {
		if(res.status !== 200)
			this.setState({apiError: "השמירה בשרת נכשלה, בדוק חיבור לרשת או נסה שוב"})
	}

	handleContentSave = (index) => {
		postRequest('/api/submit-appointment-summary', this.state.appointments[index], this.parseSaveServerResponse)
		const appointments = [...this.state.appointments];
		appointments[index].orgSummary = appointments[index].summary;
		appointments[index].orgPractices = appointments[index].practices;
		this.setState({appointments})
		this.disableEditDialog();
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
		const {  appointments, practicesList, apiError,  edit, addPracticeDialog, showPracticeDetailsDialog, practiceSelectedOption, selectedIndex, practiceDetailsObject } = this.state;
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
									index={index.toString()}
									practices={item.practices || []}
									selectedIndex={selectedIndex}
									content={item.summary || ""}
									edit={edit}
									handleContentChange={this.handleContentChange}
								/>
								<PatientHistoryPractices showDetails={this.showPracticeDetails} edit={edit} handleDeleteChip={(practiceIndex)=>this.handleDeleteChip(index, practiceIndex)} practices={item.practices || []} />
							</ExpansionPanelDetails>
							<ExpansionPanelActions>
								<PatientHistoryButtons
									index={index.toString()}
									selectedIndex={selectedIndex}
									edit={edit}
									handleEdit={this.enableEditDialog}
									handleCancel={this.handleContantCancel}
									handleSave={this.handleContentSave}
									openAddPractice={this.handleToggleAddPracticeDialog}
								/>
								</ExpansionPanelActions>
						</ExpansionPanel>
					)}
					<Dialog scroll='paper' open={addPracticeDialog} onClose={this.handleToggleAddPracticeDialog}>
						<DialogTitle style={{width: '65vw', textAlign: 'center'}} >הוספת תרגיל</DialogTitle>
						<DialogContent>
							<Select 
								isMulti
								className='practices-container'
								classNamePrefix="practices"
								value={practiceSelectedOption}
								onChange={this.handlePracticeChange}
								options={practicesList}
							/>
						</DialogContent>
					</Dialog>
					<Dialog scroll='paper' open={showPracticeDetailsDialog} onClose={this.handleToggleShowPracticeDetailsDialog}>
						<DialogContent dir="rtl">
							<PracticeDetails practiceDetails={practiceDetailsObject} />
						</DialogContent>
					</Dialog>
				</div>
				)
	}
}

export default withRouter( patientHistory );