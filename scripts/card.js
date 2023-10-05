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


const verificationCity = async (cityName) => {
    
    const weatherData = await fetchWeatherData(cityName);

    if (weatherData === null) {
        console.error(`${cityName} no fue encontrado`);
        return;
    }

    // Verificar se a cidade já foi criada usando o ID da cidade
    const cityId = weatherData.id;

    if (createdCities.some(city => city.id === cityId)) {
        console.log(`A cidade com ID ${cityId} já foi adicionada.`);
        return;
    }
    
    return createWeatherCard(weatherData)
} 

// Função para criar um novo cartão com dados climáticos e qualidade do ar
async function createWeatherCard(weatherData) {

    createdCities.push(weatherData);

    // Seleção de elementos fora do loop
    const cardContainer = document.querySelector('.card-container');

    cardContainer.innerHTML = '';
    //loop "for...of" é usado para garantir que as operações assíncronas sejam tratadas corretamente.
    for (const data of createdCities) {
        console.log(data);
        const card = document.createElement('div');
        card.classList.add('card');
        
        const wrapperLeft = document.createElement('div');
        wrapperLeft.classList.add('wrapper-left');

        const infoWrapper = document.createElement('div');
        infoWrapper.classList.add('info-wrapper');
        
        const detailsWrapper = document.createElement('div')
        detailsWrapper.classList.add('details-wrapper');
        
        const airQualityWrapper = document.createElement('div')
        airQualityWrapper.classList.add('details-element');

        const feelsLikeWrapper = document.createElement('div')
        feelsLikeWrapper.classList.add('details-element');

        const windWrapper = document.createElement('div')
        windWrapper.classList.add('details-element');

        const visibilityWrapper = document.createElement('div')
        visibilityWrapper.classList.add('details-element');
        
        // ICONO DEL CLIMA
        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add('icon-wrapper');

        const weatherIconElement = document.createElement('img')
        weatherIconElement.classList.add('icon');

        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

        weatherIconElement.src = iconUrl;
        weatherIconElement.alt = 'Ícone do clima';

        //  ELEMENTOS DE TEXTO WRAPPER 1
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
        
        
        //  ELEMENTOS DE TEXTO WRAPPER 2

        const feelsLike = document.createElement('p');
        const feelsLikeData = `${data.main.feels_like}`;
        feelsLike.textContent = `Sensación Térmica`;

        const wind = document.createElement('p');
        const windData = `${data.wind.speed} km/h`;
        wind.textContent = "Viento";

        const airQuality = await getAirQuality(data.coord.lat, data.coord.lon);

        const airQualityElement = document.createElement('p');
        const airQualityData= `${airQuality}`;
        airQualityElement.textContent = `Calidad del aire`;

        const visibility = document.createElement('p');
        const visibilityData = `${data.visibility} km`;
        visibility.textContent = `Visibilidad`;
        
        iconWrapper.appendChild(weatherIconElement)
        
        infoWrapper.appendChild(cityNameElement);
        infoWrapper.appendChild(weatherDescriptionElement);
        infoWrapper.appendChild(temperatureElement);
        infoWrapper.appendChild(tempWrapper);
        
        tempWrapper.appendChild(minTemperatureElement);
        tempWrapper.appendChild(maxTemperatureElement);

        feelsLikeWrapper.append(feelsLike, feelsLikeData);
        windWrapper.append(wind, windData);
        airQualityWrapper.append(airQualityElement, airQualityData);
        visibilityWrapper.append(visibility, visibilityData);

        detailsWrapper.appendChild(feelsLikeWrapper);
        detailsWrapper.appendChild(windWrapper);
        detailsWrapper.appendChild(airQualityWrapper);
        detailsWrapper.appendChild(visibilityWrapper);

        wrapperLeft.appendChild(iconWrapper);
        wrapperLeft.appendChild(infoWrapper);
        
        card.appendChild(wrapperLeft);
        card.appendChild(detailsWrapper);

        cardContainer.appendChild(card);
    }
}

// Adicione um evento de escuta para o botão de pesquisa
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', handleInputCity);

export { createWeatherCard, createdCities };

