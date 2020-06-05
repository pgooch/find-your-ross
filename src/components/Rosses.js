import React, {useContext,useState,useEffect} from 'react';
import Parser from 'papaparse';

import {FilterContext} from './Filters.js';
import Painting from './Painting.js';
import PaintingDetails from './PaintingDetails.js';
import FilteringMessage from './FilteringMessage.js'

// This data file is a combination of 2 data files made by /setup.js, create with 'npm run setup'
import rossData from '../ross-data.csv';

export default function Rosses(){ 

	// grad the FilterContext to determine the correct Rosses to show
	const {getFilters} = useContext(FilterContext)

	// We use a little state here, one for the data (that we only load once) and one for the results (which we fiddle with)
	const [getRosses,setRosses] = useState([]);
	const [isLoading,setLoading] = useState(true);
	const [getFilteredRosses,setFilteredRosses] = useState([])
	const [getSelectedPainting,setSelectedPainting] = useState(-1,[])

	// Load the rosses
	useEffect(()=>{
		setLoading(true);
		Parser.parse(rossData, {
			header: true,
			download: true,
			skipEmptyLines: true,
			complete: function(results) {
				setRosses(results.data);
			}
		});
	},[])

	// Filter the Rosses
	useEffect(()=>{
		let filteredRosses = getRosses;
		let sortFilterIndex = -1;
		if(filteredRosses.length>0){
			setLoading(true);

			getFilters.forEach((filter,index)=>{
				// We're gonna skip sort order till were done filtering
				if(filter.category==="Sort"){
					sortFilterIndex = index; // keep track of this so we don't have to search for it again in a bit

				// Trees and painter aren't simple binary choices, so they get some special handeling
				}else if(filter.category==="Trees"){
					switch(filter.value){
						case 'No Trees':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.tree === "0" && ross.trees === "0" && ross.palm_trees === "0"
							})
						break;
						case 'One Tree':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.tree === "1" && ross.trees === "0" && ross.palm_trees === "0"
							})
						break;
						case 'Many Trees':
							filteredRosses = filteredRosses.filter((ross)=>{
								return (ross.tree === "1" || ross.trees === "1") && ross.palm_trees === "0"
							})
						break;
						case 'Palm Trees':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.tree === "0" && ross.trees === "0" && ross.palm_trees === "1"
							})
						break;
						default:break;
					}
				}else if(filter.category==="Painter"){
					switch(filter.value){
						case 'Bob Ross':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.steve_ross === "0" && ross.diane_andre === "0" && ross.guest === "0"
							})
						break;
						case 'Steve Ross':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.steve_ross === "1"
							})
						break;
						case 'Diane André':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.diane_andre === "1"
							})
						break;
						case 'A Friend of Bob Ross':
							filteredRosses = filteredRosses.filter((ross)=>{
								return ross.guest === "1" && ross.steve_ross === "0" && ross.diane_andre === "0"
							})
						break;
						default:break;
					}

				// The bulk of filters are either "1" or "0", as strings :/
				}else{
					filteredRosses = filteredRosses.filter((ross)=>{
						return ross[filter.value] === "1"
					})
				}
			});

			// Now we can worry about sorting, if we need to
			const sortOrder = sortFilterIndex>=0 ? getFilters[sortFilterIndex].value : "In Airing Order"
			switch(sortOrder){
				case 'In Airing Order':
					filteredRosses.sort((a,b)=>{
						return a.episode === b.episode ? 0 : a.episode > b.episode ? 1 : -1;
					})
				break;
				case 'Ordered by Title':
					filteredRosses.sort((a,b)=>{
						return a.painting_title === b.painting_title ? 0 : a.painting_title > b.painting_title ? 1 : -1;
					})
				break;
				case 'Ordered by Number of Colors':
					filteredRosses.sort((a,b)=>{
						return a.colors.split(',').length === b.colors.split(',').length ? 0 : a.colors.split(',').length > b.colors.split(',').length ? -1 : 1;
					})
				break;
				default:break;
			}
			setLoading(false);
		}

		setFilteredRosses([...filteredRosses]);
	},[getRosses,getFilters])

	// Component Will Unmount
	useEffect(()=>{
		return ()=>{
			// This was added to have a visual of this working as componentWillUnmount for a demo, it serves no purpose.
			// alert('The Rosses.js component is really going to unmount.')
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
			setSelectedPainting(-1)
		}
	}

	// The actual output of the Rosses or the loading message thats so fast you'll never see it.
	return (<div>
		<pre style={{display:'none'}}>
			The Rosses, filtered as described above, go here.
			Those filters would be: 
			{JSON.stringify(getFilters,null,3)}
		</pre>
		<FilteringMessage isFiltering={isLoading} totalCount={getRosses.length} filteredCount={getFilteredRosses.length} />
		<ol id="ross-paintings" className="container flex flex-wrap mx-auto my-5">
			{getFilteredRosses.map((ross,index)=>{
				return (<Painting key={ross.episode} paintingIndex={index} details={ross} displayDetails={displayDetails}/>)
			})}
			<li id="painting-details" className="relative text-white w-full">
				<div id="connecting-bit" className="absolute">&nbsp;</div>
				<div id="connecting-bit-outline" className="absolute">&nbsp;</div>
				<div id="details-wrapper" className="bg-black p-2 mx-2 my-1 relative">
					<PaintingDetails paintingIndex={getSelectedPainting} details={getRosses[getSelectedPainting]} />
				</div>
			</li>
		</ol>
	</div>);
}
