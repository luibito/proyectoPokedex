document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const pokemonList = document.getElementById("pokemonList");

    let pokemons = [];

    async function fetchPokemons() {
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            pokemons = await Promise.all(data.results.map(async (pokemon) => {
                const pokemonDetails = await fetch(pokemon.url).then(res => res.json());
                return pokemonDetails;
            }));
            displayPokemons(pokemons);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    }

    function displayPokemons(pokemonArray) {
        pokemonList.innerHTML = "";
        pokemonArray.forEach(pokemon => {
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("col-md-3", "mb-4", "pokemon-card");
            pokemonCard.innerHTML = `
                <div class="card">
                    <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">Tipo: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(", ")}</p>
                    </div>
                </div>
            `;

            pokemonCard.addEventListener("click", () => {
                showPokemonDetails(pokemon);
            });

            pokemonList.appendChild(pokemonCard);
        });
    }

    function showPokemonDetails(pokemon) {
        document.getElementById("pokemonModalLabel").innerText = pokemon.name;
        document.getElementById("pokemonDetails").innerHTML = `
            <img src="${pokemon.sprites.front_default}" class=" img-fluid mb-3" alt="${pokemon.name}">
            <p><strong>Tipo:</strong> ${pokemon.types.map(typeInfo => typeInfo.type.name).join(", ")}</p>
            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
            <p><strong>Movimientos:</strong></p>
            <ul>
                ${pokemon.moves.slice(0, 10).map(move => `<li>${move.move.name}</li>`).join("")}
            </ul>
        `;
        $('#pokemonModal').modal('show');
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredPokemons = pokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query)
        );
        displayPokemons(filteredPokemons);
    });

    fetchPokemons();
});
