"use strict";
const mapContainer = document.querySelector(".app__map");
const inputIP = document.querySelector(".app__input--text");
const submitBtn = document.querySelector(".app__input--submit");
const title = document.querySelector(".app__title");
let map;
const ipAddress = document.querySelector(".ip-address");
const ipLocation = document.querySelector(".ip-location");
const timezone = document.querySelector(".timezone");
const isp = document.querySelector(".isp");

// Rendering Map
const renderMap = function (latitude, longitude) {
  map = L.map("map").setView([latitude, longitude], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
};
// Set map
const setMap = function (lat, lng) {
  map.setView([lat, lng], 12);
};
// Rendering Marker on Map
const showMarkerOnMap = function (latitude, longitude, content) {
  // Set ICON
  const myIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [30, 40],
  });
  //   Add Marker
  L.marker([latitude, longitude], {
    icon: myIcon,
    riseOnHover: true,
    riseOffset: 200,
  })
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 500,
        autoClose: false,
        className: `popup`,
        closeButton: false,
      }).setContent(content)
    )
    .openPopup();
};

// ?App Class
class App {
  constructor() {
    this._loadLocation();
    submitBtn.addEventListener("click", this._getIP.bind(this));
  }
  //   Loading location
  _loadLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          console.log(pos);
          const { latitude: lat, longitude: lng } = pos.coords;
          console.log(lat, lng);
          //   this._renderMap(lat, lng);
          renderMap(lat, lng);
          showMarkerOnMap(lat, lng, "You are here");
          //   this._renderMarkerOnMap(lat, lng, "You are here");
        },
        function () {
          console.error(`Couldn't fetch location`);
        }
      );
    }
  }
  // rendering IP Details
  _renderIPDetails(ipData) {
    ipAddress.innerHTML = `${ipData.ip}`;
    ipLocation.innerHTML = `${ipData.location.city}, ${ipData.location.country}`;
    timezone.innerHTML = `UTC ${ipData.location.timezone}`;
    isp.innerHTML = `${ipData.isp}`;
  }

  //   Getting IP From API
  async _getIP(e) {
    e.preventDefault();
    try {
      const ipadd = inputIP.value;

      const res = await fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_Zs7fJFMsFkJiE9qAfZtQ9A6gpeGl5&ipAddress=${ipadd}`
      );
      if (!res.ok) throw new Error(`IP Address not found (${res.status})`);
      // console.log(res);
      //   mapContainer.innerHTML = "";
      const data = await res.json();
      // console.log(data);
      this._renderIPDetails(data);
      const { lat, lng } = data.location;
      setMap(lat, lng);
      showMarkerOnMap(lat, lng, data.ip);
      inputIP.value = "";
      inputIP.blur();
    } catch (err) {
      console.error(err.message);
      alert(`${err.message}. Try Again`);
    }
  }
}

const ipApp = new App();
