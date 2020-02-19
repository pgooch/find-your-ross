import React from 'react';
import {Link} from "react-router-dom";
  
// The actual filter component
export default function Header(props) {
	return (<>
        <h1 className="font-fancy py-4 text-5xl text-center text-rossBlue-dark">Find Your Ross</h1>
        
        <nav className="container w-1/1 mx-auto mb-6">
          <ul className="text-center">
            <li className="inline-block">
              <Link className="p-3" to="/">Home</Link>
            </li>
            <li className="inline-block">
              <Link className="p-3" to="/about">About</Link>
            </li>
          </ul>
        </nav>

    </>);
}
