import React, {useMemo} from 'react';

// The actual filter component
export default function Ross(props) {

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

	return (<li className="p-3 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
		<h3 className="font-extrabold text-center">{props.details.EPISODE+' - '+props.details.TITLE}</h3>
		<span className="font-light italic lowercase text-gray-600">{rossFeatures.map(c=>c.replace('_',' ').toLowerCase()).join(', ')}</span>
	</li>);
}
