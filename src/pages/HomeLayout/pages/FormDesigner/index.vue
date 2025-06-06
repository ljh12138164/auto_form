<template>
  <div class="form-designer h-full bg-gray-50">
    <!-- 标题设置弹窗 -->
    <TitleDialog v-model="showTitleDialog" v-model:form-config="formConfig" />

    <!-- 主体区域 -->
    <div class="flex h-full">
      <!-- 左侧组件面板 -->
      <ComponentPanel />

      <!-- 中间设计画布 -->
      <DesignCanvas
        :form-config="formConfig"
        v-model:form-items="formItems"
        :selected-item-id="selectedItemId"
        @edit-title="editTitle"
        @preview="handlePreview"
        @save="handleSave"
        @publish="handlePublish"
        @select-item="handleSelectItem"
        @copy-item="handleCopyItem"
        @delete-item="handleDeleteItem"
        @form-items-change="handleFormItemsChange"
      />

      <!-- 右侧属性配置面板 -->
      <PropertyPanel
        :form-config="formConfig"
        :selected-item="selectedItem"
        @edit-title="editTitle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import ComponentPanel from "./components/ComponentPanel/index.vue";
import DesignCanvas from "./components/DesignCanvas/index.vue";
import PropertyPanel from "./components/PropertyPanel/index.vue";
import TitleDialog from "./components/TitleDialog/index.vue";

// 标题设置弹窗
const showTitleDialog = ref(true);

// 表单配置
const formConfig = reactive({
  title: "未命名表单",
  description: "",
  labelWidth: "100px",
  size: "default",
});
watch(
  () => formConfig,
  (newVal) => {
    console.log("formConfig", newVal);
  },
  {
    deep: true,
    immediate: true,
  }
);
// 选中的组件
const selectedItemId = ref<string | null>(null);
const selectedItem = computed(() => {
  return (
    formItems.value.find((item) => item.id === selectedItemId.value) || null
  );
});

// 表单项列表
const formItems = ref<any[]>([]);

// 事件处理
const editTitle = () => {
  showTitleDialog.value = true;
};

const handleSelectItem = (item: any) => {
  selectedItemId.value = item.id;
};

const handleFormItemsChange = (event: any) => {
  console.log("表单项顺序变化:", event);
};

const handleCopyItem = (item: any) => {
  const newItem = {
    ...item,
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    field: `${item.field}_copy`,
    label: `${item.label}_副本`,
  };
  formItems.value.push(newItem);
  selectedItemId.value = newItem.id;
  ElMessage.success("组件复制成功");
};

const handleDeleteItem = (index: number) => {
  const item = formItems.value[index];
  formItems.value.splice(index, 1);
  if (selectedItemId.value === item.id) {
    selectedItemId.value = null;
  }
  ElMessage.success("组件删除成功");
};

const handlePreview = () => {
  if (formItems.value.length === 0) {
    ElMessage.warning("请先添加表单组件");
    return;
  }
  console.log("预览表单:", { formConfig, formItems: formItems.value });
  ElMessage.success("预览功能开发中...");
};

const handleSave = () => {
  if (!formConfig.title.trim()) {
    ElMessage.warning("请先设置表单标题");
    return;
  }
  console.log("保存表单:", { formConfig, formItems: formItems.value });
  ElMessage.success("表单保存成功");
};

const handlePublish = () => {
  if (!formConfig.title.trim()) {
    ElMessage.warning("请先设置表单标题");
    return;
  }
  if (formItems.value.length === 0) {
    ElMessage.warning("请先添加表单组件");
    return;
  }
  console.log("发布表单:", { formConfig, formItems: formItems.value });
  ElMessage.success("表单发布成功");
};
</script>
