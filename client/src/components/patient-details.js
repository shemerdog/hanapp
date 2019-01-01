import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
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


const styles = {
	list: {
		width: '100%',
		maxWidth: 260,
		margin: 'auto',
	},
	ListItem: {
		textAlign: 'start'
	},
	button: {
		margin: '0 2vw',
	},
	edit:{position: 'absolute', left: "3vw", bottom: '3vh'},
};


class PatientDetails extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			edit:false,
			}
		this.renderDetailesRow = this.renderDetailesRow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleDismissChanges = this.handleDismissChanges.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.setFormData = this.setFormData.bind(this);

	};

	renderDetailesRow( item, index ) {
		if (this.state.edit) {
			return(
				<FormControl key={index}>
					<InputLabel htmlFor={item.key}>{item.key}</InputLabel>
					<Input type="text" name={index.toString()} value={item.value} onChange={this.handleChange} />
				</FormControl>
		)}
		else{
			return(
				<ListItem key={index} style={styles.ListItem}>
					<ListItemText
						primary={item.key}
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

	handleSaveChanges(){
		this.setState({edit: false});
		//send data to DB
	};
	handleDismissChanges(){
		this.setFormData();
		this.setState({edit: false});
	}
	setFormData() {
		this.callApi()
		.then( res => { this.setState( { data: res.data } )} )
	}
	componentDidMount() {
		this.setFormData();
	};

	callApi = async () => {
		const response = await fetch( '/api/patient-details?userid=' + this.props.data.userId + '&patientid=' + this.props.match.params.patientId );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	render() {
		const { data, edit } = this.state;

		if ( this.props.data.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				return (
					<div>
						<Typography variant="title">
							פרטי מטופל
						</Typography>
						{!edit && <Button variant="fab" color="secondary"  style={styles.edit} onClick={()=> { this.setState({edit: true}) } }>
							<EditIcon />
						</Button>}
						<div>
							<List style={styles.list}>
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
					</div>
				)
		}
	}
}


export default PatientDetails;

