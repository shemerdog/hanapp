import React ,{ Component } from 'react';
import { withRouter } from 'react-router-dom';
import CreatePracticeMaterials from './CreatePracticeMaterials'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';

const styles = {
	container: {
		maxWidth: 600,
		margin: '2vh auto',
	},
	shortInput: {
		margin: '1vh 1vw',
		width: 200,
	},
	longInput: {
		margin: '1vh 1vw',
		width: 400,
	},
	button: {
		margin: '3vh auto',
	},
};
const tagsRegEx = /([\u0590-\u05FF\-a-zA-Z0-9]+)[^\u0590-\u05FF\-a-zA-Z0-9]*/g;
// const URLregex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
class CreatePractice extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			formValid: true,
			serverError: false,
			serverErrorDuplicate: false,
			dialogOpen: false,
			practiceData: [
				{key: "proName", value: (props.data && props.data[0].value) || "", error: false, label:"שם מקצועי", required: true, helperText:"", style: styles.shortInput},
				{key: "name", value:(props.data && props.data[2].value) || "", error: false, label:"שם התרגיל", required: true, helperText:"", style: styles.shortInput},
				{key: "proDescription", value: (props.data && props.data[1].value) || "", error: false, label:"תיאור מקצועי", required: true, helperText:"", style: styles.longInput, multiline: true},
				{key: "description", value: (props.data && props.data[3].value) || "", error: false, label:"תיאור התרגיל", required: true, helperText:"", style: styles.longInput, multiline: true},
				{key: "purpose", value: (props.data && props.data[4].value) || "", error: false, label:"מטרת התרגיל", required: false, helperText:"", style: styles.longInput, multiline: true},
				{key: "defaultDuration", value: (props.data && props.data[6].value) || "0", error: false, label:"משך התרגיל", required: false, helperText:"", style: styles.shortInput},
				{key: "defaultRepeatition", value: (props.data && props.data[6].value) || "0", error: false, label:"מספר חזרות", required: false, helperText:"", style: styles.shortInput},
				{key: "tags", value: (props.data && props.data[5].value) || "", error: false, label:"תגיות", required: false, helperText:"תגית1,תגית2,תגית3...", style: styles.shortInput},
			],
			materials: 	[]
		};

		this.handleDataChange = this.handleDataChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.closeDialog = this.closeDialog.bind(this);
	};

	componentWillUnmount() {
		if (this.timeout) {clearTimeout(this.timeout)}
	};

	componentDidMount() {
		this.props.setTitle && this.props.setTitle(this.createTitle(this.props.actionType, this.props.profileType));
	};

	handleDataChange = index => event => {
		let change = [];
		change.practiceData = [...this.state.practiceData];
		change.practiceData[index].value = event.target.value;
		this.setState(change);
	};

	handleMaterialChange = (index, key) => event => {
		let change = [];
		change.materials = [...this.state.materials];
		change.materials[index][key] = event.target.value;
		this.setState(change);
	};


	closeDialog(){
		this.setState({dialogOpen: false});
	};

	addMaterialSrc = () => {
		this.setState( prevState => ({
			materials: prevState.materials.concat({type: "", value: "", helperText:"", error: false})
		}));
	};

	deleteMaterialSrc = (index) => {
		this.setState( prevState => {
			prevState.materials.splice(index, 1);
			return {materials: prevState.materials}
		});
	};

	validateField() {
		let valid = true;
		for (let item of this.state.practiceData) {
				item.error = false;
			if (item.required && item.value.length === 0) {
				item.error = true;
				item.helperText = "שדה חובה";
				valid = false;
			}
		}
		return valid;
	}

	handleSubmit(e){
		e.preventDefault();
		let formValid;
		this.setState({serverError: false, serverErrorDuplicate: false});
		formValid = this.validateField( this.state.practiceData ) && this.validateField( this.state.materials );
		if( formValid ) {
			const formData = {};
			const materialsData = {};
			this.state.practiceData.forEach( item => {
				if ( item.key === 'tags') {
					item.value = item.value.replace(tagsRegEx, "$1,").slice(0,-1);
				} 
				formData[ item.key] =  item.value;
			});
			this.state.materials.forEach( item => {
				if ( materialsData[ item.type] ){
					materialsData[ item.type] += ", " + item.value
				} else {
					materialsData[ item.type] =  item.value;
				}
			});
			this.setState({ formValid });
			fetch('/api/submit-practice-form', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({formData:formData, materialsData: materialsData})
			})
		}
	};

	render(){
		const { practiceData, formValid, serverError, serverErrorDuplicate, materials } = this.state;
		return (
					<div dir="rtl" style={styles.container}>
						<form >
							{practiceData.map( (item, index) =>
								<TextField key={index} id={index.toString()} style={styles[item.style]} {...item} onChange={this.handleDataChange(index)}/>
							)}
							<Typography  variant="caption" color='secondary' align="center">
								{!formValid && <span>תקן את השדות האדומים ונסה שוב!</span>}
								{serverErrorDuplicate && <span>ת.ז. קיימת במערכת!</span>}
								{serverError && <span>בעיה בשרתים, אנא נסה שוב או פנה לבוס המעצבן שלי</span>}
							</Typography>
							<div className="horizonal-margin">
								<Typography style={{display: "inline-block", margin: "0 2vw"}} variant="title" align="center">הוסף מקורות</Typography>
								<Button variant="fab" mini onClick={this.addMaterialSrc} >
									<AddIcon />
								</Button>
							</div>
							<CreatePracticeMaterials index={10} materials={materials} handleDelete={this.deleteMaterialSrc} handleChange={this.handleMaterialChange}/>
							<Button type="submit" variant="contained" style={styles.button} color="primary" onClick={this.handleSubmit}>
								שמור
								<SaveIcon />
							</Button>
						</form>
					</div>
		)
	}
}

export default withRouter(CreatePractice);

