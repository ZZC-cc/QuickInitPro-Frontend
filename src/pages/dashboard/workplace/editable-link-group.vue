<script setup lang="ts">
import {PlusOutlined} from '@ant-design/icons-vue'

const links = [
  {
    title: '用户管理',
    href: '/control/user-crud-table',
  },
  {
    title: '商品管理',
    href: '/control/product-crud-table',
  },
  {
    title: '订单管理',
    href: '/control/order-crud-table',
  },
  {
    title: '文章管理',
    href: '/control/post-crud-table',
  },
  {
    title: '评论管理',
    href: '/control/comment-crud-table',
  },
  {
    title: '通知管理',
    href: '/control/notice-crud-table',
  },
  {
    title: '文章列表',
    href: '/post',
  },
  {
    title: '商品列表',
    href: '/product',
  },
  {
    title: '个人中心',
    href: '/account/center',
  },
  {
    title: '个人设置',
    href: '/account/settings',
  },
]
</script>

<template>
  <div class="linkGroup">
    <router-link v-for="(item, index) in links" :key="index" :to="item.href">
      {{ item.title }}
    </router-link>
  </div>
</template>

<style scoped lang="less">
.linkGroup {
  padding: 20px 0 8px 24px;
  font-size: 0;

  & > a {
    display: inline-block;
    width: 25%;
    margin-bottom: 13px;
    color: var(--text-color);
    font-size: 14px;

    &:hover {
      color: #0088ff;
    }
  }
}
</style>
