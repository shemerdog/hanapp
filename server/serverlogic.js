const moment = require('moment');
const mongojs = require('mongojs');

mongojs.Promise = global.Promise;

var Db = mongojs('hanapp', ['appointments', 'users', 'settings']);

const defaultCalendarSettings = {
	_id: 1,
	name: "calendarSettings",
	freeDays: [5,6], // starting from 0.
	appointmentDuration: 15,  // in minutes
	workHours: ["10:00", "18:00"],  // start,stop
};

let calendarSettings = defaultCalendarSettings;

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

exports.init = (res) => {
	Db.settings.findOne({name: "calendarSettings"}, (err,doc) => {
		if (doc){
			calendarSettings = doc;
		}
	})
};

const isValidNewAppointmentDate = function(date){
	console.log("isValidNewAppointmentDate called: "+ date)
	const day = moment(date).day();
	if (moment(date).isBefore(moment())){
		console.log("old date!!!");
		return { message: 'old'};
	}
	else if (calendarSettings.freeDays.indexOf(day) > -1 ) {
		console.log("free day!!!");
		return { message: 'free', days: calendarSettings.freeDays.sort()};
	}
	else return { message: 'ok'};
}

const checkBusy = (newTime) => (appointment) =>{
	return ! moment(newTime).add(1,"ms").isBetween(appointment.startTime, appointment.endTime)
}

exports.getAvailableAppointmentsFromDb = (res, userID, date) => { // user id is the therapist.
	const dateStatus = isValidNewAppointmentDate(date);
		console.log(dateStatus);
	if (dateStatus.message !== "ok"){
		return res.status(444).json(dateStatus);
	}
	const regexString =  new RegExp('^'+date);
	Db.appointments.find({startTime: {$in : [regexString]} }, (err, docs) => { // get appointments in certain date
		let data = [];
		let busy = [];
		for( let index in docs){
			busy.push(docs[index]);
		}
		const start = moment(date+" "+calendarSettings.workHours[0]);
		const stop = moment(date+" "+calendarSettings.workHours[1]);

		while(start.format() !== stop.format()){
			if ( busy.every(checkBusy(start)) ) {
				data.push(start.format('hh:mm')); //only time
			};
			start.add(parseInt(calendarSettings.appointmentDuration), 'm')

		}
		console.log(data);
		res.send(data);
	})
};

exports.getPatientAppointmentsFromDb = (res, userID, patientId, method) => { // method string can be 'all' 'next' and 'history'.
	Db.appointments.find({id: patientId}, (err, docs) => {
		console.log('%s patient appointments sent: ', method );
		const now = moment();
		let data = [];
		for( let index in docs){
			if(	method == "all" || typeof(method) == 'undefined' ||
				( method == "next" && now.isBefore(docs[index].startTime) ) ||
				( method == "history" && now.isAfter(docs[index].startTime) )
				) {
				data.push(docs[index]);
			}
		}
		console.log(data);
		res.send(data);
	})
};

exports.getPatientAppointmentByDateFromDb = (res, userID, patientId, date) => { // like getPatientAppointmentsFromDb() but with specific date
	Db.appointments.findOne({id: patientId, startTime: date}, (err, doc) => {
		console.log('%s patient appointment by date: ');
			if(	doc){
				console.log(doc);
				res.send(doc);
			} else {
				console.log("data not found");
				res.status('444').json({message: "not found"});
			}

		})
};

exports.getPatientDataFromDb = (res, userID, patientId) => { //we use userId for permisson or dedicated DB. we will not return it
	Db.users.findOne({id: patientId}, (err, doc) => {
		if( ! doc){
			console.log("no such ID in DB");
			res.status('444').json({message: "not found"});
			return;
		}
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

exports.deletePatientsListFromDb = (req, res) => { // need to delete all appointment??????
	console.log("deleting user id:" + req.query.patientid);
	Db.users.remove({id: req.query.patientid});
	res.send("deleted");
};

exports.getSettings = (res) => {
	Db.settings.findOne({name: "calendarSettings"}, (err,doc) => { // i used random codes, up to  uto keep them or not 
		if (doc){
			calendarSettings = doc;
			res.send(doc);
		}
		else {
			console.log("didnt get DB settings, using defaultCalendarSettings")
			calendarSettings = defaultCalendarSettings;
			res.send(defaultCalendarSettings);
		};
	})
};

exports.submitSettings = (req, res) => {
	console.log("submit Settings")
	console.log(req.body);
	Db.settings.update(
      { "name" : "calendarSettings" },
      req.body,
      {upsert: true}
	, function (err, doc) {
		res.send("ok");
	})
}

exports.submitPatientFormToDb = (req, res, formMethod) => {
	let newData = {}
		for (let item of req.body.formData){
			newData[item.key] = item.value;
		};
		console.log("new patient data recevied: ")
		console.log(newData)
		Db.users.findOne( {id: newData.id}, (err,doc) => { // i used random codes, up to  uto keep them or not 
				if (doc){
					if(formMethod === 'create'){	// create/edit
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
			console.log("can't create new appointment, appointment already in database");
			res.status('444').send("appointment already in database");
		} else {
			Db.appointments.insert( {startTime: req.body.appointment, id: req.body.id, endTime: moment(req.body.appointment).add(parseInt(calendarSettings.appointmentDuration)-1, 'm').format("YYYY MM DD hh:mm")} );
			console.log("appointment added");
			res.send("appointment added");
		}
	})
}

exports.updateAppointmentSummary = (req, res) => {
	console.log(req.body);
	Db.appointments.update( {startTime: req.body.startTime}, {$set: {summary: req.body.summary} }, {}, () => {
			console.log("appointment updated");
	} );
	res.send("appointment updated");
}

