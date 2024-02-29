<script setup lang="ts">
import router from "~/router";

interface IDataItem {
  title: string
  tags: string[]
  content: string
}

defineProps<{
  dataSource: IDataItem[]
}>()

const {
  avatar,
  name,
  email,
  mobile,
  sex,
  userId,
  role,
  username,
  address,
  description,
} = useUserStore()

function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: {id: postId}, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}
</script>

<template>
  <a-card :bordered="false">
    <a-list item-layout="horizontal" :data-source="dataSource">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a :href="getArticleDetailLink(item.id)" class="text-xl font-bold">{{ item.title }}</a>
              <div class="my-3">
                <a-tag v-for="(tag, index) in item.tagList" :key="index" color="blue" style="border-radius: 0">
                  {{ tag }}
                </a-tag>
              </div>
            </template>
          </a-list-item-meta>
          <div>
            <div>
              {{ item.content.slice(0, 200) }}<span v-if="item.content.length > 200"
                                                    class="text-gray-400">.......</span>
            </div>

            <div class="flex items-center">
            <span class="flex items-center" mt2>
              <a-avatar :size="20" class="mr-2">
                <template #icon>
                  <img :src="avatar" alt="">
                </template>
              </a-avatar>
              <span style="color: rgb(22, 119, 255);">
                {{ name }}
              </span>
              <span style="color: rgba(221,221,221,0.28);margin: 0 10px">
                |
              </span>
              <span style="color: rgb(185,185,185);">
                {{ item.createTime }}
              </span>
            </span>
            </div>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
