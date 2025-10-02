require('dotenv').config();
const { conn } = require('./src/db');

async function checkLastDog() {
  try {
    await conn.authenticate();
    
    const [result] = await conn.query(`
      SELECT d.name as dog_name, t.name as temp_name
      FROM dog_temperament dt
      JOIN dogs d ON dt."dogId" = d.id
      JOIN temperaments t ON dt."temperamentId" = t.id
      WHERE d.name LIKE 'Golden Test%'
      ORDER BY dt."createdAt" DESC
    `);
    
    console.log('🔍 Temperaments for Golden Test dogs:');
    console.log(result);

    await conn.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLastDog();
