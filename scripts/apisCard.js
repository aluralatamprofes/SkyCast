const accessKey = '1b8ea7e355598334980366c7ab323021';

async function getWeather(city) {
    const baseUrl = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${city}`;

    try {
        const response = await fetch(baseUrl);

        if (!response.ok) {
        throw new Error(`Error al obtener el clima. Código de estado: ${response.status}`);
        }

        const data = await response.json();
        
        // if (!data.current) {
        //     throw new Error('Los datos del clima no están disponibles para esta ubicación.');
        // }

        console.log(data);
        // const { temperature, weather_icons, weather_descriptions } = data.current;
        
        // const cityName = data.location.name;

        // const weatherData = {
        //     temperature: temperature,
        //     icon: weather_icons[0],
        //     description: weather_descriptions[0],
        //     city: cityName,
        // };

        // return weatherData;

    } catch (error) {
        throw new Error(`Error al obtener el clima: ${error.message}`);
    }
}

// Ejemplo de uso
const cityToQuery = 'London, United Kingdom'; // Reemplaza con la ciudad deseada

getWeather(cityToQuery)
    .then((weatherData) => {
        console.log('Datos del clima:', weatherData);
    }).catch((error) => {
        console.error(error.message);
});
