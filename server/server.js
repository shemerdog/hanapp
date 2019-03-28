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
	// const testToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzEzZTdmZDFlOWUyYTRkZWQzYjI5MmQyYTdmNGU1MTk1NzQzMDgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNDkyNDg5OTUyMjIzLWhlYWl2aXZwZG41ZG5xdW42YWVybDQ1NmNscnNjbHNiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNDkyNDg5OTUyMjIzLWhlYWl2aXZwZG41ZG5xdW42YWVybDQ1NmNscnNjbHNiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0OTQwNDY4NDA0NzQ0MzM5MzQ5IiwiaGQiOiJsYmQuY28uaWwiLCJlbWFpbCI6IlllaHVkYS5HQGxiZC5jby5pbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiN0ZoZl9qYm04MEVJRTlTaFN5MTdGZyIsIm5hbWUiOiJZZWh1ZGEgR2Vyc3RsZSIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLVpTSGoxY3dwdHNJL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUxRL2YyY05KcGVnaWVZL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJZZWh1ZGEiLCJmYW1pbHlfbmFtZSI6IkdlcnN0bGUiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU1Mzc3NDUxMywiZXhwIjoxNTUzNzc4MTEzLCJqdGkiOiJlNjBlYzMxM2EzODlmMjMzYjM4NTljMWU1NTM4ZmRiY2JmNGVjZDQ4In0.C7oZvEvDTxQaN8jsxj8nXxJXesa2Jld2X8Pnw_P1wcgwRL03trI7jRYOkmrFHiE02Q1TV2XY9R5mFnPIvrQGsskx5Ll8bpYCp8qDmq_78Luj9jYjhG6KOCZ-md9tvSkNQL5afL5C-_qAU5wx_yM4B2Us2Ki92FvDO3DS-EB5Q7qGUJLrCTKy_xLRGpDqtzQYQw_QiDWCmfMpNRiuCR1SB6MNPztjKmleZ2xKnPxGgXYd_l-qC6WNHlL4V-_kn5EiHDABsPLhroi0pRaHO9sKD3NhkuN6MdQ7IdZEtmuum_It_NUbG_GtdALOoouNaYLu1rGgNzPeCyi_M5znlevMXw";
    // serverLogic.verifyAndStoreTokenId({ tokenId: testToken, email: "Y@lbd.co.il" });
    serverLogic.verifyAndStoreTokenId(req.body);
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
