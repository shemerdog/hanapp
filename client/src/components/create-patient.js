import React ,{ Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

const styles = {
	container: {
		maxWidth: 800,
		margin: 'auto',
	},
  input: {
    margin: '1vh 1vw',
    width: 200,
  },
  button: {
  	margin: '3vh auto',
  	display: 'block',
  },
}

const TextInput = function(props) {
	return <FormControl style={styles.input}>
          <InputLabel shrink required={props.required} htmlFor={props.id}>{props.label}</InputLabel>
          <Input id={props.id} value={props.val} type={props.type || 'text'} onChange={props.handleChange} />
        </FormControl>
};

class CreatePatient extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			patientData: {
        firstName:"",
        lastName:"",
        birthDate:"",
        phone:"",
        email:"",
        address:"",
      },
      errors: {
        firstName:false,
        lastName:false,
        birthDate:false,
        phone:false,
        email:false,
        address:false,
      },
      momDetails:{},
      dadDetails:{},
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	};

	handleChange(event) {
		let change = {};
		change.patientData = {...this.state.patientData};
		change.patientData[event.target.id] = event.target.value;
		this.setState(change);
	};
	validateForm() {
		const { patientData, errors } = this.state;
		for (let key in patientData) {

		}
	}

	handleSubmit(){
		this.validateForm();
		console.log("submitted")
	}

	render(){
		if ( this.props.data.login === false ) {
			return <Redirect to='/login' />
		}
		else {
			const { patientData, errors } = this.state;
			return (
				<div style={styles.container}>
					<Typography variant="title">
						מטופל חדש
					</Typography>
					<form>
						<TextInput error={errors.firstName} required id="firstName" val={patientData.firstName} label="שם פרטי" handleChange={this.handleChange} autofocus/>
						<TextInput error={errors.lastName} required id="lastName" val={patientData.lastName} label="שם משפחה" handleChange={this.handleChange}/>
						<TextInput error={errors.phone} required id="phone" type="tel" val={patientData.phone} label="טלפון" handleChange={this.handleChange}/>
						<TextInput focused error={errors.birthDate} id="birthDate" type="date" val={patientData.birthDate} label="תאריך לידה" handleChange={this.handleChange}/>
						<TextInput error={errors.email} id="email" type="email" val={patientData.email} label="מייל" handleChange={this.handleChange}/>
						<TextInput error={errors.address} id="address" val={patientData.address} label="כתובת" handleChange={this.handleChange}/>
						<Button variant="contained" type="submit" style={styles.button} color="primary" onClick={this.handleSubmit}>
							צור מטופל
							<SaveIcon />
						</Button>
					</form>
				</div>
			)
		} 
	}
}

export default CreatePatient