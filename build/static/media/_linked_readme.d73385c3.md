# Find Your Ross

Find your ross is a react app that will let you find just the Bob Ross episode you want based on some filtering options.

## Setup
Before starting up this application in development mode or building a production ready version you must first prepare the data. This merges two different Bob Ross painting data sets and downloads the images from twoinchprush.com as to not waste their bandwidth. You can use the following command to run the startup script.
```
npm run setup
```
Alternatively you can run setup.js with node directly. Images will be downloaded to `./img/` and the merged painting data CSV will be downloaded to `./ross-data.csv`. These locations can be changed but it will also require changes in the application. 

Keep in mind the show ran for 31 seasons, 403 total episodes, just shy of 100mb of images, and this does not download them in parallel - it'll take a while. This might be something to consider changing, but as you only need to run this once I was not concerned with the speed of it.

## Data Sources and Problems
The data used to create this app comes from two pre-existing sets of Bob Ross painting data CSVs available on github:
```
https://raw.githubusercontent.com/fivethirtyeight/data/master/bob-ross/elements-by-episode.csv
```
```
https://raw.githubusercontent.com/jwilber/Bob_Ross_Paintings/master/data/bob_ross_paintings.csv
```
These data sets, while awesome and totally time saving, both have some issues. I've noticed the following when working on this:

- The second data set has incorrect season and episode listings which are pruned during merge.
- The first data set does not always have paintings in frames marked as `framed` or have the specific type of frame properly noted, this field is only used for the "any" frame option.
- The first source lists guest but only has Steve Ross and Diane Andre as named guests, the others are not in the data.
- The second source list has missing colors from some paintings.

There may be more errors I did not notice. While I did consider modifying the `setup.js` script to correct these errors (and may still do that in the future) I didn't _really_ build this to find Bob Ross painting I built it for fun and to try out some newer React techniques and as such I didn't really want to spend the time on minor errors. This is a dorky app for fun not a production product and I'd probably miss some errors regardless (unless I want to commit the time to check each and every episode, which again given the nature of this project I don't).

That said if the error were corrected source side re-running the setup script should fix everything, nothing was built specifically to work around these content issues. If I do decide to fix the issues thats where I would try and get them fixed (repo owners willing).