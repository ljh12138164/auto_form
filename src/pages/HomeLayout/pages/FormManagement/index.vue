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
            v-model="searchForm.name"
            placeholder="请输入表单名称"
            clearable
            style="width: 200px"
          />
        </div>

        <!-- 创建时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >创建时间</label
          >
          <el-date-picker
            @keydown.enter="handleSearch"
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
            class="w-full"
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
          prop="name"
          label="表单名称"
        >
          <template #default="{ row }">
            <div class="flex items-center justify-center">
              <el-icon class="mr-2 text-blue-500"><Document /></el-icon>
              <span class="font-medium">{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="表单描述" prop="description" />
        <el-table-column align="center" label="表单提交次数" width="120" prop="submitCount" />
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
        <el-table-column align="center" label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <div class="flex gap-2 justify-center">
              <el-button type="primary" size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="handlePreview(row)"
              >
                <el-icon><View /></el-icon>
                预览
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {getCreateFormAPI,FormItem } from "@/api";
import {
  Search,
  Refresh,
  Plus,
  Document,
  Edit,
  View,
  Delete,
} from "@element-plus/icons-vue";

const router = useRouter();

// 响应式数据
const loading = ref(false);

// 查询表单
const searchForm = reactive({
  name: "",
  dateRange: [],
});

// 表格数据
const tableData = ref<FormItem[]>([]);

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

// 工具函数
const formatDate = (dateTime: string) => {
  return dateTime.split(" ")[0];
};

const formatTime = (dateTime: string) => {
  return dateTime.split(" ")[1];
};

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
  Object.assign(searchForm, {
    name: "",
    dateRange: [],
    status: "",
  });
  handleSearch();
};

// 编辑
const handleEdit = (row: FormItem) => {
  router.push(`/form-designer?id=${row.id}`);
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
    const res = await getCreateFormAPI();
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
</style>
