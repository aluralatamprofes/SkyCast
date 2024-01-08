// Paso 1: CREAR VARIABLES DE VALORES
const apiKey = "e87b741ac20eead7877c10d5d6d3b78d";
const dataBase = "http://localhost:3000/createdCities";
const cardContainer = document.querySelector( '.card-container' );


// OBTENER DATOS CLIMÁTICOS
// Paso 2: OBTENER DATOS CLIMÁTICOS
async function fetchWeatherData ( cityName ) {
    // Construir la URL de la API para obtener datos climáticos
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=es`;

    try {
        // Realizar la solicitud a la API y esperar la respuesta
        const response = await fetch( apiUrl );
        const data = await response.json();

        // Paso 3: Verificar si la respuesta es exitosa
        if ( response.ok ) {
            return data;
        } else {
            // En caso de error, lanzar una excepción con el mensaje de error
            throw new Error( `Error al buscar datos de la API: ${data.message}` );
        }
    } catch ( error ) {
        // Paso 4: Capturar errores y mostrarlos en la consola
        console.error( 'Error al buscar datos de la API:', error );
        return null;
    }
}

// Paso 5: OBTENER DATOS DE LA CALIDAD DEL AIRE
async function getAirQuality ( lat, lon ) {
    try {
        // Construir la URL de la API para obtener datos de calidad del aire
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        // Realizar la solicitud a la API y esperar la respuesta
        const request = await fetch( url );
        const airQuality = await request.json();

        // Paso 6: Verificar si la lista de calidad del aire está vacía
        if ( airQuality.list.length === 0 ) return "No se puede obtener la calidad del aire";

        // Paso 7: Obtener el índice de calidad del aire (AQI) y asignar una descripción en base a los niveles estándar
        const aqi = airQuality.list[ 0 ].main.aqi;
        const aqiDescriptions = [ "", "Excelente", "Buena", "Regular", "Mala", "Péssimo" ];
        return aqiDescriptions[ aqi ];
    } catch ( error ) {
        // Paso 8: Capturar errores y mostrarlos en la consola
        console.log( error.message );
        return "No se puede obtener la calidad del aire";
    }
}

// Paso 9: Función para crear una tarjeta
async function createCard ( data ) {
    const card = document.createElement( 'div' );
    card.classList.add( 'card' );

    const wrapperLeft = document.createElement( 'div' );
    wrapperLeft.classList.add( 'wrapper-left' );

    const infoWrapper = document.createElement( 'div' );
    infoWrapper.classList.add( 'info-wrapper' );

    const detailsWrapper = document.createElement( 'div' )
    detailsWrapper.classList.add( 'details-wrapper' );

    const airQualityWrapper = document.createElement( 'div' )
    airQualityWrapper.classList.add( 'details-element' );

    const feelsLikeWrapper = document.createElement( 'div' )
    feelsLikeWrapper.classList.add( 'details-element' );

    const windWrapper = document.createElement( 'div' )
    windWrapper.classList.add( 'details-element' );

    const visibilityWrapper = document.createElement( 'div' )
    visibilityWrapper.classList.add( 'details-element' );

    // ICONO DEL CLIMA
    const iconWrapper = document.createElement( 'div' );
    iconWrapper.classList.add( 'icon-wrapper' );

    const weatherIconElement = document.createElement( 'img' )
    weatherIconElement.classList.add( 'icon' );

    const iconCode = data.weather[ 0 ].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

    weatherIconElement.src = iconUrl;
    weatherIconElement.alt = 'Ícone do clima';

    //  ELEMENTOS DE TEXTO WRAPPER 1
    const cityNameElement = document.createElement( 'h2' );
    cityNameElement.classList.add( 'cityName' );
    cityNameElement.textContent = data.name;

    const weatherDescriptionElement = document.createElement( 'p' );
    weatherDescriptionElement.classList.add( 'weatherDescription' );
    weatherDescriptionElement.textContent = `${data.weather[ 0 ].description}`;

    const temperatureElement = document.createElement( 'p' );
    temperatureElement.classList.add( 'temperature' );
    temperatureElement.textContent = `${data.main.temp} °C`;

    const tempWrapper = document.createElement( 'div' );
    tempWrapper.classList.add( 'temp-wrapper' );

    const minTemperatureElement = document.createElement( 'p' );
    minTemperatureElement.textContent = `MIN ${data.main.temp_min} °C`;

    const maxTemperatureElement = document.createElement( 'p' );
    maxTemperatureElement.textContent = `MAX ${data.main.temp_max} °C`;


    //  ELEMENTOS DE TEXTO WRAPPER 2

    const feelsLike = document.createElement( 'p' );
    const feelsLikeData = `${data.main.feels_like}`;
    feelsLike.textContent = `Sensación Térmica`;

    const wind = document.createElement( 'p' );
    const windData = `${data.wind.speed} km/h`;
    wind.textContent = "Viento";

    const airQuality = await getAirQuality( data.coord.lat, data.coord.lon );

    const airQualityElement = document.createElement( 'p' );
    const airQualityData = `${airQuality}`;
    airQualityElement.textContent = `Calidad del aire`;

    const visibility = document.createElement( 'p' );
    const visibilityData = `${data.visibility} km`;
    visibility.textContent = `Visibilidad`;

    iconWrapper.appendChild( weatherIconElement )

    infoWrapper.appendChild( cityNameElement );
    infoWrapper.appendChild( weatherDescriptionElement );
    infoWrapper.appendChild( temperatureElement );
    infoWrapper.appendChild( tempWrapper );

    tempWrapper.appendChild( minTemperatureElement );
    tempWrapper.appendChild( maxTemperatureElement );

    feelsLikeWrapper.append( feelsLike, feelsLikeData );
    windWrapper.append( wind, windData );
    airQualityWrapper.append( airQualityElement, airQualityData );
    visibilityWrapper.append( visibility, visibilityData );

    detailsWrapper.appendChild( feelsLikeWrapper );
    detailsWrapper.appendChild( windWrapper );
    detailsWrapper.appendChild( airQualityWrapper );
    detailsWrapper.appendChild( visibilityWrapper );

    wrapperLeft.appendChild( iconWrapper );
    wrapperLeft.appendChild( infoWrapper );

    card.appendChild( wrapperLeft );
    card.appendChild( detailsWrapper );

    return card;
}

// Paso 10: Función para mostrar una tarjeta en el DOM
function displayCard ( card ) {
    cardContainer.appendChild( card );
}

// Paso 11: Función para obtener y mostrar todas las ciudades
async function fetchAndDisplayCities () {
    try {
        const response = await fetch( dataBase );
        const createdCities = await response.json();

        for ( const cityData of createdCities ) {
            const card = await createCard( cityData );
            displayCard( card );
        }
    } catch ( error ) {
        console.error( 'Error al obtener ciudades:', error );
    }
}

// Paso 12: Función principal para manejar la entrada de la ciudad
async function handleInputCity ( event ) {
    event.preventDefault();

    const cityInput = document.getElementById( 'cityInput' );
    const cityName = cityInput.value.trim();

    // Paso 13: Verificar si la ciudad tiene un nombre válido
    if ( cityName ) {
        // Paso 14: Realizar la verificación y mostrar la información de la ciudad
        await verificationCity( cityName );
        cityInput.value = '';
    }
}

// Paso 15: Función para verificar la ciudad y agregarla a la base de datos
async function verificationCity ( cityName ) {
    const weatherData = await fetchWeatherData( cityName );

    if ( weatherData === null ) {
        console.error( `${cityName} no fue encontrado` );
        return;
    }

    const cityId = weatherData.id;

    try {
        const response = await fetch( dataBase );
        const createdCities = await response.json();

        if ( createdCities.some( city => city.id === cityId ) ) {
            console.log( `A cidade com ID ${cityId} já foi adicionada.` );
            return;
        }

        await createCardList( weatherData );
    } catch ( error ) {
        console.error( "Error:", error );
    }
}

//Paso 16: Función para agregar una ciudad a la base de datos y actualizar la vista
async function createCardList ( data ) {
    try {
        await fetch( dataBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( data ),
        } );

        cardContainer.innerHTML = '';
        await fetchAndDisplayCities();
    } catch ( error ) {
        console.error( "Error:", error );
    }
}

// Paso 17: Agregar un evento para el botón de búsqueda
const submitButton = document.getElementById( 'submitButton' );
submitButton.addEventListener( 'click', handleInputCity );

// Paso 18: Inicializar la vista de las ciudades al cargar la página
document.addEventListener( 'DOMContentLoaded', fetchAndDisplayCities );

// Paso 19: Exportar funciones necesarias
export { createCard, displayCard };




