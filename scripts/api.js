const apiKey = "cba97dfcd3855f5d4abe4ee1027cc09f";
// sp, es => idioma

async function obtenerDatosClimaticos ( ciudad, idioma ) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=${idioma}`;
    try {
        const response = await fetch( url );
        const dados = await response.json();
        return dados;

    } catch ( error ) {
        console.log( error.message );
    }
}


async function getAirQuality ( lat, lon ) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const request = await fetch( url );
        const airQuality = await request.json();

        if ( airQuality.list.length === 0 ) return "No se puede obtener la calidad del aire";
        if ( airQuality.list[ 0 ].main.aqi === 1 ) return "Excelente";
        if ( airQuality.list[ 0 ].main.aqi === 2 ) return "Buena";
        if ( airQuality.list[ 0 ].main.aqi === 3 ) return "Regular";
        if ( airQuality.list[ 0 ].main.aqi === 4 ) return "Mala";
        if ( airQuality.list[ 0 ].main.aqi === 5 ) return "Péssimo";
    } catch ( error ) {
        console.log( error.message );
    }
}
