require('dotenv').config();
const { conn } = require('./src/db');

console.log('📋 Available models:');
console.log(Object.keys(conn.models));

console.log('\n🔍 Model details:');
Object.keys(conn.models).forEach(modelName => {
  const model = conn.models[modelName];
  console.log(`\n${modelName}:`);
  console.log(`  - tableName: ${model.tableName}`);
  console.log(`  - associations: ${Object.keys(model.associations).join(', ')}`);
});

process.exit(0);
