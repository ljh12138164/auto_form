<template>
  <div>
    首页
    <el-button @click="logout" type="primary">退出</el-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";
const userStore = useUserStore()
const router = useRouter();
const logout = async () => {
  await userStore.logout();
  router.push("/login");

};
</script>

<style lang="scss" scoped></style>
