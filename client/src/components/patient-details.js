import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
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
    maxWidth: 360,
    margin: 'auto',
  },
  ListItem: {
  	textAlign: 'start'
  },
  button: {
  	margin: '0 2vw',
  }
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
	        <ListItemSecondaryAction onClick={()=> {
	        																	console.log("edit clicked")
	        																	this.setState(prevState => ({
																							edit: !prevState.edit
																						}))}}>
	          <IconButton>
	            <EditIcon />
	          </IconButton>
	        </ListItemSecondaryAction>
	      </ListItem>
			)
		}
	};

	handleChange(event) {
		let change = {}
		change.data = [...this.state.data]
		change.data[event.target.name].value = event.target.value;
		this.setState(change, ()=> {
			console.log(this.state.data)
			console.log(this.orgData)
		})
	};

	handleSaveChanges(){
		this.setState({edit: false});
	};
	handleDismissChanges(){
		this.componentDidMount();
		this.setState({edit: false});
	}

	componentDidMount() {
		this.callApi()
		.then( res => { this.setState( { data: res.data } )} )
	};

	callApi = async () => {
		const response = await fetch( '/api/patient-details?userid=' + this.props.data.userId + '&patientid=' + this.props.match.params.patientId );
		const body = await response.json();
		if ( response.status !== 200) throw Error( body.message );
		return body;
	};

	render() {
		const { data, edit } = this.state;

		if ( this.props.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				return (
					<div>
						 <Grid item xs={12} md={6}>
	            <Typography variant="title">
	              PatientDetails
	            </Typography>
	            <div >
	              <List style={styles.list}>
	              { data.map( this.renderDetailesRow ) }
	              </List>
	              { edit && <div>
		              	<Button variant="contained" style={styles.button} color="secondary" onClick={this.handleDismissChanges}>
						        Delete
						        <DeleteIcon />
						      </Button>
						      <Button variant="contained" style={styles.button} color="primary" onClick={this.handleSaveChanges}>
						        Save
						        <SaveIcon />
						      </Button>
						      </div>}
	            </div>
	          </Grid>
					</div>
				)
		}
	}
}


export default PatientDetails;

