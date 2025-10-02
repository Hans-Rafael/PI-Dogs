require('dotenv').config();
const { conn } = require('./src/db');

async function checkJunction() {
  try {
    await conn.authenticate();
    
    // Check table structure
    const [columns] = await conn.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'dog_temperament'
    `);
    console.log('📋 Table structure:');
    columns.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`));

    // Check sample data
    const [data] = await conn.query('SELECT * FROM dog_temperament LIMIT 5');
    console.log('\n📊 Sample data:');
    console.log(data);

    // Check if there are any matches with existing dogs
    const [matches] = await conn.query(`
      SELECT d.name as dog_name, t.name as temp_name, dt.*
      FROM dog_temperament dt
      LEFT JOIN dogs d ON dt."dogId" = d.id
      LEFT JOIN temperaments t ON dt."temperamentId" = t.id
      LIMIT 5
    `);
    console.log('\n🔍 Joined data:');
    console.log(matches);

    await conn.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

checkJunction();
