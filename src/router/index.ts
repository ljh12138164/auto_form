import { createRouter, createWebHashHistory } from "vue-router";
// @ts-ignore
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/pages/HomePage/index.vue"),
    },
    {
      path: "/about",
      name: "About",
      component: () => import("@/pages/HomeAbout/index.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  // 路由加载前

  // 虚拟加载进度-开始
  NProgress.start();

  // to: 即将要进入的目标
  // from: 当前导航正要离开的路由
  // next: 不传参数-继续执行-next()、传参数-跳转到新路由-next({ name: 'Login' })
  next();
});
router.afterEach(() => {
  // 路由加载后

  // 虚拟加载进度-结束
  NProgress.done();
});
export default router;
