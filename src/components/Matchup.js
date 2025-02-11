import React, { useState, useEffect } from 'react';

function Matchup() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [counters, setCounters] = useState([]);

  useEffect(() => {
    fetch('/pokemon.json')
      .then(response => response.json())
      .then(data => {
        const numberedPokemon = data.map((poke, index) => ({
          ...poke,
          pokedex_number: index + 1
        }));
        setPokemon(numberedPokemon);
      });
  }, []);

  const calculateCounters = () => {
    const selected = pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase());
    if (!selected) return;

    // Calculate effectiveness score for each Pokemon
    const scoredPokemon = pokemon.map(p => {
      const effectiveness = calculateEffectivenessScore(selected, p);
      return {
        ...p,
        score: effectiveness.total,
        scoreBreakdown: effectiveness.breakdown
      };
    });

    // Sort by score and get top 5
    const topCounters = scoredPokemon
      .filter(p => p.name !== selected.name)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setCounters(topCounters);
  };

  const calculateEffectivenessScore = (target, attacker) => {
    const scores = {
      speed: attacker.speed > target.speed ? 2 : 0,
      attack: attacker.attack > target.defense ? 3 : 0,
      hp: attacker.hp > target.hp ? 1 : 0,
      type: 0
    };
    
    // Type advantage (simplified)
    if (isTypeEffective(attacker.type1, target.type1)) scores.type += 4;
    if (target.type2 && isTypeEffective(attacker.type1, target.type2)) scores.type += 4;
    if (attacker.type2 && isTypeEffective(attacker.type2, target.type1)) scores.type += 4;
    if (attacker.type2 && target.type2 && isTypeEffective(attacker.type2, target.type2)) scores.type += 4;

    return {
      total: scores.speed + scores.attack + scores.hp + scores.type,
      breakdown: scores
    };
  };

  const isTypeEffective = (attackingType, defendingType) => {
    // Simplified type effectiveness chart
    const typeAdvantages = {
      water: ['fire', 'ground', 'rock'],
      fire: ['grass', 'ice', 'bug', 'steel'],
      grass: ['water', 'ground', 'rock'],
      electric: ['water', 'flying'],
      ice: ['grass', 'ground', 'flying', 'dragon'],
      fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
      poison: ['grass', 'fairy'],
      ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
      flying: ['grass', 'fighting', 'bug'],
      psychic: ['fighting', 'poison'],
      bug: ['grass', 'psychic', 'dark'],
      rock: ['fire', 'ice', 'flying', 'bug'],
      ghost: ['psychic', 'ghost'],
      dragon: ['dragon'],
      dark: ['psychic', 'ghost'],
      steel: ['ice', 'rock', 'fairy'],
      fairy: ['fighting', 'dragon', 'dark']
    };

    return typeAdvantages[attackingType.toLowerCase()]?.includes(defendingType.toLowerCase()) || false;
  };

  const getAdvantageDescription = (breakdown, attacker, target) => {
    const advantages = [];
    
    if (breakdown.speed) advantages.push(
      `Faster speed (${attacker.speed} vs ${target.speed})`
    );
    if (breakdown.attack) advantages.push(
      `Higher attack vs defense (${attacker.attack} vs ${target.defense})`
    );
    if (breakdown.hp) advantages.push(
      `More HP (${attacker.hp} vs ${target.hp})`
    );
    if (breakdown.type) advantages.push(
      `Type advantage (${attacker.type1}${attacker.type2 ? '/' + attacker.type2 : ''} vs ${target.type1}${target.type2 ? '/' + target.type2 : ''})`
    );

    return advantages;
  };

  return (
    <div className="matchup-container">
      <h1>Matchup Analyzer</h1>
      <div className="matchup-input">
        <input
          type="text"
          list="pokemon-list"
          placeholder="Enter a Pokémon name"
          value={selectedPokemon}
          onChange={(e) => setSelectedPokemon(e.target.value)}
          className="search-input"
        />
        <datalist id="pokemon-list">
          {pokemon.map(p => (
            <option key={p.name} value={p.name} />
          ))}
        </datalist>
        <button onClick={calculateCounters} className="analyze-button">
          Find Counters
        </button>
      </div>

      {counters.length > 0 && (
        <div className="counters-grid">
          <h2>Top 5 Counters for {selectedPokemon}</h2>
          <div className="selected-pokemon">
            <h3>Selected Pokémon:</h3>
            <div className="pokemon-card">
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.pokedex_number}.png`}
                alt={selectedPokemon}
              />
              <div className="pokemon-types">
                {pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type1 && (
                  <span className={`type ${pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type1.toLowerCase()}`}>
                    {pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type1}
                  </span>
                )}
                {pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type2 && (
                  <span className={`type ${pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type2.toLowerCase()}`}>
                    {pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())?.type2}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="counters-container">
            {counters.map(poke => (
              <div key={poke.name} className="pokemon-card">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.pokedex_number}.png`}
                  alt={poke.name}
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
                <div className="advantage-breakdown">
                  <h4>Advantages:</h4>
                  <ul>
                    {getAdvantageDescription(
                      poke.scoreBreakdown,
                      poke,
                      pokemon.find(p => p.name.toLowerCase() === selectedPokemon.toLowerCase())
                    ).map((advantage, index) => (
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                  <p className="total-score">Total Score: {poke.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Matchup; 