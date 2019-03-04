const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const serverLogic = require('./serverlogic')

// const listEvents = require('./googlecalendar.js');

const port = process.env.PORT || 3001;


const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/api/available-appointments', (req, res) => {
	const userID = req.query.userid;
	const date = req.query.date;
	console.log('api available-appointments called');
	serverLogic.getAvailableAppointmentsFromDb(res, userID, date);
});

app.get('/api/patient-appointments', (req, res) => {
	const userID = req.query.userid
	const patientId = req.query.patientid
	const method = req.query.method;
	console.log('api patient-appointments called');
	serverLogic.getPatientAppointmentsFromDb(res, userID, patientId, method);
});


app.get('/api/patient-details', (req, res) => {
	const userID = req.query.userid
	const patientId = req.query.patientid
	console.log('api patient-details called');
	serverLogic.getPatientDataFromDb(res, userID, patientId);
});

app.get('/api/patientsList', (req, res) => {
	console.log('api patientsList called');
	//setTimeout(function() {  //simulate server lag
		serverLogic.getPatientsListFromDb(res);
	//}, 2000)
});

app.get('/api/delete-patient', (req, res) => {
	console.log('api delete-patient called');
	serverLogic.deletePatientsListFromDb(req, res);
});

app.get('/api/get-settings', (req, res) => {
	console.log('api get-settings called');
	serverLogic.getSettings(res)
});

app.post('/api/set-settings', (req, res) => {
	console.log('api set-settings called');
	serverLogic.submitSettings(req, res);
});

app.post('/api/submit-patient-form', (req, res) => {
	const formMethod = req.body.formMethod;
	serverLogic.submitPatientFormToDb(req, res, formMethod);
});

app.post('/api/submit-patient-appointment', (req, res) => {
	console.log("new patient appointment required: " + req.body.appointment)
	serverLogic.submitAppointmentToDb(req, res);
});

app.post('/api/submit-appointment-summary', (req, res) => {
	console.log("appointment-summary called: " + (req.body.appointment && req.body.startTime) );
	serverLogic.updateAppointmentSummary(req, res);
});

// Till here API paths


//Serving static files

app.get('/*', function(req, res) { res.sendFile(path.join(__dirname, '../client/build', 'index.html')); });

//listen//
app.listen(port, () => {
	serverLogic.init(); // update settings...
	console.log(`Listening on port ${port}`)
});