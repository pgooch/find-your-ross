import React from 'react';

// The actual filter component
export default function Footer(props) {
	return (<div className="container w-1/1 mx-auto my-6 mb-12 text-center text-gray-600">
        This site is in no way affiliated with Bob Ross Inc.<br/>
        <a href="https://github.com/pgooch/find-your-ross" target="_blank" rel="noopener noreferrer" className="font-bold">Clone this happy little repo on Github</a>.
    </div>);
}
