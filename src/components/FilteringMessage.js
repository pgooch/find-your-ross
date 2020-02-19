import React from 'react';

export default function FilteringMessage(props){
	// Instead of typing the same classes out over and over
	const stdClassName = 'text-center text-lg ';
	
	// Different returns for different situations
	if(props.totalCount == props.filteredCount){
		return (<h2 className={stdClassName+' text-rossBlue-dark'}>{`Start playing around with the filters above to find just the right Bob Ross painting or browser all ${props.totalCount} paintings below.`}</h2> )
	}
	if(props.filteredCount<=0){
		return (<h2 className={stdClassName+' text-red-800'}>{`It doesn't look like there are any happy little paintings meeting those requirements.`}</h2> )
	}
	return (<h2 className={stdClassName+' text-rossGreen-dark'}>{`Your current filters leave you with ${Math.round((props.filteredCount/props.totalCount)*1000)/10}% (${props.filteredCount}) of Bob Ross paintings remaining.`}</h2>);
}