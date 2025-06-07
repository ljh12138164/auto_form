<template>
  <div class="form-designer h-full bg-gray-50">
    <!-- 表单设计器主界面 -->
    <div class="designer-main h-full">
      <!-- 标题设置弹窗 -->
      <TitleDialog v-model="showTitleDialog" v-model:form-config="formConfig" />
      <!-- 表单预览弹窗 -->
      <FormPreview
        v-if="showPreview"
        :form-config="formConfig"
        :form-items="formItems"
        @close="showPreview = false"
      />
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
          @select-item="handleSelectItem"
          @copy-item="handleCopyItem"
          @delete-item="handleDeleteItem"
          @form-items-change="handleFormItemsChange"
        />
        <!-- 右侧属性配置面板 -->
        <PropertyPanel :selected-item="selectedItem" @edit-title="editTitle" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import ComponentPanel from "../../components/ComponentPanel/index.vue";
import DesignCanvas from "../../components/DesignCanvas/index.vue";
import PropertyPanel from "../../components/PropertyPanel/index.vue";
import TitleDialog from "../../components/TitleDialog/index.vue";
import FormPreview from "../../components/FormPreview/index.vue";

// 弹窗控制
const showTitleDialog = ref(false);
const showPreview = ref(false);

// 表单配置
const formConfig = reactive({
  title: "未命名表单",
  description: "",
  labelWidth: "100px",
  size: "default",
});

// 选中的组件
const selectedItemId = ref<string | null>(null);
const selectedItem = computed(() => {
  return (
    formItems.value.find((item) => item.id === selectedItemId.value) || null
  );
});
// 表单项列表
const formItems = ref<any[]>([]);
// 保留原有的事件处理函数
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
  showPreview.value = true;
};
</script>

<style lang="scss" scoped>
.action-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.form-card {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.recent-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.create-form-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}

.form-selector-dialog {
  .el-dialog__body {
    padding: 0;
  }
}

.create-form-content {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
