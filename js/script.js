function AppViewModel(){var e=this;this.findType="Restaurants",this.findPlace="Manhattan, NY",this.resultList=ko.observableArray([]),this.weatherdata=ko.observable({temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"}),this.getWeather=function(){url="http://api.wunderground.com/api/ef5a156e62f050d2/conditions/q/"+e.findPlace+".json",$.ajax({url:url,method:"GET",dataType:"json"}).done(function(t){var n={temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"};t.current_observation&&(n.temp=t.current_observation.temp_f+"ºF",n.weather=t.current_observation.weather,n.weatherurl=t.current_observation.icon_url,console.log(n.weatherurl),n.humidity=t.current_observation.relative_humidity),e.weatherdata(n)}).fail(function(t){var n={temp:"--ºF",weather:"No Weather Data",weatherurl:"",humidity:"--%"};throw e.weatherdata(n),console.log(t),t})},this.getWeather(),this.computeresultList=function(e){for(var t=0;t<e.length;t++)this.resultList.push(e[t])},this.linkClick=function(t){console.log(e.resultList()[t]),displayinfowindow(e.resultList()[t])},this.submitQuery=function(){this.resultList()&&this.resultList([]),initMap(),this.getWeather()}}function initMap(){map=new google.maps.Map(document.getElementById("map"),{center:pyrmont,zoom:16}),service=new google.maps.places.PlacesService(map),infowindow=new google.maps.InfoWindow,geocoder=new google.maps.Geocoder,geocodeAddress(geocoder,map)}function geocodeAddress(e,t){var n=myviewModel.findPlace;e.geocode({address:n},function(e,n){if("OK"===n){pyrmont=e[0].geometry.location,t.setCenter(e[0].geometry.location);var o,a=e[0].photos;o=a?a[0].getUrl({maxWidth:35,maxHeight:35}):"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";var i=new google.maps.Marker({map:t,position:pyrmont,icon:o});google.maps.event.addListener(i,"click",function(){infowindow.setContent("<h1>"+place.name+"</h1>"),infowindow.open(map,this)}),service.textSearch({location:e[0].geometry.location,radius:"500",query:myviewModel.findType},callback)}else alert("Geocode was not successful for the following reason: "+n)})}function callback(e,t){if(reslist&&(reslist=[],reslist.length=0),reslist=e,t===google.maps.places.PlacesServiceStatus.OK)for(var n=0;n<e.length;n++){reslist[n].mark=createMarker(e[n]);var o=e[n].photos;o?reslist[n].url=o[0].getUrl({maxWidth:50,maxHeight:50}):reslist[n].url="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",e[n].rating?reslist[n].rating=e[n].rating:reslist[n].rating="NR",e[n].opening_hours?e[n].opening_hours.open_now===!0?reslist[n].open="Open Now: Yes":reslist[n].open="Open Now: No":reslist[n].open="Open Now: --"}myviewModel.computeresultList(reslist)}function displayinfowindow(e){null!==e.mark.getAnimation()?e.mark.setAnimation(null):e.mark.setAnimation(google.maps.Animation.BOUNCE),content="<span class='label label-primary'>"+e.rating+"</span>",content+=" ",content+="<span class='glyphicon glyphicon-star' aria-hidden='true'></span>",content+="<h4 style='display:inline;'> "+e.name+"</h4>",content+="<img src='"+e.url+"' class='pull-right' alt='displayphoto'>",content+="<h6>"+e.formatted_address+"</h6>",content+="<h6>"+e.open+"</h6>",service.getDetails({placeId:e.place_id},function(e,t,n){t===google.maps.places.PlacesServiceStatus.OK&&(content+="<img src='img/phone.png' alt='phoneimage'>",content+=e.formatted_phone_number?"<h6 style='display:inline;'> "+e.formatted_phone_number+"</h6>":"<h6 style='display:inline;'>--</h6>",e.reviews&&(content+='<p>"'+e.reviews[0].text+'"</p>')),url="https://api.foursquare.com/v2/venues/search",url+="?"+$.param({v:"20131016",near:myviewModel.findPlace,query:e.name+" "+myviewModel.findType,client_id:"NEO0GEWJZYJ3LGMYG103A5AJ0L5JME2KRRNERFOMGHVZYP30",client_secret:"J4ZFEQAJMHD3NKNPKAE3WLIRBCSMABBBRRAHKMGNZHWNPEO0"}),$.ajax({url:url,method:"GET",dataType:"json"}).done(function(e){console.log(e),content+=0!=e.response.venues.length&&e.response.venues[0].url?"<h6>Website: "+e.response.venues[0].url+"</h6>":"<h6>Website: --</h6>",infowindow.setContent(content)}).fail(function(e){throw console.log(e),content+="<h6>Website: --</h6>",infowindow.setContent(content),e})}),infowindow.open(map,e.mark)}function createMarker(e){var t=(e.geometry.location,new google.maps.Marker({map:map,position:e.geometry.location,animation:google.maps.Animation.DROP}));return google.maps.event.addListener(t,"click",function(){displayinfowindow(e)}),t}var drawer=document.querySelector("#drawer"),map,infowindow,pos,pyrmont={lat:-33.867,lng:151.195},geocoder,service,reslist,content,menu=document.querySelector("#menu"),main=document.querySelector(".main"),drawer=document.querySelector("#drawer");menu.addEventListener("click",function(e){drawer.classList.toggle("open"),e.stopPropagation()}),main.addEventListener("click",function(){drawer.classList.remove("open")});var myviewModel=new AppViewModel;ko.applyBindings(myviewModel);