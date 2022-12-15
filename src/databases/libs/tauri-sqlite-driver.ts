import { Driver, DatabaseConnection, CompiledQuery, QueryResult } from 'kysely';
import TauriDatabase from 'tauri-plugin-sql-api';
import { TauriSqliteDialectConfig } from './tauri-sqlite-dialect-config';

export class TauriSqliteDriver implements Driver {
  readonly #config: TauriSqliteDialectConfig;
  readonly #connectionMutex = new ConnectionMutex();

  #db?: TauriDatabase | null;
  #connection?: DatabaseConnection;

  constructor(config: TauriSqliteDialectConfig) {
    this.#config = Object.freeze({ ...config });
  }

  async init(): Promise<void> {
    this.#db = await TauriDatabase.load(this.#config.path);
    this.#connection = new TauriSqliteConnection(this.#config, this.#db);
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    await this.#connectionMutex.lock();
    if (!this.#connection) {
      throw new Error('#connection is undefined.');
    }
    return this.#connection;
  }

  async beginTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('begin'));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('commit'));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw('rollback'));
  }

  // eslint-disable-next-line require-await
  async releaseConnection(): Promise<void> {
    this.#connectionMutex.unlock();
  }

  // eslint-disable-next-line require-await
  async destroy(): Promise<void> {
    this.#db = null;
  }
}

class TauriSqliteConnection implements DatabaseConnection {
  readonly #config: TauriSqliteDialectConfig;
  readonly #db: TauriDatabase;

  constructor(config: TauriSqliteDialectConfig, db: TauriDatabase) {
    this.#config = config;
    this.#db = db;
  }

  streamQuery<R>(
    _compiledQuery: CompiledQuery,
    _chunkSize?: number
  ): AsyncIterableIterator<QueryResult<R>> {
    throw new Error('Method not implemented.');
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const { sql, parameters } = compiledQuery;
    if (this.#config.trace) {
      // eslint-disable-next-line no-console
      console.trace(sql, parameters);
    } else if (this.#config.debug) {
      // eslint-disable-next-line no-console
      console.debug(sql, parameters);
    }

    if (sql.startsWith('select')) {
      const res = await this.#db.select(sql, parameters as unknown[]);

      return {
        rows: res as unknown as O[]
      };
    } else {
      const res = await this.#db.execute(sql, parameters as unknown[]);

      return {
        numUpdatedOrDeletedRows: BigInt(res.rowsAffected),
        insertId: BigInt(res.lastInsertId),
        rows: []
      };
    }
  }
}

class ConnectionMutex {
  #promise?: Promise<void>;
  #resolve?: () => void;

  async lock(): Promise<void> {
    while (this.#promise) {
      await this.#promise;
    }

    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  unlock(): void {
    const resolve = this.#resolve;

    this.#promise = undefined;
    this.#resolve = undefined;

    resolve?.();
  }
}
