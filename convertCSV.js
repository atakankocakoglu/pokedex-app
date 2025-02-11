const fs = require('fs');
const csv = require('csv-parse');

const results = [];

fs.createReadStream('pokemon.csv')
  .pipe(csv.parse({ columns: true }))
  .on('data', (data) => {
    results.push({
      name: data.name.toLowerCase(),
      pokedex_number: parseInt(data['#']),
      type1: data.type1.toLowerCase(),
      type2: data.type2 ? data.type2.toLowerCase() : null,
      hp: parseInt(data.hp),
      attack: parseInt(data.attack),
      defense: parseInt(data.defense),
      speed: parseInt(data.speed)
    });
  })
  .on('end', () => {
    fs.writeFileSync(
      'public/pokemon.json',
      JSON.stringify(results, null, 2)
    );
    console.log('Conversion completed! Check public/pokemon.json');
  }); 