require('dotenv').config();
const { Dog, Temperament, conn } = require('./src/db');

async function debugQuery() {
  try {
    await conn.authenticate();
    
    // Enable SQL logging temporarily
    const dogs = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      limit: 1,
      logging: console.log  // This will show the SQL query
    });

    console.log('\n📊 Result:');
    console.log(JSON.stringify(dogs[0], null, 2));

    await conn.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugQuery();
