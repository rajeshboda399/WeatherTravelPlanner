const apiKey = "2e697bc0e1fbb9cb18ddab3adf0c9812"; // Your OpenWeatherMap API Key

// Initialize the map
const map = L.map('map').setView([10.7900, 78.7040], 10); // Default view for Tiruchirappalli

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to fetch and filter weather data based on user input
async function fetchAndFilterCities(cityName, minTemp, maxTemp, weatherCondition) {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        // Extract temperature and weather condition
        const cityTemp = data.main.temp;
        const cityWeather = data.weather[0].main.toLowerCase(); // e.g., "clear", "rain"

        // Filter by temperature and weather condition
        if (cityTemp >= minTemp && cityTemp <= maxTemp && cityWeather.includes(weatherCondition)) {
            // Return matching city data
            return {
                name: cityName,
                weather: cityWeather,
                temperature: cityTemp,
                lat: data.coord.lat,
                lon: data.coord.lon
            };
        }
        return null; // No match
    } catch (error) {
        console.error("Error fetching and filtering cities:", error);
    }
}

// Function to add city to the map with a marker
function addCityToMap(lat, lon, cityName, weather, temperature) {
    L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${cityName}</b><br>Weather: ${weather}<br>Temp: ${temperature}°C`)
        .openPopup();
}

// Function to fetch weather for Tiruchirappalli based on user input
async function fetchWeatherData() {
    // Get values from the user input form
    const minTemp = parseInt(document.getElementById("minTemp").value);
    const maxTemp = parseInt(document.getElementById("maxTemp").value);
    const weatherCondition = document.getElementById("weatherCondition").value;

    const cityName = "Tiruchirappalli";

    // Fetch and filter weather data for the city
    const city = await fetchAndFilterCities(cityName, minTemp, maxTemp, weatherCondition);

    // Clear previous map markers and results
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    document.getElementById("destinationList").innerHTML = "";

    // If a city matches the preferences, display it
    if (city) {
        const listContainer = document.getElementById("destinationList");
        listContainer.innerHTML = `<h3>Matching City: ${city.name}</h3>
                                   <p>Weather: ${city.weather}</p>
                                   <p>Temperature: ${city.temperature}°C</p>`;
        
        // Add marker to the map for the matching city
        addCityToMap(city.lat, city.lon, city.name, city.weather, city.temperature);
    } else {
        // If no city matches, display a message
        document.getElementById("destinationList").innerHTML = "No matching cities found.";
    }
}
