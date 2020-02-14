import React, {useMemo} from 'react';

// The actual filter component
export default function Painting(props) {

	// In order to not re-loop the ross details we will useMemo them. This only needs to do once since they don't change.
	let rossFeatures = useMemo(()=>{
		let features = [];
		Object.keys(props.details).forEach((key)=>{
			if(props.details[key]==='1'){
				features.push(key)
			}
		})
		return features
	},[props.details])

	return (<li data-index={props.paintingIndex} className="painting p-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4" onClick={props.displayDetails}>
		<div className="painting-wrap relative cursor-pointer">
			<img src={require('../img/'+props.details.img_src)}/>
		</div>
	</li>);
}
