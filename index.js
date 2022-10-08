const API_KEY = "c6c699b887b177ad49cf408e327724ba";

const currentWeatherAPI = async () => {
    let city = "delhi";
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    return reponse.json();
}

const getIconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`;

const loadCurrentForecast = ({name, main: {temp}, weather: [{description, icon}]}) => {
    const currentWeatherContainer = document.querySelector("#current-forecast");

    let iconURL = currentWeatherContainer.querySelector(".current-forecast-icon");
    iconURL.setAttribute("src", getIconUrl(icon));
    currentWeatherContainer.querySelector(".current-temp").textContent = temp;
    currentWeatherContainer.querySelector(".description").textContent = description;
    currentWeatherContainer.querySelector(".day-and-date").textContent = "Today";
    currentWeatherContainer.querySelector(".location").textContent = name;

}

document.addEventListener("DOMContentLoaded", async () => {
    const currentWeatherAPIResponse = await currentWeatherAPI();
    console.log(currentWeatherAPIResponse);
    loadCurrentForecast(currentWeatherAPIResponse);
});
