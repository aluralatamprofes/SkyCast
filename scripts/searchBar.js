import { createdCities, createWeatherCard } from "./card";

function handleSearchBar(event) {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    filterCities(searchTerm);
    searchInput.value = ''; // Limpa o campo de pesquisa após a pesquisa
}

function filterCities(searchTerm) {
    const filteredCities = createdCities.filter(city => {
        return city.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    createWeatherCard(filteredCities);
}

const searchBarForm = document.getElementById('searchForm');
searchBarForm.addEventListener('submit', handleSearchBar);
