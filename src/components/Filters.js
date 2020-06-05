import React, {useContext} from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';



// This is the data used in the autocomplete based filtering system.
const filterSuggestions = {
	"Sort": {
		groupLabel: "You can view your world however you want, it's yours.",
		limitCatagory: true,
		values: ['In Airing Order','Ordered by Title','Ordered by Number of Colors'],
	},
	"Trees": {
		groupLabel: "Happy little trees, you can only select one of these.",
		limitCatagory: true,
		values: ["No Trees","One Tree","Many Trees","Palm Trees"],
	},
	"Nature": {
		groupLabel: "The wounderful splender of Mother Nature.",
		values: ['aurora_borealis','beach','bushes','cactus','cirrus','cliff','clouds','conifer','cumulus','deciduous','flowers','fog','grass','hills','lake','lakes','moon','mountain','mountains','night','ocean','river','rocks','snow','snowy_mountain','sun','waterfall','waves','winter'],
	},
	"Manmade": {
		groupLabel: "People can build anything, all they need is a little imagination.",
		values: ['barn','boat','bridge','building','cabin','dock','farm','fence','fire','lighthouse','mill','path','person','portrait','structure','windmill'],
	},
	"Colors": {
		groupLabel: "Mix those colors till you get a shade that makes you happy.",
		values: ['black_gesso','bright_red','burnt_umber','cadmium_yellow','dark_sienna','indian_red','indian_yellow','liquid_black','liquid_clear','midnight_black','phthalo_blue','phthalo_green','prussian_blue','sap_green','titanium_white','van_dyke_brown','yellow_ochre','alizarin_crimson'],
	},
	"Frame": {
		groupLabel: "We're gonna work on something a little special today.",
		values: ['apple_frame','circle_frame','double_oval_frame','florida_frame','framed','half_circle_frame','half_oval_frame','oval_frame','rectangle_3d_frame','rectangular_frame','seashell_frame','split_frame','tomb_frame','triple_frame','window_frame','wood_framed'],
	},
	"Painter": {
		groupLabel: (<span>You can paint with your friends, but it's hard to paint <i>with</i> your friends.</span>),
		limitCatagory: true,
		values: ['Bob Ross','Steve Ross','Diane André','A Friend of Bob Ross'],
	},
}

// This converts that more user-friendly data format into somewthing the material-ui's autocomplete can jive with.
const prepareFilterSuggestions = (filterSuggestions) => {
	let array = [];

	Object.keys(filterSuggestions).forEach((category)=>{
		filterSuggestions[category].values.forEach((value,index)=>{

		  	let label = value.split('_').map((word)=>{
		  		return word.charAt(0).toUpperCase()+word.slice(1);
		  	}).join(' ');

			array.push({
				label: label,
				value: value,
				category: category,
				categoryRestricted: !!filterSuggestions[category].limitCatagory,
				groupName: filterSuggestions[category].groupLabel,
				index: index
			})
		})
	})

	return array;
}



// The default values for the filter
export const filtersDefault = []

// Filter context shared between the Filters and the Rosses
export const FilterContext = React.createContext(filtersDefault);

// The actual filter component
export function Filters() {
	const {getFilters, setFilters} = useContext(FilterContext)
	return (<form className={"container flex flex-wrap mx-auto my-5 px-2"}>
		<Autocomplete
		  id="filter-suggestor"
		  options={prepareFilterSuggestions(filterSuggestions)}

		  getOptionLabel={(filter) => filter.label}
		  renderOption={(option,state) => {
		  	return (<div>{option.label}</div>)
		  }}
		  getOptionSelected={(option,value)=>{
		  	return option.category === value.category && option.index === value.index
		  }}

		  groupBy={(option)=>{
		  	return option.groupName
		  }}
		  // renderGroup={(group)=>{
		  // 	return (<div key={group.key}>
		  // 		{group.group}
		  // 		{group.children}
		  // </div>)
		  // }}

		  // This needs to check if the selected item is from a restricted group and if it is remove the existing value in exchange for the new one.
		  onChange={(e,values)=>{
		  	// If you want no filters I can save us both a lot of time here.
		  	if(values.length===0){ setFilters([]); return false; }
		  	// newest is always at the end.
		  	let selected = values[values.length-1]; 
		  	if(selected.categoryRestricted && values.length>1){
		  		values = values.filter((value)=>{
					if(selected.category===value.category && selected.index!==value.index){
						return false;
					}else{
			  			return true;
					}
		  		})
		  	}
		  	setFilters(values);
		  }}

		  fullWidth={true}
		  multiple={true}
		  value={getFilters}
		  noOptionsText="I'm sorry, but I don't have any filters that migh match that."
		  renderInput={(params) => <TextField {...params} label="Start typing to search some happy paintings" variant="outlined" />}
		/>
	</form>);
}