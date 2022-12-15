<template>
  <el-page-header
    :icon="null"
    title="Heroku I/O"
    @back="$router.push({ name: 'index' })"
  >
    <template #extra>
      <div class="flex items-center">
        <el-button type="info" :icon="Refresh" circle @click="refresh" />
        <el-button
          type="info"
          :icon="Setting"
          circle
          @click="$router.push({ name: 'settings' })"
        />
      </div>
    </template>
    <template v-if="displayStore.apps.length > 0">
      <app-card
        v-for="app in displayStore.apps"
        :key="app.id"
        :ref="setAppCardRefs"
        :app="app"
      >
      </app-card>
    </template>
    <el-empty
      v-else
      description="Not found apps. Please add apps at settings page."
    />
  </el-page-header>
</template>

<script setup lang="ts">
import { Setting, Refresh } from '@element-plus/icons-vue';
import { ElButton, ElEmpty, ElLink, ElPageHeader } from 'element-plus';
import { AppCard } from '#components';

const displayStore = useDisplayStore();
const appCardRefs = ref<typeof AppCard[]>([]);

const setAppCardRefs = (el: typeof AppCard) => {
  appCardRefs.value.push(el);
  return appCardRefs;
};

const refresh = () => {
  Promise.allSettled(
    appCardRefs.value.map((card: typeof AppCard) => {
      if (card) {
        return card._.exposed.refreshAppInfo();
      }
    })
  );
};
</script>
