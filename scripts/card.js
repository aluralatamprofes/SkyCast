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
            throw new Error(`Error al buscar dados de la API: ${data.message}`);
        }
    } catch (error) {
        console.error('Error al buscar dados de la API:', error);
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


// Função para lidar com a pesquisa quando o botão é clicado
function handleInputCity(event) {
    event.preventDefault(); 

    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();

    if (cityName) {
        verificationCity(cityName);
        cityInput.value = '';
    }
}


const verificationCity = (cityName) => {
    const  cityNameLowerCase= cityName.toLowerCase();
    
    // Verifique se a cidade já foi criada (sensível a maiúsculas e minúsculas)
    // createdCities.forEach((city, index) => {
    //     console.log(city[index].name);
        // if (city[index].name.includes( || cityName)) {
        //     return console.error(`${cityName} ya fue creado`);
        // } 
    // })

    return createWeatherCard(cityNameLowerCase)
} 

// Função para criar um novo cartão com dados climáticos e qualidade do ar
async function createWeatherCard(cityName) {
    const weatherData = await fetchWeatherData(cityName);

    if (weatherData === null) {
        console.error(`${cityName} no fue encontrado`);
        return;
    }

    createdCities.push(weatherData);

    // Seleção de elementos fora do loop
    const cardContainer = document.querySelector('.card-container');
    
    //loop "for...of" é usado para garantir que as operações assíncronas sejam tratadas corretamente.
    for (const data of createdCities) {

        const card = document.createElement('div');
        card.classList.add('card');
        
        const infoWrapper = document.createElement('div');
        infoWrapper.classList.add('info-wrapper');

        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('icon-wrapper');

        // Criar o elemento img para o ícone do clima
        const weatherIconElement = document.createElement('img');
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
        weatherIconElement.src = iconUrl;
        weatherIconElement.alt = 'Ícone do clima';


        const cityNameElement = document.createElement('h2');
        cityNameElement.classList.add('cityName');
        cityNameElement.textContent = data.name;

        const weatherDescriptionElement = document.createElement('p');
        weatherDescriptionElement.classList.add('weatherDescription');
        weatherDescriptionElement.textContent = `${data.weather[0].description}`;

        const temperatureElement = document.createElement('p');
        temperatureElement.classList.add('temperature');
        temperatureElement.textContent = `${data.main.temp} °C`;

        const tempWrapper = document.createElement('div');
        tempWrapper.classList.add('temp-wrapper');

        const minTemperatureElement = document.createElement('p');
        minTemperatureElement.textContent = `MIN ${data.main.temp_min} °C`;

        const maxTemperatureElement = document.createElement('p');
        maxTemperatureElement.textContent = `MAX ${data.main.temp_max} °C`;

        const airQuality = await getAirQuality(data.coord.lat, data.coord.lon);
        console.log("Qualidadee do ar:", airQuality);
        
        const airQualityElement = document.createElement('p');
        airQualityElement.textContent = `Calidad del aire: ${airQuality}`;
        
        iconWrapper.appendChild(weatherIconElement)
        
        infoWrapper.appendChild(cityNameElement);
        infoWrapper.appendChild(weatherDescriptionElement);
        infoWrapper.appendChild(temperatureElement);
        infoWrapper.appendChild(tempWrapper);
        
        tempWrapper.appendChild(minTemperatureElement);
        tempWrapper.appendChild(maxTemperatureElement);

        card.appendChild(iconWrapper);
        card.appendChild(infoWrapper);
        card.appendChild(airQualityElement);

        cardContainer.appendChild(card);
    }
}





// function handleSearchBar(event) {


// }





// Adicione um evento de escuta para o botão de pesquisa
const searchButton = document.getElementById('submitButton');
searchButton.addEventListener('click', handleInputCity);

// Adicione um evento de escuta para o evento "submit" da barra de pesquisa
const searchBarForm = document.querySelector('.searchBar-container'); // Seleciona o formulário pela classe
// searchBarForm.addEventListener('submit', handleSearchBar); // Usa o evento "submit"
