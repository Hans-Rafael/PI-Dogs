require('dotenv').config();
const { Dog, Temperament, conn } = require('./src/db');

async function checkDatabase() {
  try {
    await conn.authenticate();
    console.log('✅ Database connected');

    const dogs = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      limit: 5
    });

    console.log(`\n🐕 Found ${dogs.length} dogs (showing first 5)`);
    
    dogs.forEach(dog => {
      console.log(`\n  Dog: ${dog.name} (${dog.id.substring(0, 8)}...)`);
      console.log(`  Temperaments: ${dog.Temperaments ? dog.Temperaments.length : 0}`);
      if (dog.Temperaments && dog.Temperaments.length > 0) {
        console.log(`  Names: ${dog.Temperaments.map(t => t.name).join(', ')}`);
      }
    });

    const [junctionData] = await conn.query('SELECT COUNT(*) as count FROM dog_temperament');
    console.log(`\n🔗 Total junction table records: ${junctionData[0].count}`);

    await conn.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
