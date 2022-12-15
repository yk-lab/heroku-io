import { Generated } from 'kysely';

export type AppTable = {
  id: Generated<number>;
  name: string;
  profile_id: number;
  order: number;
};

export type DBApp = {
  id: number;
  name: string;
  profile_id: number;
  order: number;
};

export type App = {
  id: number;
  name: string;
  profile_id: number;
  order: number;
};

export type FormApp = {
  name: string;
  profile_id: number;
  order?: number;
};

export const formatApp = (db: DBApp): App => {
  return {
    id: db.id,
    name: db.name,
    order: db.order,
    profile_id: db.profile_id
  };
};

export const parseApp = (form: FormApp) => {
  // バリデ
  const name = form.name?.trim();
  if (!name) {
    throw new Error('Name is empty.');
  }

  return {
    name,
    profile_id: form.profile_id,
    order: form.order ?? 0
  };
};
