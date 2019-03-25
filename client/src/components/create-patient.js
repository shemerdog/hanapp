import React from 'react';
import { Redirect,withRouter } from 'react-router-dom';
import CreateOrEditProfile from './CreateOrEditProfile';

function CreatePatient(props) {
	if ( props.data.login === false ) {
		return <Redirect to='/login' />;
	}
	else {
		return <CreateOrEditProfile setTitle={props.data.setTitle} actionType="create" profileType="patient" handleExit={()=>{props.history.push('/patients-list');}}/>
	}
}

export default withRouter(CreatePatient);