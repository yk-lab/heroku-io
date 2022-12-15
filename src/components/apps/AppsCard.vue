<template>
  <el-card class="box-card mt-4">
    <template #header>
      <div class="card-header">
        <span>Apps</span>
        <el-button class="button" text @click="dialogVisible = true"
          >Add App</el-button
        >
      </div>
    </template>
    <template v-if="displayStore.apps.length > 0">
      <div class="text item" v-for="app in displayStore.apps" :key="app.id">
        {{ app.name }}
      </div>
    </template>
    <el-empty v-else description="Not found apps" />
    <el-dialog v-model="dialogVisible" :v-loading="loading" title="Profile">
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Authorization token" :label-width="formLabelWidth">
          <el-select
            v-model="form.profile_id"
            placeholder="Select Profile"
            autocomplete="off"
          >
            <el-option
              v-for="profile in displayStore.profiles"
              :key="`profile-${profile.id}`"
              :label="profile.name"
              :value="profile.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmDialog"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import {
  ElButton,
  ElCard,
  ElDialog,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElNotification
} from 'element-plus';
import { AppAPI } from '~~/src/apis';
import { FormApp } from '~~/src/databases/models/app';

const displayStore = useDisplayStore();

const dialogVisible = ref(false);
const loading = ref(false);
const formLabelWidth = '140px';

const form = reactive<FormApp>({
  name: '',
  profile_id: -1
});

const confirmDialog = async () => {
  loading.value = true;
  await AppAPI.create(form);
  loading.value = false;
  dialogVisible.value = false;
  form.name = '';
  form.profile_id = -1;
  await displayStore.onLoad();
  ElNotification({
    title: 'Success',
    message: 'App saved!',
    type: 'success'
  });
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
</style>
