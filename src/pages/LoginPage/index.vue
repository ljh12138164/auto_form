<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <!-- 标题和Logo区域 -->
      <div class="text-center">
        <!-- 表单设计器Logo -->
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">表单设计器</h1>
        <h2 class="text-lg font-semibold text-gray-700 mb-2">
          {{ isLogin ? "欢迎回来" : "创建账号" }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ isLogin ? "登录到您的表单设计工作台" : "注册并开始设计您的表单" }}
        </p>
      </div>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        class="space-y-6"
        @keyup.enter="handleSubmit"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            :prefix-icon="User"
            :placeholder="isLogin ? '用户名或邮箱' : '用户名'"
            class="form-input"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            class="form-input"
            show-password
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <!-- 注册时显示的额外字段 -->
        <template v-if="!isLogin">
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="确认密码"
              class="form-input"
              show-password
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="formData.email"
              :prefix-icon="Message"
              placeholder="电子邮箱"
              class="form-input"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>
        </template>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            v-loading="isLoading"
            type="primary"
            class="w-full submit-btn"
            @click="handleSubmit"
          >
            {{ isLogin ? loginTitle : registerTitle }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换登录/注册 -->
      <div class="text-center">
        <el-button link class="toggle-btn" @click="toggleLoginState">
          {{ isLogin ? "没有账号？立即注册" : "已有账号？立即登录" }}
        </el-button>
      </div>

      <!-- 底部说明 -->
      <div class="text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
        <p>专业的表单设计与数据收集平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { User, Lock, Message } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { postRegisterAPI } from "@/api";
import { notification } from "@/utils";
import { useRouter } from "vue-router";
const isLoading = ref(false);
const userStore = useUserStore();
const router = useRouter();
// 表单引用
const formRef = ref<FormInstance>();
const loginTitle = ref("登录");
const registerTitle = ref("注册");
// 登录状态
const isLogin = ref(true);


// 表单数据
const formData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

// 验证规则
const formRules = reactive<FormRules>({
  username: [
    { required: true, message: isLogin.value ? "请输入用户名或邮箱" : "请输入用户名", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (isLogin.value) {
          // 登录模式：允许用户名或邮箱
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isEmail = emailRegex.test(value);
          const isValidUsername = value.length >= 3 && value.length <= 20;
          
          if (!isEmail && !isValidUsername) {
            callback(new Error("请输入有效的用户名（3-20个字符）或邮箱地址"));
          } else {
            callback();
          }
        } else {
          // 注册模式：只允许用户名
          if (value.length < 3 || value.length > 20) {
            callback(new Error("用户名长度应在 3 到 20 个字符之间"));
          } else {
            callback();
          }
        }
      },
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于 6 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (value !== formData.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入电子邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的电子邮箱格式", trigger: "blur" },
  ],
});

// 切换登录/注册状态
const toggleLoginState = () => {
  isLogin.value = !isLogin.value;
  formRef.value?.resetFields();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 登录
      if (isLogin.value) {
        try {
          isLoading.value = true;
          loginTitle.value = "登录中...";
          await userStore.login(formData);
          router.push("/home");
        } finally {
          isLoading.value = false;
          loginTitle.value = "登录";
        }
      } else {
        try {
          isLoading.value = true;
          registerTitle.value = "注册中...";
          await postRegisterAPI(formData);
          // 注册成功后跳转到登录页面
          notification("注册成功", "请登录", "success");
        } catch (error:any) {
          notification("注册失败", error.message, "error");
        } finally {
          isLoading.value = false;
          registerTitle.value = "注册";
          isLogin.value = true;
        }
      }
    }
  });
};
// 在 script setup 中添加
watch(isLogin, () => {
  // 当登录状态改变时，重新验证用户名字段
  formRef.value?.validateField('username');
});
</script>

<style lang="scss" scoped>
// 表单输入框样式
:deep(.form-input .el-input__wrapper) {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
  }
  
  &.is-focus {
    border-color: #6b7280;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
}

// 提交按钮样式
:deep(.submit-btn) {
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  border: none;
  font-weight: 600;
  height: 44px;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// 切换按钮样式
:deep(.toggle-btn) {
  color: #6b7280;
  font-size: 14px;
  
  &:hover {
    color: #4b5563;
  }
}

// 表单项间距
:deep(.el-form-item) {
  margin-bottom: 20px;
}

// 图标颜色
:deep(.el-input__prefix-inner) {
  color: #9ca3af;
}
</style>