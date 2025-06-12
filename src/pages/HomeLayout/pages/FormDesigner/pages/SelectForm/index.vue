<template>
  <div class="form-designer h-full bg-gray-50">
    <!-- 表单选择页面 -->
    <div class="designer-home h-full flex justify-center">
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
      </div>
    </div>
    <!-- 表单选择弹窗 -->
    <el-dialog
      v-model="showFormSelector"
      title="选择表单"
      width="60%"
      class="form-selector-dialog"
    >
      <CreateForm ref="createFormRef" @close="showFormSelector = false" />
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
          <el-form-item label="表单名称" required>
            <el-input
              v-model="newFormData.title"
              placeholder="请输入表单名称"
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
import { postCreateFormAPI } from "@/api";
import { Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import CreateForm from "../../components/CreateForm/index.vue";
import useCreateStore from "@/stores/modules/createForm";
import { useRouter } from "vue-router";
import { notification } from "@/utils";
const router = useRouter()
const createStore = useCreateStore()
// 弹窗控制
const showCreateDialog = ref(false);
const showFormSelector = ref(false);

const goForm = (id:number|string)=>{
  router.push({ path: `/home/form-designer/designer/${id}` })
}
// 新表单数据
const newFormData = reactive({
  title: "",
  description: "",
});
// 创建新表单
const handleCreateForm = async () => {
  if (!newFormData.title.trim()) {
    ElMessage.warning("请输入表单名称");
    return;
  }
  try {
    const data = {
      title: newFormData.title,
      description: newFormData.description,
    };
    await postCreateFormAPI(data);
    // 关闭弹窗并重置数据
    showCreateDialog.value = false;
    newFormData.title = "";
    newFormData.description = "";
    await createStore.getCreateFormData()
    notification("表单创建成功","", "success");
    // 跳转到表单设计器
    goForm(createStore.createFormInfo[0].id);
  } catch (error) {
    notification("创建失败，请重试","", "error");
    console.error(error);
  }
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
