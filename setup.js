// Lets get the tool we need
const fs = require('fs');
const https = require('https');
const Parser = require('papaparse');

// Data sources, luckily they already exist. There are replaced with the data once loaded.
let rossDataA = "https://raw.githubusercontent.com/fivethirtyeight/data/master/bob-ross/elements-by-episode.csv"; // Elements and frames
let rossDataB = "https://raw.githubusercontent.com/jwilber/Bob_Ross_Paintings/master/data/bob_ross_paintings.csv"; // Images, videos, and colors

// Additional Settings
const mergedCSVSaveLocation = './src/ross-data.csv';
const imageSaveLocation = './img/';

// Prepare the data, we definitely want it all in place before continuing
(async function(){
    rossDataA = await loadRosses(rossDataA);
    rossDataB = await loadRosses(rossDataB);    
    mergeRossData();
})()

// This function takes a CSV input and returns a papaparsed object
function loadRosses(remoteRossFile){
    return new Promise((resolve,reject)=>{
        let dataBuffer = '';
        https.get(remoteRossFile,{},(response)=>{
            response.on('data',(chunk)=>{
                dataBuffer += chunk;
            })
            // Now that the data is done start parsing it
            response.on('end',(end)=>{
                Parser.parse(dataBuffer, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                        resolve(results.data);
                    }
                });
            })
            // Just in case
            response.on('error',(error)=>{
                throw new Error(`The following error occured when attempting to load the Ross data file at ${remoteRossFile}`,error)
            })
        })
    })
    return dataBuffer
}

// This will take the two CSVs and marge them together, luckily both CSVs are in the same order - episode order
// I know the test in this very function fails but thats the fault of the second data set having incorrect episode numbers, the names confirm that.
function mergeRossData(){ 
    console.log('Merging Ross painting data...')

    // This bit of code was to confirm everything lines up, just in case you don't trust me or the data sources change.
    //      rossDataA.forEach((painting,row)=>{
    //          let rossBEpisodeEquivalent = 'S'+rossDataB[row].season.padStart(2,'0')+'E'+rossDataB[row].episode.padStart(2,'0')
    //          console.log( `Row #${row}: ${painting.EPISODE} = ${rossBEpisodeEquivalent} ${(painting.EPISODE==rossBEpisodeEquivalent?`\x1b[32mMatch\x1b[0m`:`\x1b[31mError! \x1b[0mTitles ${painting.TITLE} = ${rossDataB[row].painting_title}`)}` )
    //      })

    // Lets run all this through a switch and sort out a new data set
    let mergedRossData = []
    rossDataA.forEach((paintingA,index)=>{
        const paintingB = rossDataB[index];
        const paintingData = {...paintingA, ...paintingB}
        let mergedPainting = {};
        Object.keys(paintingData).forEach((attrKey)=>{
            switch(attrKey){
                case "": // a blank one for index in rossDataB
                case "painting_index": // an un-needed index from rossDataB
                case "season": case "episode": // from rossDataB, these are not always correct, so we'll use the rossDataA version
                case "TITLE": // this from rossDataA and is in all caps, but the version from rossDataB is properly cased, so we'll keep that one.
                break;
                case "color_hex": // I'm just renaming this one for consistency
                    mergedPainting['colors_hex'] = paintingData[attrKey];
                break;
                default: // Keeping most everything, but adjusting the names for consisteny
                    mergedPainting[attrKey.toLowerCase()] = paintingData[attrKey].trim().replace(/(\\r|\\n)*/g,''); // some unencoded line breaks snuck their way into rossDataB, this removes them
                break;
            }
        })
        mergedRossData.push(mergedPainting)
    })

    // Now, lets prepare the download data for all those images and update the img_src column with our new file name (I don't want to leech bandwidth off twoinchbrush.com for them)
    let downloadPaintingData = []
    mergedRossData.forEach((painting,index)=>{
        const newImageFileName = painting.episode+'-'+painting.painting_title.toLowerCase().replace(/[^a-z0-9 ]/,'').replace(/ +/g,'-')+'.png';
        downloadPaintingData.push({
            'newFileName': newImageFileName,
            'download': painting.img_src
        })
        mergedRossData[index].img_src = newImageFileName
    })

    // Save all that as a CSV
    const newCSV = Parser.unparse(mergedRossData)
    fs.writeFileSync(mergedCSVSaveLocation,newCSV)
    console.log(`New merged Ross painting data has been saved to ${mergedCSVSaveLocation}`)

    // And finally we can start the download of those images
    console.log('Downloading painting images...')
    downloadPaintingImage(downloadPaintingData)
}

// This little function does the actual downloading of the images
function downloadPaintingImage(downloadPaintingData){
    if(downloadPaintingData.length>0){
        const thisDownload = downloadPaintingData.shift();
        const downloadedFile = fs.createWriteStream(imageSaveLocation+thisDownload.newFileName)
        https.get(thisDownload.download,{},(response)=>{
            response.pipe(downloadedFile)
            response.on('end',()=>{
                downloadPaintingImage(downloadPaintingData)
            })
        })
    }else{
        console.log(`Painting images downloaded to ${imageSaveLocation}.`)
    }
}