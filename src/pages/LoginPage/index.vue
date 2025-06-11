<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <!-- 标题 -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isLogin ? "欢迎回来" : "创建账号" }}
        </h2>
        <p class="text-sm text-gray-600">
          {{ isLogin ? "登录到您的账号" : "注册一个新账号" }}
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
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
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
              show-password
              @keyup.enter="handleSubmit"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="formData.email"
              :prefix-icon="Message"
              placeholder="电子邮箱"
              @keyup.enter="handleSubmit"
            />
          </el-form-item>
        </template>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button
            v-loading="isLoading"
            type="primary"
            class="w-full !bg-black hover:!bg-gray-800"
            @click="handleSubmit"
          >
            {{ isLogin ? loginTitle : registerTitle }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换登录/注册 -->
      <div class="text-center text-sm">
        <el-button link type="primary" @click="toggleLoginState">
          {{ isLogin ? "没有账号？立即注册" : "已有账号？立即登录" }}
        </el-button>
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
    } else {
      console.log("表单验证失败");
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
:deep(.el-input__wrapper) {
  border-radius: 0.5rem;
}

:deep(.el-button) {
  border-radius: 0.5rem;
}
</style>
