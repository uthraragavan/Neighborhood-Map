function stringStartsWith(e,t){return e=e||"",!(t.length>e.length)&&e.substring(0,t.length)===t}function AppViewModel(){var e=this;e.findType="Restaurants",e.findPlace="Manhattan, NY",e.findFilter=ko.observable(""),e.resultList=ko.observableArray([]),e.weatherdata=ko.observable({temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"}),e.currentMarker=ko.observable(""),e.filteredresultList=ko.computed(function(){var t=e.findFilter().toLowerCase();return t?ko.utils.arrayFilter(e.resultList(),function(e){e.mark.setVisible(!0);var n=stringStartsWith(e.name.toLowerCase(),t);return n===!1&&e.mark.setVisible(!1),n}):(e.resultList().forEach(function(e){e.mark.setVisible(!0)}),e.resultList())},e),e.getWeather=function(){url="https://api.wunderground.com/api/ef5a156e62f050d2/conditions/q/"+e.findPlace+".json",$.ajax({url:url,method:"GET",dataType:"json"}).done(function(t){var n={temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"};t.current_observation&&(n.temp=t.current_observation.temp_f+"ºF",n.weather=t.current_observation.weather,n.weatherurl=t.current_observation.icon_url,n.weatherurl=n.weatherurl.replace("http:","https:"),console.log(n.weatherurl),n.humidity=t.current_observation.relative_humidity),e.weatherdata(n)}).fail(function(t){var n={temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"};throw e.weatherdata(n),console.log(t),t})},e.getWeather(),e.computeresultList=function(t){for(var n=0;n<t.length;n++)e.resultList.push(t[n])},e.linkClick=function(t){displayinfowindow(e.filteredresultList()[t])},e.submitQuery=function(){e.resultList()&&e.resultList([]),initMap(),e.getWeather()}}function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:pyrmont,zoom:16}),service=new google.maps.places.PlacesService(map),infowindow=new google.maps.InfoWindow,geocoder=new google.maps.Geocoder,map.addListener("center_changed",function(){window.setTimeout(function(){map.panTo(myviewModel.currentMarker.getPosition())},3e3)}),geocodeAddress(geocoder,map)}function geocodeAddress(e,t){var n=myviewModel.findPlace;e.geocode({address:n},function(e,n){if("OK"===n){pyrmont=e[0].geometry.location,t.setCenter(e[0].geometry.location);var o,r=e[0].photos;o=r?r[0].getUrl({maxWidth:35,maxHeight:35}):"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";var a=new google.maps.Marker({map:t,position:pyrmont,icon:o});myviewModel.currentMarker=a,google.maps.event.addListener(a,"click",function(){infowindow.setContent("<h1>"+place.name+"</h1>"),infowindow.open(map,this)}),service.textSearch({location:e[0].geometry.location,radius:"500",query:myviewModel.findType},callback)}else alert("Geocode was not successful for the following reason: "+n)})}function callback(e,t){if(reslist&&(reslist=[],reslist.length=0),reslist=e,t===google.maps.places.PlacesServiceStatus.OK)for(var n=0;n<e.length;n++){reslist[n].mark=createMarker(e[n]);var o=e[n].photos;o?reslist[n].url=o[0].getUrl({maxWidth:50,maxHeight:50}):reslist[n].url="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",e[n].rating?reslist[n].rating=e[n].rating:reslist[n].rating="NR",e[n].opening_hours?e[n].opening_hours.open_now===!0?reslist[n].open="Open Now: Yes":reslist[n].open="Open Now: No":reslist[n].open="Open Now: --"}else alert("Google Places Service was not successful for the following reason: "+t);myviewModel.computeresultList(reslist)}function displayinfowindow(e){content="<span class='label label-primary'>"+e.rating+"</span>",content+=" ",content+="<span class='glyphicon glyphicon-star' aria-hidden='true'></span>",content+="<h4 style='display:inline;'> "+e.name+"</h4>",content+="<img src='"+e.url+"' class='pull-right' alt='displayphoto'>",content+="<h6>"+e.formatted_address+"</h6>",content+="<h6>"+e.open+"</h6>",service.getDetails({placeId:e.place_id},function(e,t,n){t===google.maps.places.PlacesServiceStatus.OK?(content+="<img src='img/phone.png' alt='phoneimage'>",content+=e.formatted_phone_number?"<h6 style='display:inline;'> "+e.formatted_phone_number+"</h6>":"<h6 style='display:inline;'>--</h6>",e.reviews&&(content+='<p>"'+e.reviews[0].text+'"</p>')):(content+="<img src='img/phone.png' alt='phoneimage'>",content+="<h6 style='display:inline;'>--</h6>"),url="https://api.foursquare.com/v2/venues/search",url+="?"+$.param({v:"20131016",near:myviewModel.findPlace,query:e.name+" "+myviewModel.findType,client_id:cli_id,client_secret:cli_sec}),$.ajax({url:url,method:"GET",dataType:"json"}).done(function(e){console.log(e),content+=0!=e.response.venues.length&&e.response.venues[0].url?"<h6>Website: "+e.response.venues[0].url+"</h6>":"<h6>Website: --</h6>",infowindow.setContent(content)}).fail(function(e){throw console.log(e),content+="<h6>Website: --</h6>",infowindow.setContent(content),e})}),infowindow.open(map,e.mark)}function createMarker(e){var t=(e.geometry.location,new google.maps.Marker({map:map,position:e.geometry.location,animation:google.maps.Animation.DROP}));return google.maps.event.addListener(t,"click",function(){bounceCurrentMarker(e),displayinfowindow(e),map.setZoom(18),map.setCenter(t.getPosition())}),t}function bounceCurrentMarker(e){myviewModel.currentMarker&&myviewModel.currentMarker.setAnimation(null),myviewModel.currentMarker=e.mark,null!==e.mark.getAnimation()?e.mark.setAnimation(null):e.mark.setAnimation(google.maps.Animation.BOUNCE)}function initMapError(){alert("Unable to load the Google map. Please try again later.")}var drawer=document.querySelector("#drawer"),map=null,infowindow,pos,pyrmont={lat:-33.867,lng:151.195},geocoder,service,reslist,content,cli_id="NEO0GEWJZYJ3LGMYG103A5AJ0L5JME2KRRNERFOMGHVZYP30",cli_sec="J4ZFEQAJMHD3NKNPKAE3WLIRBCSMABBBRRAHKMGNZHWNPEO0",menu=document.querySelector("#menu"),main=document.querySelector(".main"),drawer=document.querySelector("#drawer");menu.addEventListener("click",function(e){drawer.classList.toggle("open"),e.stopPropagation()}),main.addEventListener("click",function(){drawer.classList.remove("open")});var myviewModel=new AppViewModel;ko.applyBindings(myviewModel);