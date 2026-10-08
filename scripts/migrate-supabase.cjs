const path = require('path');
const { Client } = require(path.resolve(__dirname, '../lib/db/node_modules/pg'));

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.jnbhiurrmaabclykcttb:huivexauto1122@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function migrate() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Supabase PostgreSQL!');

  const sql = `
    CREATE TABLE IF NOT EXISTS quote_inquiries (
      id serial PRIMARY KEY,
      locale varchar(8) NOT NULL,
      name varchar(120) NOT NULL,
      company varchar(160),
      country varchar(2) NOT NULL,
      email varchar(254),
      phone varchar(40),
      inquiry_type varchar(32) NOT NULL,
      vehicles text[] NOT NULL DEFAULT '{}',
      other_vehicle varchar(300),
      quantity varchar(16),
      destination varchar(200),
      message varchar(2000),
      consent boolean NOT NULL DEFAULT false,
      email_status varchar(16) NOT NULL DEFAULT 'pending',
      created_at timestamp with time zone NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS rate_limits (
      key varchar(128) PRIMARY KEY,
      count integer NOT NULL DEFAULT 1,
      reset_at timestamp with time zone NOT NULL
    );
  `;

  await client.query(sql);
  console.log('Schema migration completed successfully!');

  const tables = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('Tables in Supabase public schema:', tables.rows.map(r => r.table_name));

  await client.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
