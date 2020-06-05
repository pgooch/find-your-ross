import React from 'react';

// This will takes the painting data and an array of fields and returns all the ones that are not 0
function reduceFields(data={},fields=[]){
    let returnArray = [];
    fields.forEach((key)=>{
        if(data[key]!==undefined && data[key]!=="0"){
            returnArray.push(key)
        }
    })
    return returnArray
}

// This will make the all lower can underscored field names look more presentable
function cleanupFields(fieldArray=[]){
    return fieldArray.map((field)=>{
        return field.replace(/_/g,' ').replace(/\b(\w)/g, s => s.toUpperCase()); // Thank you stack overflow
    })
}

// The actual filter component
export default function PaintingDetails(props) {
    const painting = props.details; // makes this cleaner below

    // If we do not have any painting details then we don't need to do anything
    if(painting===undefined){
        return(<></>)
    }

    // Convert the singles quotes to double so it can be parsed and get us more usable arrays for the colors.
    const parsedColorNames = JSON.parse(painting.colors.replace(/'/g,'"'))
    const parsedColorValues = JSON.parse(painting.colors_hex.replace(/'/g,'"'))

    // Grab all the frame details and the element details, these list are derrived from the CSV. If this was API driven this stuff would come over in a more organized manner and we wouldn't need this crazy long filter functions
    const frameDetails = cleanupFields(reduceFields(painting,['apple_frame','circle_frame','double_oval_frame','florida_frame','half_circle_frame','half_oval_frame','oval_frame','rectangle_3d_frame','rectangular_frame','seashell_frame','split_frame','tomb_frame','triple_frame','window_frame','wood_framed']))
    const paintingElements = cleanupFields(reduceFields(painting,['aurora_borealis','barn','beach','boat','bridge','building','bushes','cabin','cactus','cirrus','cliff','clouds','conifer','cumulus','deciduous','dock','farm','fence','fire','flowers','fog','grass','hills','lake','lakes','lighthouse','mill','moon','mountain','mountains','night','ocean','palm_trees','path','person','portrait','river','rocks','snow','snowy_mountain','structure','sun','tree','trees','waterfall','waves','windmill','winter']));
    const guestPainter = ( ({guest,steve_ross,diane_andre})=>({guest,steve_ross,diane_andre}) )(painting)

    // The painting details box contents, finally
	return (<>
        <div className="header float-clear md:float-right p-2 pt-0 text-center w-full md:w-1/2">
            <h2 className="font-fancy text-3xl">{painting.painting_title}</h2>
            <div className="">
                {painting.episode} <Artist guestDetails={guestPainter} />
            </div>
        </div>
        <div className="video float-clear md:float-left p-2 w-full md:w-1/2">
            <iframe width="100%" height="315" className="video-container" src={painting.youtube_src} title={painting.painting_title+" on YouTube"}>You need iframes to watch Bob Ross do his thing.</iframe>
        </div>
        <div className="details float-clear md:float-right p-2 w-full md:w-1/2">
            <div>
                Tagged; {paintingElements.join(`, `)}
                <Frame frameDetails={frameDetails} />
            </div>
        </div>
        <ol className="colors float-clear md:float-right p-2 w-full md:w-1/2">{parsedColorNames.map((colorName,index)=>{
                return (<BrushIcon key={'color'+index} colorName={colorName} colorHex={parsedColorValues[index]} />)
            })}</ol>
        <div className="clearfix"></div>
    </>);
}

// This will display Bob Ross's name, or someone elses name, if we know what that might be, or a message otherwise
function Artist(props){
    if(props.guestDetails.steve_ross !== undefined && props.guestDetails.steve_ross==="1"){
        return (<span>By Steve Ross</span>)
    }
    if(props.guestDetails.diane_andre !== undefined && props.guestDetails.diane_andre==="1"){
        return (<span>By Diane André</span>)
    }
    if(props.guestDetails.diane_andre !== undefined && props.guestDetails.guest==="1"){
        return (<span>By A Friend of Bob Ross</span>)
    }
    return (<span>By Bob Ross</span>)
}

// This is the palette icon used to express the color with it's title
function BrushIcon(props){
    return (<li className="color-cell w-1/2 py-1 inline-block">
        <svg xmlns="http://www.w3.org/2000/svg" style={{fill:props.colorHex}} viewBox="0 0 1280 1280">
            <path d="M433.374,42.764c-148.148,52.637 -265.097,149.898 -341.675,284.104c-69.573,121.806 -96.684,259.566 -77.941,396.846c4.608,34.41 8.034,50.269 19.493,89.981c15.987,56.078 32.237,94.835 59.638,142.457c23.933,41.22 44.637,69.674 78.408,106.994c36.988,40.92 69.607,69.398 115.876,101.103c20.097,13.843 75.714,44.251 99.918,54.734c110.971,47.888 228.74,63.452 347.017,45.747c40.974,-6.069 89.149,-18.571 101.737,-26.267c21.199,-13.024 36.36,-29.938 45.015,-50.473c10.646,-25.072 11.547,-51.198 2.377,-76.643c-8.629,-24.505 -20.337,-38.687 -45.947,-56.023c-11.369,-7.709 -25.138,-22.399 -32.182,-34.625c-6.629,-11.251 -13.45,-35.175 -13.713,-48.103c-0.795,-33.034 12.711,-63.438 37.349,-84.561c16.408,-13.985 15.431,-13.569 109.576,-41.504c46.819,-13.895 86.477,-26.022 88.141,-26.907c1.628,-1.011 8.392,-4.172 15.03,-7.296c64.819,-29.976 120.249,-82.324 156.032,-147.412c29.213,-53.087 43.402,-106.543 44.179,-167.674c0.679,-49.469 -12.396,-107.335 -36.791,-162.658c-71.723,-162.281 -225.594,-279.515 -415.909,-316.692c-84.356,-16.466 -167.003,-16.858 -255.572,-1.052c-19.149,3.406 -83.762,20.184 -100.056,25.924Z"/>
        </svg>
        <span className="underlined-color pr-1 pl-2 -ml-1" style={{borderColor:props.colorHex}}>{props.colorName}</span>
    </li>)
}

// This will output nothing or the frame of the painting
function Frame(props){
    if(props.frameDetails.length>0){
        const frames = props.frameDetails.map((frame)=>{
            return frame.replace(/_/g,' ').replace('Frame','').trim()
        })
        return (<span className="frameDetails">, and {frames.join(', ')} framed.</span>)
    }else{ // No frame, no return
        return (<>.</>)
    }
}

