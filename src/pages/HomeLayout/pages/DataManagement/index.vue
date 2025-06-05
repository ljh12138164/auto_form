<template>
  <div class="data-management bg-gray-50 p-6">
    <!-- 搜索和筛选区域 -->
    <div class="bg-white rounded-lg border-gray-200 shadow-sm border p-6 mb-6">
      <div class="flex gap-10">
        <!-- 标题搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >表单标题</label
          >
          <el-input
            v-model="searchForm.title"
            placeholder="请输入表单标题"
            clearable
            style="width: 200px"
          />
        </div>

        <!-- 提交时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >提交时间</label
          >
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </div>

        <!-- 内容关键词搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >内容关键词</label
          >
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索提交内容"
            clearable
            class="w-full"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-between items-center mt-6">
        <div class="flex gap-3">
          <el-button type="primary" @click="getSubmitFormData" :loading="loading">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button
            type="warning"
            @click="handleBatchDelete"
            :disabled="!selectedRows.length"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="bg-white rounded-lg border-gray-200 shadow-sm border">
      <div class="p-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-800">我的提交记录</h3>
          <div class="text-sm text-gray-500">
            共 {{ total }} 条记录
          </div>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        stripe
        class="w-full"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="id" width="80" />
        <el-table-column
          align="center"
          prop="title"
          label="表单标题"
          width="250"
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
          prop="submitTime"
          label="提交时间"
          width="180"
        >
          <template #default="{ row }">
            <div class="text-gray-600 text-center">
              <div>{{ formatDate(row.submitTime) }}</div>
              <div class="text-xs text-gray-400">
                {{ formatTime(row.submitTime) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dataPreview" label="数据预览">
          <template #default="{ row }">
            <div class="text-sm text-gray-600 text-center">
              <div class="truncate">{{ getDataPreview(row.data) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <div class="flex gap-2 justify-center">
              <el-button type="primary" size="small" @click="handleView(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button type="warning" size="small" @click="handleExportSingle(row)">
                <el-icon><Download /></el-icon>
                导出
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
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="justify-end"
        />
      </div>
    </div>

    <!-- 数据详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="数据详情"
      width="50%"
      :before-close="handleCloseDetail"
    >
      <div v-if="currentRowData">
        <div class="mb-4">
          <h4 class="text-lg font-medium mb-3">{{ currentRowData?.title }}</h4>
          <div class="text-sm text-gray-500 mb-4">
            提交时间：{{ formatDateTime(currentRowData?.submitTime) }}
          </div>
        </div>
        <div>
          <h4 class="text-base font-medium mb-3">提交数据</h4>
          <div class="bg-gray-50 p-4 rounded-lg border-gray-200">
            <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{
              JSON.stringify(currentRowData.data, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleExportSingle(currentRowData)"
            >导出此数据</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Delete,
  Download,
  Document,
  View,
} from "@element-plus/icons-vue";
import { getSubmitFormAPI, TsubmittedItem } from "@/api";
import { notification } from "@/utils";

// 响应式数据
const loading = ref(false);
const exportLoading = ref(false);
const detailDialogVisible = ref(false);
const selectedRows = ref<TsubmittedItem[]>([]);
const currentRowData = ref<TsubmittedItem|null>(null);

// 搜索表单
const searchForm = reactive({
  title: "",
  dateRange: [],
  keyword: "",
});
const total=ref()
// 分页
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 表格数据 - 模拟用户自己提交的数据
const tableData = ref<TsubmittedItem[]>([]);
const getSubmitFormData = async () => {
  loading.value = true;
  // 模拟获取数据请求
  const res = await getSubmitFormAPI(pagination)
  tableData.value = res.data.submittedDate
  total.value=res.data.total
  loading.value = false;
}
onMounted(()=>{
    getSubmitFormData()
})
// 工具函数
const formatDate = (dateTime: string) => {
  return dateTime.split(" ")[0];
};

const formatTime = (dateTime: string) => {
  return dateTime.split(" ")[1];
};

const formatDateTime = (dateTime: string) => {
  return dateTime;
};

const getDataPreview = (data: any) => {
  const keys = Object.keys(data);
  if (keys.length === 0) return "无数据";

  // 显示前3个字段的键值对
  const preview = keys
    .slice(0, 3)
    .map((key) => {
      const value = data[key];
      // 如果值太长就截断
      const displayValue =
        String(value).length > 8
          ? String(value).substring(0, 8) + "..."
          : value;
      return `${key}:${displayValue}`;
    })
    .join(", ");

  return keys.length > 3 ? `${preview}...` : preview;
};
// 事件处理函数
// const handleSearch = () => {
//   loading.value = true;
//   // 模拟搜索请求
//   setTimeout(() => {
//     loading.value = false;
//     ElMessage.success("搜索完成");
//   }, 1000);
// };

const handleReset = () => {
  Object.assign(searchForm, {
    title: "",
    dateRange: [],
    keyword: "",
  });
  getSubmitFormData();
};

const handleExport = () => {
  exportLoading.value = true;
  // 模拟导出请求
  setTimeout(() => {
    exportLoading.value = false;
    ElMessage.success("导出成功，文件已下载到本地");
  }, 2000);
};

const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条数据吗？删除后无法恢复。`,
    "批量删除确认",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    ElMessage.success("删除成功");
    selectedRows.value = [];
    // 这里应该调用删除API
  });
};

const handleSelectionChange = (selection:TsubmittedItem[]) => {
  console.log(selection);
  
  selectedRows.value = selection;
};

const handleView = (row:TsubmittedItem) => {
  console.log(row)
  currentRowData.value = row;
  detailDialogVisible.value = true;
};

const handleExportSingle = (row: any) => {
  // 模拟单条数据导出
  const dataStr = JSON.stringify(row.data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${row.title}_${row.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
  notification("导出成功", `${row.title} 数据导出成功`, "success");
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除「${row.title}」的提交数据吗？删除后无法恢复。`,
    "删除确认",
    {
      confirmButtonText: "确定删除",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(() => {
    ElMessage.success("删除成功");
    // 这里应该调用删除API并刷新列表
  });
};

const handleCloseDetail = () => {
  detailDialogVisible.value = false;
  currentRowData.value = null;
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  getSubmitFormData();
};

const handleCurrentChange = (page: number) => {
  pagination.pageNum = page;
  getSubmitFormData();
};

</script>

<style lang="scss" scoped>
.data-management {
  min-height: 100%;
}

.el-table {
  --el-table-border-color: #e5e7eb;
}

.el-pagination {
  --el-pagination-bg-color: transparent;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
}
</style>
