import { Database } from '~/databases';
import {
  DBProfile,
  formatProfile,
  FormProfile,
  parseProfile,
  Profile
} from '~/databases/models/profile';

export type SearchProfile = {
  name?: string; // 完全一致
  limit?: number;
  sorts?: [keyof DBProfile, 'asc' | 'desc'][];
};

export class ProfileAPI {
  public static async getAll(search?: SearchProfile): Promise<Profile[]> {
    const profiles = await Database.getDB()
      .selectFrom('profile')
      .selectAll()
      .if(Boolean(search?.name), (qb) => qb.where('name', '=', search!.name!))
      .if(Boolean(search?.limit), (qb) => qb.limit(search!.limit!))
      .if(Boolean(search?.sorts), (qb) =>
        search!.sorts!.reduce((qb2, sort) => qb2.orderBy(sort[0], sort[1]), qb)
      )
      .execute();

    return profiles.map((profile) => formatProfile(profile));
  }

  public static async get(profileId: number): Promise<Profile> {
    const profile = await Database.getDB()
      .selectFrom('profile')
      .selectAll()
      .where('id', '=', profileId)
      .executeTakeFirstOrThrow();

    return formatProfile(profile);
  }

  public static async create(form: FormProfile): Promise<Profile> {
    const db = Database.getDB();

    const parse = parseProfile(form);

    const { insertId } = await db
      .insertInto('profile')
      .values({
        id: 0,
        ...parse
      })
      .executeTakeFirst();

    return await this.get(Number(insertId));
  }

  public static async update(
    profileId: number,
    form: FormProfile
  ): Promise<Profile> {
    const db = Database.getDB();

    const { numUpdatedRows } = await db
      .updateTable('profile')
      .set({
        ...parseProfile(form)
      })
      .where('id', '=', profileId)
      .executeTakeFirst();

    if (Number(numUpdatedRows) === 0) {
      throw new Error('no result');
    }

    return await this.get(Number(profileId));
  }

  public static async remove(profileId: number): Promise<boolean> {
    const db = Database.getDB();

    const res = await db
      .selectFrom('app')
      .select([db.fn.count('id').as('count')])
      .where('profile_id', '=', profileId)
      .executeTakeFirst();

    if (!res) {
      throw new Error(
        'Error in obtaining the number of app filtered by profile.'
      );
    }

    if (res.count > 0) {
      throw new Error('このプロフィールは使用中です');
    }

    const { numDeletedRows } = await db
      .deleteFrom('profile')
      .where('id', '=', profileId)
      .executeTakeFirst();

    if (Number(numDeletedRows) === 0) {
      throw new Error('no result');
    }

    return true;
  }

  public static async count(): Promise<number> {
    const db = Database.getDB();

    const res = await db
      .selectFrom('profile')
      .select([db.fn.count('id').as('count')])
      .executeTakeFirst();

    if (res) {
      return Number(res.count);
    }
    throw new Error('Error in obtaining the number of profiles.');
  }
}
