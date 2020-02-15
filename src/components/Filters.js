import React, {useContext} from 'react';
// The default values for the filter
export const filtersDefault = {
	trees: 	 '*',
	frame: 	 '*',
	water:   '*',
	manmade: '*',
}

// Filter context shared between the Filters and the Rosses
export const FilterContext = React.createContext(filtersDefault);

// The actual filter component
export function Filters() {

	// Since we share the filters between the filters component and the rosses component we have to above, pull it in
	const {getFilters, setFilters} = useContext(FilterContext)

	// Handle the update of the filters
	function handleFilterUpdate(event){
		
		// We have special checkboxes that need to act like radios is some are selected, and normal checkboxes if others are selected. 
		// Checkboxes are stored in a comma seperated string for simplicity
		if(event.target.dataset.checkedAlone!==undefined){
			// If it's one of the items that should be checked along clear all checked int he fieldset and then re-check the desired item
			event.target.closest('fieldset').querySelectorAll('input[type="checkbox"]').forEach(input => {
				input.checked = false;
			});
			event.target.checked = true;
		}else{
			// So you clicked one that isn't exclusive, so make sure none of the exclusive ones are checked.
			event.target.closest('fieldset').querySelectorAll('input[type="checkbox"][data-checked-alone]').forEach(input => {
				input.checked = false;
			});
		}
		// And a final bit, if nothing is checked in checkbox section select the very first item in it
		if(event.target.closest('fieldset[data-special-checkboxes]')!==null){
			if(event.target.closest('fieldset').querySelectorAll('fieldset[data-special-checkboxes] input:checked').length===0){
				event.target.closest('fieldset').querySelector('fieldset[data-special-checkboxes] input').checked = true
			}
		}

		// Most are simply updated, but some need a little work before we can save their state
		let newFilters = getFilters
		switch(event.target.name){

			case 'water': 
			case 'manmade':
				let waterFeatures = [];
				newFilters[event.target.name] = event.target.closest('fieldset').querySelectorAll('input[type="checkbox"]').forEach((input)=>{
					if(input.checked){
						waterFeatures.push(input.value)
					}
				})
				newFilters[event.target.name] = waterFeatures.join(',')
			break;
			
			// The majority of cases
			default:
				newFilters[event.target.name] = event.target.value;
			break;
		}

		// Finally save
		setFilters({...getFilters})
	}

	return (<form className="container w-1/1 mx-auto my-5" style={{display:"none"}}>

		<fieldset className="border-green-700 border-t-8">
			<legend className="text-green-800 font-bold pr-2 text-lg">Trees</legend>
			<label htmlFor="trees-*" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.trees==='*'}    className="align-text-top mr-1" type="radio" name="trees" id="trees-*"  value="*" />
				Irregardless of Trees
			</label>
			<label htmlFor="trees-no" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.trees==='no'}   className="align-text-top mr-1" type="radio" name="trees" id="trees-no"   value="no" />
				No Trees
			</label>
			<label htmlFor="trees-one" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.trees==='one'}  className="align-text-top mr-1" type="radio" name="trees" id="trees-one"  value="one" />
				One Tree
			</label>
			<label htmlFor="trees-many" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.trees==='many'} className="align-text-top mr-1" type="radio" name="trees" id="trees-many" value="many" />
				Many Trees
			</label>
		</fieldset>
		
		<fieldset className="border-orange-700 border-t-8">
			<legend className="text-orange-800 font-bold pr-2 text-lg">Frame</legend>
			<label htmlFor="frame">
				Frame
				<select onChange={handleFilterUpdate} value={getFilters.frame} id="frame" name="frame">
					<option value="*">Irregardless of Frame</option>
					<option value="none">No Frame</option>
					<option value="any">Any Frame</option>
					<optgroup label="Specific Frame"></optgroup>
					<option value="rectangle_3d_frame"	> 3D Rectangle	</option>
					<option value="apple_frame"			> Apple			</option>
					<option value="circle_frame"		> Circle		</option>
					<option value="double_oval_frame"	> Double Oval	</option>
					<option value="florida_frame"		> Florida		</option>
					<option value="half_circle_frame"	> Half Circle	</option>
					<option value="half_oval_frame"		> Half Oval		</option>
					<option value="oval_frame"			> Oval			</option>
					<option value="rectangular_frame"	> Rectangular	</option>
					<option value="seashell_frame"		> Seashell		</option>
					<option value="split_frame"			> Split			</option>
					<option value="tomb_frame"			> Tomb			</option>
					<option value="triple_frame"		> Triple		</option>
					<option value="window_frame"		> Window		</option>
					<option value="wood_framed"			> Wood			</option>
				</select>
			</label>
		</fieldset>
	
		<fieldset data-special-checkboxes className="border-blue-700 border-t-8">
			<legend className="text-blue-800 font-bold pr-2 text-lg">Water Element</legend>
			<i className="float-right text-gray-500">Check all that apply</i>
			<label htmlFor="water-*" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='*'} data-checked-alone		className="align-text-top mr-1" type="checkbox" name="water" id="water-*" value="*" />
				Irregardless of any Water Elements
			</label>
			<label htmlFor="water-any" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='any'} data-checked-alone	className="align-text-top mr-1" type="checkbox" name="water" id="water-any" value="any" />
				Any Water Element
			</label>
			<label htmlFor="water-none" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='none'} data-checked-alone	className="align-text-top mr-1" type="checkbox" name="water" id="water-none" value="none" />
				No Water Element
			</label>
			<br/>
			<label htmlFor="water-dock" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='dock'} 			className="align-text-top mr-1" type="checkbox" name="water" id="water-dock" value="dock" />
				Dock
			</label>
			<label htmlFor="water-lake" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='lake'} 			className="align-text-top mr-1" type="checkbox" name="water" id="water-lake" value="lake" />
				Lake
			</label>
			{/* The CSV has a column for "lakes" but no ross is set as having "lakes" only "lake" so I'm hiding this here so the code is "complete" but not useless
			<label htmlFor="water-lakes">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='lakes'} 		className="align-text-top mr-1" type="checkbox" name="water" id="water-lakes" value="lakes" />
				Lakes
			</label>*/}
			<label htmlFor="water-lighthouse" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='lighthouse'} 	className="align-text-top mr-1" type="checkbox" name="water" id="water-lighthouse" value="lighthouse" />
				Lighthouse
			</label>
			<label htmlFor="water-ocean" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='ocean'} 		className="align-text-top mr-1" type="checkbox" name="water" id="water-ocean" value="ocean" />
				Ocean
			</label>
			<label htmlFor="water-river" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='river'} 		className="align-text-top mr-1" type="checkbox" name="water" id="water-river" value="river" />
				River
			</label>
			<label htmlFor="water-waterfall" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='waterfall'} 	className="align-text-top mr-1" type="checkbox" name="water" id="water-waterfall" value="waterfall" />
				Waterfall
			</label>
			<label htmlFor="water-waves" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.water==='waves'} 		className="align-text-top mr-1" type="checkbox" name="water" id="water-waves" value="waves" />
				Waves
			</label>
		</fieldset>

		<fieldset data-special-checkboxes className="border-pink-700 border-t-8">
			<legend className="text-pink-800 font-bold pr-2 text-lg">Manmade Objects</legend>
			<i className="float-right text-gray-500">Check all that apply</i>
			<label htmlFor="manmade-*" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='*'} data-checked-alone		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-*" value="*" />
				Irregardless of any Man Made Objects
			</label>
			<label htmlFor="manmade-any" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='any'} data-checked-alone		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-any" value="any" />
				Any Man Made Objects
			</label>
			<label htmlFor="manmade-none" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='none'} data-checked-alone		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-none" value="none" />
				No Man Made Objects
			</label>
			<br/>
			<label htmlFor="manmade-barn" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='barn'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-barn" value="barn" />
				Barn
			</label>
			<label htmlFor="manmade-boat" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='boat'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-boat" value="boat" />
				Boat
			</label>
			<label htmlFor="manmade-bridge" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='bridge'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-bridge" value="bridge" />
				Bridge
			</label>
			<label htmlFor="manmade-building" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='building'} 	className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-building" value="building" />
				Building
			</label>
			<label htmlFor="manmade-cabin" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='cabin'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-cabin" value="cabin" />
				Cabin
			</label>
			<label htmlFor="manmade-dock" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='dock'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-dock" value="dock" />
				Dock
			</label>
			<label htmlFor="manmade-farm" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='farm'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-farm" value="farm" />
				Farm
			</label>
			<label htmlFor="manmade-fence" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='fence'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-fence" value="fence" />
				Fence
			</label>
			<label htmlFor="manmade-fire" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='fire'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-fire" value="fire" />
				Fire
			</label>
			<label htmlFor="manmade-lighthouse" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='lighthouse'} 	className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-lighthouse" value="lighthouse" />
				Lighthouse
			</label>
			<label htmlFor="manmade-path" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='path'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-path" value="path" />
				Path
			</label>
			<label htmlFor="manmade-person" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='person'} 		className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-person" value="person" />
				Person
			</label>
			<label htmlFor="manmade-structure" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='structure'} 	className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-structure" value="structure" />
				Structure
			</label>
			<label htmlFor="manmade-windmill" className="mr-3 whitespace-no-wrap">
				<input onClick={handleFilterUpdate} defaultChecked={getFilters.manmade==='windmill'} 	className="align-text-top mr-1" type="checkbox" name="manmade" id="manmade-windmill" value="windmill" />
				Windmill
			</label>



		</fieldset>

	</form>);
}
