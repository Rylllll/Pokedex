const pokedex = document.getElementById('pokedex');
const detailsContainer = document.getElementById('pokemon-details');

// Define a mapping of Pokemon types to background colors
const typeColors = {
    normal: 'rgb(128, 128, 128)',
    grass: 'rgb(0, 128, 0)',
    fire: 'rgb(255, 165, 0)',
    water: 'rgb(0, 0, 255)',
    electric: 'rgb(255, 215, 0)',
    ice: 'rgb(173, 216, 230)',
    fighting: 'rgb(139, 0, 0)',
    flying: 'rgb(135, 206, 235)',
    bug: 'rgb(154, 205, 50)',
    ghost: 'rgb(128, 0, 128)',
    poison: 'rgb(148, 0, 211)',
    fairy: 'rgb(255, 105, 180)',
    rock: 'rgb(160, 82, 45)',
    ground: 'rgb(139, 69, 19)',
    steel: 'rgb(192, 192, 192)',
    dark: 'rgb(169, 169, 169)',
    psychic: 'rgb(219, 112, 147)',
    dragon: 'rgb(0, 128, 128)',
    // Add more types and corresponding colors as needed
};

const fetchPokemon = () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const pokemonData = results.map((result) => ({
            name: result.name,
            image: result.sprites['front_default'],
            types: result.types.map((type) => type.type.name),
            id: result.id,
            abilities: result.abilities.map((ability) => ability.ability.name),
            height: result.height,
            weight: result.weight,
            baseExperience: result.base_experience,
            stats: result.stats.map((stat) => ({
                name: stat.stat.name,
                value: stat.base_stat,
            })),
        }));
        fetchPokedexEntries(pokemonData);
    });
};

const fetchPokedexEntries = (pokemonData) => {
    const promises = pokemonData.map((pokemon) => {
        const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`;
        return fetch(url).then((res) => res.json());
    });

    Promise.all(promises).then((results) => {
        for (let i = 0; i < pokemonData.length; i++) {
            const entry = results[i].flavor_text_entries.find(
                (entry) => entry.language.name === 'en'
            ).flavor_text;
            pokemonData[i].pokedexEntry = entry;
        }
        fetchTypeWeaknesses(pokemonData);
    });
};

const fetchTypeWeaknesses = (pokemonData) => {
    const promises = pokemonData.map((pokemon) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
        return fetch(url).then((res) => res.json());
    });

    Promise.all(promises).then((results) => {
        for (let i = 0; i < pokemonData.length; i++) {
            const weaknesses = getTypeWeaknesses(results[i].types.map((type) => type.type.name));
            pokemonData[i].weaknesses = weaknesses;
        }
        displayPokemon(pokemonData);
    });
};


const displayPokemon = (pokemonData) => {
    const pokemonHTMLString = pokemonData
        .map((pokemon) => {
            const bgColors = getBackgroundColorsForTypes(pokemon.types);
            const textColors = getTextColorsForBackgrounds(bgColors);

            return `
            <li class="card bg-white rounded-2xl border 1px border-[#ff5722] cursor-pointer shadow-lg w-full py-4 transform hover:scale-105 transition-transform" data-pokemon-id="${pokemon.id}">
                <div class="flex justify-center">
                    <img class="card-image hover:animate-shake" src="${pokemon.image}" />
                </div>
                <div class="grid justify-center">
                    <div class="card-info justify-center flex">
                        <h2 class="card-title font-semibold text-gray-400 text-sm" style="">#${pokemon.id}</h2>
                    </div>
                    <div class="card-info mt-4">
                        <h2 class="card-title font-bold text-md uppercase mb-2">${pokemon.name}</h2>
                    </div>
                </div>
                <p class="card-subtitle justify-center flex gap-2 font-bold">
                    ${pokemon.types[0] ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[0]}; color: ${textColors[0]};">${pokemon.types[0]}</span>` : ''}
                    ${pokemon.types[1] ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[1]}; color: ${textColors[1]};">${pokemon.types[1]}</span>` : ''}
                </p>
            </li>
            `;
        })
        .join('');

    pokedex.innerHTML = pokemonHTMLString;

    // Add event listeners to each Pokemon box
    const pokemonBoxes = document.querySelectorAll('.card');
    pokemonBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            // Get the Pokemon ID from the data attribute
            const pokemonId = box.getAttribute('data-pokemon-id');
            // Find the corresponding Pokemon data
            const selectedPokemon = pokemonData.find((pokemon) => pokemon.id == pokemonId);
            // Display the details in the details container
            displayDetails(selectedPokemon);
        });
    });
};


const typeImages = {
    normal: './normal.svg',
    grass: './poison.svg',
    water: 'img/game.png',
    rock: './rock.svg',
    ground: './ground.svg',
    fire: 'psychic.svg'
 
};

const getTypeWeaknesses = (types) => {

    const weaknesses = {
         normal: ["fighting"],
        grass: ["fire", "ice", "bug", "poison", "flying"],
        fire: ["water", "rock", "ground"],
        water: ["electric", "grass"],
        electric: ["ground"],
        ice: ["fire", "fighting", "rock", "steel"],
        fighting: ["flying", "psychic", "fairy"],
        flying: ["electric", "ice", "rock"],
        bug: ["fire", "flying", "rock"],
        ghost: ["ghost", "dark"],
        poison: ["ground", "psychic"],
        fairy: ["steel", "poison"],
        rock: ["water", "grass", "fighting", "ground", "steel"],
        ground: ["water", "ice", "grass"],
        steel: ["fire", "fighting", "ground"],
        dark: ["fighting", "bug", "fairy"],
        psychic: ["bug", "ghost", "dark"],
        dragon: ["ice", "dragon", "fairy"],
        // Define weaknesses for other types
    };
    return types.map((type) => weaknesses[type] || []);
};
const displayDetails = (pokemon) => {
    // Generate HTML for the details
    const bgColors = getBackgroundColorsForTypes(pokemon.types);
    const textColors = getTextColorsForBackgrounds(bgColors);
    const detailsHTML = `
        <div class="bg-white p-6 w-full rounded-md font-sans">
            <div class="flex justify-center">
                <img class="card-image hover:animate-shake w-56 h-56" src="${pokemon.image}" />
            </div>
            <div class="grid justify-center">
                <div class="card-info justify-center flex">
                    <h2 class="card-title font-bold text-gray-400 text-sm" style="">#${pokemon.id}</h2>
                </div>
                <div class="card-info text-center">
                    <h2 class="card-title font-bold text-md uppercase mb-2">${pokemon.name}</h2>
                    <p class="font-semibold text-gray-500 justify-center flex">${pokemon.description}</p> <!-- Description added here -->
                </div>
            </div>
            <p class="card-subtitle justify-center flex gap-2 font-bold">
                ${pokemon.types[0] ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[0]}; color: ${textColors[0]};">${pokemon.types[0]}</span>` : ''}
                ${pokemon.types[1] ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[1]}; color: ${textColors[1]};">${pokemon.types[1]}</span>` : ''}
            </p>

            <div class="grid items-center text-center mt-4">
            <p class="font-semibold justify-center">Pokédex Entry</p>
            <p class="mt-2 text-sm">${pokemon.pokedexEntry}</p>
            </div>
            
            <div class="grid justify-center items-center text-center mt-4">
            <p class="font-bold">Abilities:</p>
            <div class="flex flex-wrap gap-2 font-semibold text-sm mt-2">
                ${pokemon.abilities.map((ability) => `<div class="rounded-full w-40 border-blue-300 border-2 bg-gray-200 p-2">${ability}</div>`).join('')}
            </div>
        </div>
        
          
             <div class="flex gap-2 justify-center items-center text-center mt-4 text-sm">
             <div class="grid">
             <p class="font-semibold">Height</p>
             <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${pokemon.height / 10} m</p>
             </div>
             <div class="grid">
             <p class="font-semibold">Weight</p>
             <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${pokemon.weight / 10} kg</p>
             </div>
            
           
            </div>

            <div class="flex gap-2 justify-center items-center text-center mt-4 text-sm">
            <div class="grid">
            <p class="font-semibold">Base Experince</p>
            <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${pokemon.baseExperience}</p>
            </div>
            <div class="grid">
            <p class="font-bold">Weakness</p>
            <div class="flex flex-wrap gap-2 font-semibold text-sm mt-2">
            ${pokemon.weaknesses.map((weakness) => `
                <div class="rounded-full w-40 bg-gray-200 p-2">
                    <img src="${typeImages[weakness]}" alt="${weakness}" width="24" height="24">
                </div>
            `).join('')}
        </div>
            </div>
           
          
           </div>
    
            
            
            <p class="font-bold">Stats:</p>
            <ul class="font-bold">
                ${pokemon.stats.map((stat) => `<li>${stat.name}: ${stat.value}</li>`).join('')}
            </ul>
        </div>
    `;

    // Display the details in the details container
    detailsContainer.innerHTML = detailsHTML;
};


const getBackgroundColorsForTypes = (types) => {
    return types.map(type => typeColors[type.toLowerCase()] || 'transparent');
};

const getTextColorsForBackgrounds = (backgroundColors) => {
    return backgroundColors.map(bgColor => isDarkColor(bgColor) ? 'white' : 'black');
};

// Function to check if a color is dark
const isDarkColor = (color) => {
    const r = parseInt(color.slice(4, 7), 10);
    const g = parseInt(color.slice(9, 12), 10);
    const b = parseInt(color.slice(14, 17), 10);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128; // You can adjust this threshold as needed
};



fetchPokemon();
