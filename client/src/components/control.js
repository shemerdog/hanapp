import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}
const styles = {
  root: {
    width: '90%',
    overflowX: 'auto',
    margin: '5vh auto'
  },
  table: {
  }
}
class Control extends Component {

	constructor(props) {
		super(props);
		this.state = {	
			dialogOpen: false
		}
	};


rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

	componentDidMount() {
		this.callApi()
		.then( res => { this.setState( { data: res.data } ) } )
	};

	callApi = async () => {
		const response = await fetch('/api/control');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	render () {
		if (this.props.login === false) {
	      return <Redirect to='/login' />
	    }
		return (
		   <Paper style={styles.root}>
		      <Table style={styles.table}>
		        <TableBody>
		          {this.rows.map(row => {
		            return (
		              <TableRow key={row.id}>
		                <TableCell component="th" scope="row">
		                  {row.name}
		                </TableCell>
		                <TableCell>{row.calories}</TableCell>
		                <TableCell>{row.fat}</TableCell>
		                <TableCell>{row.carbs}</TableCell>
		                <TableCell>{row.protein}</TableCell>
		              </TableRow>
		            );
		          })}
		        </TableBody>
		      </Table>
		    </Paper>
		) }
	}

export default Control;
