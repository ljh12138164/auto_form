<template>
  <div class="code-generator">
    <!-- 表单选择区域 -->
    <div class="form-selector">
      <el-card>
        <template #header>
          <div class="selector-header">
            <span>选择表单</span>
            <el-button type="primary" @click="showImportDialog = true">
              <el-icon><Upload /></el-icon>
              导入JSON数据
            </el-button>
          </div>
        </template>
        <el-select
          v-model="selectedFormIndex"
          placeholder="请选择要生成代码的表单"
          style="width: 100%"
          @change="onFormChange"
        >
          <el-option
            v-for="(form, index) in formList"
            :key="index"
            :label="form.title || form.formName || `表单${index + 1}`"
            :value="index"
          />
        </el-select>
      </el-card>
    </div>

    <!-- 导入JSON数据弹框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入JSON数据"
      width="600px"
      :before-close="handleCloseDialog"
      style="
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: -100px;
      "
    >
      <div class="import-content">
        <el-alert title="数据格式说明" type="info" :closable="false" show-icon>
          <template #default>
            <p>请输入符合以下格式的JSON数据：</p>
            <pre class="format-example">
{
  "title": "表单标题",
  "formConfig": [
    {
      "id": "field_1",
      "field": "username",
      "type": "input",
      "label": "用户名",
      "required": true,
      "props": {
        "placeholder": "请输入用户名"
      }
    }
  ]
}</pre
            >
          </template>
        </el-alert>

        <div class="json-input-area">
          <el-input
            v-model="jsonInput"
            type="textarea"
            :rows="12"
            placeholder="请粘贴或输入JSON数据..."
            class="json-textarea"
          />
        </div>

        <div class="validation-result" v-if="validationMessage">
          <el-alert
            :title="validationMessage"
            :type="isValidJson ? 'success' : 'error'"
            :closable="false"
            show-icon
          />
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button
            type="primary"
            @click="validateAndImportJson"
            :disabled="!jsonInput.trim()"
          >
            验证并导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 代码生成区域 -->
    <div class="code-output" v-if="selectedForm">
      <el-card class="h-full">
        <template #header>
          <div class="code-header">
            <span>生成的 Vue3 + Element Plus 代码</span>
            <div>
              <el-button size="small" @click="copyCode">
                <el-icon><CopyDocument /></el-icon>
                复制代码
              </el-button>
              <el-button size="small" @click="downloadCode">
                <el-icon><Download /></el-icon>
                下载文件
              </el-button>
            </div>
          </div>
        </template>

        <el-input
          v-model="generatedCode"
          type="textarea"
          :rows="25"
          readonly
          class="code-textarea"
        />
      </el-card>
    </div>

    <!-- 预览区域 -->
    <div class="form-preview" v-if="selectedForm">
      <el-card style="height:100%;">
        <template #header>
          <span>表单预览</span>
        </template>
        <div class="preview-content">
          <h3>
            {{ selectedForm.title || selectedForm.formName || "表单预览" }}
          </h3>
          <el-form label-width="120px">
            <el-form-item
              v-for="field in selectedForm.formConfig"
              :key="field.id"
              :label="field.label"
            >
              <!-- 输入框 -->
              <el-input
                v-if="field.type === 'input'"
                :placeholder="field.props?.placeholder || field.placeholder"
                style="width: 300px"
              />
              <!-- 多行文本 -->
              <el-input
                v-else-if="field.type === 'textarea'"
                type="textarea"
                :rows="field.props?.rows || 3"
                :placeholder="field.props?.placeholder || field.placeholder"
                style="width: 300px"
              />
              <!-- 日期选择器 -->
              <el-date-picker
                v-else-if="field.type === 'date'"
                type="date"
                :placeholder="
                  field.props?.placeholder || field.placeholder || '请选择日期'
                "
                style="width: 300px"
              />
              <!-- 单选框 -->
              <el-radio-group v-else-if="field.type === 'radio'">
                <el-radio
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
              <!-- 复选框 -->
              <el-checkbox-group v-else-if="field.type === 'checkbox'">
                <el-checkbox
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
              <!-- 默认输入框 -->
              <el-input
                v-else
                :placeholder="field.props?.placeholder || field.placeholder"
                style="width: 300px"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { getCreateFormAPI } from "@/api";
import { ElMessage } from "element-plus";
import { CopyDocument, Download, Upload } from "@element-plus/icons-vue";
import { VueTemplates, FormDataTemplates } from "./templates/vue-templates";

const formList = ref<any>([]);
const selectedFormIndex = ref<number | null>(null);
const generatedCode = ref("");

// 导入JSON相关状态
const showImportDialog = ref(false);
const jsonInput = ref("");
const validationMessage = ref("");
const isValidJson = ref(false);

// 获取选中的表单
const selectedForm = computed(() => {
  if (
    selectedFormIndex.value !== null &&
    formList.value[selectedFormIndex.value]
  ) {
    return formList.value[selectedFormIndex.value];
  }
  return null;
});

// 获取表单数据
const getCreateFormData = async () => {
  try {
    const res = await getCreateFormAPI();
    formList.value = res.data.createData;
  } catch (error) {
    ElMessage.error("获取表单数据失败");
  }
};

// 获取字段名（优先使用field，没有则使用id）
const getFieldName = (field: any) => {
  return field.field || field.id;
};

// 生成 Vue3 + Element Plus 代码
const generateVueCode = (formData: any) => {
  const formName = formData.title || formData.formName || "DynamicForm";
  const fields = formData.formConfig || [];
  const componentClassName = formName.toLowerCase().replace(/\s+/g, "-");

  // 生成表单字段模板
  const generateFieldTemplate = (field: any) => {
    const fieldName = getFieldName(field);
    const required = field.required
      ? ` :rules="[{ required: true, message: '请输入${field.label}', trigger: 'blur' }]"`
      : "";

    switch (field.type) {
      case "input":
        return VueTemplates.fieldTemplates.input(field, required, fieldName);

      case "textarea":
        return VueTemplates.fieldTemplates.textarea(field, required, fieldName);

      case "date":
        return VueTemplates.fieldTemplates.date(field, required, fieldName);

      case "radio":
        const radioOptions =
          field.options
            ?.map((option: any) => VueTemplates.optionTemplates.radio(option))
            .join("\n") || "";
        return VueTemplates.fieldTemplates.radio(
          field,
          required,
          radioOptions,
          fieldName
        );

      case "checkbox":
        const checkboxOptions =
          field.options
            ?.map((option: any) =>
              VueTemplates.optionTemplates.checkbox(option)
            )
            .join("\n") || "";
        return VueTemplates.fieldTemplates.checkbox(
          field,
          checkboxOptions,
          fieldName
        );

      default:
        return VueTemplates.fieldTemplates.default(field, required, fieldName);
    }
  };

  // 生成表单初始数据
  const generateFormData = (field: any) => {
    const fieldName = getFieldName(field);
    switch (field.type) {
      case "checkbox":
        return FormDataTemplates.checkbox(fieldName);
      case "date":
        return FormDataTemplates.date(fieldName);
      case "textarea":
        return FormDataTemplates.textarea(fieldName);
      default:
        return FormDataTemplates.default(fieldName);
    }
  };

  const fieldsTemplate = fields.map(generateFieldTemplate).join("\n");
  const formDataTemplate = fields.map(generateFormData).join(",\n");

  return VueTemplates.mainTemplate(
    componentClassName,
    formName,
    fieldsTemplate,
    formDataTemplate
  );
};

// 表单选择变化时生成代码
const onFormChange = () => {
  if (selectedForm.value) {
    generatedCode.value = generateVueCode(selectedForm.value);
  }
};

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value);
    ElMessage.success("代码已复制到剪贴板");
  } catch (error) {
    ElMessage.error("复制失败");
  }
};

// 下载代码文件
const downloadCode = () => {
  if (!selectedForm.value) return;

  const formName =
    selectedForm.value.title || selectedForm.value.formName || "DynamicForm";
  const fileName = `${formName.replace(/\s+/g, "")}.vue`;

  const blob = new Blob([generatedCode.value], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);

  ElMessage.success(`文件 ${fileName} 已下载`);
};

// 组件挂载时获取数据
onMounted(() => {
  getCreateFormData();
});

// 验证并导入JSON数据
const validateAndImportJson = () => {
  if (!jsonInput.value.trim()) {
    validationMessage.value = "请输入JSON数据";
    isValidJson.value = false;
    return;
  }

  try {
    const parsedData = JSON.parse(jsonInput.value);

    // 验证数据结构
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("JSON数据必须是一个对象");
    }

    if (!parsedData.formConfig || !Array.isArray(parsedData.formConfig)) {
      throw new Error("缺少formConfig字段或formConfig不是数组");
    }

    // 验证formConfig中的字段
    for (let i = 0; i < parsedData.formConfig.length; i++) {
      const field = parsedData.formConfig[i];
      if (!field.type || !field.label) {
        throw new Error(`第${i + 1}个字段缺少必要的type或label属性`);
      }
    }

    // 验证成功
    validationMessage.value = "JSON数据格式正确！";
    isValidJson.value = true;

    // 添加到表单列表
    const newForm = {
      ...parsedData,
      title:
        parsedData.title ||
        parsedData.formName ||
        `导入的表单${formList.value.length + 1}`,
      id: Date.now(), // 添加唯一ID
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
      submitCount: 0,
    };

    formList.value.push(newForm);

    // 自动选择新导入的表单
    selectedFormIndex.value = formList.value.length - 1;

    // 生成代码
    onFormChange();

    // 关闭弹框
    setTimeout(() => {
      handleCloseDialog();
      ElMessage.success("JSON数据导入成功！");
    }, 1000);
  } catch (error) {
    // @ts-ignore
    validationMessage.value = `JSON格式错误: ${error?.message}`;
    isValidJson.value = false;
  }
};

// 关闭弹框
const handleCloseDialog = () => {
  showImportDialog.value = false;
  jsonInput.value = "";
  validationMessage.value = "";
  isValidJson.value = false;
};
</script>

<style lang="scss" scoped>
.code-generator {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - 60px);
}

.form-selector {
  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-card {
    margin-bottom: 0;
  }
}

// 导入弹框样式
.import-content {
  .format-example {
    background: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 8px;
    overflow-x: auto;
  }

  .json-input-area {
    margin: 20px 0;

    .json-textarea {
      font-family: "Consolas", "Monaco", "Courier New", monospace;

      :deep(.el-textarea__inner) {
        font-family: inherit;
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }

  .validation-result {
    margin-top: 15px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.code-output {
  flex: 1;

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      gap: 10px;
    }
  }

  .code-textarea {
    font-family: "Consolas", "Monaco", "Courier New", monospace;
    font-size: 13px;

    :deep(.el-textarea__inner) {
      font-family: inherit;
      font-size: inherit;
      line-height: 1.5;
    }
  }
}

.form-preview {
  .preview-content {
    h3 {
      color: #303133;
      margin-bottom: 20px;
      text-align: center;
    }
  }
}

// 响应式设计
@media (min-width: 1200px) {
  .code-generator {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 20px;

    .form-selector {
      grid-column: 1 / -1;
    }

    .code-output {
      grid-column: 1;
    }

    .form-preview {
      grid-column: 2;
    }
  }
}
</style>
