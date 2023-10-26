const pokedex = document.getElementById('pokedex');

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
        const pokemon = results.map((result) => ({
            name: result.name,
            image: result.sprites['front_default'],
            types: result.types.map((type) => type.type.name),
            id: result.id
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    const pokemonHTMLString = pokemon
        .map((pokemon) => {
            const bgColors = getBackgroundColorsForTypes(pokemon.types);
            const textColors = getTextColorsForBackgrounds(bgColors);
            return `
            <li class="card bg-white rounded-lg cursor-pointer shadow-lg w-64 py-4 transform hover:scale-105 transition-transform">
    <div class="flex justify-center">
        <img class="card-image hover:animate-shake" src="${pokemon.image}"/>
    </div>
    <div class="grid justify-center">
        <div class="card-info justify-center flex">
            <h2 class="card-title font-bold text-gray-400 text-sm" style="">No. ${pokemon.id}</h2>
        </div>
        <div class="card-info">
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
