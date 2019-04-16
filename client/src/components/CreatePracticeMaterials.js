import React from 'react';
import { createPractice as lang} from '../tools/lang.heb.js';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';

const types = ["pictures", "audio", "video"];

export default function CreatePracticeMaterials(props) {
	const {materials} = props;
	return (
		<div>
			{materials.map( (item, index) =>
				<div key={index} >
					<TextField
						select
						id={index.toString()}
						label={lang.materialsTypeLabel}
						value={materials[index].type}
						InputLabelProps={{shrink: true}}
						onChange={props.handleChange(index, "type")}
					>
					{types.map(option => (
							<MenuItem
								key={option}
								value={option}>
								{option}
							</MenuItem>
					))}
					</TextField>
					<TextField
						style={{margin: "1vh 1vw"}}
						label={lang.materialsSrcLabel}
						{...materials[index]}
						onChange={props.handleChange(index, "value")}
					/>
					<Button variant="fab" color="secondary" mini onClick={() => props.handleDelete(index)} >
						<RemoveIcon />
					</Button>
				</div>

			)}
		</div>
)};
