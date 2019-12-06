import React, {useState} from 'react';
import {Filters, filtersDefault, FilterContext} from './Filters.js';
import {Rosses} from './Rosses.js';

// The actual filter component
export default function Find(props) {

  const [getFilters,setFilters] = useState(filtersDefault);

	return(
		<FilterContext.Provider value={{getFilters,setFilters}}>
		This is the "find" page...
			<Filters />
			<Rosses />
		</FilterContext.Provider>
	)
}
