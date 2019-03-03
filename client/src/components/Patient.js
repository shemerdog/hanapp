import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import PatientDetails from './patient-details'
import PatientHistory from './patient-history'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
	container: {
		width: '100%',
		maxWidth: 600,
		margin: 'auto',
	}
}

class Patient extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patientComponent: 0,
		}
	};

	componentDidMount() {
		this.props.data.setTitle("פרטי מטופל");
	};

	handleChange = (event, patientComponent) => {
		this.setState({ patientComponent });
	};

	handleChangeIndex = index => {
		this.setState({ patientComponent: index });
	};

	render() {
		if ( this.props.data.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				const {patientComponent} = this.state;
				return (
					<div style={styles.container}>
						<Tabs
							value={patientComponent}
							onChange={this.handleChange}
							fullWidth
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab 
								label="פרטים" 
								/>
							<Tab label="היסטורית פגישות" />
						</Tabs>
						<SwipeableViews
							axis='x-reverse'
							index={patientComponent}
							onChangeIndex={this.handleChangeIndex}
						>
							<PatientDetails {...this.props} />
							<PatientHistory {...this.props} />
						</SwipeableViews>			
					</div>
				)
		}
	}
}

export default Patient;