import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// My Imports
import './styles/_compiled.css';
import Rosses from './components/Rosses.js'
import About from './components/About.js'
import {Filters, filtersDefault, FilterContext} from './components/Filters.js'
import Footer from './components/Footer.js'
import Header from './components/Header.js'

export default function App() {

  const [getFilters,setFilters] = useState(filtersDefault);

  // The main content output router
  return (
    <Router>
      <Header />
      <div>
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
            <div className="container w-1/1 mx-auto my-5">
              You done error'd, how did you manage that? Look, normally this type of thing takes you to an error page, maybe a 404, maybe a 500, maybe some arbitrary other number everybody has to look up - you know the drill. Thing is in this case the app is so simple and so ultimately pointless that I don't really want to make one. I know it takes like no time at all time make one but your never gonna see it and I've spent more time writing this out that I would have making the page. So anyways, sorry about the error and the time of yours I wasted reading this.
            </div>
          </Route>
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}