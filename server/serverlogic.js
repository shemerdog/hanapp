const moment = require("moment");
const mongoJs = require("mongojs");
const IncomingForm = require("formidable").IncomingForm;
const {OAuth2Client} = require('google-auth-library');
const {google} = require('googleapis');
const logger = require( './logger');

mongoJs.Promise = global.Promise;
const databaseUrl = process.env.MONGODB_URI; // "username:password@example.com/mydb"
const appointmentsCollectionName = "appointments";
const usersCollectionName = "users";
const settingsCollectionName = "settings";
const practicesCollectionName = "practices";
const collections = [ appointmentsCollectionName, usersCollectionName, settingsCollectionName, practicesCollectionName ];
const db = mongoJs(databaseUrl, collections );

const CLIENT_ID = "492489952223-heaivivpdn5dnqun6aerl456clrsclsb.apps.googleusercontent.com";
const clientAuth = new OAuth2Client(CLIENT_ID);
// TODO: Add client_secret and redirect_uris like here:
// function authorize(credentials, callback) {
// 	const {client_secret, client_id, redirect_uris} = credentials.installed;
// 	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// }

db.on( 'connect', () => {
	logger.info('Database Connected...');
});

db.on('error', (err) => {
	logger.error('database error: %s!!!', err);
	// TODO: Raise exception and close?
});

const appointments = db.collection( appointmentsCollectionName );
const users = db.collection( usersCollectionName );
const settings = db.collection( settingsCollectionName );
const practices = db.collection( practicesCollectionName );

const defaultCalendarSettings = {
	_id: 1,
	name: "calendarSettings",
	workingDays: [0,1,2,3,4], // starting from 0.
	appointmentDuration: 15,  // in minutes
	workHours: ["10:00", "18:00"],  // start,stop
};

let calendarSettings = defaultCalendarSettings;

const verify = async (token) => {
	const ticket = await clientAuth.verifyIdToken({
	  idToken: token,
	  audience: CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return payload.sub;
};


exports.init = (res) => {
	settings.findOne({name: "calendarSettings"}, (err,doc) => { // TODO: Use consts
		if (doc){
			calendarSettings = doc;
		}
		else { console.log("cant retrive calendarSettings");}
	});
};

const dateIsInvalid = function(date){
	console.log(`Checking date validity: ${date}`); // TODO: Consider to install and use some normal logging system with different logging levels.
	return moment(date).isBefore(moment());
};

const therapistWorkingDays = function (date) {
	console.log("Checking therapist working days");
	const day = moment(date).day();
	return calendarSettings.workingDays.includes(day);
};

const checkBusy = (newTime) => (appointment) =>{
	return ! moment(newTime).add(1,"ms").isBetween(appointment.startTime, appointment.endTime);
};

const storeToken = token => {
	console.info('Token stored in DB');
	console.debug( "Token:", JSON.stringify(token) );
};

exports.verifyAndStoreTokenId = (credentials) => {
	// verify( credentials.tokenId ).then( ( tokenId ) => console.log(tokenId) );
	clientAuth.getToken( credentials.code, (err, token) => {
		if (err) { return console.error('Error retrieving access token', err); }
		clientAuth.setCredentials(token);
		storeToken( token );
		// TODO: Learn and implement refreshing tokens
		getNextTenEvent();
	} );
};

const getNextTenEvent = () => {
	const calendar = google.calendar({ version: 'v3', clientAuth }); // TODO: If everyone is using the same Oauth object how do we maintain different identities?!
	calendar.events.list({
		calendarId: 'primary',
		timeMin: ( new Date() ).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	}, (err, res) => {
		if (err) { return console.log('The API returned an error: ' + err); }
		const events = res.data.items;
		if (events.length) {
			console.log('Upcoming 10 events:');
			events.map((event, i) => {
				const start = event.start.dateTime || event.start.date;
					console.log(`${start} - ${event.summary}`);
				}
			);
		} else {
			console.log('No upcoming events found.');
		}
	});
};

exports.getAvailableAppointmentsFromDb = (response, userID, date) => { // userID is the therapist id for future usage.
	if (dateIsInvalid(date) || !therapistWorkingDays(date)) { // TODO:I don't really see the point of testing therapist working days - why not showing only working days in the first place?
		return response.status(444).json(calendarSettings.workingDays.sort());
	}

	const regexString =  new RegExp('^'+date); // TODO: Don't get it, why regex? Why not using a normal date object in the DB?
	// TODO: Also, I would add a search based on therapist ID.
	appointments.find({startTime: {$in : [regexString]} }, (err, docs) => { // get appointments in certain date
		let data = [];
		let busy = [];
		for ( let timeSlot of docs ){ // TODO: I would consider having a full day with busy\free status once there is at least one appointment
			busy.push( timeSlot );
		}
		const nextAppointmentTime = moment(date + " " + calendarSettings.workHours[0]); //TODO: Looks pretty ugly, can't we do it in another way (setHour maybe)
		const finishTime = moment(date+" "+calendarSettings.workHours[1]); // TODO: Looks pretty ugly, can't we do it in another way (setHour maybe)

		while(nextAppointmentTime.format() !== finishTime.format()){
			if ( busy.every(checkBusy(nextAppointmentTime)) ) { // TODO: Not very effective - you're going through all array several times.
				data.push(nextAppointmentTime.format("hh:mm")); // Push time only
			}
			nextAppointmentTime.add(parseInt(calendarSettings.appointmentDuration), "m");

		}
		console.log(data); // TODO: Better be in debug log and have some preceding text
		response.send(data);
	});
};

exports.getPatientAppointmentsFromDb = (res, userID, patientId, scope) => { // Scope variable string might be 'all' 'next' and 'history'.
	// TODO: I don't get why do we filter after request received and not in db query level
	let dateScope;
	switch ( scope ) {
		case "upcoming":
			dateScope = "$gte";
			break;
		case "past":
			dateScope = "$lte";
			break;
		default:
			dateScope = "$exists";
			break;
	}
	console.log(`Trying to find ${scope} of patient appointments`);
	appointments.find({id: patientId, startTime: { [dateScope]: new Date() } }, (err, docs) => { // TODO: why is userID passed if not used?
		console.log(docs); // TODO: This should be logged only in DEBUG mode and have some preceding text
		res.send(docs);
	});
};

exports.getPatientAppointmentByDateFromDb = (res, userID, patientId, date) => {
	appointments.findOne({id: patientId, startTime: date}, (err, doc) => {
		console.log('%s patient appointment by date: ');
			if(	doc){
				console.log(doc);
				res.send(doc);
			} else {
				console.log("data not found");
				res.status('444').json({message: "not found"});
			}

		});
};

exports.getPatientDataFromDb = (res, userID, patientId) => { //we use userId for permission or dedicated DB. we will not return it
	users.findOne({ id: patientId }, { _id: false, type: false }, (err, doc) => {
		if ( !doc ){
			console.log("Can't find patient by this ID in the DB");
			res.status("444").json({message: "Not Found"}); // TODO: Why are we using response code 444?
			return;
		}
		console.log(`Sending patient data: ${doc}`); // TODO: Again, debug level
		res.send(doc);
	});
};

exports.getPatientsListFromDb = (res) => {
	users.find({type: 'patient'}, (err, docs) => { // TODO: Put 'patient' in some const
		console.log(`Sending patients list: ${docs}`); // TODO: Debug level
		res.send(docs);
	});
};

exports.deletePatientsListFromDb = (req, res) => { // TODO: Make a helper function to delete all FUTURE appointments
	console.log( `Deleting user id: ${req.query.patientId}` ); // TODO: Consider adding some debug info about the user
	users.remove({id: req.query.patientId});
	res.send("Patient successfully deleted"); // TODO: Consider adding some data and also to create a resource file to hold all strings or response codes - to be later translated to different language strings
};

exports.getSettings = (res) => {
	settings.findOne({name: "calendarSettings"}, (err,doc) => { // TODO: put calendarSettings in a const
		if (doc){
			calendarSettings = doc; // This is updating local object, why?
			res.send(doc);
		}
		else {
			console.log("Couldn't fetch settings from DB, using defaultCalendarSettings instead");
			calendarSettings = defaultCalendarSettings;
			res.send(defaultCalendarSettings);
		}
	});
};

exports.getPracticesListFromDb = (res) => {
	practices.find({}, { formData: true }, (err, docs) => {
		logger.info("Sent practices list");
		logger.debug(docs);
		res.send(docs);
	});
};

exports.getPracticeDetails = (req, res) => {
	practices.findOne({_id: req.query.practiceid}, (err,doc) => { // i used random codes, up to  uto keep them or not
		if (doc){
			console.log("found doc" + req.query.practiceid);
			res.send(doc);
		}
		else {
			console.log(`didnt find practice ${req.query.practiceid}`);
			res.send({});
		}
	});
};

exports.submitSettings = (req, res) => {
	console.log(`Changing Settings:${req.body}`);
	settings.update(
      { name: "calendarSettings" },
      req.body,
      {upsert: true},
		(err, doc) => {
		res.send("ok");
	});
};

exports.submitPatientFormToDb = (req, res, formMethod) => {
	let newData = {};
		for (let item of req.body.formData){
			newData[item.key] = item.value;
		}
		console.log("new patient data recevied: ");
		console.log(newData);
		db.users.findOne( {id: newData.id}, (err,doc) => { // i used random codes, up to  uto keep them or not
				if (doc){
					if(formMethod === 'create'){	// create/edit
						console.log("can't create new patient, already in database");
						res.status('444').send("patient already in database");
					} else {
						console.log("patient updated");
						db.users.update({id: newData.id}, newData);
						res.send("ok");
					}
				} else {
					if(formMethod === 'create'){
						console.log("saving patient in database");
						db.users.insert( newData);
						res.send("ok");
					} else {
						console.log("cant update, patient not exist in database");
						res.status('445').send("patient not exist in database");
					}
				}
	});
};

exports.submitAppointmentToDb = (req, res) => {
	appointments.findOne( {startTime: req.body.appointment}, (err,doc) => {
		if (doc){
			console.log("can't create new appointment, appointment already in database");
			res.status('444').send("appointment already in database");
		} else {
			db.appointments.insert( {startTime: req.body.appointment, id: req.body.id, endTime: moment(req.body.appointment).add(parseInt(calendarSettings.appointmentDuration)-1, 'm').format("YYYY MM DD hh:mm")} );
			console.log("appointment added");
			res.send("appointment added");
		}
	});
};

exports.updateAppointmentSummary = (req, res) => {
	console.log(req.body);
	appointments.update( {startTime: req.body.startTime}, {$set: {summary: req.body.summary, practices:req.body.practices } }, {}, () => {
			console.log("appointment updated");
	} );
	res.send("appointment updated");
};

exports.submitPracticeFormToDb = (req,res) => {
	const {formData, materialsData} = req.body;
	console.log(`submitPracticeFormToDb: ${formData.proName}`);
	// add check if already in DB
	practices.insert( {_id: formData.proName, formData: formData, materials: materialsData });
};

exports.upload = (req, res) => {
  var form = new IncomingForm();

  form.on("file", (field, file) => {
    //some shit here...
    console.log('${file.path} uploaded');
  });
  form.on("end", () => {
    res.json();
  });
  form.parse(req);
};
