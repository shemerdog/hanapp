import React from 'react';
import { Redirect } from 'react-router-dom'
import MUIDataTable from "./table/MUIDataTable";

const columns = ["Time", "Action", "Server", "Details"];

const data = [
	["10:12 AM", "copy", "blabla.com", "null"],
	["10:33 AM", "search", "shemer.co.il", "https:ppppsdasd.asdsa.asd:123"],
	["09:12 AM", "looking", "blabla2.com", "https:asd.asdsa.asd:123"],
	["02:22 AM", "copy", "bjnhv.com", "http:asdasd.asdsa.asd:123"],
];

const options = {
	filterType: "dropdown",
	responsive: "scroll",
	print: false,
		download: false,
		rowsPerPageOptions: [10,20,30]
};



function Devices(props) {
	if (props.login === false) {
			return <Redirect to='/login' />
		}
		else {
			return (
					<MUIDataTable
					title={"Devices"}
					data={data}
					columns={columns}
					options={options}
					responsive={"scroll"}
				/>
			)
		}
 }

export default Devices;

