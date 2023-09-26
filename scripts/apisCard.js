
async function getWeather(city) {
    const accessKey = '1b8ea7e355598334980366c7ab323021';
    
    const baseUrl = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${city}`;

    try {
        const response = await fetch(baseUrl);

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Error al obtener el clima. Código de estado: ${response.status}`);
        }

        if (!data.current) {
            throw new Error('Los datos del clima no están disponibles para esta ubicación.');
        }

        console.log(data);

        const { temperature, weather_icons, weather_descriptions } = data.current;
        const cityName = data.location.name;
        

        const weatherData = {
            temperature: temperature,
            icon: weather_icons[0],
            description: weather_descriptions[0],
            city: cityName,
        };

        return weatherData;


    } catch (error) {
        throw new Error(`Error al obtener el clima: ${error.message}`);
    }
}


async function searchWeather() {
    const cityInput = document.getElementById('cityInput').value;
    const countryInput = document.getElementById('countryInput').value;


    if (cityInput && countryInput) {

        const cityToQuery = `${cityInput}, ${countryInput}`;
        console.log(cityToQuery);
        
        try {
            const weatherData = await getWeather(cityToQuery);

            // Muestra los resultados en la pantalla
            const resultadosDiv = document.getElementById('cards');
            resultadosDiv.innerHTML = `
                <h2>${weatherData.city}</h2>
                <p>Temperatura: ${weatherData.temperature}°C</p>
                <p>Descripción: ${weatherData.description}</p>
                <img src="${weatherData.icon}" alt="Ícono del clima">
            `;

        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error('Por favor, ingrese una ciudad y un país.');
    }
}

// Obtiene el botón de búsqueda por su ID
const searchButton = document.getElementById('searchBtn');

// Agrega un event listener para el clic en el botón
searchButton.addEventListener('click', searchWeather);
