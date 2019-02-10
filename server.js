const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
// const listEvents = require('./googlecalendar.js');

const port = process.env.PORT || 3001;
mongojs.Promise = global.Promise;

var Db = mongojs('hanapp', ['appointments', 'users']);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


getPatientDataFromDb = (res, userID, patientId) => { //we use userId for permisson or dedicated DB. we will not return it
	Db.users.findOne({id: patientId}, (err, doc) => {
		console.log("patient data sent: ");
		let data = [];
		for( let key in doc){
			if(key !== '_id' && key !== 'type') {
				data.push({key: key, value: doc[key]})
			}
		}
		console.log(data);
		res.send(data);
	})
};

getPatientAppointmentsFromDb = (res, userID, patientId) => { //we use userId for permisson or dedicated DB. we wont return it in res
	Db.appointments.find({id: patientId}, (err, doc) => {
		console.log("patient appointments sent: ");
		let data = [];
		for( let key in doc){
			if(key !== '_id' && key !== 'type') {
				data.push(doc[key].startTime)
			}
		}
		console.log(data);
		res.send(data);
	})
};

app.get('/api/patient-details', (req, res) => {
	const userID = req.query.userid
	const patientId = req.query.patientid
	console.log('api patient-details called');
	getPatientDataFromDb(res, userID, patientId);
});

app.get('/api/patient-appointments', (req, res) => {
	const userID = req.query.userid
	const patientId = req.query.patientid
	console.log('api patient-appointments called');
	getPatientAppointmentsFromDb(res, userID, patientId);
});

getPatientsListFromDb = (res) => {
	Db.users.find({type: 'patient'}, (err, docs) => {
		console.log("patients list sent: ");
		console.log(docs)
		res.send(docs);
	})
};

app.get('/api/patientsList', (req, res) => {
	console.log('api patientsList called');
	//setTimeout(function() {  //simulate server lag
		getPatientsListFromDb(res);
	//}, 2000)
});

app.post('/api/submit-patient-form', (req, res) => {
	const formMethod = req.body.formMethod;
	let newData = {}
	for (let item of req.body.formData){
		newData[item.key] = item.value;
	};
	console.log("new patient data recevied: ")
	console.log(newData)
	Db.users.findOne( {id: newData.id}, (err,doc) => {
			if (doc){
				if(formMethod === 'create'){
					console.log("can't create new patient, already in database");
					res.status('444').send("patient already in database");
				} else {
					console.log("patient updated");
					Db.users.update({id: newData.id}, newData)
					res.send("ok");
				}
			} else {
				if(formMethod === 'create'){
					console.log("saving patient in database");
					Db.users.insert( newData);
					res.send("ok");
				} else {
					console.log("cant update, patient not exist in database");
					res.status('445').send("patient not exist in database");
				}
			}
	})
})

app.post('/api/submit-patient-appointment', (req, res) => {
	console.log("new patient appointment required: " + req.body.appointment)
	Db.appointments.findOne( {startTime: req.body.appointment}, (err,doc) => {
		if (doc){
			console.log("can't create new appointment, busy");
			res.status('444').send("appointment already in database");
		} else {
			console.log("appointment added");
			Db.appointments.insert( {startTime: req.body.appointment, id: req.body.id});
		}
	})
});

deletePatientsListFromDb = (req, res) => {
	console.log(req.query);
	console.log("deleting user id:" + req.query.patientid);
	Db.users.remove({id: req.query.patientid});
	res.send("ok");
}


app.get('/api/delete-patient', (req, res) => {
	console.log('api delete-patient called');
	deletePatientsListFromDb(req, res);
});

//listen//
app.listen(port, () => console.log(`Listening on port ${port}`));