const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

const port = process.env.PORT || 3001;
mongojs.Promise = global.Promise;

var Db = mongojs('patientsList', ['blabla']);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

getPatientDataFromDb = (res, userID, patientId) => { //we use userId for permisson or dedicated DB. we will not return it
	let response = {}; 
	response.data = [{key: "firstName", value: "נחמיה"}, {key: "lastName", value: "לילי"}, {key: "patientId", value: patientId} ];
	// need to get the data from DB here...
	//
	console.log("Patient data sent: ");
	console.log(response)
	res.json(response)

};


app.get('/api/patient-details', (req, res) => {
	const userID = req.query.userid
	const patientId = req.query.patientid
	console.log('api patient-details called');
	getPatientDataFromDb(res, userID, patientId);
});

getPatientsListFromDb = (res) => {
	let response = {}; 
	response.data = [{firstName: "נחמיה", lastName: "לילי", id: 123123},{firstName: "שמר", lastName: "דוג", id: 321123},{firstName: "יהודה", lastName: "שיט", id: 321321}];
	console.log("patients list sent: ");
	console.log(response)
	res.json(response)

};


app.get('/api/patientsList', (req, res) => {
	console.log('api patientsList called');
	getPatientsListFromDb(res);
});

//listen//
app.listen(port, () => console.log(`Listening on port ${port}`));