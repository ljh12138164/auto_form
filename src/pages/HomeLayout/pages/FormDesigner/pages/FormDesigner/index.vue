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

      <!-- 导入JSON弹窗 -->
      <el-dialog
        v-model="showImportDialog"
        title="导入JSON数据"
        width="600px"
        style="
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          top: -100px;
        "
        :close-on-click-modal="false"
      >
        <div class="import-content">
          <p class="mb-4 text-gray-600">请粘贴您的JSON数据到下方文本框中：</p>
          <el-input
            v-model="importJsonText"
            type="textarea"
            :rows="12"
            placeholder="请输入JSON格式的表单数据..."
            class="mb-4"
          />
          <div class="example-section">
            <p class="text-sm text-gray-500 mb-2">示例格式：</p>
            <pre class="example-json">
[
  {
    "id": "field_1",
    "field": "name",
    "label": "姓名",
    "type": "input",
    "required": true,
    "placeholder": "请输入姓名"
  },
  {
    "id": "field_2",
    "field": "email",
    "label": "邮箱",
    "type": "input",
    "required": true,
    "placeholder": "请输入邮箱地址"
  }
]</pre
            >
          </div>
        </div>
        <template #footer>
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="handleImportConfirm"
            >导入</el-button
          >
        </template>
      </el-dialog>

      <!-- 主体区域 -->
      <div class="flex h-full">
        <!-- 左侧组件面板 -->
        <ComponentPanel @useTemplate="setTemplate" />
        <!-- 中间设计画布 -->
        <DesignCanvas
          :saveToHistory="saveToHistory"
          :can-undo="canUndo"
          :can-redo="canRedo"
          @undo="undo"
          @redo="redo"
          @import="importForm"
          @export="exportForm"
          @clearAll="clearAll"
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
        <el-button type="primary" @click="handleSaveAndLeave"
          >保存并离开</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getFormAPI, postSaveFormAPI,type TemplateForm,type TSaveForm } from "@/api";
import {type FormItem } from "@/types";
import { notification } from "@/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import ComponentPanel from "../../components/ComponentPanel/index.vue";
import DesignCanvas from "../../components/DesignCanvas/index.vue";
import FormPreview from "../../components/FormPreview/index.vue";
import PropertyPanel from "../../components/PropertyPanel/index.vue";
import TitleDialog from "../../components/TitleDialog/index.vue";

const route = useRoute();
const paramsId = route.params.id;

// 弹窗控制
const showTitleDialog = ref(false);
const showPreview = ref(false);
const showUnsavedDialog = ref(false);
const showImportDialog = ref(false);

// 导入相关数据
const importJsonText = ref("");
// 在 FormDesigner 组件中添加历史记录管理
const history = ref([]);
const historyIndex = ref(-1);
const maxHistorySize = 50; // 最大历史记录数量
// 表单配置
const formConfig = ref({
  title: "未命名表单",
  description: "",
});

const formItems = ref<FormItem[]>([]);
// 保存当前状态到历史记录
const saveToHistory = () => {
  const currentState = {
    formItems: JSON.parse(JSON.stringify(formItems.value)),
    formConfig: JSON.parse(JSON.stringify(formConfig.value)),
    timestamp: Date.now(),
  };

  // 如果当前不在历史记录的末尾，删除后面的记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }

  // 添加新的历史记录
  // @ts-ignore
  history.value.push(currentState);

  // 限制历史记录数量
  if (history.value.length > maxHistorySize) {
    history.value.shift();
  } else {
    historyIndex.value++;
  }
};
// 撤销操作
const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    const state = history.value[historyIndex.value];
    // @ts-ignore
    formItems.value = JSON.parse(JSON.stringify(state.formItems));
    // @ts-ignore
    formConfig.value = JSON.parse(JSON.stringify(state.formConfig));
  }
};
// 重做操作
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    const state = history.value[historyIndex.value];
    // @ts-ignore
    formItems.value = JSON.parse(JSON.stringify(state.formItems));
    // @ts-ignore
    formConfig.value = JSON.parse(JSON.stringify(state.formConfig));
  }
};
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
// 导入JSON数据
const importForm = () => {
  importJsonText.value = "";
  showImportDialog.value = true;
};

// 处理导入确认
const handleImportConfirm = () => {
  try {
    if (!importJsonText.value.trim()) {
      ElMessage.warning("请输入JSON数据");
      return;
    }

    const jsonData = JSON.parse(importJsonText.value);

    // 验证数据格式
    if (!Array.isArray(jsonData)) {
      ElMessage.error("JSON数据格式错误，应该是一个数组");
      return;
    }

    // 验证每个表单项的基本结构
    const isValidFormat = jsonData.every(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        item.field &&
        item.label &&
        item.type
    );

    if (!isValidFormat) {
      ElMessage.error(
        "JSON数据格式错误，每个表单项必须包含 id、field、label、type 字段"
      );
      return;
    }

    // 添加覆盖提示确认
    if (formItems.value.length > 0) {
      ElMessageBox.confirm(
        "导入新数据将会覆盖当前表单中的所有组件，是否继续？",
        "确认导入",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // 导入数据
          formItems.value = jsonData;
          showImportDialog.value = false;
          importJsonText.value = "";
          saveToHistory();
          ElMessage.success(`成功导入 ${jsonData.length} 个表单组件`);
        })
        .catch(() => {
          // 用户取消导入
        });
    } else {
      // 如果当前没有表单项，直接导入
      formItems.value = jsonData;
      showImportDialog.value = false;
      importJsonText.value = "";
      saveToHistory();
      ElMessage.success(`成功导入 ${jsonData.length} 个表单组件`);
    }
  } catch (error) {
    ElMessage.error("JSON格式错误，请检查数据格式");
    console.error("导入错误:", error);
  }
};
// 监听数据变更
watch(
  [formConfig, formItems],
  () => {
    if (originalFormConfig.value && originalFormItems.value) {
      const configChanged =
        JSON.stringify(formConfig.value) !==
        JSON.stringify(originalFormConfig.value);
      const itemsChanged =
        JSON.stringify(formItems.value) !==
        JSON.stringify(originalFormItems.value);
      hasUnsavedChanges.value = configChanged || itemsChanged;
    }
  },
  { deep: true }
);
// 清空表单数据
const clearAll = async () => {
  await ElMessageBox.confirm(`确定要清空表单吗?`, "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    formItems.value = [];
    saveToHistory();
    saveOriginalData();
    return ElMessage.success("清空成功");
  });
};
// 保存原始数据
const saveOriginalData = () => {
  originalFormConfig.value = JSON.parse(JSON.stringify(formConfig.value));
  originalFormItems.value = JSON.parse(JSON.stringify(formItems.value));
  hasUnsavedChanges.value = false;
};
// 计算是否可以撤销/重做
const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);
// 表单配置变更处理
const handleFormConfigChange = () => {
  // TitleDialog 更新时触发
  saveToHistory();
};
// 导出JSON
const exportForm = () => {
  const dataStr = JSON.stringify(formItems.value, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${formConfig.value.title}_${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  notification("导出成功", `${formConfig.value.title} 数据导出成功`, "success");
};
const setTemplate = (template: TemplateForm) => {
  formItems.value = template.templateConfig;
  formConfig.value.title = template.title;
  formConfig.value.description = template.description;
  saveToHistory();
  saveOriginalData(); // 保存成功后更新原始数据
};
// 保留原有的事件处理函数
const editTitle = () => {
  showTitleDialog.value = true;
};

const handleSelectItem = (item: any) => {
  selectedItemId.value = item.id;
};

const handleFormItemsChange = (event: any) => {
  console.log("表单项顺序变化:", event);
  saveToHistory();
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
  saveToHistory();
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
    saveToHistory();
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
    event.returnValue = "您有未保存的更改，确定要离开吗？";
    return "您有未保存的更改，确定要离开吗？";
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
    ElMessage.error("保存失败，无法离开");
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
const handleKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
      e.preventDefault()
      redo()
    }
  }
onMounted(() => {
  getFormData();
  window.addEventListener("beforeunload", handleBeforeUnload);
  // 添加键盘事件监听
  document.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  document.removeEventListener("keydown", handleKeydown);
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
.import-content {
  .example-section {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 12px;
    border: 1px solid #e9ecef;
  }

  .example-json {
    background-color: #f1f3f4;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    color: #666;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.form-designer {
  /* 精确计算可用高度 */
  height: calc(100vh - 6rem) !important;
  min-height: calc(100vh - 6rem);
  max-height: calc(100vh - 6rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.designer-main {
  flex: 1;
  min-height: 0; /* 重要：允许flex子项收缩 */
  height: 100%;
}

.flex.h-full {
  height: 100% !important;
  min-height: 100%;

  > * {
    height: 100%;
  }
}
</style>
