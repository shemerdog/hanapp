const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');

const port = process.env.PORT || 3001;
mongojs.Promise = global.Promise;

var Db = mongojs('stingray', ['blabla']);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// getRandomDataFromDb = (id, res) => {
// 	let data = {};
// 	profilesDb.profiles.find( {_id: id}, (err, docs) =>  {
// 		console.log("getting new data set from DB...")
// 		if (docs.length === 0) {
// 			res.send( {error: 'no such id profile'})
// 			console.log(err);
// 		} else {
// 			console.log(docs);
// 			const titles = docs[0].titles;
// 			const types = docs[0].types;
// 			const templates = docs[0].templates;
// 			getRandomItemFromArray = ( array ) => { return array[Math.floor(Math.random()*array.length)] };
// 			data.title = getRandomItemFromArray(titles);
// 			data.template = getRandomItemFromArray(templates);
// 			data.type =getRandomItemFromArray(types);
// 			console.log("data sent: ");
// 			console.log(data)
// 			res.send(data);
// 		}
// 	})
// };

// getAdminDataFromDb = (res) => {
// 	let data = {};
// 	questionsDb.reviews.find( (err,docs) =>  {
// 		data.titles = docs[0].titles;
// 		data.types = docs[0].types;
// 		data.templates = docs[0].templates;
// 		console.log("admin data sent: ");
// 		console.log(data)
// 		res.send(data);
// 	})
// };

// app.post('/api/feedback', (req, res) => {
// 	const newData = {
// 		userId: req.body.userId,
// 		title: req.body.title,
// 		template: req.body.template,
// 		type: req.body.type,
// 		value: req.body.value,
// 		time: new Date()
// 	};
// 	console.log("data recevied: ")
// 	console.log(newData)
// 	feedbackDb.feedback.insert(newData);
// })

// app.post('/api/admin', (req, res) => {
// 	const newData = {
// 		userId: req.body.userId,
// 		titles: req.body.titles,
// 		templates: req.body.templates,
// 		types: req.body.types
// 	};
// 	console.log("admin data recevied: ")
// 	console.log(newData)
// 	profilesDb.profiles.update({_id: newData.userId}, newData, {upsert: true});
// })

// app.get('/api/admin', (req, res) => {
// 	console.log('api admin called');
// 	getAdminDataFromDb(res);
// });

// app.get('/api/review', (req, res) => {
// 	console.log('api review called');
// 	if(req._parsedUrl.query){
// 		const idParam = (req._parsedUrl.query).split("=")[1]
// 		getRandomDataFromDb(idParam, res);
// 	} else {
// 		res.send( "/api/review?id=###    query id required!");
// 		console.error(" missing id in query!"); };
// });

getEventsDataFromDb = (res) => {
	let response = {};
	Db.events.find( (err,docs) =>  {
		response.columns = ["Site", "Content", "MAC-address", "Type"];
		response.data = docs.map( doc => [ doc.site, doc.content, doc.mac, doc.type ] );
		console.log("events data sent: ");
		console.log(response)
		res.json(response);
	})
};

getPersonsDataFromDb = (res) => {
	let response = {};
	Db.persons.find( (err,docs) =>  {
		response.columns = ["ID", "Device-Type", "Device-Name", "MSISDN", "Network"];
		response.data = docs.map( doc => [ doc.uid, doc.type, doc.name, doc.MSISDN, doc.IMEI ] ); //check NETWORK
		console.log("persons data sent: ");
		console.log(response)
		res.json(response);
	})
};

getNetworksDataFromDb = (res) => {
	let response = {};
	Db.events.find( (err,docs) =>  {
		response.columns = ["Site", "Content", "MAC-address", "Type"];
		response.data = docs.map( doc => [ doc.site, doc.content, doc.mac, doc.type ] );
		console.log("networks data sent: ");
		console.log(response)
		res.json(response);
	})
};

getDevicesDataFromDb = (res) => {
	let response = {};
	Db.events.find( (err,docs) =>  {
		response.columns = ["Site", "Content", "MAC-address", "Type"];
		response.data = docs.map( doc => [ doc.site, doc.content, doc.mac, doc.type ] );
		console.log("devices data sent: ");
		console.log(response)
		res.json(response);
	})
};

getControlDataFromDb = (res) => {
	let response = {};
	Db.statusbaritems.find( (err,docs) =>  {
		response.data = docs.map( doc => [ doc.serviceName	, doc.name, doc.serviceStatus ] );
		console.log("control data sent: ");
		console.log(response)
		res.json(response);
	})
};

app.get('/api/events', (req, res) => {
	console.log('api events called');
	getEventsDataFromDb(res);
});

app.get('/api/persons', (req, res) => {
	console.log('api persons called');
	getPersonsDataFromDb(res);
});

app.get('/api/networks', (req, res) => {
	console.log('api networks called');
	getNetworksDataFromDb(res);
});

app.get('/api/devices', (req, res) => {
	console.log('api devices called');
	getDevicesDataFromDb(res);
});

app.get('/api/control', (req, res) => {
	console.log('api control called');
	getControlDataFromDb(res);
});

//mongojs.ObjectId('5b8699d291bae74d89ad71e0').getTimestamp()

//listen//
app.listen(port, () => console.log(`Listening on port ${port}`));