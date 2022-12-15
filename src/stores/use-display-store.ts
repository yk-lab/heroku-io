import { defineStore } from 'pinia';
import { ProfileAPI, AppAPI } from '~/apis';
import { Profile } from '~/databases/models/profile';
import { App } from '~/databases/models/app';

export const useDisplayStore = defineStore('display', () => {
  // const configStore = useConfigStore();
  // const calendarStore = useCalendarStore();

  const _profiles = ref<Profile[]>([]); // 最近の更新
  const _apps = ref<App[]>([]); // タグ一覧

  const _profileCount = ref<number>(0);
  const _appCount = ref<number>(0);

  const onLoad = async () => {
    _profiles.value = await ProfileAPI.getAll({
      sorts: [['id', 'asc']]
    });
    _apps.value = await AppAPI.getAll({
      sorts: [
        ['order', 'asc'],
        ['id', 'asc']
      ]
    });

    // 総数
    _profileCount.value = await ProfileAPI.count();
    _appCount.value = await AppAPI.count();
  };

  return {
    profiles: computed(() => _profiles.value),
    apps: computed(() => _apps.value),

    profileCount: computed(() => _profileCount.value),
    appCount: computed(() => _appCount.value),

    onLoad
  };
});
