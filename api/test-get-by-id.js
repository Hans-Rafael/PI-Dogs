require('dotenv').config();
const { getDogsById } = require('./src/routes/functions');

async function test() {
  try {
    const dog = await getDogsById('4aa6fbfe-4aef-473c-b677-cb401a4033d8');
    console.log('🐕 Dog data:');
    console.log(JSON.stringify(dog, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

test();
