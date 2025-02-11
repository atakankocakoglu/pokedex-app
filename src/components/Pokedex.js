import React, { useState, useEffect } from 'react';

function Pokedex() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  useEffect(() => {
    fetch('/pokemon.json')
      .then(response => response.json())
      .then(data => {
        const numberedPokemon = data.map((poke, index) => ({
          ...poke,
          pokedex_number: index + 1
        }));
        setPokemon(numberedPokemon);
        setFilteredPokemon(numberedPokemon);
      });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = pokemon.filter(poke => 
      poke.name.toLowerCase().includes(term) ||
      poke.type1.toLowerCase().includes(term) ||
      (poke.type2 && poke.type2.toLowerCase().includes(term))
    );
    setFilteredPokemon(filtered);
  };

  return (
    <div>
      <header className="App-header">
        <h1>Pokédex</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokémon by name or type..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </header>
      <div className="pokemon-grid">
        {filteredPokemon.map(poke => (
          <div key={poke.name} className="pokemon-card">
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.pokedex_number}.png`}
              alt={poke.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
              }}
            />
            <h3>{poke.name}</h3>
            <div className="pokemon-types">
              <span className={`type ${poke.type1.toLowerCase()}`}>{poke.type1}</span>
              {poke.type2 && (
                <span className={`type ${poke.type2.toLowerCase()}`}>{poke.type2}</span>
              )}
            </div>
            <div className="pokemon-stats">
              <p>HP: {poke.hp}</p>
              <p>Attack: {poke.attack}</p>
              <p>Defense: {poke.defense}</p>
              <p>Speed: {poke.speed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pokedex; 