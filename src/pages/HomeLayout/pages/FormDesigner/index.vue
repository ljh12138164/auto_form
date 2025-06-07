<template>
  <div class="form-designer h-full bg-gray-50">
    <!-- 表单选择页面 -->
    <div v-if="!currentFormId" class="designer-home h-full flex justify-center">
      <div class="max-w-4xl w-full p-8">
        <!-- 欢迎标题 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-800 mb-4">表单设计器</h1>
          <p class="text-lg text-gray-600">
            选择一个表单开始设计，或创建新的表单
          </p>
        </div>

        <!-- 快速操作 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <el-card
            class="action-card cursor-pointer hover:shadow-lg transition-shadow"
            @click="showCreateDialog = true"
          >
            <div class="text-center p-6">
              <el-icon class="text-6xl text-blue-500 mb-4"><Plus /></el-icon>
              <h3 class="text-xl font-semibold mb-2">创建新表单</h3>
              <p class="text-gray-600">从空白开始设计你的表单</p>
            </div>
          </el-card>

          <el-card
            class="action-card cursor-pointer hover:shadow-lg transition-shadow"
            @click="showFormSelector = true"
          >
            <div class="text-center p-6">
              <el-icon class="text-6xl text-green-500 mb-4"><Edit /></el-icon>
              <h3 class="text-xl font-semibold mb-2">编辑现有表单</h3>
              <p class="text-gray-600">选择一个表单进行编辑</p>
            </div>
          </el-card>
        </div>

        <!-- 最近编辑的表单 -->
        <div v-if="recentForms.length" class="recent-section">
          <h3 class="text-2xl font-semibold mb-6">最近编辑</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <el-card
              v-for="form in recentForms"
              :key="form.id"
              class="form-card cursor-pointer hover:shadow-md transition-shadow"
              @click="openForm(form.id, form)"
            >
              <div class="p-4">
                <h4 class="font-medium mb-2 truncate">{{ form.title }}</h4>
                <p class="text-sm text-gray-500 mb-2">
                  {{ form.description || "暂无描述" }}
                </p>
                <div class="text-xs text-gray-400">
                  {{ formatDate(form.updatedAt) }}
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单设计器主界面 -->
    <div v-else class="designer-main h-full">
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
        <ComponentPanel @go-back="handleBackToList" />
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
          @back-to-list="handleBackToList"
        />
        <!-- 右侧属性配置面板 -->
        <PropertyPanel :selected-item="selectedItem" @edit-title="editTitle" />
      </div>
    </div>
    <!-- 表单选择弹窗 -->
    <el-dialog
      v-model="showFormSelector"
      title="选择表单"
      width="60%"
      class="form-selector-dialog"
    >
      <CreateForm
        @form-selected="handleFormSelected"
        @close="showFormSelector = false"
      />
    </el-dialog>
    <!-- 创建新表单弹窗 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新表单"
      width="500px"
      class="create-form-dialog"
    >
      <div class="create-form-content">
        <el-form
          :model="newFormData"
          label-width="80px"
          @submit.prevent="handleCreateForm"
        >
          <el-form-item label="表单标题" required>
            <el-input
              v-model="newFormData.title"
              placeholder="请输入表单标题"
              maxlength="50"
              show-word-limit
              @keyup.enter="handleCreateForm"
            />
          </el-form-item>
          <el-form-item label="表单描述">
            <el-input
              v-model="newFormData.description"
              type="textarea"
              placeholder="请输入表单描述（可选）"
              :rows="3"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleCreateForm"
            :disabled="!newFormData.title.trim()"
            >创建表单</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Edit } from "@element-plus/icons-vue";
import ComponentPanel from "./components/ComponentPanel/index.vue";
import DesignCanvas from "./components/DesignCanvas/index.vue";
import PropertyPanel from "./components/PropertyPanel/index.vue";
import TitleDialog from "./components/TitleDialog/index.vue";
import FormPreview from "./components/FormPreview/index.vue";
import CreateForm from "./components/CreateForm/index.vue";

// 当前选中的表单ID
const currentFormId = ref<string | null>(null);

// 弹窗控制
const showCreateDialog = ref(false);
const showFormSelector = ref(false);
const showTitleDialog = ref(false);
const showPreview = ref(false);

// 新表单数据
const newFormData = reactive({
  title: "",
  description: "",
});

// 最近编辑的表单
const recentForms = ref<any[]>([]);

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

// 创建新表单
const handleCreateForm = () => {
  if (!newFormData.title.trim()) {
    ElMessage.warning("请输入表单标题");
    return;
  }
  // const newFormId = `form_${Date.now()}`;
  // currentFormId.value = newFormId;

  // 设置表单配置
  Object.assign(formConfig, {
    title: newFormData.title,
    description: newFormData.description,
    labelWidth: "100px",
    size: "default",
  });

  // 清空表单项
  formItems.value = [];
  selectedItemId.value = null;

  // 关闭弹窗并重置数据
  showCreateDialog.value = false;
  newFormData.title = "";
  newFormData.description = "";

  ElMessage.success("表单创建成功，开始设计吧！");
};

// 打开表单
const openForm = (formId: string, formData: any) => {
  currentFormId.value = formId;
  Object.assign(formConfig, formData);
  // 这里可以加载表单的组件数据
  // formItems.value = formData.items || [];
};

// 处理表单选择
const handleFormSelected = (formId: string, formData: any) => {
  currentFormId.value = formId;
  Object.assign(formConfig, formData);
  showFormSelector.value = false;

  // 添加到最近编辑列表
  addToRecentForms(formData);
};

// 返回表单列表
const handleBackToList = () => {
  // 保存当前表单到最近编辑
  if (currentFormId.value) {
    addToRecentForms({
      id: currentFormId.value,
      title: formConfig.title,
      description: formConfig.description,
      updatedAt: new Date().toISOString(),
    });
  }

  currentFormId.value = null;
  // 重置数据
  formItems.value = [];
  selectedItemId.value = null;
};

// 添加到最近编辑列表
const addToRecentForms = (formData: any) => {
  const existingIndex = recentForms.value.findIndex(
    (f) => f.id === formData.id
  );
  if (existingIndex > -1) {
    recentForms.value.splice(existingIndex, 1);
  }
  recentForms.value.unshift({
    ...formData,
    updatedAt: new Date().toISOString(),
  });
  // 只保留最近10个
  if (recentForms.value.length > 10) {
    recentForms.value = recentForms.value.slice(0, 10);
  }
  // 保存到本地存储
  localStorage.setItem("recentForms", JSON.stringify(recentForms.value));
};

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "今天";
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
};

// 加载最近编辑的表单
const loadRecentForms = () => {
  const saved = localStorage.getItem("recentForms");
  if (saved) {
    try {
      recentForms.value = JSON.parse(saved);
    } catch (e) {
      console.error("加载最近表单失败:", e);
    }
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadRecentForms();
});

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

const handleSave = () => {
  if (!formConfig.title.trim()) {
    ElMessage.warning("请先设置表单标题");
    return;
  }
  // 保存到最近编辑
  addToRecentForms({
    id: currentFormId.value,
    title: formConfig.title,
    description: formConfig.description,
    updatedAt: new Date().toISOString(),
  });
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
  ElMessage.success("表单发布成功");
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
