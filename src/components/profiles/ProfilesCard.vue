<template>
  <el-card class="box-card mt-4">
    <template #header>
      <div class="card-header">
        <span>Profiles</span>
        <el-button class="button" text @click="dialogVisible = true"
          >Add Profile</el-button
        >
      </div>
    </template>
    <template v-if="displayStore.profiles.length > 0">
      <div
        class="text item"
        v-for="profile in displayStore.profiles"
        :key="profile.id"
      >
        {{ profile.name }}
      </div>
    </template>
    <el-empty v-else description="Not found profiles" />
    <el-dialog v-model="dialogVisible" :v-loading="loading" title="Profile">
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Authorization token" :label-width="formLabelWidth">
          <el-input v-model="form.authorization_token" autocomplete="off" />
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
  ElNotification
} from 'element-plus';
import { ProfileAPI } from '~~/src/apis';
import { FormProfile } from '~~/src/databases/models/profile';

const displayStore = useDisplayStore();

const dialogVisible = ref(false);
const loading = ref(false);
const formLabelWidth = '140px';

const form = reactive<FormProfile>({
  name: '',
  authorization_token: ''
});

const confirmDialog = async () => {
  loading.value = true;
  await ProfileAPI.create(form);
  loading.value = false;
  dialogVisible.value = false;
  form.name = '';
  form.authorization_token = '';
  await displayStore.onLoad();
  ElNotification({
    title: 'Success',
    message: 'Profile saved!',
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
