const appid = 'AvFr3pJ3GUYKrMBMnYAj';
const appcode = 'hWwzAgkdb1O9H_pNzeMY5g';
const weatherkey = 'fe4f3e8b7f8944229853f91c733c42c7';
const proxy = `https://cors-anywhere.herokuapp.com/`;
var latitude;
var longitude;
var city = document.getElementById('city');
var temprature = document.getElementById('temprature');
var iconq = document.getElementById('icon');
var dt = document.getElementById('date');
var humidity = document.getElementById('humidity');
var pressure = document.getElementById('pressure');
var summary = document.getElementById('summary');
var windSpeed = document.getElementById('windspeed');
var weekday,weekicon,weektemp;
/*
var precipIntensity = document.getElementById('precipintensity');
*/
var temp;
var change = true;
var current = new Date();
var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
var day = daylist[current.getDay()];
var currentTime = new Date(),
hours = currentTime.getHours();
minutes = currentTime.getMinutes();
if (minutes < 10) {
 minutes = "0" + minutes;
}
var suffix = "AM";
if (hours >= 12) {
suffix = "PM";
hours = hours - 12;
}
if (hours == 0) {
 hours = 12;
}
var searchtxt = document.getElementById('search-txt');
searchButton = document.getElementById('search-btn');
searchtxt.addEventListener("keyup", enterPressed);
searchButton.addEventListener("click", findlatlng);
function enterPressed(event) {
  if (event.key === "Enter") {
    findlatlng();
  }
}
function changetof(){
    if(change == true){
    var t = parseInt(temp);
    temp = (t * 9/5) + 32;
    temp = Math.round(temp);
    temprature.innerHTML = '<h3>' + temp +'<a onclick="changetof()">&deg;F</a> | <a onclick="changetoc()" style="color:#17a2b8">&deg;C</a>'+ '</h3>';
    change = false;
    }
}
function changetoc(){
    if(change == false){
    var t = parseInt(temp);
    temp = (t - 32) * 5/9;
    temp = Math.round(temp);
    temprature.innerHTML =  temp +'<a onclick="changetoc()">&deg;C</a> | <a onclick="changetof()" style="color:#17a2b8">&deg;F</a>';
    change = true;
    }
}
function findlatlng(){
    change = true;
    var searchLink = 'https://geocoder.api.here.com/6.2/geocode.json?searchtext='+searchtxt.value+'&app_id='+appid+'&app_code='+appcode+'&gen=9';
    httpRequestAsync(searchLink, thelatlngResponse);
}
function findweather(){
    var weatherLink = proxy+'https://api.darksky.net/forecast/'+weatherkey+'/'+latitude+','+longitude+'?units=si';
    httpRequestAsync(weatherLink, theweatherResponse);
}
function theweatherResponse(response){
    let weatherobject = JSON.parse(response);
    displayweatherdetails(weatherobject);
}

function displayweatherdetails(weatherobject){
    dt.innerHTML = '<h4>'+day.charAt(0).toUpperCase() + day.slice(1)+", "+hours + ":" + minutes + " " + suffix+'</h4>';
    temp = Math.round(weatherobject.currently.temperature);
    temprature.innerHTML = '<h3>' + temp +'<a onclick="changetoc()">&deg;C</a> | <a onclick="changetof()" style="color:#17a2b8">&deg;F</a>'+ '</h3>';
    pressure.innerHTML ='<h5>'+"Pressure: "+ weatherobject.currently.pressure+" hPa"+'</h5>';
    var humid = weatherobject.currently.humidity;
    humidity.innerHTML = '<h5>'+"Humidity: "+ parseInt(humid*100) + " %"+'</h5>';
    var stringsummary = weatherobject.currently.summary
    summary.innerHTML = '<h6>'+stringsummary.charAt(0).toUpperCase() + stringsummary.slice(1)+'</h6>';
    windSpeed.innerHTML = '<h5>'+"WindSpeed: "+ parseInt((weatherobject.currently.windGust)*1.852)+" Km/h"+'</h5>';
    seticon(weatherobject.currently.icon,iconq);
    displayweekweather(weatherobject);
    precipIntensity.innerHTML = '<h5>'+"Precipitation: "+ Math.round(weatherobject.currently.precipIntensity)+" %"+'</h5>';
}

function displayweekweather(weatherobject){
    var thisday,thistemp,thisicon;
    var ddd = current.getDay()+1;
    var k=1,i=ddd;
    do{
        if(i==7){
            i=0;
        }
        weekday = document.getElementById("weekday"+k);
        weekicon = document.getElementById("icon"+k);
        weektemp = document.getElementById("weektemp"+k);
        thisday = daylist[i] ;
        thisicon = weatherobject.daily.data[k].icon;
        thistemp = (weatherobject.daily.data[k].temperatureMax + weatherobject.daily.data[k].temperatureMin)/2;
        seticon(thisicon,weekicon);
        weekday.innerHTML = '<h4>'+thisday.slice(0,3).toUpperCase()+'</h4>';
        weektemp.innerHTML = '<h4>'+Math.round(thistemp)+'&degC'+'</h4>';
        k++;
        i++;
    }while(i!=ddd)
}

function seticon(icon,iconid){
    const skycons= new Skycons({color:"#F4D03F"});
    const currenticon = icon.replace(/-/g,"_").toUpperCase();
    skycons.add(iconid, Skycons[currenticon]);
    skycons.play();
}


function thelatlngResponse(response) {
    let jsonObject = JSON.parse(response);
    var postalcode = jsonObject.Response.View[0].Result[0].Location.Address.PostalCode;
    if(postalcode === "undefined"){
        postalcode = " ";
    }
    city.innerHTML = '<h1>'+jsonObject.Response.View[0].Result[0].Location.Address.Label+"-"+postalcode+'</h1>';
    latitude = jsonObject.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
    longitude = jsonObject.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
    findweather();
}
function httpRequestAsync(url, callback)
{
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true); // true for asynchronous 
    httpRequest.send();
}