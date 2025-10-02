require('dotenv').config();
const { conn } = require('./src/db');

async function test() {
  try {
    const [results] = await conn.query(`
      SELECT "dog".*, "temperaments"."id" AS "temperaments.id", "temperaments"."name" AS "temperaments.name" 
      FROM "dogs" AS "dog" 
      LEFT OUTER JOIN ( "dog_temperament" AS "temperaments->dog_temperament" 
        INNER JOIN "temperaments" AS "temperaments" 
        ON "temperaments"."id" = "temperaments->dog_temperament"."temperamentId") 
      ON "dog"."id" = "temperaments->dog_temperament"."dogId" 
      WHERE "dog"."id" = '4aa6fbfe-4aef-473c-b677-cb401a4033d8'
    `);
    
    console.log('📊 Raw query results:');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  }
  process.exit(0);
}

test();
