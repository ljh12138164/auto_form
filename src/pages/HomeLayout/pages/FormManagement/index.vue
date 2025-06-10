<template>
  <div class="form-management bg-gray-50 p-6">
    <!-- 搜索和筛选区域 -->
    <div class="bg-white rounded-lg border-gray-200 shadow-sm border p-6 mb-6">
      <div class="flex gap-10">
        <!-- 表单名称搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >表单名称</label
          >
          <el-input
            @keydown.enter="handleSearch"
            v-model="searchForm.title"
            placeholder="请输入表单名称"
            clearable
            style="width: 200px"
          />
        </div>

        <!-- 创建时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >表单描述</label
          >
          <el-input
            @keydown.enter="handleSearch"
            v-model="searchForm.description"
            placeholder="请输入表单描述"
            clearable
            style="width: 200px"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between items-center mt-6">
        <div class="flex gap-3">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleCreateForm">
            <el-icon><Plus /></el-icon>
            新增表单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg border-gray-200 shadow-sm border">
      <div class="p-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-800">我的表单</h3>
          <div class="text-sm text-gray-500">
            共 {{ pagination.total }} 个表单
          </div>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe class="w-full">
        <el-table-column align="center" type="index" label="序号" :width="80" />
        <el-table-column
          align="center"
          prop="title"
          label="表单名称"
          width="200"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <el-icon class="mr-2 text-blue-500"><Document /></el-icon>
              <span class="font-medium">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="表单描述"
          prop="description"
          width="300"
        >
          <template #default="{ row }">
            <div class="text-ellipsis-2 text-gray-600">
              {{ row.description || "暂无描述" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="表单提交次数"
          width="120"
          prop="submitCount"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="180"
        >
          <template #default="{ row }">
            <div class="text-gray-600 text-center">
              <div>{{ formatDate(row.createTime) }}</div>
              <div class="text-xs text-gray-400">
                {{ formatTime(row.createTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="更新时间"
          width="180"
        >
          <template #default="{ row }">
            <div class="text-gray-600 text-center">
              <div>{{ formatDate(row.updateTime) }}</div>
              <div class="text-xs text-gray-400">
                {{ formatTime(row.updateTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template #default="{ row }">
            <div class="flex gap-2 justify-center">
              <el-button
                link
                type="info"
                size="small"
                @click="handleDetails(row)"
              >
                <el-icon><InfoFilled /></el-icon>
                详情
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleEdit(row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                link
                type="success"
                size="small"
                @click="handlePreview(row)"
              >
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-button
                link
                type="warning"
                size="small"
                @click="handleExport(row)"
              >
                <el-icon><Download /></el-icon>
                导出
              </el-button>
              <el-button
                link
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="p-4 border-t border-gray-200">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="justify-end"
        />
      </div>
    </div>

    <!-- 表单详情对话框 -->
    <el-dialog
      v-model="detailsDialogVisible"
      title="表单详情"
      width="1000px"
      :before-close="handleCloseDetails"
      style="
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: -100px;
      "
    >
      <div v-if="currentForm" class="space-y-6">
        <!-- 基本信息 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-lg font-medium mb-4 text-gray-800">基本信息</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-600">表单名称：</span>
              <span class="font-medium">{{ currentForm.title }}</span>
            </div>
            <div>
              <span class="text-gray-600">表单ID：</span>
              <span class="font-medium">{{ currentForm.id }}</span>
            </div>
            <div>
              <span class="text-gray-600">创建时间：</span>
              <span>{{ currentForm.createTime }}</span>
            </div>
            <div>
              <span class="text-gray-600">更新时间：</span>
              <span>{{ currentForm.updateTime }}</span>
            </div>
            <div class="col-span-2">
              <span class="text-gray-600">表单描述：</span>
              <span>{{ currentForm.description || "暂无描述" }}</span>
            </div>
            <div>
              <span class="text-gray-600">提交次数：</span>
              <span class="font-medium text-blue-600">{{
                currentForm.submitCount
              }}</span>
            </div>
          </div>
        </div>

        <!-- 表单配置 -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-lg font-medium mb-4 text-gray-800">表单配置</h4>
          <pre
            class="bg-white p-4 rounded border text-sm overflow-auto max-h-96 text-gray-800"
            >{{ JSON.stringify(currentForm.formConfig, null, 2) }}</pre
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getCreateFormAPI, FormItem } from "@/api";
import {
  Download,
  Search,
  Refresh,
  Plus,
  Document,
  Edit,
  View,
  Delete,
  InfoFilled,
} from "@element-plus/icons-vue";

const router = useRouter();

// 响应式数据
const loading = ref(false);

// 查询表单
const searchForm = ref({
  title: null,
  description: null,
});

// 表格数据
const tableData = ref<FormItem[]>([]);

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 详情对话框
const detailsDialogVisible = ref(false);
const currentForm = ref<FormItem | null>(null);

// 工具函数
const formatDate = (dateTime: string) => {
  return dateTime.split(" ")[0];
};

const formatTime = (dateTime: string) => {
  return dateTime.split(" ")[1];
};
// 导出JSON
const handleExport = (row: FormItem) => {
  const blob = new Blob([JSON.stringify(row.formConfig, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${row.title}.json`;
  link.click();
  URL.revokeObjectURL(url);
  ElMessage.success("导出成功");
}
// 新增表单
const handleCreateForm = () => {
  router.push("/home/form-designer");
};

// 查询
const handleSearch = () => {
  pagination.value.currentPage = 1;
  loadTableData();
};

// 重置
const handleReset = () => {
  searchForm.value.title = null;
  searchForm.value.description = null;
  pagination.value.currentPage = 1;
  pagination.value.pageSize = 10;
  handleSearch();
};

// 编辑
const handleEdit = (row: FormItem) => {
  router.push(`/home/form-designer/designer/${row.id}`);
};

// 预览
const handlePreview = (row: FormItem) => {
  window.open(`/form-preview/${row.id}`, "_blank");
};

// 删除
const handleDelete = async (row: FormItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除表单"${row.title}"吗？删除后无法恢复。`,
      "删除确认",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    // 这里调用删除API
    // await deleteForm(row.id)

    ElMessage.success("删除成功");
    loadTableData();
  } catch {
    // 用户取消删除
  }
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val;
  loadTableData();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val;
  loadTableData();
};

// 加载表格数据
const loadTableData = async () => {
  loading.value = true;
  try {
    const res = await getCreateFormAPI({
      ...searchForm.value,
      ...pagination.value,
    });
    tableData.value = res.data.createData;
    pagination.value.total = res.data.total as number;
  } catch (error) {
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadTableData();
});

// 查看详情
const handleDetails = (row: FormItem) => {
  currentForm.value = row;
  detailsDialogVisible.value = true;
};

// 关闭详情对话框
const handleCloseDetails = () => {
  detailsDialogVisible.value = false;
  currentForm.value = null;
};
</script>

<style lang="scss" scoped>
.form-management {
  min-height: 100%;
}

.el-table {
  --el-table-border-color: #e5e7eb;
}

.el-pagination {
  --el-pagination-bg-color: transparent;
}

pre {
  font-family: "Courier New", Courier, monospace;
  line-height: 1.4;
}

// 文本溢出隐藏样式
.text-ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
</style>
