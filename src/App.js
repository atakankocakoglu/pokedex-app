import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Pokedex from './components/Pokedex';
import Matchup from './components/Matchup';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  useEffect(() => {
    // Load the Pokemon data
    fetch('/pokemon.json')
      .then(response => response.json())
      .then(data => {
        // Add index+1 as pokedex_number to each Pokemon
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
    <Router>
      <div className="App">
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Pokédex</Link>
          <Link to="/matchup" className="nav-link">Matchup Analyzer</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/matchup" element={<Matchup />} />
        </Routes>
      </div>
    </Router>
  );
}

function getPokemonNumber(name) {
  // This is a simple mapping for special cases
  const specialCases = {
    'nidoran♀': '29',
    'nidoran♂': '32',
    'mr. mime': '122',
    'mime jr.': '439',
    'type: null': '772',
    'flabébé': '669',
    'jangmo-o': '782',
    'hakamo-o': '783',
    'kommo-o': '784',
    'tapu koko': '785',
    'tapu lele': '786',
    'tapu bulu': '787',
    'tapu fini': '788'
  };

  if (specialCases[name]) {
    return specialCases[name];
  }

  // Remove any special characters and spaces from the name
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Use the cleaned name for the sprite URL
  return cleanName;
}

export default App;
