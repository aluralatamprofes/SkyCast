// CREAR CARDS
const apiKey = "e87b741ac20eead7877c10d5d6d3b78d";

//GUARDAR VALOR DE LAS CIUDADES CREADAS
const createdCities = [];

// OBTENER DADOS CLIMATICOS
async function fetchWeatherData(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // VERIFICANDO EL STATUS DE LA RESPUESTA
        if (response.ok) {
            return data
        } else {
            // SI LA RESPUSTA !ok, LANZA UN ERROR QUE SERA CAPTURADO EN EL CATCH
            throw new Error(`Erro ao buscar dados da API: ${data.message}`);
        }

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return null; // Retorna null em caso de erro
    }
}

// OBTENER DADOS LA QUALIDAD DEL AIRE
async function getAirQuality(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const request = await fetch(url);
        const airQuality = await request.json();

        if (airQuality.list.length === 0) return "No se puede obtener la calidad del aire";
        if (airQuality.list[0].main.aqi === 1) return "Excelente";
        if (airQuality.list[0].main.aqi === 2) return "Buena";
        if (airQuality.list[0].main.aqi === 3) return "Regular";
        if (airQuality.list[0].main.aqi === 4) return "Mala";
        if (airQuality.list[0].main.aqi === 5) return "Péssimo";

    } catch (error) {
        console.log(error.message);
    }
}

// Função para criar um novo cartão com dados climáticos e qualidade do ar
async function createWeatherCard(cityName) {
    const cityNameLower = cityName.toLowerCase();

    // Verifique se a cidade já foi criada (sensível a maiúsculas e minúsculas)
    if (createdCities.includes(cityNameLower || cityName)) {
        return console.error(`${cityName} já foi criado.`);
    } 

    // OBTIENE DOS DADOS CLIMÁTICOS
    const weatherData = await fetchWeatherData(cityNameLower);
    console.log(weatherData);
    if (weatherData === null) {
        // SI LOS DADOS SON === null, NO RETORNARA NADA
        return 
    }

    createdCities.push(cityNameLower)
    // console.log(createdCities);
    
    const cardContainer = document.querySelector('.card-container');

    if (weatherData) {
        //CRIANDO A DIV DO CARD
        const card = document.createElement('div');
        card.classList.add('card');

        //DIV DAS INFOS RESUMIDAS
        const infoWrapper = document.createElement('div')
        infoWrapper.classList.add('info-wrapper')

            //NOME DA CIDADE
            const cityNameElement = document.createElement('h2');
            cityNameElement.classList.add('cityName')
            cityNameElement.textContent = cityNameLower;
            
            //DESCRIÇÃO DO CLIMA
            const weatherDescriptionElement = document.createElement('p');
            weatherDescriptionElement.classList.add('weatherDescription')
            weatherDescriptionElement.textContent = `${weatherData.weather[0].description}`;
            
            //VALOR DA TEMPERATURA 
            const temperatureElement = document.createElement('p');
            temperatureElement.classList.add('temperature')
            temperatureElement.textContent = `${weatherData.main.temp} °C`;

            //DIV DAS TEMP MIN E MAX
            const tempWrapper = document.createElement('div')        
            tempWrapper.classList.add('temp-wrapper')

                    const minTemperatureElement = document.createElement('p');
                    minTemperatureElement.textContent = `MIN ${weatherData.main.temp_min} °C`;

                    const maxTemperatureElement = document.createElement('p');
                    maxTemperatureElement.textContent = `MAX ${weatherData.main.temp_max} °C`;

            


        // Obtenha a qualidade do ar
        const airQuality = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon);
        const airQualityElement = document.createElement('p');
        airQualityElement.textContent = `Calidad del aire: ${airQuality}`;

        card.appendChild(infoWrapper);
            infoWrapper.appendChild(cityNameElement);
            infoWrapper.appendChild(weatherDescriptionElement);
            infoWrapper.appendChild(temperatureElement);
            infoWrapper.appendChild(tempWrapper);
                tempWrapper.appendChild(minTemperatureElement);
                tempWrapper.appendChild(maxTemperatureElement);

        card.appendChild(airQualityElement);

        cardContainer.appendChild(card);
    }
}

// Função para lidar com a pesquisa quando o botão é clicado
function handleSearch(event) {
    event.preventDefault(); // Evita que o formulário seja enviado, que é o comportamento padrão

    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();
    if (cityName) {
        createWeatherCard(cityName);
        cityInput.value = '';
    }
}

// Adicione um evento de escuta para o botão de pesquisa
const searchButton = document.getElementById('submitButton');
searchButton.addEventListener('click', handleSearch);


function handleSearchBar(event) {


}







// Adicione um evento de escuta para o evento "submit" da barra de pesquisa
const searchBarForm = document.querySelector('.searchBar-container'); // Seleciona o formulário pela classe
searchBarForm.addEventListener('submit', handleSearchBar); // Usa o evento "submit"
// createWeatherCard('São Paulo');
// createWeatherCard('Santiago');
// createWeatherCard('Rio de Janeiro');
// createWeatherCard('Florianopolis');
