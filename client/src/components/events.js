import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom'
import MUIDataTable from "./table/MUIDataTable";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


class Events extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			columns: [],
			data: [],
			options: {
				filterType: "dropdown",
				responsive: "scroll",
				print: false,
				download: false,
				rowsPerPageOptions: [10,20,30],
				onRowClick: this.enterPerson.bind(this),//remove
			}
		}
	}

	enterPerson (data) {
		if ( this.props.match.params.tableType === "persons" )  //remove
		console.log(data);
	}

	getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FFF",
          maxWidth: "25vw",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }
    }
  })

	componentDidMount() {
		this.callApi()
		.then( res => { this.setState( { data: res.data, columns: res.columns } ) } )
	};

	callApi = async () => {
		const response = await fetch('/api/events');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	render() {
		if (this.props.login === false) {
				return <Redirect to='/login' />
			}
			else {
				const { title,data, columns, options } = this.state;
				return (
					<MuiThemeProvider theme={this.getMuiTheme()}>
						<MUIDataTable
						title="Events"
						data={data}
						columns={columns}
						options={options}
						responsive={"scroll"}
					/>
					</MuiThemeProvider>
				)
		}
	}
}


export default Events;

