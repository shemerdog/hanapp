// import React ,{ Component } from 'react';
// import { Redirect, withRouter } from 'react-router-dom';
// import Typography from '@material-ui/core/Typography';
// import FormControl from '@material-ui/core/FormControl';
// import Input from '@material-ui/core/Input';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import InputLabel from '@material-ui/core/InputLabel';
// import Button from '@material-ui/core/Button';
// import SaveIcon from '@material-ui/icons/Save';
// import PersonAdd from '@material-ui/icons/PersonAdd';
// import DialogTemplate from './dialog';


// const styles = {
// 	container: {
// 		maxWidth: 800,
// 		margin: 'auto',
// 	},
// 	input: {
// 		margin: '1vh 1vw',
// 		width: 200,
// 	},
// 	button: {
// 		margin: '3vh 1vw',
// 	},
// }

// const TextInput = function(props) {
// 	return <FormControl error={props.error} style={styles.input}>
// 					<InputLabel shrink required={props.required} htmlFor={props.id}>{props.label}</InputLabel>
// 					<Input autoFocus={props.id === "0"} id={props.id} value={props.val} type={props.type || 'text'} onChange={props.handleChange} />
// 					<FormHelperText error>{props.errorMsg}</FormHelperText>
// 				</FormControl>
// };

// const validateEmail = function(email){
// 	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 	return re.test(email);
// };

// const validateForm = function(e) {
// 	e.preventDefault();
// 	let change = [];
// 	change.formValid = true
// 	change.patientData = [...props.patientData];
// 	for (let item of change.patientData) {
// 			item.error = false;
// 		if (item.required && item.val.length === 0) {
// 			item.error = true;
// 			item.errorMsg = "שדה חובה"
// 		}
// 		if ( item.type === "email" && item.val.length > 0 && !validateEmail(item.val) ) {
// 			item.error = true;
// 			item.errorMsg = "כתובת מייל לא תקינה"
// 		}
// 		if (item.error){ change.formValid = false}
// 	}
// 	props.updateParentState(change);
// 	if (change.formValid){
// 		props.handleSubmit()
// 	}
// };
// const CreatePatientForm = props => {
// 	return (
// 		<div>
// 			{props.patientData.map((item, index) => <TextInput key={index} id={index.toString()} {...item} handleChange={props.handleChange}/>)}
// 			<Button type="submit" variant="contained" style={styles.button} color="primary" onClick={validateForm}>
// 				צור מטופל
// 				<SaveIcon />
// 			</Button>
// 			{props.supervisor && <Button style={styles.button} color="secondary" onClick={this.handleCreateSupoervisor}>
// 				צור מבוגר אחראי
// 				<PersonAdd />
// 			</Button>}
// 		</div>
// 	)
// }

// export default CreatePatientForm;