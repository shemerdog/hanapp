import React ,{ Component } from 'react';
import { Redirect } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import CalendarSettingsIcon from '../tools/calendar-settings-icon'
import CalendarSettings from './settings-components'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

const styles = {
	container: {
		width: '100%',
		maxWidth: 600,
		margin: 'auto',
	}
}

class Settings extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			settingsComponent: 0,
		}
	};

	componentDidMount() {
		this.props.data.setTitle("הגדרות");
	};

	handleChange = (event, settingsComponent) => {
    this.setState({ settingsComponent });
  };

  handleChangeIndex = index => {
    this.setState({ settingsComponent: index });
  };

	render() {
		if ( this.props.data.login === false ) {
				return <Redirect to='/login' />
			}
			else {
				const {settingsComponent} = this.state;
				return (
					<div style={styles.container}>
						<Tabs
							value={settingsComponent}
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
		          index={settingsComponent}
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