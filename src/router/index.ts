import { createRouter, createWebHashHistory } from "vue-router";
// @ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getAccessToken } from "@/utils";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/pages/HomePage/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/LoginPage/index.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/pages/HomeLayout/index.vue"),
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/pages/HomeLayout/pages/Dashboard/index.vue"),
      },
      {
        path: "dashboard",
        name: "DashboardPage",
        component: () => import("@/pages/HomeLayout/pages/Dashboard/index.vue"),
      },
      {
        path: "form-designer",
        name: "FormDesigner",
        
        children:[
          {
            path: "",
            name: "selectForm",
            component: () => import("@/pages/HomeLayout/pages/FormDesigner/pages/SelectForm/index.vue"),
          },
          {
            path: "designer/:id",
            name: "FormDesignerPage",
            component: () => import("@/pages/HomeLayout/pages/FormDesigner/pages/FormDesigner/index.vue"),
          }
        ]
      },
      {
        path: "form-management",
        name: "FormManagement",
        component: () => import("@/pages/HomeLayout/pages/FormManagement/index.vue"),
      },
      // {
      //   path: "template-center",
      //   name: "TemplateCenter",
      //   component: () => import("@/pages/HomeLayout/pages/TemplateCenter/index.vue"),
      // },
      {
        path: "data-management",
        name: "DataManagement",
        component: () => import("@/pages/HomeLayout/pages/DataManagement/index.vue"),
      },
      {
        path: "code-generator",
        name: "CodeGenerator",
        component: () => import("@/pages/HomeLayout/pages/CodeGenerator/index.vue"),
      }
    ]
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/pages/NotFound/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 路由白名单
const whiteList = ["/login", "/404"];

router.beforeEach(async (to, from, next) => {
  // 虚拟加载进度-开始
  NProgress.start();
  
  const token = getAccessToken();
  
  if (token) {
    // 已登录用户
    if (to.path === "/login") {
      // 已登录用户访问登录页，重定向到首页
      next({ name: "Home" });
      NProgress.done();
      return;
    }
    if(to.path === '/') {
      next({ name: "Home" });
      NProgress.done();
      return;
    }
    // 已登录用户可以访问其他页面
    next();
    return;
  } else {
    // 未登录用户
    if (whiteList.includes(to.path)) {
      // 白名单页面可以访问
      next();
      return;
    } else {
      if(to.path == '/'){
        next();
        return;
      }
      // 非白名单页面重定向到登录页
      next({ name: "Login" });
      NProgress.done();
      return;
    }
  }
});
router.afterEach(() => {
  // 路由加载后

  // 虚拟加载进度-结束
  NProgress.done();
});
export default router;
