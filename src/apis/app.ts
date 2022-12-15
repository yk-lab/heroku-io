import { Database } from '~/databases';
import {
  DBApp,
  formatApp,
  FormApp,
  parseApp,
  App
} from '~/databases/models/app';

export type SearchApp = {
  name?: string; // 完全一致
  limit?: number;
  sorts?: [keyof DBApp, 'asc' | 'desc'][];
};

export class AppAPI {
  public static async getAll(search?: SearchApp): Promise<App[]> {
    const apps = await Database.getDB()
      .selectFrom('app')
      .selectAll()
      .if(Boolean(search?.name), (qb) => qb.where('name', '=', search!.name!))
      .if(Boolean(search?.limit), (qb) => qb.limit(search!.limit!))
      .if(Boolean(search?.sorts), (qb) =>
        search!.sorts!.reduce((qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb)
      )
      .execute();

    return apps.map((app) => formatApp(app));
  }

  public static async get(appId: number): Promise<App> {
    const app = await Database.getDB()
      .selectFrom('app')
      .selectAll()
      .where('id', '=', appId)
      .executeTakeFirstOrThrow();

    return formatApp(app);
  }

  public static async create(form: FormApp): Promise<App> {
    const db = Database.getDB();

    const parse = parseApp(form);

    const { insertId } = await db
      .insertInto('app')
      .values({
        ...parse
      })
      .executeTakeFirst();

    return await this.get(Number(insertId));
  }

  public static async update(appId: number, form: FormApp): Promise<App> {
    const db = Database.getDB();

    const { numUpdatedRows } = await db
      .updateTable('app')
      .set({
        ...parseApp(form)
      })
      .where('id', '=', appId)
      .executeTakeFirst();

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result');
    }

    return await this.get(Number(appId));
  }

  public static async remove(appId: number): Promise<boolean> {
    const db = Database.getDB();

    const { numDeletedRows } = await db
      .deleteFrom('app')
      .where('id', '=', appId)
      .executeTakeFirst();

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result');
    }

    return true;
  }

  public static async count(): Promise<number> {
    const db = Database.getDB();

    const res = await db
      .selectFrom('app')
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst();

    if (!res) {
      throw new Error('Error in obtaining the number of apps.');
    }

    return Number(res.count);
  }
}
