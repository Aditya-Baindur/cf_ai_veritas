#!/usr/bin/env bash
set -e

DB_NAME="veritas-chat"

echo "Creating D1 database..."
OUT=$(npx wrangler d1 create $DB_NAME)

DB_ID=$(echo "$OUT" | grep -oE '[a-f0-9-]{36}' | head -n1)

if [ -z "$DB_ID" ]; then
  echo "Failed to extract database ID"
  exit 1
fi

echo "Database ID: $DB_ID"

echo "📝 Updating wrangler.json..."
node -e "
const fs = require('fs');
const path = './ai-worker/wrangler.jsonc';
const data = JSON.paers(fs.readFileSync(path, 'utf8'));

data.d1_databases = [{
  binding: 'DB',
  database_name: '$DB_NAME',
  database_id: '$DB_ID'
}];

fs.writeFileSync(path, JSON.stringify(data, null, 2));
"

echo "Applying migrations to remote..."
npx wrangler d1 migrations apply $DB_NAME --remote

echo "D1 database is ready!"
