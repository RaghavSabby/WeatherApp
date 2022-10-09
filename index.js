const API_KEY = "c6c699b887b177ad49cf408e327724ba";

const DAYS_OF_THE_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const currentWeatherAPI = async () => {
    let city = "delhi";
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    return reponse.json();
}

const dayWiseWeatherAPI = async () => {
    let city = "delhi";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    return data.list.map((forecast) => {
        const {main: {temp_max, temp_min}, dt_txt, weather: [{icon}]} = forecast;
        return {temp_max, temp_min, dt_txt, icon};
    });
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
    currentWeatherContainer.querySelector(".current-temp").innerHTML = `${Math.floor(temp)}<span class="temp-unit">°C</span>`;
    currentWeatherContainer.querySelector(".description").textContent = description;
    currentWeatherContainer.querySelector(".day-and-date").innerHTML = `<p><span class="today">Today</span>•<span class="date">${getDate()}</span></p>`;
    currentWeatherContainer.querySelector(".location").innerHTML = `<i class="fa-solid fa-location-dot location-pin"></i> ${name}, ${country}`;
}

const calculateDayWiseForecast = (dayWiseWeatherAPI) => {
    let dayWiseForecast = new Map();
    for (let forecast of dayWiseWeatherAPI) {
        const [date] = forecast.dt_txt.split(" ");
        const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];
        if (dayWiseForecast.has(dayOfTheWeek)) {
            let forecastForTheDay = dayWiseForecast.get(dayOfTheWeek);
            forecastForTheDay.push(forecast);
            dayWiseForecast.set(dayOfTheWeek, forecastForTheDay);
        } else {
            dayWiseForecast.set(dayOfTheWeek, [forecast]);
        }
    }
    console.log("OG");
    console.log(dayWiseForecast);
    for (let [key, value] of dayWiseForecast) {
        let temp_max = Math.max(...Array.from(value, val => val.temp_max));
        let temp_min = Math.min(...Array.from(value, val => val.temp_min));
        dayWiseForecast.set(key, { temp_max, temp_min, icon: value.find(v => v.icon).icon })
    }
    console.log("Updated");
    console.log(dayWiseForecast);
    return dayWiseForecast;
}

const loadDayWiseForecast = (dayWiseWeatherAPI) => {
    const dayWiseForecast = calculateDayWiseForecast(dayWiseWeatherAPI);
    const container = document.querySelector("#five-day-forecast");
    let dayWiseInfo = "";
    Array.from(dayWiseForecast).map(([day, { temp_max, temp_min, icon }], index) => {
        dayWiseInfo += `<article class="day-wise-forecast">
                            <h3 class="date">${index===0?"today":day}</h3>
                            <img src="${getIconUrl(icon)}" alt="" class="day-wise-icon">
                            <p class="max-temp">${Math.floor(temp_max)}<span class="temp-unit">°C</span></p>
                            <p class="min-temp">${Math.floor(temp_min)}<span class="temp-unit">°C</span></p>
                        </article>`;
    });
    container.innerHTML = dayWiseInfo;
}

const loadTodayHighlight = ({main: {pressure, humidity, feels_like}, wind: {speed}, visibility }) => {
    const todayHighlight = document.querySelector("#today-highlight");
    todayHighlight.querySelector(".wind-status h1").innerHTML = `${(speed*1.6).toFixed(1)}<span class="wind-unit">kmph</span>`;
    todayHighlight.querySelector(".humidity h1").innerHTML = `${humidity}<span class="percent">%</span>`;
    todayHighlight.querySelector(".feels-like h1").innerHTML = `${Math.floor(feels_like)}<span class="feels-like-unit">°C</span>`;
    todayHighlight.querySelector(".visibility h1").innerHTML = `${visibility}<span class="meter">m</span>`;
    todayHighlight.querySelector(".air-pressure h1").innerHTML = `${pressure}<span class="pressure-unit">mBar</span>`;
}

function barProgress({main: {humidity}}) {
    const bar = document.querySelector(".bar-progress");
    bar.style.width = `${humidity}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
    const currentWeatherAPIResponse = await currentWeatherAPI();
    console.log(currentWeatherAPIResponse);
    loadCurrentForecast(currentWeatherAPIResponse);
    const dayWiseWeatherAPIResponse = await dayWiseWeatherAPI();
    calculateDayWiseForecast(dayWiseWeatherAPIResponse);
    console.log(dayWiseWeatherAPIResponse);
    loadDayWiseForecast(dayWiseWeatherAPIResponse)
    loadTodayHighlight(currentWeatherAPIResponse);
    barProgress(currentWeatherAPIResponse);
});
