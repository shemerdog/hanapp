const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const serverLogic = require("./serverlogic");
const cors = require("cors");
const bunyanRequest = require('bunyan-request');
const appLogger = require( './logger');
const port = process.env.PORT || 3001;

const rootURL = "/";
const apiBaseURL = path.join( rootURL, "api" );

const app = express();
const staticClientFilesPath = path.join(__dirname, "../client/build");

const requestLogger = bunyanRequest({
  logger: appLogger
});

// app.use(requestLogger);
app.use(express.static(staticClientFilesPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //praser for the req bodies
app.use(cors({origin: "*", optionsSuccessStatus: 200})); // need to remove in prod?

// Defining GET requests
// TODO: You should decide, either you are parsing request here or in the logic, but don't do both different requests mixed
// TODO: Also if you're going with the separation of HTTP logic and application logic - I would have the serverLogic return a value and have the local functions here send it back to the client.
app.post( path.join( apiBaseURL, "submit-credentials" ), (req, res) => {
	console.log(req.body);
});

app.get( path.join( apiBaseURL, "available-appointments" ), (req, res) => {
	serverLogic.getAvailableAppointmentsFromDb(res, req.query.userID, req.query.date);
});

app.get( path.join( apiBaseURL, "patient-appointments" ), (req, res) => {
	serverLogic.getPatientAppointmentsFromDb(res, req.query.userID, req.query.patientId, req.query.scope);
});

app.get( path.join( apiBaseURL, "patient-details" ), (req, res) => {
	serverLogic.getPatientDataFromDb(res, req.query.userID, req.query.patientId);
});

app.get( path.join( apiBaseURL, "patients-list" ), (req, res) => {
	serverLogic.getPatientsListFromDb(res);
});

app.get( path.join( apiBaseURL, "delete-patient" ), (req, res) => {
	serverLogic.deletePatientsListFromDb(req, res);
});

app.get(  path.join( apiBaseURL, "get-settings" ), (req, res) => {
	serverLogic.getSettings(res);
});

app.get( path.join( apiBaseURL, "get-practices-list" ), (req, res) => {
	serverLogic.getPracticesListFromDb(res);
});

app.get( path.join( apiBaseURL, "get-practice-details" ), (req, res) => {
	console.log('api get-practice-details called');
	serverLogic.getPracticeDetails(req, res);
});

app.post( path.join( apiBaseURL, "set-settings" ), (req, res) => {
	serverLogic.submitSettings(req, res);
});

app.post( path.join( apiBaseURL, "submit-patient-form" ), (req, res) => {
	const formMethod = req.body.formMethod;
	serverLogic.submitPatientFormToDb(req, res, formMethod);
});

app.post( path.join( apiBaseURL, "submit-patient-appointment" ), (req, res) => {
	console.log("new patient appointment required: " + req.body.appointment);
	serverLogic.submitAppointmentToDb(req, res);
});

app.post( path.join( apiBaseURL, "submit-appointment-summary" ), (req, res) => {
	console.log("appointment-summary called: " + (req.body.appointment && req.body.startTime) );
	serverLogic.updateAppointmentSummary(req, res);
});

app.post( path.join( apiBaseURL, "submit-practice-form" ), (req, res) => {
	const formMethod = req.body.formMethod;
	serverLogic.submitPracticeFormToDb(req, res, formMethod);
});

app.post("/upload", serverLogic.upload); //upload files (src materials)

// Till here API paths


//Serving static files
app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'), function(err) {
	if (err) {
		console.log("Got error on HTTP request");
		res.status(500).send(err);
	}
	});
});

//listen//
app.listen(port, () => {
	serverLogic.init(); // update settings...
	appLogger.info(`Listening on port ${port}`);
});
