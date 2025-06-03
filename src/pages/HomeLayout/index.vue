<template>
  <div>
    首页
    <el-button @click="logout" type="primary">退出</el-button>
  </div>
</template>

<script setup lang="ts">
import { postLogoutAPI } from "@/api";
import { clearTokens, notification } from "@/utils";
import { useRouter } from "vue-router";
const router = useRouter();
const logout = async () => {
  try {
    await postLogoutAPI();
    clearTokens();
    notification("退出成功", "", "success");
    router.push("/login");
  } catch (error) {
    console.log(error);
    notification("退出失败", "", "error");
  }
};
</script>

<style lang="scss" scoped></style>
