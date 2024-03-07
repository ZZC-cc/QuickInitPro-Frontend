import type { RouteRecordRaw } from "vue-router";
import { AccessEnum } from "~/utils/constant.ts";
import { basicRouteMap } from "./router-modules";

export default [
  {
    path: "/home",
    name: "Home",
    component: () => import("~/pages/home/workplace/index.vue"),
    meta: {
      title: "首页",
      icon: "HomeOutlined",
    },
  },
  {
    path: "/post",
    name: "Post",
    component: () => import("~/pages/post/post.vue"),
    meta: {
      title: "文章列表",
      icon: "ReadOutlined",
    },
  },
  {
    path: "/product",
    name: "Product",
    component: () => import("~/pages/product/product-card-list.vue"),
    meta: {
      title: "商品列表",
      icon: "GiftOutlined",
    },
  },
  {
    path: "/postShow/:id",
    name: "PostDetail",
    component: () => import("~/pages/post/post-show.vue"),
    meta: {
      title: "文章详情",
      icon: "ProfileOutlined",
      access: [AccessEnum.UNKNOW],
    },
  },
  {
    path: "/control",
    redirect: "/control/card-list",
    name: "Control",
    meta: {
      title: "管理页面",
      icon: "TableOutlined",
      access: [AccessEnum.ADMIN],
    },
    component: basicRouteMap.RouteView,
    children: [
      // {
      //   path: "/control/card-list",
      //   name: "CardList",
      //   component: () => import("~/pages/control/card-list.vue"),
      //   meta: {
      //     title: "卡片列表",
      //   },
      // },
      // {
      //   path: "/control/table-list",
      //   name: "ConsultTable",
      //   component: () => import("~/pages/control/table-list.vue"),
      //   meta: {
      //     title: "查询表格",
      //   },
      // },
      {
        path: "/control/user-crud-table",
        name: "UserTable",
        component: () => import("~/pages/control/user/user-crud-table.vue"),
        meta: {
          title: "用户管理",
          icon: "TeamOutlined",
        },
      },
      {
        path: "/control/task-crud-table",
        name: "TaskTable",
        component: () => import("~/pages/control/task/task-crud-table.vue"),
        meta: {
          title: "任务管理",
          icon: "FieldTimeOutlined",
        },
      },
      {
        path: "/control/product-crud-table",
        name: "ProductTable",
        component: () =>
          import("~/pages/control/product/product-crud-table.vue"),
        meta: {
          title: "商品管理",
          icon: "GiftOutlined",
        },
      },
      {
        path: "/control/order-crud-table",
        name: "OrderTable",
        component: () => import("~/pages/control/order/order-crud-table.vue"),
        meta: {
          title: "订单管理",
          icon: "ShoppingCartOutlined",
        },
      },
      {
        path: "/control/post-crud-table",
        name: "PostTable",
        component: () => import("~/pages/control/post/post-crud-table.vue"),
        meta: {
          title: "文章管理",
          icon: "ReadOutlined",
        },
      },
      {
        path: "/control/comment-crud-table",
        name: "CommentTable",
        component: () =>
          import("~/pages/control/comment/comment-crud-table.vue"),
        meta: {
          title: "评论管理",
          icon: "MessageOutlined",
        },
      },
      {
        path: "/control/notice-crud-table",
        name: "NoticeTable",
        component: () => import("~/pages/control/notice/notice-crud-table.vue"),
        meta: {
          title: "通知管理",
          icon: "NotificationOutlined",
        },
      },

      // {
      //   path: "/control/basic-list",
      //   name: "BasicList",
      //   component: () => import("~/pages/control/basic-list.vue"),
      //   meta: {
      //     title: "标准列表",
      //   },
      // },
      // {
      //   path: "/control/search-list",
      //   name: "SearchList",
      //   component: () => import("~/pages/control/search-list/index.vue"),
      //   meta: {
      //     title: "搜索列表",
      //   },
      //   redirect: "/control/search-list/articles",
      //   children: [
      //     {
      //       path: "/control/search-list/articles",
      //       name: "SearchListArticles",
      //       component: () => import("~/pages/control/search-list/post.vue"),
      //       meta: {
      //         title: "搜索列表（文章）",
      //       },
      //     },
      //     // {
      //     //   path: "/control/search-list/projects",
      //     //   name: "SearchListProjects",
      //     //   component: () => import("~/pages/control/search-list/projects.vue"),
      //     //   meta: {
      //     //     title: "搜索列表（项目）",
      //     //   },
      //     // },
      //     // {
      //     //   path: "/control/search-list/applications",
      //     //   name: "SearchListApplications",
      //     //   component: () =>
      //     //     import("~/pages/control/search-list/applications.vue"),
      //     //   meta: {
      //     //     title: "搜索列表（应用）",
      //     //   },
      //     // },
      //   ],
      // },
    ],
  },

  {
    path: "/account",
    redirect: "/account/center",
    name: "Account",
    meta: {
      title: "个人页",
      icon: "UserOutlined",
      locale: "menu.account",
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: "/account/center",
        name: "AccountCenter",
        component: () => import("~/pages/account/center.vue"),
        meta: {
          title: "个人主页",
          locale: "menu.account.center",
        },
      },
      {
        path: "/account/settings",
        name: "AccountSettings",
        component: () => import("~/pages/account/settings.vue"),
        meta: {
          title: "个人设置",
          locale: "menu.account.settings",
        },
      },
    ],
  },
  {
    path: "/link/doc",
    name: "LinkIframe",
    component: basicRouteMap.Iframe,
    meta: {
      title: "接口文档",
      url: `${import.meta.env.VITE_APP_BASE_API_DEV}/doc.html#/home`,
      icon: "LinkOutlined",
      access: [AccessEnum.ADMIN],
    },
  },
  // {
  //   path: "/dashboard",
  //   redirect: "/dashboard/analysis",
  //   name: "Dashboard",
  //   meta: {
  //     title: "仪表盘",
  //     icon: "DashboardOutlined",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/dashboard/analysis",
  //       name: "DashboardAnalysis",
  //       component: () => import("~/pages/dashboard/analysis/index.vue"),
  //       meta: {
  //         title: "分析页",
  //       },
  //     },
  //     {
  //       path: "/dashboard/monitor",
  //       name: "DashboardMonitor",
  //       component: () => import("~/pages/dashboard/monitor/index.vue"),
  //       meta: {
  //         title: "监控页",
  //       },
  //     },
  //     {
  //       path: "/dashboard/workplace",
  //       name: "DashboardWorkplace",
  //       component: () => import("~/pages/dashboard/workplace/index.vue"),
  //       meta: {
  //         title: "监控页",
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () => import("~/pages/form/basic-form/index.vue"),
  //   meta: {
  //     title: "用户注册",
  //     locale: "用户注册",
  //     icon: "FormOutlined",
  //   },
  // },
  // {
  //   path: "/form/step-form",
  //   name: "FormStep",
  //   component: () => import("~/pages/form/step-form/index.vue"),
  //   meta: {
  //     title: "分步表单",
  //     locale: "menu.form.step-form",
  //   },
  // },
  // {
  //   path: "/form/advanced-form",
  //   name: "FormAdvanced",
  //   component: () => import("~/pages/form/advanced-form/index.vue"),
  //   meta: {
  //     title: "高级表单",
  //     locale: "menu.form.advanced-form",
  //   },
  // },
  // {
  //   path: "/link",
  //   redirect: "/link/iframe",
  //   name: "Link",
  //   meta: {
  //     title: "链接",
  //     icon: "LinkOutlined",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/link/iframe",
  //       name: "LinkIframe",
  //       component: basicRouteMap.Iframe,
  //       meta: {
  //         title: "AntDesign",
  //         url: "https://ant.design/",
  //       },
  //     },
  //     {
  //       path: "/link/antdv",
  //       name: "LinkAntdv",
  //       component: basicRouteMap.Iframe,
  //       meta: {
  //         title: "AntDesignVue",
  //         url: "https://antdv.com/",
  //       },
  //     },
  //     {
  //       path: "https://www.baidu.com",
  //       name: "LinkExternal",
  //       meta: {
  //         title: "跳转百度",
  //         // target: '_self',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/menu",
  //   redirect: "/menu/menu1",
  //   name: "Menu",
  //   meta: {
  //     title: "菜单",
  //     icon: "BarsOutlined",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/menu/menu1",
  //       name: "MenuMenu11",
  //       component: () => import("~/pages/menu/menu1.vue"),
  //       meta: {
  //         title: "菜单1",
  //       },
  //     },
  //     {
  //       path: "/menu/menu2",
  //       name: "MenuMenu12",
  //       component: () => import("~/pages/menu/menu2.vue"),
  //       meta: {
  //         title: "菜单2",
  //       },
  //     },
  //     {
  //       path: "/menu/menu3",
  //       redirect: "/menu/menu3/menu1",
  //       name: "MenuMenu1-1",
  //       meta: {
  //         title: "菜单1-1",
  //       },
  //       children: [
  //         {
  //           path: "/menu/menu3/menu1",
  //           name: "MenuMenu111",
  //           component: () => import("~/pages/menu/menu-1-1/menu1.vue"),
  //           meta: {
  //             title: "菜单1-1-1",
  //           },
  //         },
  //         {
  //           path: "/menu/menu3/menu2",
  //           name: "MenuMenu112",
  //           component: () => import("~/pages/menu/menu-1-1/menu2.vue"),
  //           meta: {
  //             title: "菜单1-1-2",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: "/profile",
  //   name: "profile",
  //   redirect: "/profile/basic",
  //   meta: {
  //     title: "menu.profile",
  //     icon: "profile",
  //     locale: "menu.profile",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/profile/basic",
  //       name: "ProfileBasic",
  //       component: () => import("~/pages/profile/basic/index.vue"),
  //       meta: {
  //         title: "menu.profile.basic",
  //         locale: "menu.profile.basic",
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/access",
  //   redirect: "/access/common",
  //   name: "Access",
  //   meta: {
  //     title: "权限模块",
  //     icon: "ClusterOutlined",
  //   },
  //   children: [
  //     {
  //       path: "/access/common",
  //       name: "AccessCommon",
  //       component: () => import("~/pages/access/common.vue"),
  //       meta: {
  //         title: "通用权限",
  //       },
  //     },
  //     {
  //       path: "/access/user",
  //       name: "AccessUser",
  //       component: () => import("~/pages/access/user.vue"),
  //       meta: {
  //         title: "普通用户",
  //         access: [AccessEnum.USER, AccessEnum.ADMIN],
  //       },
  //     },
  //     {
  //       path: "/access/admin",
  //       name: "AccessAdmin",
  //       component: () => import("~/pages/access/admin.vue"),
  //       meta: {
  //         title: "管理员",
  //         access: [AccessEnum.ADMIN],
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/exception",
  //   redirect: "/exception/403",
  //   name: "Exception",
  //   meta: {
  //     title: "异常页",
  //     icon: "WarningOutlined",
  //     locale: "menu.exception",
  //   },
  //   children: [
  //     {
  //       path: "/exception/403",
  //       name: "Exception403",
  //       component: () => import("~/pages/exception/403.vue"),
  //       meta: {
  //         title: "403",
  //         locale: "menu.exception.not-permission",
  //       },
  //     },
  //     {
  //       path: "/exception/404",
  //       name: "Exception404",
  //       component: () => import("~/pages/exception/404.vue"),
  //       meta: {
  //         title: "404",
  //         locale: "menu.exception.not-find",
  //       },
  //     },
  //     {
  //       path: "/exception/500",
  //       name: "Exception500",
  //       component: () => import("~/pages/exception/500.vue"),
  //       meta: {
  //         title: "500",
  //         locale: "menu.exception.server-error",
  //       },
  //     },
  //   ],
  // },
  // // 结果页
  // {
  //   path: "/result",
  //   redirect: "/result/success",
  //   name: "Result",
  //   meta: {
  //     title: "结果页",
  //     icon: "CheckCircleOutlined",
  //     locale: "menu.result",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/result/success",
  //       name: "ResultSuccess",
  //       component: () => import("~/pages/result/success.vue"),
  //       meta: {
  //         title: "成功页",
  //         locale: "menu.result.success",
  //       },
  //     },
  //     {
  //       path: "/result/fail",
  //       name: "ResultFail",
  //       component: () => import("~/pages/result/fail.vue"),
  //       meta: {
  //         title: "失败页",
  //         locale: "menu.result.fail",
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/list",
  //   redirect: "/list/card-list",
  //   name: "List",
  //   meta: {
  //     title: "列表页",
  //     icon: "TableOutlined",
  //     locale: "menu.list",
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: "/list/card-list",
  //       name: "CardList",
  //       component: () => import("~/pages/list/card-list.vue"),
  //       meta: {
  //         title: "卡片列表",
  //         locale: "menu.list.card-list",
  //       },
  //     },
  //     {
  //       path: "/list/table-list",
  //       name: "ConsultTable",
  //       component: () => import("~/pages/list/table-list.vue"),
  //       meta: {
  //         title: "查询表格",
  //         locale: "menu.list.consult-table",
  //       },
  //     },
  //     {
  //       path: "/list/crud-table",
  //       name: "CrudTable",
  //       component: () => import("~/pages/list/comment-crud-table.vue"),
  //       meta: {
  //         title: "增删改查表格",
  //         locale: "menu.list.crud-table",
  //       },
  //     },
  //     {
  //       path: "/list/basic-list",
  //       name: "BasicList",
  //       component: () => import("~/pages/list/basic-list.vue"),
  //       meta: {
  //         title: "标准列表",
  //         locale: "menu.list.basic-list",
  //       },
  //     },
  //     {
  //       path: "/list/search-list",
  //       name: "SearchList",
  //       component: () => import("~/pages/list/search-list/index.vue"),
  //       meta: {
  //         title: "搜索列表",
  //         locale: "menu.list.search-list",
  //       },
  //       redirect: "/list/search-list/articles",
  //       children: [
  //         {
  //           path: "/list/search-list/articles",
  //           name: "SearchListArticles",
  //           component: () => import("~/pages/list/search-list/post.vue"),
  //           meta: {
  //             title: "搜索列表（文章）",
  //             locale: "menu.list.search-list.articles",
  //           },
  //         },
  //         {
  //           path: "/list/search-list/projects",
  //           name: "SearchListProjects",
  //           component: () => import("~/pages/list/search-list/projects.vue"),
  //           meta: {
  //             title: "搜索列表（项目）",
  //             locale: "menu.list.search-list.projects",
  //           },
  //         },
  //         {
  //           path: "/list/search-list/applications",
  //           name: "SearchListApplications",
  //           component: () =>
  //             import("~/pages/list/search-list/applications.vue"),
  //           meta: {
  //             title: "搜索列表（应用）",
  //             locale: "menu.list.search-list.applications",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
] as RouteRecordRaw[];
