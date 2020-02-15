import React from 'react';

// The actual filter component
export default function Painting(props) {

	// Just a little toggle logic
	function toggleDetails(event){
		if(event.target.closest('.open')===null){
			if(document.querySelector('li.painting.open')!==null){
				document.querySelector('li.painting.open').classList.remove('open')
			}
			event.nativeEvent.target.closest('li.painting').classList.add('open')
		}else{
			document.querySelector('li.painting.open').classList.remove('open')
		}
		props.displayDetails() // also hides if there is no open image
	}

	// Simple output
	return (<li data-index={props.paintingIndex} className="painting p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" onClick={toggleDetails}>
		<div className="painting-wrap relative cursor-pointer">
			<img src={require('../../img/'+props.details.img_src)} alt={props.details.painting_title+' Image'}/>
		</div>
	</li>);
}
