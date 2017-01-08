//
// Filename: script.js
// Date last modified: January 4 2017
// Author: Uthra Vijayaragavan
//

//
// Global variables
//

var drawer = document.querySelector('#drawer');
var map = null;
var infowindow;
var pos;
var pyrmont = {lat: -33.867, lng: 151.195};
var geocoder;
var service;
var reslist;
var content;
var cli_id = 'NEO0GEWJZYJ3LGMYG103A5AJ0L5JME2KRRNERFOMGHVZYP30';
var cli_sec = 'J4ZFEQAJMHD3NKNPKAE3WLIRBCSMABBBRRAHKMGNZHWNPEO0';

function stringStartsWith(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
};
//
// Variables to hold DOM variables for Off Canvas
//
var menu = document.querySelector('#menu');
var main = document.querySelector('.main');
var drawer = document.querySelector('#drawer');

//
// Off Canvas handling
//
menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
});

main.addEventListener('click', function() {
    drawer.classList.remove('open');
});

//
// Knockout View Model
//
function AppViewModel() {
    var self = this;
    //
    // View Model variables
    //
    self.findType = "Restaurants";
    self.findPlace = "Manhattan, NY";
    self.findFilter = ko.observable("");
    self.resultList = ko.observableArray([]);
    self.weatherdata = ko.observable({"temp":"--ºF", "weather":"No Weather Data", "weatherurl":"", "humidity":"--%"});
    self.currentMarker = ko.observable("");
    //Filter the side navigation drawer and the map markers based on search query
    self.filteredresultList = ko.computed(function() {
        var filter = self.findFilter().toLowerCase();
        if (!filter) {
           self.resultList().forEach(function(entry) {
              entry.mark.setVisible(true);
            });
            return self.resultList();
        } else {
            return ko.utils.arrayFilter(self.resultList(), function(item) {
                item.mark.setVisible(true);
                var r = stringStartsWith(item.name.toLowerCase(), filter);
                if(r === false)
                {
                    item.mark.setVisible(false);
                }
                return r;

          });
        }
    }, self);
    //
    // Function to gather weather data by using AJAX - wunderground API
    //
    self.getWeather = function() {
        url = "https://api.wunderground.com/api/ef5a156e62f050d2/conditions/q/" +
              self.findPlace + ".json";
        $.ajax({
          url: url,
          method: 'GET',
          dataType: "json"
        }).done(function(data) {
           var t = {"temp":"--ºF", "weather":"No Weather Data", "weatherurl":"", "humidity":"--%"};
           if(data.current_observation)
            {
              t.temp = data.current_observation.temp_f + "ºF";
              t.weather = data.current_observation.weather;
              t.weatherurl = data.current_observation.icon_url;
              t.weatherurl = t.weatherurl.replace("http:", "https:");
              console.log(t.weatherurl);
              t.humidity = data.current_observation.relative_humidity;
            }
            self.weatherdata(t);
        }).fail(function(e) {
          var t = {"temp":"--ºF", "weather":"No Weather Data", "weatherurl":"", "humidity":"--%"};
          self.weatherdata(t);
          console.log(e);
          throw e;
        });
    }

    //
    // Invoke getweather on creating View Model instance itself
    // so that the weather data binds correctly for display
    //
    self.getWeather();

    //
    // Function to create the list of places returned from Google Places API
    // Parameter:
    //r [in] Global Results data list
    self.computeresultList = function(r) {
        for(var i =0 ; i < r.length; i++)
        {
            self.resultList.push(r[i]);
        }
    };

    //
    // Function to handle click of a place on the Navigation list
    // to display the place information in infowindow
    // Parameters:
    // i [in] Index of the places list
    self.linkClick = function(i) {
        bounceCurrentMarker(self.filteredresultList()[i]);
        displayinfowindow(self.filteredresultList()[i]);
        map.setZoom(18);
        map.setCenter(self.filteredresultList()[i].mark.getPosition());
    };

    //
    // Function to handle click of Submit button.
    // Initializes map again and fetches weather data
    //
    self.submitQuery = function() {
        if(self.resultList())
        {
            self.resultList([]);
        }
        initMap();
        self.getWeather();
    };

}

//
// Activates knockout.js
//
var myviewModel = new AppViewModel();
ko.applyBindings(myviewModel);

////////////////////////////////////////////////////////////////////////
////////////// Google Maps API related functions ///////////////////////
////////////////////////////////////////////////////////////////////////

//
// Initial Map Creation function called from index.html
//
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 16
    });
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    map.addListener('center_changed', function() {
          // 3 seconds after the center of the map has changed, pan back to the
          // marker.
          window.setTimeout(function() {
            map.panTo(myviewModel.currentMarker.getPosition());
          }, 3000);
    });
    geocodeAddress(geocoder, map);
}

//
// Function to mark the given address the user types in the search field
// on the map using marker and fetch the places list by issuing a Google API Text Search
// Parameter:
// geocoder [in] Global Geocoder object
// resultsMap  [in] Global Map object
function geocodeAddress(geocoder, resultsMap) {
    var address = myviewModel.findPlace;
    var ret;

    // Fetch the Lat and Lng given the address and mark on the map
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
              pyrmont = results[0].geometry.location;
              resultsMap.setCenter(results[0].geometry.location);
              var photos = results[0].photos;
              var image;
              if (!photos) {
                  image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
              }
              else {
                image = photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35});
              }
              var marker = new google.maps.Marker({
              map: resultsMap,
              position: pyrmont,
              icon: image
              });
              // Add an event listener to display the infowindow for the address
              // when marker on it is clicked
              myviewModel.currentMarker = marker;
              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent('<h1>' + place.name + '</h1>');
                  infowindow.open(map, this);
              });
              // Issue a text Search to find related places in the given address
              // as per the search query. The reslts are updated
              // in the callback function
              service.textSearch({
                location: results[0].geometry.location,
                radius: '500',
                query: myviewModel.findType
              }, callback);
        }
        else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//
// Call back function for the Google API Text Search
// Place results are obtained in the results parameter
// Status of the Text Search updated in status parameter
// Paremeter:
// results [out] Results data list
// status [out] Status of callback
function callback(results, status) {
    // If the reslist array is not empty, empty it.
    // We need to update it with fresh data for the new place entered.
    if(reslist)
    {
       reslist = [];
       reslist.length=0;
    }
    //
    // Update the reslist array with the newly obtained results
    //
    reslist = results;

    //Iterate through the results to extract information about each place
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            // Create marker for the place
            reslist[i].mark = createMarker(results[i]);
            var url;
            var photos = results[i].photos;
            if (!photos) {
              reslist[i].url = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
            }
            else
            {
              reslist[i].url = photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50});
            }

            //Get the rating of place. If not found set it to NR
            if(!results[i].rating) {
              reslist[i].rating = "NR";
            }
            else {
              reslist[i].rating = results[i].rating;
            }

            //Get the Open Now field of the place
            if(results[i].opening_hours) {
              if(results[i].opening_hours.open_now === true) {
                reslist[i].open = "Open Now: Yes";
              }
              else
              {
                reslist[i].open = "Open Now: No";
              }

            }
            else {
                reslist[i].open = "Open Now: --"
            }

        }
    }
    else {
            alert('Google Places Service was not successful for the following reason: ' + status);
    }
    //Update the View Model's resultList array as per teh reslist
    myviewModel.computeresultList(reslist);
}

//
// Function to display info window when
// a place is clicked from side navigation list
// Parameter:
// place [in] Place object
function displayinfowindow(place) {

    // Set the content of info window
    content = "<span class='label label-primary'>" + place.rating + "</span>";
    content += " ";
    content += "<span class='glyphicon glyphicon-star' aria-hidden='true'></span>";
    content += "<h4 style='display:inline;'>" + " " + place.name + "</h4>";
    content += "<img src='" + place.url + "' class='pull-right' alt='displayphoto'>";
    content += "<h6>" + place.formatted_address + "</h6>";
    content += "<h6>" + place.open + "</h6>";

    // In the infowindow, find additional details about the place such as
    // phone number and review to be displayed only in infowindow
    // using Googlr Places Service API
    service.getDetails({
      placeId: place.place_id
      }, function(pl, st, marker) {
         if (st === google.maps.places.PlacesServiceStatus.OK) {
              content += "<img src='img/phone.png' alt='phoneimage'>";
              if(pl.formatted_phone_number) {
                    content += "<h6 style='display:inline;'>" + " " + pl.formatted_phone_number + "</h6>";
              }
              else {
                    content += "<h6 style='display:inline;'>" + "--" + "</h6>";
              }
              if(pl.reviews) {
                    content += "<p>" + '"' + pl.reviews[0].text + '"' + "</p>";
              }

          }
          else
          {
              content += "<img src='img/phone.png' alt='phoneimage'>";
              content += "<h6 style='display:inline;'>" + "--" + "</h6>";
          }
          // Additional information such as Website Url of the
          // place displayed only in infowindow
          // that is fetched using Ajax request from Third Party API such as FourSquare
          url = "https://api.foursquare.com/v2/venues/search";
          url += '?' + $.param({
                       'v': "20131016",
                       'near': myviewModel.findPlace,
                       'query': pl.name + " " + myviewModel.findType,
                       'client_id': cli_id,
                       'client_secret': cli_sec
                       });
          $.ajax({
                    url: url,
                    method: 'GET',
                    dataType: "json"
          }).done(function(data) {
                    console.log(data);
                    if(data.response.venues.length!=0) {
                         if(data.response.venues[0].url)
                          content += "<h6>Website: " + data.response.venues[0].url + "</h6>";
                        else
                          content += "<h6>Website: --</h6>"
                    }
                    else {
                       content += "<h6>Website: --</h6>";
                    }

                    //Set the content of infowindow
                    infowindow.setContent(content);

          }).fail(function(e) {
                    console.log(e);
                    content += "<h6>Website: --</h6>";
                    infowindow.setContent(content);
                    throw(e);
          });
                //infowindow.setContent(content);

    });

      //Open the infowindow at the marker's place
    infowindow.open(map, place.mark);
}

//
// Function to create marker on the map given a place
// Parameter
// place [in] Place object
function createMarker(place) {
    // Create the marker on the map in the given place's Lat and Lng
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP
    });

    // Add a click event listener to the marker to
    // display the infowindow when clicked
    google.maps.event.addListener(marker, 'click', function() {
      bounceCurrentMarker(place);
      displayinfowindow(place);
      map.setZoom(18);
      map.setCenter(marker.getPosition());
    });
    return marker;
}

//
// Function to bounce the marker on the map given a place
// Parameter
// place [in] Place object
function bounceCurrentMarker(place) {
    //Bounce the marker of clicked place and stop bouncing the previously
    //clicked marker
    if(myviewModel.currentMarker)
        myviewModel.currentMarker.setAnimation(null);

      myviewModel.currentMarker = place.mark;
      if (place.mark.getAnimation() !== null) {
          place.mark.setAnimation(null);
      } else {
          place.mark.setAnimation(google.maps.Animation.BOUNCE);
      }
}

//
// Function to handle error of calling initMap function
// when loading Google Map
// setTimeout(function() { if(map == null){alert("Hello");} }, 3000);

function initMapError() {
  alert("Unable to load the Google map. Please try again later.");
}
