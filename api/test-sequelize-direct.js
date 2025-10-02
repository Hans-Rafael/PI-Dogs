require('dotenv').config();
const { Dog, Temperament } = require('./src/db');

async function test() {
  try {
    const dog = await Dog.findByPk('4aa6fbfe-4aef-473c-b677-cb401a4033d8', {
      include: {
        model: Temperament,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      logging: console.log
    });
    
    console.log('\n🐕 Raw dog object:');
    console.log('Temperaments property:', dog.Temperaments);
    console.log('Temperaments length:', dog.Temperaments ? dog.Temperaments.length : 'undefined');
    
    if (dog.Temperaments) {
      console.log('\nTemperament details:');
      dog.Temperaments.forEach(t => {
        console.log(`  - ${t.name} (ID: ${t.id})`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

test();
