<template>
  <el-switch v-model="modelValue" />
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<boolean>()
</script>