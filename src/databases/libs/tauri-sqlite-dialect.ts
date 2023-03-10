import {
  Kysely,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  Dialect,
  Driver,
  QueryCompiler,
  DialectAdapter,
  DatabaseIntrospector
} from 'kysely';
import { TauriSqliteDialectConfig } from './tauri-sqlite-dialect-config';
import { TauriSqliteDriver } from './tauri-sqlite-driver';

export class TauriSqliteDialect implements Dialect {
  readonly #config: TauriSqliteDialectConfig;

  constructor(config: TauriSqliteDialectConfig) {
    this.#config = Object.freeze({ ...config });
  }

  createDriver(): Driver {
    return new TauriSqliteDriver(this.#config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): DialectAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<unknown>): DatabaseIntrospector {
    return new SqliteIntrospector(db);
  }
}
