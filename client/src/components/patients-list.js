import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Face from '@material-ui/icons/Face';

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
		return listData.map( (item, index) => {
			return(
		    <Link key={index} to={'/patient-details/' + item.id}>
					<ListItem style={styles.ListItem} button>
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
					{this.renderPatientsListItems()}
				</List>
			)
		}
	}
}

export default withStyles(styles)(PatientsList);

