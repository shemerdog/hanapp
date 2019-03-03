import React ,{ Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import {callApi, postRequest} from '../tools/fetch-requests'
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {TextInput} from './CreateOrEditProfile';
import Paper from '@material-ui/core/Paper';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
import Looks3 from '@material-ui/icons/Looks3';
import Looks4 from '@material-ui/icons/Looks4';
import Looks5 from '@material-ui/icons/Looks5';
import Looks6 from '@material-ui/icons/Looks6';
import Looks7 from '@material-ui/icons/Filter7';

const styles = {
	verticalSpacing: {
		margin: "2vh 0",
	},
	horizonalSpacing: {
		margin: "0 2vw",
	}
}

class CalendarSettings extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			orgSettingObject: {},
			settings: [
			{key: 'freeDays', label: "ימים חופשיים", value: [0]},
			{key: 'workHours', label: "שעות עבודה", value: ['00:00','00:00'] },
			{key: 'appointmentDuration', label: "אורך פגישה", value: 0},
			],
		}
	};

	componentDidMount() {
		callApi('/api/get-settings')
		.then(res=>{
			const settings = [...this.state.settings];
			settings.forEach( item => item.value = res[item.key] );
			this.setState({settings: settings, orgSettingObject: res })
		})
	};

	validateForm() {
		return true;
	// 	let formValid = true
	// 	for (let item of this.state.settings) {
	// 			item.error = false;
	// 		if (item.required && item.value.length === 0) {
	// 			item.error = true;
	// 			item.errorMsg = "שדה חובה"
	// 		}
	// 		if ( item.type === "email" && item.value.length > 0 && !this.validateEmail(item.value) ) {
	// 			item.error = true;
	// 			item.errorMsg = "כתובת מייל לא תקינה"
	// 		}
	// 		if (item.error){ formValid = false}
	// 	}
	// 	this.setState({formValid: formValid});
	// 	return formValid;
	};

	handleSubmit = () => {
		let data = {};
		this.state.settings.forEach(item => data[item.key] = item.value);
		data = Object.assign({}, this.state.orgSettingObject, data)
		postRequest('/api/set-settings', data);
		this.props.history.push('/patients-list');
	}

	handleFreeDays = (event, freeDays) => {
		let settings = [...this.state.settings];
		settings[0].value = freeDays;
		this.setState({settings});
	}

	handleWorkHoursChange = name => (event) => {
			let settings = [...this.state.settings];
			settings[1].value[name] =  event.target.value;
			this.setState({settings});
	}

	handleAppointmentDurationChange = (event) => {
		let settings = [...this.state.settings];
		settings[2].value =  event.target.value;
		this.setState({settings});
	}

	render() {
		const {settings} = this.state;
		return (
			<Fragment>
				<ToggleButtonGroup selected={true} value={settings[0].value} onChange={this.handleFreeDays}>
				<Typography style={styles.horizonalSpacing} align="right" variant="subheading">
					ימים חופשיים
				</Typography>
					<ToggleButton value={0}>
						<LooksOne />
					</ToggleButton>
					<ToggleButton value={1}>
						<LooksTwo />
					</ToggleButton>
					<ToggleButton value={2}>
						<Looks3 />
					</ToggleButton>
					<ToggleButton value={3}>
						<Looks4 />
					</ToggleButton>
					<ToggleButton value={4}>
						<Looks5 />
					</ToggleButton>
					<ToggleButton value={5}>
						<Looks6 />
					</ToggleButton>
					<ToggleButton value={6}>
						<Looks7 />
					</ToggleButton>
				</ToggleButtonGroup>
				<Paper style={styles.verticalSpacing}>
					<Typography style={styles.horizonalSpacing} align="right" variant="subheading">
						שעות עבודה
					</Typography>
					<TextInput
						style={styles.horizonalSpacing}
						required
						type="time"
						id="workHours1"
						label="התחלה"
						value={settings[1].value[0]}
						handleChange={this.handleWorkHoursChange('0')}
						margin="normal"
					/>
					<TextInput
						style={styles.horizonalSpacing}
						required
						type="time"
						id="workHours2"
						label="סיום"
						value={settings[1].value[1]}
						handleChange={this.handleWorkHoursChange('1')}
						margin="normal"
					/>
				</Paper>
				<Paper style={styles.verticalSpacing}>
					<Typography style={styles.horizonalSpacing} align="right" variant="subheading">
						אורך פגישה
					</Typography>
					<TextInput
						required
						type="number"
						inputProps={{min:0,max:180}}
						id="appointmentDuration"
						label="בדקות"
						value={settings[2].value}
						handleChange={this.handleAppointmentDurationChange}
						margin="normal"
					/>
				</Paper>
				<Button disabled={!this.validateForm} color="primary" onClick={this.handleSubmit}>
					שמור 
					<SaveIcon />
				</Button>
			</Fragment>
		)
	}
}

export default withRouter(CalendarSettings);