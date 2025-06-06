<template>
  <div class="form-management">
    <!-- 创建表单区域 -->
    <div class="create-section">
      <h2 class="section-title">创建新表单</h2>
      <div class="create-form">
        <el-input
          v-model="newFormName"
          placeholder="请输入表单名称"
          class="form-name-input"
          maxlength="50"
          show-word-limit
          @keyup.enter="handleCreate"
        />
        <el-button
          type="primary"
          @click="handleCreate"
          :loading="loading"
          :disabled="!newFormName.trim()"
        >
          创建表单
        </el-button>
      </div>
    </div>

    <!-- 表单列表区域 -->
    <div class="forms-section">
      <h2 class="section-title">我的表单</h2>
      <div class="forms-grid" v-if="formList.length > 0">
        <div
          v-for="form in formList"
          :key="form.id"
          class="form-card"
          @click="openForm(form)"
        >
          <div class="form-card-header">
            <h3 class="form-title">{{ form.title }}</h3>
            <div class="form-actions">
              <el-button type="text" size="small" @click.stop="editForm(form)">
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="deleteForm(form)"
                class="delete-btn"
              >
                删除
              </el-button>
            </div>
          </div>
          <div class="form-info">
            <p class="form-desc">{{ form.description || "暂无描述" }}</p>
            <div class="form-meta">
              <span class="create-time"
                >创建时间：{{ formatDate(form.createTime) }}</span
              >
              <span class="update-time"
                >更新时间：{{ formatDate(form.updateTime) }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>还没有创建任何表单</p>
        <p class="empty-tip">在上方输入表单名称开始创建吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

interface FormItem {
  id: string;
  title: string;
  description?: string;
  createTime: string;
  updateTime: string;
}

// 定义事件
const emit = defineEmits<{
  'form-selected': [formId: string, formData: any]
}>();

const loading = ref(false);
const newFormName = ref("");
const formList = ref<FormItem[]>([]);

// 模拟数据，实际项目中从API获取
const mockForms: FormItem[] = [
  {
    id: "1",
    title: "用户反馈表",
    description: "收集用户对产品的反馈意见",
    createTime: "2024-01-15 10:30:00",
    updateTime: "2024-01-16 14:20:00",
  },
  {
    id: "2",
    title: "员工信息登记表",
    description: "新员工入职信息收集",
    createTime: "2024-01-10 09:15:00",
    updateTime: "2024-01-12 16:45:00",
  },
];

onMounted(() => {
  // 模拟加载表单列表
  formList.value = mockForms;
});

// 创建新表单
const handleCreate = async () => {
  if (!newFormName.value.trim()) {
    ElMessage.warning("请输入表单名称");
    return;
  }

  loading.value = true;
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newForm: FormItem = {
      id: Date.now().toString(),
      title: newFormName.value.trim(),
      description: "",
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
    };

    formList.value.unshift(newForm);
    newFormName.value = "";

    ElMessage.success("表单创建成功");

    // 跳转到表单设计器
    openForm(newForm);
  } catch (error) {
    ElMessage.error("创建失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 打开表单设计器
const openForm = (form: FormItem) => {
  // 触发form-selected事件，传递表单ID和表单数据
  const formData = {
    title: form.title,
    description: form.description || "",
    labelWidth: "100px",
    size: "default"
  };
  
  emit('form-selected', form.id, formData);
  ElMessage.success(`已打开表单：${form.title}`);
};

// 编辑表单
const editForm = (form: FormItem) => {
  openForm(form);
};

// 删除表单
const deleteForm = async (form: FormItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除表单"${form.title}"吗？此操作不可恢复。`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const index = formList.value.findIndex((f) => f.id === form.id);
    if (index > -1) {
      formList.value.splice(index, 1);
      ElMessage.success("删除成功");
    }
  } catch {
    // 用户取消删除
  }
};

// 格式化日期
const formatDate = (dateStr: string) => {
  return dateStr.split(" ")[0]; // 只显示日期部分
};
</script>

<style scoped>
.form-management {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.create-section {
  margin-bottom: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.create-form {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.form-name-input {
  flex: 1;
  max-width: 400px;
}

.forms-section {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  padding: 24px;
}

.forms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.form-card {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.form-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.form-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  color: #f56c6c;
}

.form-info {
  color: #606266;
}

.form-desc {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #909399;
}

.form-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #c0c4cc;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-tip {
  font-size: 14px;
  color: #c0c4cc;
  margin-top: 8px;
}
</style>
