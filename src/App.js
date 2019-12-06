import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// My Imports
import './styles/compiled.css';
import {Filters, filtersDefault, FilterContext} from './Filters.js'
import {Rosses} from './Rosses.js'

export default function App() {

  const [getFilters,setFilters] = useState(filtersDefault);

  // The main content output router
  return (
    <Router>
      <div>
        
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/this-is-a-404-error">Error</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/">
            <FilterContext.Provider value={{getFilters,setFilters}}>
              <Filters />
              <Rosses />
            </FilterContext.Provider>
          </Route>
          <Route>
            <Error />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (<h2>Home</h2>);
}

function About() {
  return <h2>About</h2>;
}

function Error() {
  return <h2>It appears you have 404'd</h2>;
}