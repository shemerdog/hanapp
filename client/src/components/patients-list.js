import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Face from '@material-ui/icons/Face';
import PersonAdd from '@material-ui/icons/PersonAdd';

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
			listData: []
		}
		this.renderPatientsListItems = this.renderPatientsListItems.bind(this);
		this.callApi = this.callApi.bind(this);
	}
	componentDidMount() {
		this.callApi()
		.then( res => { this.setState( { listData: res.data } ) } )
	};

	callApi = async () => {
		const response = await fetch('/api/patientsList');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};
	renderPatientsListItems() {
		const { listData } = this.state
		if (listData.length === 0) return (
			<div>אין מטופלים כרגע</div>
		)
		return listData.map( (item, index) => {
			return(
				<Link key={index} to={'/patient-details/' + item.id}>
					<ListItem button style={styles.ListItem}>
						<Avatar>
							<Face />
						</Avatar>
						<ListItemText primary={item.firstName + " " + item.lastName} secondary={item.id} />
					</ListItem>
				</Link>
			)
		})
	}

	render(){
		if (this.props.data.login === false) {
			return <Redirect to='/login' />
		}
		else {
			return (
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
			)
		}
	}
}

export default withStyles(styles)(PatientsList);

