import type { Dyno } from './types/heroku';

export type AppInfo = {
  active_dyno: Dyno[];
};
