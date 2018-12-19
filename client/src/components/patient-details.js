import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom'


class PatientDetails extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			}
		};

	componentDidMount() {
		this.callApi()
		.then( res => { this.setState( { data: res.data } ) } )
	};

	callApi = async () => {
		const response = await fetch('/api/patient-details?userid=' + this.props.data.userId + '&patientid=' + this.props.match.params.patientId);
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	render() {
		if (this.props.login === false) {
				return <Redirect to='/login' />
			}
			else {
				const { data } = this.state;
				return (
					<div> PatientDetails
						<div>{data.firstName + ' ' + data.lastName}</div>
						<div>{data.test}</div>
					</div>
				)
		}
	}
}


export default PatientDetails;

