import React from 'react';

export default function FilteringMessage(props){
	// Instead of typing the same classes out over and over
	const stdClassName = 'text-center text-xl ';

	// Different returns for different situations
	if(props.isFiltering){
		return (<div className={stdClassName+' text-rossBlue italic'}>One moment while I beat the devil out that data.</div>)
	}
	if(props.totalCount === props.filteredCount){
		return (<h2 className={stdClassName+' text-rossBlue-dark'}>{`All ${props.totalCount} Bob Ross paintings are below, filters are above.`}</h2> )
	}
	if(props.filteredCount <= 0){
		return (<h2 className={stdClassName+' text-red-800'}>{`It doesn't look like there are any happy little paintings meeting those requirements.`}</h2> )
	}
	return (<h2 className={stdClassName+' text-rossGreen-dark'}>{`Your current filters leave you with ${Math.round((props.filteredCount/props.totalCount)*1000)/10}% (${props.filteredCount}) of Bob Ross paintings remaining.`}</h2>);
}