<template>
  <el-page-header @back="$router.go(-1)">
    <template #content>
      <span class="text-large font-600 mr-3"> Settings </span>
    </template>
    <div class="mt-3">
      <el-space
        wrap
        fill
        direction="vertical"
        :fill-ratio="100"
        :size="20"
        style="width: 100%"
      >
        <profiles-card></profiles-card>
        <apps-card></apps-card>
      </el-space>
    </div>
  </el-page-header>
</template>

<script lang="ts" setup>
import { ElPageHeader, ElSpace } from 'element-plus';
</script>
