import { Generated } from 'kysely';

export type ProfileTable = {
  id: Generated<number>;
  name: string;
  authorization_token: string;
};

export type DBProfile = {
  id: number;
  name: string;
  authorization_token: string;
};

export type Profile = {
  id: number;
  name: string;
  authorization_token: string;
};

export type FormProfile = {
  name: string;
  authorization_token: string;
};

export const formatProfile = (db: DBProfile): Profile => {
  return {
    id: db.id,
    name: db.name,
    authorization_token: db.authorization_token
  };
};

export const parseProfile = (form: FormProfile) => {
  const name = form.name?.trim();
  const authorization_token = form.authorization_token?.trim();
  if (!name) {
    throw new Error('Name is empty.');
  }
  if (!authorization_token) {
    throw new Error('Authorization token is empty.');
  }

  return {
    name,
    authorization_token
  };
};
