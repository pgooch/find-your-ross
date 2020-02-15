import React, {useContext,useState,useEffect} from 'react';
import {FilterContext} from './Filters.js';
import Parser from 'papaparse';
import Painting from './Painting.js';
import PaintingDetails from './PaintingDetails.js';
import rossData from '../ross-data.csv';
import { Redirect } from 'react-router-dom';

export function Rosses(){ 

	// grad the FilterContext to determine the correct Rosses to show
	const {getFilters,setFilters} = useContext(FilterContext)

	// We use a little state here, one for the data (that we only load once) and one for the results (which we fiddle with)
	const [getRosses,setRosses] = useState([]);
	const [getFilteredRosses,setFilteredRosses] = useState([])
	const [getSelectedPainting,setSelectedPainting] = useState(-1,[])

	// And maybe another to keep track of sets of filters so we don't have to refigure that every render
	const [getFilterDetails,setFilterDetails] = useState({})

	// Once the filters have loaded process the more complex ones to build out arrays needed to actually filter. It was this or manually make them.
	useEffect(()=>{
		let buildFilterDetails = getFilterDetails;
		document.querySelectorAll('fieldset').forEach((fieldset)=>{
			// filters can consist of many inputs or a single selector (for now)
			let name = fieldset.querySelector('input,select').name;
			buildFilterDetails[name] = [];
			// This will fill that build array with all the possible options 
			fieldset.querySelectorAll('input').forEach((input)=>{
				buildFilterDetails[name].push(input.value)
			})
			fieldset.querySelectorAll('select option').forEach((option)=>{
				buildFilterDetails[name].push(option.value)
			})
			// This will filter out and of the specially handled values, as we don't need them for this.
			Object.keys(buildFilterDetails).forEach((key)=>{
				buildFilterDetails[key] = buildFilterDetails[key].filter((option)=>{
					if(['*','any','none'].indexOf(option)>-1){
						return false
					}
					return true
				})
			})
		});
		setFilterDetails(buildFilterDetails);
	},[])

	// Load the rosses
	useEffect(()=>{
		Parser.parse(rossData, {
			header: true,
			download: true,
			skipEmptyLines: true,
			complete: function(results) {
				setRosses(results.data)
			}
		});
	},[])

	// Filter the Rosses
	useEffect(()=>{
		let filteredRosses = getRosses;
		Object.keys(getFilters).forEach((filter)=>{

			// * means skip, otherwise start filtering the ross 
			if(getFilters[filter]!=='*'){
				filteredRosses = filteredRosses.filter((ross)=>{

					// any means, well, any of the below filter options 
					if(getFilters[filter]==='any'){
						let thisRossKept = false; // once we know it's true we don't need to bother
						getFilterDetails[filter].forEach((option)=>{
							if(thisRossKept===false){
								if(ross[option.toUpperCase()]==='1'){
									thisRossKept = true;
								}
							}
						})
						return thisRossKept

					// none means none of the filter options
					}else if(getFilters[filter]==='none'){
						let thisRossKept = true;
						getFilterDetails[filter].forEach((option)=>{
							if(thisRossKept===true){
								if(ross[option.toUpperCase()]==='1'){
									thisRossKept = false;
								}
							}
						})
						return thisRossKept

					// This is the others, some things that may not be covered by the above, including handling individual options
					}else{
						let thisFiltersValues = getFilters[filter].split(',');
						let thisRossKept = true
						thisFiltersValues.forEach((filterValue)=>{

							// Sometimes we may need to adjust the filters, switch it
							let rossKeys = [filterValue.toUpperCase()];
							let checkValues = ['1']; // the CSV contains strings on 1 or 0
							switch(filter){
								case 'trees':
									switch(filterValue){
										case 'no':
											// There are two column about trees; TREE and TREES, while the CSV seems to follow the logic I'll check for both since I can
											rossKeys[0] = 'TREE';
											checkValues[0] = '0';
											rossKeys[1] = 'TREES';
											checkValues[1] = '0';
										break;
										case 'one':
											// A forest has many trees, but a single tree is special
											rossKeys[0] = 'TREE';
											checkValues[0] = '1';
											rossKeys[1] = 'TREES';
											checkValues[1] = '0';
										break;
										case 'many':
										default:
											// Fuck my shit up with some trees
											rossKeys[0] = 'TREES';
											checkValues[0] = '1';
										break;
									}
								break;
								default:
									// the pre-set value of rossKey is the default
								break;
							}

							// We default to the ross staying, but sometimes it sadly must go. Tis better to have Rossed and lost then never to have Rossed at all.
							rossKeys.forEach((rossKey,index)=>{
								if(ross[rossKey]!==checkValues[index]){
									thisRossKept = false;
								}
							})
						})
						return thisRossKept
					}
				})
			}
		})
		setFilteredRosses(filteredRosses);

		// And you can return a function to be run for cleanup, in this specific case I probably don't want to cleanup, but hey - this is mostly an example of how to do it.
		return function cleanup(){
			console.log('The cleanup function of the Filter Rosses useEffect has been called, congratulations. This should run every time the component is unmounted, but React also runs it before re-running the effect for because it wants to help. If you don\'t want it\'s help you can work around it, in this case the alert only appears on unload because I created a second useEffect to do it, which seems to be the standard solution to the problem when investigating.')
		}
	},[getRosses,getFilters])

	// Component Will Unmount
	useEffect(()=>{
		return ()=>{
			alert('The Rosses.js component is really going to unmount.')
		}
	},[])

	// This compares the position of the open paintings element with those around it and returns the first element we need to place the details before in order to put in between rows
	function getInsertBeforeElement(resize=false){
		
		// Before we move the details panel to it's new home we have to reset it to the bottom or else the browser may not reflow the page properly (hiding it will cause it not to reflow if the area is outside the rendering view)
		document.getElementById('painting-details').classList.remove('active')
		document.getElementById('ross-paintings').after(document.getElementById('painting-details'))

		// Lets got the selected images position and do the math to position the arrow diamond
		const startingTop = document.querySelector('li.painting.open').getBoundingClientRect().top;
		const wrapperLeft = document.getElementById('ross-paintings').getBoundingClientRect().left;
		const paintingLeft = document.querySelector('li.painting.open').getBoundingClientRect().left;
		const paintingWidth = document.querySelector('li.painting.open').offsetWidth
		const conectorWidth = 100; // it's 0px withe with 2 50px borders

		// This grabs the starting element based on it having the "open" class and moved the details panel to the appropriate position in the dom
		let nextPossibleElement = document.querySelector('li.painting.open').nextSibling
		while(nextPossibleElement!==null && nextPossibleElement.getBoundingClientRect().top <= startingTop){
			nextPossibleElement = nextPossibleElement.nextSibling
		}
		
		// Lets reposition that diamond now
		document.getElementById('connecting-bit').style.left = (paintingLeft-wrapperLeft+(paintingWidth/2)-(conectorWidth/2))+'px'
		document.getElementById('connecting-bit-outline').style.left = (paintingLeft-wrapperLeft+(paintingWidth/2)-(conectorWidth/2))+'px'

		// This gets the element we want to move around for the details and moved it to where we want, then makes it visible again
		if(nextPossibleElement!==null){
			nextPossibleElement.before(document.getElementById('painting-details'))
		}else{ // In case you click on the last row, or I guess something else goes horribly wrong, place it at the
			document.querySelector('li.painting:last-child').after(document.getElementById('painting-details'))
		}
		document.getElementById('painting-details').classList.add('active')
		
		// scroll window into position, smooth scrolling can have weird effects, so jump to it for easier use also it's disorinting when it happens on resize, so not then
		if(!resize){
			window.scrollTo(0,window.scrollY+document.querySelector('li.painting.open').getBoundingClientRect().top);
		}
	}
	window.onresize = ()=>{
		if(document.querySelector('li.painting.open')!==null){
			getInsertBeforeElement(true)
		}
	}

	// This will reposition the details block and proceed to figure out what to put in it.
	function displayDetails(event){
		if(document.querySelector('li.painting.open')!==null){
			getInsertBeforeElement()
			// Update which painting we are looking at, this will be used to load the content
			setSelectedPainting(document.querySelector('li.painting.open').dataset.index)
		}else{
			document.getElementById('painting-details').classList.remove('active')
		}
	}

	// The actual output of the Rosses
	return (<div>
		<pre style={{display:'none'}}>
			The Rosses, filtered as described above, go here.
			Those filters would be: 
			{JSON.stringify(getFilters,null,3)}
		</pre>
		<h2 className="font-bold text-center text-lg">Your current filters leave you with {Math.round((getFilteredRosses.length/getRosses.length)*1000)/10}% of paintings matching ({getFilteredRosses.length}/{getRosses.length}).</h2>
		<ol id="ross-paintings" className="container flex flex-wrap mx-auto my-5">
			{getFilteredRosses.map((ross,index)=>{
				return (<Painting key={ross.episode} paintingIndex={index} details={ross} displayDetails={displayDetails}/>)
			})}
			<li id="painting-details" className="relative text-white w-full">
				<div id="connecting-bit" className="absolute">&nbsp;</div>
				<div id="connecting-bit-outline" className="absolute">&nbsp;</div>
				<div className="bg-black p-2 mx-2 my-1 relative">
					<PaintingDetails paintingIndex={getSelectedPainting} details={getRosses[getSelectedPainting]} />
				</div>
			</li>
		</ol>
	</div>);
}
