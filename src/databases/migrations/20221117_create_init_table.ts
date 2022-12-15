import { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('profile')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('authorization_token', 'text', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('app')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('order', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('profile_id', 'integer', (col) => col.notNull())
    .addForeignKeyConstraint(
      'app_profile_id_fk',
      ['profile_id'],
      'profile',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createIndex('app_profile_id_index')
    .on('app')
    .column('profile_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('app').execute();
  await db.schema.dropTable('profile').execute();
}
