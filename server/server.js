const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const serverLogic = require("./serverlogic");

const port = process.env.PORT || 3001;

const app = express();
const staticClientFilesPath = path.join(__dirname, "../client/build");
app.use(express.static(staticClientFilesPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); // What does that mean? why do we need this?

// Defining GET requests
// TODO: Consider using middleware for logging requests, like: https://github.com/expressjs/morgan or https://github.com/winstonjs/winston
// TODO: You should decide, either you are parsing request here or in the logic, but don't do both different requests mixed
// TODO: Also if you're going with the separation of HTTP logic and application logic - I would have the serverLogic return a value and have the local functions here send it back to the client.
const apiBaseURL = "/api/";
app.get(`${apiBaseURL}available-appointments`, (req, res) => {
	serverLogic.getAvailableAppointmentsFromDb(res, req.query.userID, req.query.date);
});

app.get( `${apiBaseURL}patient-appointments`, (req, res) => {
	serverLogic.getPatientAppointmentsFromDb(res, req.query.userID, req.query.patientId, req.query.scope);
});


app.get(`${apiBaseURL}patient-details`, (req, res) => {
	serverLogic.getPatientDataFromDb(res, req.query.userID, req.query.patientId);
});

app.get(`${apiBaseURL}patients-list`, (req, res) => {
	serverLogic.getPatientsListFromDb(res);
});

app.get(`${apiBaseURL}delete-patient`, (req, res) => {
	serverLogic.deletePatientsListFromDb(req, res);
});

app.get( `${apiBaseURL}get-settings`, (req, res) => {
	serverLogic.getSettings(res);
});

app.post(`${apiBaseURL}set-settings`, (req, res) => {
	serverLogic.submitSettings(req, res);
});

app.post("/api/submit-patient-form", (req, res) => {
	const formMethod = req.body.formMethod;
	serverLogic.submitPatientFormToDb(req, res, formMethod);
});

app.post("/api/submit-patient-appointment", (req, res) => {
	console.log("new patient appointment required: " + req.body.appointment);
	serverLogic.submitAppointmentToDb(req, res);
});

app.post("/api/submit-appointment-summary", (req, res) => {
	console.log("appointment-summary called: " + (req.body.appointment && req.body.startTime) );
	serverLogic.updateAppointmentSummary(req, res);
});

// Till here API paths


//Serving static files

app.get("/*", function(req, res) { res.sendFile(path.join(__dirname, "../client/build", "index.html")); });

//listen//
app.listen(port, () => {
	serverLogic.init(); // update settings...
	console.log(`Listening on port ${port}`)
});