require('dotenv').config({ path: './api/.env' });
const { Dog, Temperament, conn } = require('./api/src/db');

async function checkDatabase() {
  try {
    await conn.authenticate();
    console.log('✅ Database connected');

    // Check if dog_temperament table exists
    const [results] = await conn.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'dog_temperament';
    `);
    
    console.log('\n📊 dog_temperament table exists:', results.length > 0);

    // Get all dogs with temperaments
    const dogs = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    });

    console.log(`\n🐕 Found ${dogs.length} dogs in database`);
    
    dogs.forEach(dog => {
      console.log(`\n  Dog: ${dog.name} (${dog.id})`);
      console.log(`  Temperaments count: ${dog.Temperaments ? dog.Temperaments.length : 0}`);
      if (dog.Temperaments && dog.Temperaments.length > 0) {
        console.log(`  Temperaments: ${dog.Temperaments.map(t => t.name).join(', ')}`);
      }
    });

    // Check the junction table directly
    const [junctionData] = await conn.query('SELECT * FROM dog_temperament LIMIT 10');
    console.log(`\n🔗 Junction table records: ${junctionData.length}`);
    if (junctionData.length > 0) {
      console.log('Sample data:', junctionData);
    }

    await conn.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
