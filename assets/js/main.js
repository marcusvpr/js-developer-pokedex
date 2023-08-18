const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {   
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>  
                    <span class="name">${pokemon.name}</span>
                    
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                            <div class="detail-btn">
                                <button type='button' 
                                    onclick='showDetails("${pokemon.name}")'>
                                    Show Details
                                </button>
                            </div>
                        </ol>
        
                        <img src="${pokemon.photo}"
                            alt="${pokemon.name}">
                    </div>
                    
                </li>  
            `).join('') 
        pokemonList.innerHTML += newHtml
    }) 
} 

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showDetails(name) {
    pokeApi.getPokemonByName(name)
        .then((details) => {
            const modal = document.getElementById('modal');

            modal.removeAttribute('class');
            modal.classList.add(details.type);
            
            document.getElementById('modal-overlay').classList.add('active');
            document.querySelector('#modal h2').innerHTML = details.name;

            document.querySelector('#modal .types').innerHTML = `                
                ${details.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}`;

            document.querySelector('#modal #number').innerHTML = `#${details.number}`;
            
            document.querySelector('#modal .details #abilities').innerHTML = `
                Abilities: ${details.abilities.map((ability) => `${ability}`).join(', ')}`;

            document.querySelector('#modal img').src = details.photo;
            document.querySelector('#modal .details #species')
                .innerHTML = `Species: ${details.species}`;
            document.querySelector('#modal .details #height')
                .innerHTML = `Height: ${details.height}`;
            document.querySelector('#modal .details #weight')
                .innerHTML = `Weight: ${details.weight}`;
        });
}

const modalToggle = () => {
    document.getElementById('modal-overlay').classList.toggle('active');
}

