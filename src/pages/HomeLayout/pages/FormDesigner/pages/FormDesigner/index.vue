<template>
  <div class="form-designer h-full bg-gray-50">
    <!-- 表单设计器主界面 -->
    <div class="designer-main h-full">
      <!-- 标题设置弹窗 -->
      <TitleDialog
        v-model:visibleValue="showTitleDialog"
        v-model:formConfig="formConfig"
        @update:formConfig="handleFormConfigChange"
      />
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
        <ComponentPanel @useTemplate="setTemplate" />
        <!-- 中间设计画布 -->
        <DesignCanvas
          :form-config="formConfig"
          v-model:form-items="formItems"
          :selected-item-id="selectedItemId"
          @edit-title="editTitle"
          @preview="handlePreview"
          @save="handleSave"
          @select-item="handleSelectItem"
          @copy-item="handleCopyItem"
          @delete-item="handleDeleteItem"
          @form-items-change="handleFormItemsChange"
        />
        <!-- 右侧属性配置面板 -->
        <PropertyPanel :selected-item="selectedItem" @edit-title="editTitle" />
      </div>
    </div>
    
    <!-- 未保存提示对话框 -->
    <el-dialog
      v-model="showUnsavedDialog"
      title="未保存的更改"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p>您有未保存的更改，是否要保存？</p>
      <template #footer>
        <el-button @click="handleDiscardChanges">不保存</el-button>
        <el-button @click="handleCancelLeave">取消</el-button>
        <el-button type="primary" @click="handleSaveAndLeave">保存并离开</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getFormAPI, postSaveFormAPI, TSaveForm } from "@/api";
import { FormItem } from "@/types";
import { notification } from "@/utils";
import { ElMessage } from "element-plus";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import ComponentPanel from "../../components/ComponentPanel/index.vue";
import DesignCanvas from "../../components/DesignCanvas/index.vue";
import FormPreview from "../../components/FormPreview/index.vue";
import PropertyPanel from "../../components/PropertyPanel/index.vue";
import TitleDialog from "../../components/TitleDialog/index.vue";
import { TemplateForm } from "@/api";

const route = useRoute();
const router = useRouter();
const paramsId = route.params.id;

// 弹窗控制
const showTitleDialog = ref(false);
const showPreview = ref(false);
const showUnsavedDialog = ref(false);

// 表单配置
const formConfig = ref({
  title: "未命名表单",
  description: "",
});

const formItems = ref<FormItem[]>([]);

// 数据变更跟踪
const hasUnsavedChanges = ref(false);
const originalFormConfig = ref<any>(null);
const originalFormItems = ref<FormItem[]>([]);
let pendingNavigation: any = null;

// 选中的组件
const selectedItemId = ref<string | null>(null);
const selectedItem = computed(() => {
  return (
    formItems.value.find((item) => item.id === selectedItemId.value) || null
  );
});

// 监听数据变更
watch(
  [formConfig, formItems],
  () => {
    if (originalFormConfig.value && originalFormItems.value) {
      const configChanged = JSON.stringify(formConfig.value) !== JSON.stringify(originalFormConfig.value);
      const itemsChanged = JSON.stringify(formItems.value) !== JSON.stringify(originalFormItems.value);
      hasUnsavedChanges.value = configChanged || itemsChanged;
    }
  },
  { deep: true }
);

// 保存原始数据
const saveOriginalData = () => {
  originalFormConfig.value = JSON.parse(JSON.stringify(formConfig.value));
  originalFormItems.value = JSON.parse(JSON.stringify(formItems.value));
  hasUnsavedChanges.value = false;
};

// 表单配置变更处理
const handleFormConfigChange = () => {
  // TitleDialog 更新时触发
};
const setTemplate = (template: TemplateForm) => {
  formItems.value = template.templateConfig;
  formConfig.value.title = template.title;
  formConfig.value.description = template.description;
  saveOriginalData(); // 保存成功后更新原始数据
}
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

const handleSave = async () => {
  const data: TSaveForm = {
    id: paramsId as string,
    description: formConfig.value.description,
    title: formConfig.value.title,
    form_config: formItems.value,
  };
  try {
    await postSaveFormAPI(data);
    saveOriginalData(); // 保存成功后更新原始数据
    return notification("保存成功", "", "success");
  } catch (err) {
    return notification("保存失败", "", "error");
  }
};

const getFormData = async () => {
  try {
    const res = await getFormAPI(paramsId as string);
    // @ts-ignore
    const { title, description, form_config } = res?.data!;
    formConfig.value.title = title;
    formConfig.value.description = description;
    formItems.value = form_config;
    
    // 保存初始数据
    saveOriginalData();
  } catch (err) {
    console.log(err);
  }
};

// 路由守卫 - 离开前检查
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    pendingNavigation = { to, from, next };
    showUnsavedDialog.value = true;
  } else {
    next();
  }
});

// 浏览器刷新/关闭前提示
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault();
    event.returnValue = '您有未保存的更改，确定要离开吗？';
    return '您有未保存的更改，确定要离开吗？';
  }
};

// 未保存对话框处理函数
const handleSaveAndLeave = async () => {
  try {
    await handleSave();
    showUnsavedDialog.value = false;
    if (pendingNavigation) {
      pendingNavigation.next();
      pendingNavigation = null;
    }
  } catch (err) {
    ElMessage.error('保存失败，无法离开');
  }
};

const handleDiscardChanges = () => {
  hasUnsavedChanges.value = false;
  showUnsavedDialog.value = false;
  if (pendingNavigation) {
    pendingNavigation.next();
    pendingNavigation = null;
  }
};

const handleCancelLeave = () => {
  showUnsavedDialog.value = false;
  if (pendingNavigation) {
    pendingNavigation.next(false);
    pendingNavigation = null;
  }
};

onMounted(() => {
  getFormData();
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
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
