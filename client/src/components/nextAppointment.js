import React from 'react';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Input from '@material-ui/core/Input';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const iconColor = function(time, time2){
	return time !== time2 ? "primary" : "secondary";
}

export default function NextAppointment(props) {
	return (
		<ExpansionPanel >
			<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
				<ListItem dense key='nextApointment'>
					<ListItemText
						primary='פגישה הבאה'
						secondary={( props.appointments[0] && props.appointments[0].startTime ) || 'אין פגישות ביומן!'}
					/>
					<Tooltip title="הוסף פגישה" >
							<IconButton onClick={props.handleClick} >
								<AddIcon />
							</IconButton>
					</Tooltip >
				</ListItem>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						{props.appointments.length > 1 && <div>
						<Typography  variant="title"> פגישות הבאות: </Typography>
							{ props.appointments.map( (appointment, index) => <Typography align="right" key={index}>{appointment.startTime}</Typography> ) }
						</div>}
					</ExpansionPanelDetails>
				<Dialog scroll='paper' open={props.open} onClose={props.handleClose}>
					<DialogTitle >קבע פגישה חדשה</DialogTitle>
						<Input onChange={ (e)=> props.handleChange(e.target) } autoFocus={props.open} value={props.newAppointment.date} type='date'/>
						<br />
						<DialogContent>
							<List dense={true}>
								{!props.error && props.availableAppointments.map((appointment, index) => 
									<ListItem color={iconColor(appointment.startTime, props.newAppointment.time)} key={index}>
										<ListItemText >{appointment}</ListItemText>
										<ListItemSecondaryAction>
											<IconButton color={iconColor(appointment, props.newAppointment.time)} onClick={ ()=> props.handleChange({type: "time",value: appointment}) } >
												<AddIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								)}
								{props.error && <Typography  variant="caption" color='secondary' align="center">
									<span>{props.error}</span>
								</Typography>}
							</List>
					</DialogContent>
					<DialogActions>
						<Button disabled={!(props.newAppointment.date && props.newAppointment.time)} color="primary" onClick={props.handleSave}>
							שמור פגישה
							<SaveIcon />
						</Button>
					</DialogActions>
				</Dialog>
			</ExpansionPanel>
	)
}