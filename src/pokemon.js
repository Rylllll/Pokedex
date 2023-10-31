const pokedex = document.getElementById("pokedex");
const detailsContainer = document.getElementById("pokemon-details");

const typeColors = {
  normal: "rgb(128, 128, 128)",
  grass: "rgb(0, 128, 0)",
  fire: "rgb(255, 165, 0)",
  water: "rgb(0, 0, 255)",
  electric: "rgb(255, 215, 0)",
  ice: "rgb(173, 216, 230)",
  fighting: "rgb(139, 0, 0)",
  flying: "rgb(135, 206, 235)",
  bug: "rgb(154, 205, 50)",
  ghost: "rgb(128, 0, 128)",
  poison: "rgb(148, 0, 211)",
  fairy: "rgb(255, 105, 180)",
  rock: "rgb(160, 82, 45)",
  ground: "rgb(139, 69, 19)",
  steel: "rgb(192, 192, 192)",
  dark: "rgb(169, 169, 169)",
  psychic: "rgb(219, 112, 147)",
  dragon: "rgb(0, 128, 128)",

};

const fetchPokemon = () => {
  const promises = [];
  for (let i = 1; i <= 150; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    const evolutionUrl = `https://pokeapi.co/api/v2/evolution-chain/${i}`;

   
    promises.push(
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
         
          return fetch(evolutionUrl)
            .then((res) => res.json())
            .then((evolutionData) => {
        
              return { ...data, evolutionData: evolutionData };
            });
        })
    );
  }

  Promise.all(promises).then((results) => {
    const pokemonData = results.map((result) => ({
      name: result.name,
      image: result.sprites["front_default"],
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
      evolutionData: result.evolutionData,
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
        (entry) => entry.language.name === "en"
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
      const weaknesses = getTypeWeaknesses(
        results[i].types.map((type) => type.type.name)
      );
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
            <li class="card bg-white rounded-2xl border-2 border-[#ffa000] cursor-pointer shadow-lg w-full py-4 transform hover:scale-105 transition-transform" data-pokemon-id="${
              pokemon.id
            }">
                <div class="flex justify-center">
                    <img class="card-image hover:animate-shake" src="${
                      pokemon.image
                    }" />
                </div>
                <div class="grid justify-center">
                    <div class="card-info justify-center flex">
                        <h2 class="card-title font-semibold text-gray-400 text-sm" style="">#${
                          pokemon.id
                        }</h2>
                    </div>
                    <div class="card-info mt-4">
                        <h2 class="card-title font-bold text-md uppercase mb-2">${
                          pokemon.name
                        }</h2>
                    </div>
                </div>
                <p class="card-subtitle justify-center flex gap-2 font-bold">
                    ${
                      pokemon.types[0]
                        ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[0]}; color: ${textColors[0]};">${pokemon.types[0]}</span>`
                        : ""
                    }
                    ${
                      pokemon.types[1]
                        ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[1]}; color: ${textColors[1]};">${pokemon.types[1]}</span>`
                        : ""
                    }
                </p>
            </li>
            `;
    })
    .join("");

  pokedex.innerHTML = pokemonHTMLString;


  const pokemonBoxes = document.querySelectorAll(".card");
  pokemonBoxes.forEach((box) => {
    box.addEventListener("click", () => {

      const pokemonId = box.getAttribute("data-pokemon-id");
     
      const selectedPokemon = pokemonData.find(
        (pokemon) => pokemon.id == pokemonId
      );
      
      displayDetails(selectedPokemon);
    });
  });
};

const getBackgroundColorsForWeaknesses = (weaknesses) => {
  const weaknessColors = {
    fighting: "rgb(139, 0, 0)",
    bug: "rgb(154, 205, 50)",
    rock: "rgb(160, 82, 45)",
    ghost: "rgb(128, 0, 128)",
    ground: "rgb(139, 69, 19)",
    fire: "rgb(255, 165, 0)",
    grass: "rgb(0, 128, 0)",
    electric: "rgb(255, 215, 0)",
    ice: "rgb(173, 216, 230)",
    poison: "rgb(148, 0, 211)",
    fairy: "rgb(255, 105, 180)",
    steel: "rgb(192, 192, 192)",
    dark: "rgb(169, 169, 169)",
    psychic: "rgb(219, 112, 147)",
    dragon: "rgb(0, 128, 128)",
    water: "rgb(0, 0, 255)",
    flying: "rgb(135, 206, 235)",
  };

  return weaknesses.reduce((colors, weakness) => {
    colors[weakness] = weaknessColors[weakness] || "transparent";
    return colors;
  }, {});
};

const getTypeWeaknesses = (types) => {
  const weaknesses = {
    normal: ["fighting"],
    grass: ["fire"],
    fire: ["water"],
    water: ["electric"],
    electric: ["ground"],
    ice: ["fire"],
    fighting: ["flying"],
    flying: ["electric"],
    bug: ["fire"],
    ghost: ["ghost"],
    poison: ["ground"],
    fairy: ["steel"],
    rock: ["water"],
    ground: ["water"],
    steel: ["fire"],
    dark: ["fairy"],
    psychic: ["dark"],
    dragon: ["dragon"],
  };
  return types.map((type) => weaknesses[type] || []);
};

const statImages = {
  hp: "./img/HP.png",
  attack: "./img/atk.png",
  defense: "./img/DEF.png",
  "special-attack": "./img/SPA.png",
  "special-defense": "./img/SPD.png",
  speed: "./img/SP.png",
};

const displayDetails = (pokemon, evolutionLine) => {
  const bgColors = getBackgroundColorsForTypes(pokemon.types);
  const textColors = getTextColorsForBackgrounds(bgColors);
  const weaknessColors = getBackgroundColorsForWeaknesses(pokemon.weaknesses); // Get colors for weaknesses

  const evolutionHTML = evolutionLine
    ? evolutionLine
        .map(
          (evolution) => `
            <div class="rounded-full w-40 bg-gray-200 p-2 mt-2">
                <img src="${evolution.image}" alt="${evolution.name}" />
                <p class="text-sm text-gray-500">${evolution.name}</p>
            </div>
        `
        )
        .join("")
    : "";

  const weaknessesHTML = pokemon.weaknesses
    .map(
      (weakness) => `
        <div class="rounded-full w-44 bg-gray-200 p-2" style="background: ${weaknessColors[weakness]}">${weakness}</div>
    `
    )
    .join("");

  const statsHTML = pokemon.stats
    .map((stat) => {
      const statImageSrc = statImages[stat.name.toLowerCase()];

      return `
                <li>
                    <img src="${statImageSrc}" alt="${stat.name}" class="stat-image" /> ${stat.value}
                </li>
            `;
    })
    .join("");

  const detailsHTML = `
        <div class="bg-white p-6 w-full rounded-md font-sans">
        
            <div class="flex justify-center">
                <img class="card-image hover:animate-shake w-56 h-56" src="${
                  pokemon.image
                }" />
            </div>
            <div class="flex gap-1 text-center items-center justify-center mb-4">
        <i class="fa-solid fa-mars text-xl bg-blue-300 px-2 py-1.5"></i>
        <i class="fa-solid fa-venus text-xl bg-red-500 px-2.5 py-1.5"></i>
        </div>
            <div class="grid justify-center">
                <div class="card-info justify-center flex">
                    <h2 class="card-title font-bold text-gray-400 text-sm" style="">#${
                      pokemon.id
                    }</h2>
                </div>
                <div class="card-info text-center">
                    <h2 class="card-title font-bold text-md uppercase mb-2">${
                      pokemon.name
                    }</h2>
                    <p class="font-semibold text-gray-500 justify-center flex">${
                      pokemon.description
                    }</p> <!-- Description added here -->
                </div>
            </div>
            <p class="card-subtitle justify-center flex gap-2 font-bold">
                ${
                  pokemon.types[0]
                    ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[0]}; color: ${textColors[0]};">${pokemon.types[0]}</span>`
                    : ""
                }
                ${
                  pokemon.types[1]
                    ? `<span class="py-1.5 px-3 rounded-md uppercase text-xs" style="text-transform: uppercase; background: ${bgColors[1]}; color: ${textColors[1]};">${pokemon.types[1]}</span>`
                    : ""
                }
            </p>

            <div class="grid items-center text-center mt-4">
            <p class="font-semibold justify-center">Pokédex Entry</p>
            <p class="mt-2 text-sm">${pokemon.pokedexEntry}</p>
            </div>
            
            <div class="grid justify-center items-center text-center mt-4">
            <p class="font-semibold">Abilities:</p>
            <div class="flex flex-wrap gap-2 font-semibold text-sm mt-2">
                ${pokemon.abilities
                  .map(
                    (ability) =>
                      `<div class="rounded-full w-40 border-blue-300 border-2 bg-gray-200 p-2">${ability}</div>`
                  )
                  .join("")}
            </div>
        </div>
        
          
             <div class="flex gap-2 justify-center items-center text-center mt-4 text-sm">
             <div class="grid">
             <p class="font-semibold">Height</p>
             <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${
               pokemon.height / 10
             } m</p>
             </div>
             <div class="grid">
             <p class="font-semibold">Weight</p>
             <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${
               pokemon.weight / 10
             } kg</p>
             </div>
            
           
            </div>

            <div class="flex gap-2 justify-center items-center text-center mt-4 text-sm">
            <div class="grid">
            <p class="font-semibold">Base Experince</p>
            <p class="rounded-full w-40 bg-gray-200 p-1 mt-2">${
              pokemon.baseExperience
            }</p>
            </div>
            <div class="grid">
            <p class="font-semibold">Weakness</p>
            <div class="flex flex-wrap gap-2 font-semibold text-sm mt-2">
                ${weaknessesHTML}
            </div>
            </div>
           
          
           </div>
    
            
           <div class="grid items-center justify-center text-center mt-4 p-">
           <p class="font-semibold">Stats</p>
           <ul class="flex gap-2 mt-2">
           ${statsHTML}
       </ul>
           </div>

            
            

            

        </div>
    `;

 
  detailsContainer.innerHTML = detailsHTML;
};

const getBackgroundColorsForTypes = (types) => {
  return types.map((type) => typeColors[type.toLowerCase()] || "transparent");
};

const getTextColorsForBackgrounds = (backgroundColors) => {
  return backgroundColors.map((bgColor) =>
    isDarkColor(bgColor) ? "white" : "black"
  );
};

// Function to check if a color is dark
const isDarkColor = (color) => {
  const r = parseInt(color.slice(4, 7), 10);
  const g = parseInt(color.slice(9, 12), 10);
  const b = parseInt(color.slice(14, 17), 10);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; 
};

fetchPokemon();

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.classList.remove("bg-transparent");
    header.classList.add("bg-white", "shadow-lg");
  } else {
    header.classList.remove("bg-white", "shadow-lg"); 
    header.classList.add("bg-transparent");
  }
});


