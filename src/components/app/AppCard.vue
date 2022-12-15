<template>
  <div>
    {{ app.name }}
    <span>{{ msg }}</span>
    <el-button class="button" @click="startDyno">Start App</el-button>
    <el-button class="button" @click="stopDyno">Stop App</el-button>
  </div>
</template>

<script setup lang="ts">
import { App } from '~~/src/databases/models/app';
import { ProfileAPI } from '~~/src/apis';
import { invoke } from '@tauri-apps/api/tauri';
import { ElButton, ElMessage } from 'element-plus';
import type { AppInfo } from '~~/src/tauri_structs/main';

interface Props {
  app: App;
}

const props = withDefaults(defineProps<Props>(), {});

const msg = ref('');
const profile = await ProfileAPI.get(props.app.profile_id);

const refreshAppInfo = () => {
  invoke<AppInfo>('app_info', {
    token: profile.authorization_token,
    app: props.app.name
  }).then((result) => {
    msg.value = JSON.stringify(result);
  });
};

onMounted(() => {
  refreshAppInfo();
});

const startDyno = () => {
  invoke<AppInfo>('app_info', {
    token: profile.authorization_token,
    app: props.app.name
  })
    .then(async (appInfo) => {
      if (appInfo.active_dyno.length == 0) {
        const resp = await invoke('scaling_dyno', {
          token: profile.authorization_token,
          app: props.app.name,
          processType: 'web',
          num: 1
        });
        console.log(JSON.stringify(resp));
        return resp;
      } else {
        throw new Error('Already Started.');
      }
    })
    .catch((reason) => {
      ElMessage.error(reason);
    })
    .finally(async () => {
      refreshAppInfo();
    });
};

const stopDyno = async () => {
  try {
    await invoke('scaling_dyno', {
      token: profile.authorization_token,
      app: props.app.name,
      processType: 'web',
      num: 0
    });
  } catch (reason) {
    ElMessage.error(String(reason));
  } finally {
    refreshAppInfo();
  }
};

defineExpose({
  refreshAppInfo
});
</script>
