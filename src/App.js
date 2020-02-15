import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// My Imports
import './styles/_compiled.css';
import {Filters, filtersDefault, FilterContext} from './components/Filters.js'
import {Rosses} from './components/Rosses.js'

export default function App() {

  const [getFilters,setFilters] = useState(filtersDefault);

  // The main content output router
  return (
    <Router>
      <div>
        
        <nav className="container w-1/1 mx-auto my-5">
          <ul className="text-center">
            <li className="inline-block">
              <Link className="p-3" to="/">Home</Link>
            </li>
            <li className="inline-block">
              <Link className="p-3" to="/about">About</Link>
            </li>
            <li className="inline-block">
              <Link className="p-3" to="/this-is-a-404-error">Error</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/about">
            <div className="container w-1/1 mx-auto my-5">
              This is, or would be if I bothered to write anything, the About page, talking about what this is and why this is.
            </div>
          </Route>
          <Route exact path="/">
            <FilterContext.Provider value={{getFilters,setFilters}}>
              <Filters />
              <Rosses />
            </FilterContext.Provider>
          </Route>
          <Route>
            <div className="container w-1/1 mx-auto my-5">
              You done error'd.
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}