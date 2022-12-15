import { Database } from '~/databases';
// import { useConfigStore } from '~~/src/stores/useConfigStore';

export default defineNuxtPlugin(async (_nuxtApp) => {
  // // load config
  // const configStore = useConfigStore();
  // await configStore.onLoad();

  // migrate db
  const { migrator } = Database.getInstance();
  await migrator?.migrateToLatest();

  // load ui data
  const displayStore = useDisplayStore();
  await displayStore.onLoad();
});
