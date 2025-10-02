#!/bin/bash

echo "Testing dog creation with temperaments..."

# Create a test dog
RESPONSE=$(curl -s -X POST http://localhost:3001/api/dogs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Breed Debug",
    "minHeight": 30,
    "maxHeight": 40,
    "minWeight": 10,
    "maxWeight": 20,
    "minLifeExp": 10,
    "maxLifeExp": 15,
    "temperament": ["Active", "Friendly", "Intelligent"]
  }')

echo "Response from POST:"
echo "$RESPONSE" | jq '.'

# Extract the ID
DOG_ID=$(echo "$RESPONSE" | jq -r '.id')

echo ""
echo "Dog ID: $DOG_ID"
echo ""
echo "Fetching dog details..."

# Fetch the dog details
curl -s http://localhost:3001/api/dogs/$DOG_ID | jq '.'
