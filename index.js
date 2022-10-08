const API_KEY = "c6c699b887b177ad49cf408e327724ba";

const currentWeatherAPI = async () => {
    let city = "delhi";
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return reponse.json();
}

const getIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

// const formatTemperature = (temp) => `${temp.toFixed(1)}°C`;

const getDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = new Date();
    return today.toLocaleDateString("en-US", options);
}

const loadCurrentForecast = ({name, main: {temp }, weather: [{description, icon}], sys: {country}}) => {
    const currentWeatherContainer = document.querySelector("#current-forecast");

    let iconURL = currentWeatherContainer.querySelector(".current-forecast-icon");
    iconURL.setAttribute("src", getIconUrl(icon));
    currentWeatherContainer.querySelector(".current-temp").innerHTML = `${temp.toFixed(1)}<span class="temp-unit">°C</span>`;
    currentWeatherContainer.querySelector(".description").textContent = description;
    currentWeatherContainer.querySelector(".day-and-date").innerHTML = `<p><span class="today">Today</span>•<span class="date">${getDate()}</span></p>`;
    currentWeatherContainer.querySelector(".location").innerHTML = `<i class="fa-solid fa-location-dot location-pin"></i> ${name}, ${country}`;
}

const loadTodayHighlight = ({main: {pressure, humidity, feels_like}, wind: {speed}, visibility }) => {
    const todayHighlight = document.querySelector("#today-highlight");
    todayHighlight.querySelector(".wind-status h1").innerHTML = `${(Math.floor(speed))*1.6}<span class="wind-unit">kmph</span>`;
    todayHighlight.querySelector(".humidity h1").innerHTML = `${humidity}<span class="percent">%</span>`;
    todayHighlight.querySelector(".feels-like h1").innerHTML = `${feels_like.toFixed(1)}<span class="feels-like-unit">°C</span>`;
    todayHighlight.querySelector(".visibility h1").innerHTML = `${visibility}<span class="meter">m</span>`;
    todayHighlight.querySelector(".air-pressure h1").innerHTML = `${pressure}<span class="pressure-unit">mBar</span>`;
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentWeatherAPIResponse = await currentWeatherAPI();
    console.log(currentWeatherAPIResponse);
    loadCurrentForecast(currentWeatherAPIResponse);
    loadTodayHighlight(currentWeatherAPIResponse);
});
