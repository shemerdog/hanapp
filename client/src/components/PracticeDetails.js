import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

function Picture(props) {
	return <img
						src={props.value}
						alt={props.value}
						width="100%" 
						height="100%"
						onError={(e)=>{e.target = <div>fail</div>}}
						/>
};

function Video(props) {
	if (props.value.indexOf("youtube")) return <iframe 	src={props.value}
									frameBorder='0'
									width="100%"
									height="100%"
									allow='autoplay; encrypted-media'
									allowFullScreen
									title='video'
					/>
	else return <video controls width="100%"	height="100%" src={props.value} autoplay={false}>no audio support</video>
};



function Audio(props) {
	return <audio controls className="fill-width" src={props.value} >no audio support</audio>
};

function RenderMaterials(props) {
	const materialsKeys = Object.keys(props.materials);
	if(materialsKeys.length) {
		return (<Grid item xs={12} container spacing={8}>
				{materialsKeys.map(key=> {
					const sources = props.materials[key].split(", ");
					return sources.map( (source,index) => {
						switch (key) {
							case "audio":
								return <Grid key={index} item xs={4}><Audio value={source}/></Grid>;
							case "video":
								return <Grid key={index} item xs={4}><Video value={source}/></Grid>;
							case "pictures":
								return (<Grid key={index}  item xs={4}>
													<Picture value={source}/>
												</Grid>);
							default:
								console.log("unsupported source");
						}
						return <div>unsupported source</div>;
					})
				})}
				</Grid>)
	} else {
		return <Fragment/>
	}
}
//tests = {
// 	audio: 'https://www.kozco.com/tech/LRMonoPhase4.wav',
// 	video:'https://www.youtube.com/embed/PAbYiB5vxkE',
//  video:'https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
// 	pic: "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fa%2Fa7%2FWeihai.jpg%2F1200px-Weihai.jpg&f=1"}
export default function PracticeDetails(props) {
	const {formData,materials} = props.practiceDetails;
	if (formData) {
		return (
			<Grid container spacing={16}>
				<Grid item xs={12}>
					<Typography  variant="display1" align="center">{formData.name}</Typography>
					<Typography  align="center" variant="title">{formData.proName}</Typography>
				</Grid>
				{formData.purpose && <Grid item xs={12}>
					<Typography  variant="subheading" color="primary" align="right">מטרת התרגיל</Typography>
					<Typography align="right">{formData.purpose}</Typography>
				</Grid>}
				<Grid item xs={12}>
					<Typography  variant="subheading" color="primary" align="right">תיאור מקצועי</Typography>
					<Typography align="right">{formData.proDescription}</Typography>
				</Grid>
				<Grid container spacing={8} alignItems="center" item xs={12} >
					<Grid item xs={12}>
						<Typography  variant="subheading" color="primary" align="right">תיאור התרגיל</Typography>
						<Typography align="right">{formData.description}</Typography>
					</Grid>
					<Grid item xs={5}>
						<Typography align="center"> משך התרגיל: {formData.defaultDuration}</Typography>
					</Grid>
					<Grid item xs={5}>
						<Typography align="center"> מספר חזרות: {formData.defaultRepeatition}</Typography>
					</Grid>
				</Grid>
				{formData.tags &&<Typography align="right"> תגיות: {formData.tags}</Typography>}
				<RenderMaterials materials={materials} />
			</Grid>
		)}
	else return <div>loading...</div>
};