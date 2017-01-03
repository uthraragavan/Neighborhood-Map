 <!-- // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // -->
var drawer = document.querySelector('#drawer');
var map;
var infowindow;
var pos;
var pyrmont = {lat: -33.867, lng: 151.195};
var geocoder;
var service;
var reslist;
var content;
var menu = document.querySelector('#menu');
      var main = document.querySelector('.main');
      var drawer = document.querySelector('#drawer');

      menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();
      });
      main.addEventListener('click', function() {
        drawer.classList.remove('open');
      });

function AppViewModel() {
    var self = this;

    this.findType = "Restaurants";
    this.findPlace = "Manhattan, NY";
    this.resultList = ko.observableArray([]);
    this.weatherdata = ko.observable({"temp":"--ºF","weather":"No Weather Data","weatherurl":"","humidity":"--%"});
    // this.weatherdata = ko.computed(this.getWeather,this);
    this.getWeather = function() {

    $.ajax({
          url: "http://api.wunderground.com/api/ef5a156e62f050d2/conditions/q/" +
          self.findPlace + ".json",
          dataType: "json",
          success: function(data) {
              var t = {"temp":"--ºF","weather":"No Weather Data","weatherurl":"","humidity":"--%"};
              if(data.current_observation)
              {
                t.temp=data.current_observation.temp_f + "ºF";
                t.weather=data.current_observation.weather;
                t.weatherurl=data.current_observation.icon_url;
                t.humidity = data.current_observation.relative_humidity;
              }

              self.weatherdata(t);
              // console.log(data);
          // data.temp = url.current_observation.temp_f;
          // data.weather = url.current_observation.weather;
          // data.weatherurl = url.current_observation.icon_url;
          // // $(".conditions").html("Current temperature in " + location + " is: " + temp_f + "ºF");
          // return data;
          }
        });

    };
    this.getWeather();

    this.computeresultList = function(r) {

      for(var i=0;i<r.length;i++)
      {
        this.resultList.push(r[i]);
      }
    };
    this.linkClick = function(i) {
      console.log(self.resultList()[i]);

      displayinfowindow(self.resultList()[i]);

      // infowindow.setContent('<p>'+name+'<p>');

      // infowindow.open(map, mark);

    };
    this.submitQuery = function() {
      if(this.resultList())
      {

          this.resultList([]);

      }
      initMap();
      this.getWeather();

    };

}

// Activates knockout.js
var myviewModel = new AppViewModel();
ko.applyBindings(myviewModel);






function initMap() {


    map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 16
    });
    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);

}




    function displayinfowindow(place) {
          content = "<span class='label label-primary'>" + place.rating + "</span>";
          content += " ";
          content += "<span class='glyphicon glyphicon-star' aria-hidden='true'></span>";
          content += "<h4 style='display:inline;'>" + " " + place.name + "</h4>";
          content += "<img src='" + place.url + "' class='pull-right' alt='displayphoto'>";
          content += "<h6>" + place.formatted_address + "</h6>";
          content += "<h6>" + place.open + "</h6>";
          service.getDetails({
            placeId: place.place_id
            }, function(pl, st, marker) {
                  if (st === google.maps.places.PlacesServiceStatus.OK) {
                  // console.log(pl);
                  content += "<img src='img/phone.png' alt='phoneimage'>";
                  if(pl.formatted_phone_number) {
                    content += "<h6 style='display:inline;'>" + " " + pl.formatted_phone_number + "</h6>";
                  }
                  else {
                    content += "<p>" + "Not available" + "</p>";
                  }
                  if(pl.reviews) {
                      content += "<p>" + '"' + pl.reviews[0].text + '"' + "</p>";
                  }

              }
              infowindow.setContent(content);

              });
          infowindow.open(map, place.mark);
    }


    function callback(results, status) {
      // reslist = [{'Name':'Uthra','Age':25},{'Name':'Balaji','Age':28}];
      if(reslist)
      {
       reslist = [];
       reslist.length=0;
      }
      reslist = results;

      if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
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
            if(!results[i].rating) {
              reslist[i].rating = "NR";
            }
            else {
              reslist[i].rating = results[i].rating;
            }
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

      myviewModel.computeresultList(reslist);
    }

    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        // service.getDetails({
        //     placeId: place.place_id
        //     }, function(pl,st) {
        //           if (st === google.maps.places.PlacesServiceStatus.OK) {

        //               console.log(marker);
        //             // placelist.phone=pl.formatted_phone_number;
        //             // placelist.review=pl.reviews[0].text;
        //             // placelist.address=pl.formatted_address;

        //         }
        //       });
        google.maps.event.addListener(marker, 'click', function() {
          content = "<span class='label label-primary'>" + place.rating + "</span>";
          content += " ";
          content += "<span class='glyphicon glyphicon-star' aria-hidden='true'></span>";
          content += "<h4 style='display:inline;'>" + " " + place.name + "</h4>";
          content += "<img src='" + place.url + "' class='pull-right' alt='displayphoto'>";
          content += "<h6>" + place.formatted_address + "</h6>";
          content += "<h6>" + place.open + "</h6>";

          service.getDetails({
            placeId: place.place_id
            }, function(pl, st, marker) {
                  if (st === google.maps.places.PlacesServiceStatus.OK) {
                  content += "<img src='img/phone.png' alt='phoneimage'>";
                  if(pl.formatted_phone_number) {
                    content += "<h6 style='display:inline;'>" + " " + pl.formatted_phone_number + "</h6>";
                  }
                  else {
                    content += "<p>" + "Not available" + "</p>";
                  }
                  if(pl.reviews[0]) {
                      content += "<p>" + '"' + pl.reviews[0].text + '"' + "</p>";
                  }


              }
              infowindow.setContent(content);

              });
          infowindow.open(map, marker);

        });
        return marker;
        //return marker;
    }
    function geocodeAddress(geocoder, resultsMap) {
        var address = myviewModel.findPlace;
        var ret;

        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
             // alert(results[0].geometry.location);
             // pyrmont.lat=results[0].geometry.location.lat;
             // pyrmont.lng=results[0].geometry.location.lng;
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
              google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent('<h1>' + place.name + '</h1>');
                  infowindow.open(map, this);
              });
               service.textSearch({
                location: results[0].geometry.location,
                radius: '500',
                query: myviewModel.findType
                }, callback);



          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }

