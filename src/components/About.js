import React, {useState} from 'react';

const ReactMarkdown = require('react-markdown')

// Output the readme
export default function About(){ 

	// Load the readme
	const [getReadme,setReadme] = useState('');
	fetch(require('../_linked_readme.md'))
	.then((r)=>{
		return r.text()
	})
	.then((text)=>{
		setReadme(text)
	})

	return (<>
		<div className="text-center pt-1 pb-2">
			<a className="text-center text-lg text-rossBlue-dark" href="https://github.com/pgooch/find-your-ross">This is just the README.md file from the GitHub repository.</a>
		</div>
		<div className="container mx-auto my-5 markdown-body">
			<ReactMarkdown source={getReadme} />
		</div>
	</>);
}
