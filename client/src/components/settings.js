import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import CalendarSettingsIcon from '../tools/calendar-settings-icon'
import CalendarSettings from './settings-components'
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

const styles = {
	container: {
		width: '100%',
		maxWidth: 400,
		margin: 'auto',
	}
}

class Settings extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			settingsComponenet: 0,
		}
	};

	componentDidMount() {
		
	};

	handleChange = (event, settingsComponenet) => {
    this.setState({ settingsComponenet });
  };

  handleChangeIndex = index => {
    this.setState({ settingsComponenet: index });
  };

	render() {
		if ( this.props.data.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				const {settingsComponenet} = this.state;
				return (
					<div style={styles.container}>
						<Typography style={{margin: "2vh 0"}} variant="title">
							הגדרות
						</Typography>
						<Tabs
							value={settingsComponenet}
							onChange={this.handleChange}
							fullWidth
							indicatorColor="secondary"
							textColor="secondary"
						>
							<Tab 
								icon={<CalendarSettingsIcon x="0px" y="0px" width="24px" height="24px" viewBox="0 0 37.884 37.885" />}
								label="לוח שנה" 
								/>
							<Tab icon={<FavoriteIcon />} label="משהו אחר" />
							<Tab icon={<PersonPinIcon />} label="עוד משהו" />
						</Tabs>
		        <SwipeableViews
		          axis='x-reverse'
		          index={settingsComponenet}
		          onChangeIndex={this.handleChangeIndex}
		        >
							<CalendarSettings />
	        		<div>Item Two</div>
	        		<div>Item Three</div>
						</SwipeableViews>			
					</div>
				)
		}
	}
}

export default Settings;