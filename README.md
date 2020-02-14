# Find Your Ross

Find your ross is a react app that will let you find just the Bob Ross episode you want based on some filtering options.

This version should not be considered "done", I'm simply publishing it now so I can use it's code as an example, maybe some day this will get finished, but not today.

## Setup
Before starting up this application in development more or building a production ready version you must first prepare the data. This merges two different Bob Ross painting data sets and downloads the images from twoinchprush.com as to not waste their bandwidth. You can use the following command to run the startup script.
```
npm run setup
```
Alternatively you can run setup.js with node directly. Images will be downloaded to `./img/` and the merged painting data CSV will be downloaded to `./ross-data.csv`. These locations can be changed but it will also require changes in the application. 

Keep in mind the show ran for 31 seasons, 403 total episodes, just shy of 100mb of images, and this does not download them in parallel - it'll take a while. This might be something to consider changing, but as you only need to run this once I was not concerned with the speed of it.