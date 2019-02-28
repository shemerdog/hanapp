import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import DialogTemplate from '../tools/dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress'
import Face from '@material-ui/icons/Face';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = {
	list: {
		width: '100%',
		maxWidth: 360,
		margin: 'auto',
	},
	ListItem: {
		textAlign: 'start'
	}
};

class PatientsList extends Component {
	constructor(props){
		super(props);
		this.state = {
			listData: [],
			loading: false,
			dialogDeleteOpen: false,
			dialogDeleteId: "",
		}

		this.renderPatientsListItems = this.renderPatientsListItems.bind(this);
	};

	exitDeleteDialog = () => {
		this.setState({dialogDeleteOpen: false, dialogDeleteId: ""});
	};

	deletePatient =() => {
		fetch( '/api/delete-patient?patientid=' + this.state.dialogDeleteId );
		this.getListData();
		this.exitDeleteDialog();
	};

	handleDeleteClick = (id) => (e) => {
		e.preventDefault();
		this.setState({dialogDeleteOpen: true, dialogDeleteId: id});
	}

	componentDidMount() {
		this.getListData()
	};

	getListData = () => {
		this.setState( { loading: true } ) 
		this.callApi()
		.then( res => { this.setState( { listData: res, loading: false } ) } )
	}

	callApi = async () => {
		const response = await fetch('/api/patientsList');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	renderPatientsListItems() {
		const { listData } = this.state
		if (listData.length === 0) {
			if(this.state.loading) {
				return ( <CircularProgress size={20}/>
			)} else {
				return ( <div>אין מטופלים כרגע</div>
			)}
		}
		return listData.map( (item, index) => {
			return(
				<Link key={index} to={'/patient-details/' + item.id}>
					<ListItem button style={styles.ListItem}>
						<Avatar>
							<Face />
						</Avatar>
						<ListItemText primary={item.firstName + " " + item.lastName} secondary={item.id} />
						<ListItemSecondaryAction style={{left: '4px', right:'auto'}}>
							<IconButton onClick={this.handleDeleteClick(item.id)}>
								<DeleteIcon />
							</IconButton>	
						</ListItemSecondaryAction>
					</ListItem>
				</Link>
			)
		})
	};

	render(){
		if (this.props.data.login === false) {
			return <Redirect to='/login' />
		}
		else {
			return (
				<div>
					<List style={styles.list}>
					<Typography variant="title">
						רשימת מטופלים
					</Typography>
					<Link key="new" to='/create-patient/'>
						<ListItem button style={styles.ListItem}>
							<Avatar>
								<PersonAdd />
							</Avatar>
							<ListItemText primary="הוסף מטופל חדש" />
						</ListItem>
					</Link>
						<Divider />

						{this.renderPatientsListItems()}
					</List>
					<DialogTemplate
						title={"מחיקת מטופל " + this.state.dialogDeleteId}
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

export default withStyles(styles)(PatientsList);

