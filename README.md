## Neighborhood Map
Neighborhood Map is a web application where the user provides two inputs:'What to find' and 'Where to find'. For example, 'Restaurants' in  Manhattan, NY. The application then populates the Google Map to display places of interest near the location entered using markers. There is also a side navigation drawer that displays the following items in the location entered:
* Current weather
* List of places marked on the map.
On clicking a place in the list on the side navigation doawer, an information window opens up near the place merker on the map displaying additional information about the place such as - Name and address, Phone number, Google review and Website URL.

### APIs used
Google Maps, Google Places Services, Foursquare and Wunderground.

### Setup Instructions to host your own web server
* **Node JS for localhost web server**:  Install Node JS by following instructions from here https://nodejs.org/en/download/
* **Ngrok for webserver over proxy**: Install ngrok by following instructions from here: https://ngrok.com/download
* **Gulp as build configuration tool**: From Node JS command prompt, install gulp by following instructions from here: https://www.npmjs.com/package/gulp-download
* **Gulp modules required to run our web app**: From Node JS command prompt, install the following gulp modules:
    * gulp-uglify
    * gulp-util
    * gulp-rename
    * gulp-clean-css
    * gulp-imagemin
    * gulp-image-resize
    * gulp-htmlmin
    * browser-sync
    * ngrok
    * run-sequence
as defined in package.json by typing the following command:
```
npm install
```

### Starting Web App
##### From github server
* The web app is hosted on https://uthraragavan.github.io/Neighborhood-Map

##### Hosting your own web server on ngrok

* **Download the project assets from Github**: https://github.com/uthraragavan/Neighborhood-Map
* **Starting web app**: From Node JS command prompt, navigate to the project asset folder on your system and type gulp. This will start the web app over ngrok proxy. A browser window showing index.html from dist folder shows up. The gulp command from command prompt should display something like this:
 ```
C:\Users\Uthra\Desktop\Udacity\FrontEnd\Maps-Knockout>gulp
[11:52:48] Using gulpfile ~\Desktop\Udacity\FrontEnd\Maps-Knockout\gulpfile.js
[11:52:48] Starting 'webhost'...
[11:52:48] Starting 'browser-sync'...
[11:52:48] Finished 'browser-sync' after 146 ms
[11:52:48] Starting 'ngrok-url'...
serving your tunnel from: https://0fc6798b.ngrok.io
[11:52:50] Finished 'ngrok-url' after 2.21 s
[11:52:50] Finished 'webhost' after 2.38 s
[11:52:50] Starting 'default'...
[11:52:50] Finished 'default' after 33 µs
[BS] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.0.105:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.0.105:3001
 --------------------------------------
[BS] Serving files from: ./dist
```
