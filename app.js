"use strict";
//There may be a slight difference in values of weather data by getting through getWeatherByCityName and getWeatherByCurrentLocation

/**
 * ? Selecting elements
 */
const searchByCityName = document.querySelector("#searchByCityName");
const searchByCurrentLocation = document.querySelector(
  "#searchByCurrentLocation"
);
const formcontrol = document.querySelector(".form-control");
const errorMsg = document.querySelector("#errorMsg");
const [forecast, details] = document.querySelectorAll(".forecast");
const locationName = document.querySelector("#locationName");
const Temperature = document.querySelector("#Temperature");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const visibility = document.querySelector("#visibility");
const pressure = document.querySelector("#pressure");
const speed = document.querySelector("#speed");
const Weathericon = document.querySelector("#Weathericon");
const [, , locationIcon] = document.querySelectorAll("i");
locationIcon.style.opacity = "0";

/**
 * ? forecast by city name
 */
const getWeatherByCityName = async function (cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b9083480bfbd6d8f828a2177055a6141&units=metric`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      errorMsg.style.opacity = "0";
      const { weather, main, visibility, name, wind } = await response.json();
      const forecast = {
        icon: weather.at(0).icon,
        temp: main.temp,
        description: weather.at(0).main,
        humidity: main.humidity,
        visibility,
        pressure: main.pressure,
        name,
        speed: wind.speed,
      };
      renderData(forecast);
      fetchIcon(forecast.icon);
      unhide();
    }
  } catch (err) {
    if (err.message === `Bad Request`) {
      errorMsg.innerHTML = "Please Provide The Location";
      hide();
    } else if (err.message === `Not Found`) {
      errorMsg.innerHTML = "Location Not Found";
      hide();
    }
  }
};

/**
 * ? adding click event listener on 1st search button
 */
searchByCityName.addEventListener("click", () => {
  getWeatherByCityName(formcontrol.value);
});

/**
 * ? getting weather forecast from clients's location (default)
 */
navigator.geolocation.getCurrentPosition(
  (GeolocationPosition) => {
    const { latitude, longitude } = GeolocationPosition.coords;
    getWeatherByCurrentLocation(latitude, longitude);
  },
  (err) => {
    if (err.code === 2) {
      errorMsg.innerHTML = "Please Check Your Internet Connection";
      hide();
    } else if (err.code === 1) {
      errorMsg.innerHTML = "Please Allow to Access Your Location";
      hide();
    }
  }
);

/**
 * ? getting weather from client location (Default)
 */
const getWeatherByCurrentLocation = async function (latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b9083480bfbd6d8f828a2177055a6141&units=metric`
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      errorMsg.style.opacity = "0";
      const { weather, main, visibility, name, wind } = await response.json();
      const forecast = {
        icon: weather.at(0).icon,
        temp: main.temp,
        description: weather.at(0).main,
        humidity: main.humidity,
        visibility,
        pressure: main.pressure,
        name,
        speed: wind.speed,
      };
      renderData(forecast);
      fetchIcon(forecast.icon);
      unhide();
    }
  } catch (err) {
    if (err.message === `Bad Request`) {
      errorMsg.innerHTML = "Please Provide The Location";
      hide();
    } else if (err.message === `Not Found`) {
      errorMsg.innerHTML = "Location Not Found";
      hide();
    }
  }
};

/**
 * ? adding click event listener on 2nd search button
 */
searchByCurrentLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (GeolocationPosition) => {
      const { latitude, longitude } = GeolocationPosition.coords;
      console.log(latitude, longitude);
      getWeatherByCurrentLocation(latitude, longitude);
    },
    (err) => {
      if (err.code === 2) {
        errorMsg.innerHTML = "Please Check Your Internet Connection";
        hide();
      } else if (err.code === 1) {
        errorMsg.innerHTML = "Please Allow to Access Your Location";
        hide();
      }
    }
  );
  console.log("clicked");
});

/**
 * ? fetching icon from the api
 */
const fetchIcon = function (icon) {
  const response = fetch(`https://openweathermap.org/img/wn/${icon}@2x.png`);
  if (response) {
    Weathericon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${icon}@2x.png`
    );
  }
};

/**
 *  ? rendering the page after getting data from api
 */
const renderData = function (forecast) {
  locationName.innerHTML = forecast.name;
  Temperature.innerHTML = `${forecast.temp.toFixed(0)}°C`;
  description.innerHTML = forecast.description;
  humidity.innerHTML = `Humidity: ${forecast.humidity}%`;
  visibility.innerHTML = `Visibility: ${forecast.visibility / 1000}km`;
  pressure.innerHTML = `Pressure: ${forecast.pressure}hPa`;
  speed.innerHTML = `Wind speed: ${forecast.speed}m/s NE`;
};

/**
 * ? hiding forecast incase of errors
 */
const hide = function () {
  forecast.style.opacity = "0";
  details.style.opacity = "0";
  errorMsg.style.opacity = "1";
  locationIcon.style.opacity = "0";
};

/**
 * ? unhiding forecast 
 */
const unhide = function () {
  forecast.style.opacity = "1";
  details.style.opacity = "1";
  locationIcon.style.opacity = "1";
};

