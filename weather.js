//get temp from location selectors
const btn = document.querySelector(".btn");
const img = document.querySelector(".img");
const p_c = document.querySelector(".w_c");
const p_s = document.querySelector(".w_s");
const p_t = document.querySelector(".w_t");
const p_temp = document.querySelector(".w_temp");
const fbtn = document.querySelector("#fbtn");
const Wicon = document.querySelector("#Wicon");
//API Keys
const apiKey = "2b035229e8834c73b29ca4a714946885";
const wetherKey = "8366237814cd4072a7e201444221901";
const openMapApi = "49fd6f61e2b89421e0c3b527bc26efd6";

//get temp from input selectors
const ibtn = document.querySelector("#btn1");
const ibtn2 = document.querySelector("#btn2");

//temp from location code START
var tempinc = true;
btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    btn.innerHTML = "Your Browser doesent support";
  }
});

function onSuccess(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let allDetails = result.results[0].components;
      let state = allDetails.city;
      let code = allDetails.postcode;
      btn.innerHTML = state + "," + code;
      const wetherUrl = `https://api.weatherapi.com/v1/current.json?q=${state}&key=${wetherKey}`;
      fetch(wetherUrl)
        .then((response) => response.json())
        .then((result) => {
          p_c.innerHTML = result.location.name;
          p_s.innerHTML = result.location.region + ", " + result.location.country; 
          Wicon.src = result.current.condition.icon;
          Wicon.style.visibility = "visible";
          p_t.innerHTML = result.current.condition.text;
          p_temp.innerHTML = result.current.temp_c + "°C";
          fbtn.style.visibility = "visible";
          fbtn.addEventListener("click", () => {
            tempinc = !tempinc;
            if (tempinc) {
              fbtn.innerHTML = "temperature in Fahrenheit";
              p_temp.innerHTML = result.current.temp_c + "°C";
            } else {
              fbtn.innerHTML = "temperature in Celsuis";
              p_temp.innerHTML = result.current.temp_f + "°F";
            }
          });
        });
    });
}

function onError(error) {
  if (error.code == 1) {
    btn.innerHTML = "You need to allow to get the location";
  } else if (error.code == 2) {
    btn.innerHTML = "location not available";
  } else {
    btn.innerHTML = "something went wrong";
  }
}
//temp from location code END

//search section
ibtn.addEventListener("click", () => {
  //get temp from input selectors
  const input = document.querySelector("#city").value;
  const icon = document.querySelector("#icon");
  const info = document.querySelector("#info");
  document.querySelector("#output").style.visibility = "visible";
  if (input) {
    const inputURL = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${openMapApi}`;
    fetch(inputURL)
      .then((response) => response.json())
      .then((result) => {
        const inpTempC = (result.main.temp - 273.15).toFixed(1) + "°C";
        const inpTempf = ((result.main.temp * 9) / 5 - 459.67).toFixed(1) + "°F";
        const cityName = result.name;
        const tempType = result.weather[0].main;
        var inpTempinC = true;
        var line = cityName + ", " + tempType + "  " + inpTempC;
        info.innerHTML = line;
        const icon2 = result.weather[0].icon;
        const iconImg = "http://openweathermap.org/img/wn/" + icon2 + "@2x.png";
        icon.src = iconImg
        ibtn2.addEventListener("click", () => {
          inpTempinC = !inpTempinC
          if(inpTempinC){
            line = cityName + ", " + tempType + "  " + inpTempC;
            info.innerHTML = line
        }else{
            line = cityName + ", " + tempType + "  " + inpTempf;
            info.innerHTML = line
          }
        })
      })
      .catch((err) => {
        info.innerHTML = "Please Enter a valid <b>CITY</b> name";
        icon.src = "error2.png";
      })
    } else {
      icon.src = "error.png";
      info.innerHTML = "You need to Enter Something the <b>INPUT BOX</b>";
    }
  })