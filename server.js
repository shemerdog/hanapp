const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

const port = process.env.PORT || 3001;
mongojs.Promise = global.Promise;

var Db = mongojs('patientsList', ['blabla']);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

getPatientDataFromDb = (res, userID, patientId) => {
	let response = {}; 
	response.data = {firstName: "נחמיה", lastName: "לילי", test: patientId};
	// let response = {};
	// Db.patientsList.find( (err,docs) =>  {
	// 	response.data = docs.map( doc => [ doc.serviceName	, doc.name, doc.serviceStatus ] );
	// 	console.log("control data sent: ");
	// 	console.log(response)
	// 	res.json(response);
	// })
	console.log("control data sent: ");
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
	// let response = {};
	// Db.patientsList.find( (err,docs) =>  {
	// 	response.data = docs.map( doc => [ doc.serviceName	, doc.name, doc.serviceStatus ] );
	// 	console.log("data sent: ");
	// 	console.log(response)
	// 	res.json(response);
	// })
	console.log("control data sent: ");
	console.log(response)
	res.json(response)

};


app.get('/api/patientsList', (req, res) => {
	console.log('api patientsList called');
	getPatientsListFromDb(res);
});

//listen//
app.listen(port, () => console.log(`Listening on port ${port}`));