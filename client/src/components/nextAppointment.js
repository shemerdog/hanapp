import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function NextAppointment(props) {
	return (
		<ExpansionPanel >
	        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
				<ListItem key='nextApointment' style={{textAlign: 'start'}}>
					<ListItemText
						primary='פגישה הבאה'
						secondary={props.appointments[0] || 'אין פגישות ביומן!'}
					/>
					<Tooltip title="הוסף פגישה" >
							<IconButton onClick={props.handleClick} >
								<AddIcon />
							</IconButton>
					</Tooltip >
				</ListItem>
	        </ExpansionPanelSummary>
	        <ExpansionPanelDetails>
	          {props.appointments.length > 2 && <div>
	         	<Typography  variant="title"> פגישות הבאות: </Typography>
	            { props.appointments.map( (appointment, index) => <Typography key={index}>{appointment}</Typography> ) }
	          </div>}
	        </ExpansionPanelDetails>
				<Dialog open={props.open} onClose={props.handleClose}>
					<DialogTitle >קבע פגישה חדשה</DialogTitle>
					<Input onChange={props.handleChange} autoFocus={props.open} value={props.newAppointment.date} type='date'/>
					<Input onChange={props.handleChange} autoFocus={props.open} value={props.newAppointment.time} type='time'/>
					<Button color="primary" onClick={props.handleSave}>
						שמור פגישה
						<SaveIcon />
					</Button>
				</Dialog>
      </ExpansionPanel>
	)
}