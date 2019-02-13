const moment = require('moment');
const mongojs = require('mongojs');

mongojs.Promise = global.Promise;

var Db = mongojs('hanapp', ['appointments', 'users']);

const patientLabels = { // get the labels back
	"firstName": "שם פרטי",
	"lastName": "שם משפחה",
	"id": "ת.ז",
	"phone": "טלפון",
	"birthDate": "תאריך לידה",
	"email": "מייל",
	"address": "כתובת",
	"supervisorId": "מבוגר אחראי"
};

exports.getAvailableAppointmentsFromDb = (res, userID, date) => { // user id is the therapist.
	const regexString =  new RegExp('^'+date);
	Db.appointments.find({startTime: {$in : [regexString]} }, (err, docs) => {
		let data = [];
		let busy = [];
		for( let index in docs){
			busy.push(docs[index].startTime);
		}
		const start = moment(date+" 10:00");
		const stop = moment(date+" 18:00");

		while(start.format() !== stop.format()){
			if ( busy.every((item)=> moment(item).format() !== start.format() ) ) {
				data.push(start.format('LT')); //only time
			};
			start.add(15, 'm')

		}
		console.log(data);
		res.send(data);
	})
};

exports.getPatientAppointmentsFromDb = (res, userID, patientId, method) => { // method string can be 'all' 'next'.
	Db.appointments.find({id: patientId}, (err, docs) => {
		console.log('%s patient appointments sent: ', method );
		const today = new Date();
		const todayArray = today.toLocaleDateString().split('-');
		let data = [];
		for( let item in docs){
			const appointmentArray = docs[item].startTime.split('-');
			if(	method == "all" || typeof(method) == 'undefined' ||
				( method == "next" && parseInt(appointmentArray[0]) >= parseInt(todayArray[0]) && parseInt(appointmentArray[1]) >= parseInt(todayArray[1]) && parseInt(appointmentArray[2]) >= parseInt(todayArray[2]) )
				) {
				data.push(docs[item].startTime);
			}
		}
		console.log(data);
		res.send(data);
	})
};

exports.getPatientDataFromDb = (res, userID, patientId) => { //we use userId for permisson or dedicated DB. we will not return it
	Db.users.findOne({id: patientId}, (err, doc) => {
		console.log("patient data sent: ");
		let data = [];
		for( let key in doc){
			if(key !== '_id' && key !== 'type') {
				data.push({key: key, value: doc[key], label: patientLabels[key]})
			}
		}
		console.log(data);
		res.send(data);
	})
};

exports.getPatientsListFromDb = (res) => {
	Db.users.find({type: 'patient'}, (err, docs) => {
		console.log("patients list sent: ");
		console.log(docs)
		res.send(docs);
	})
};

exports.deletePatientsListFromDb = (req, res) => {
	console.log("deleting user id:" + req.query.patientid);
	Db.users.remove({id: req.query.patientid});
	res.send("deleted");
};

exports.submitPatientFormToDb = (req, res, formMethod) => {
	let newData = {}
		for (let item of req.body.formData){
			newData[item.key] = item.value;
		};
		console.log("new patient data recevied: ")
		console.log(newData)
		Db.users.findOne( {id: newData.id}, (err,doc) => { // i used random codes, up to  uto keep them or not 
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
};

exports.submitAppointmentToDb = (req, res) => {
	Db.appointments.findOne( {startTime: req.body.appointment}, (err,doc) => {
		if (doc){
			console.log("can't create new appointment, busy");
			res.status('444').send("appointment already in database");
		} else {
			console.log("appointment added");
			Db.appointments.insert( {startTime: req.body.appointment, id: req.body.id});
		}
	})
}
