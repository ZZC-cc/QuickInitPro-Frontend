<script setup lang="ts">
import router from "~/router";

interface IDataItem {
  title: string;
  tags: string[];
  content: string;
}

defineProps<{
  dataSource: IDataItem[];
}>();

const { avatar, name } = useUserStore();

function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: { id: postId }, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}
</script>

<template>
  <a-list item-layout="horizontal" :data-source="dataSource">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta>
          <template #title>
            <a :href="getArticleDetailLink(item.id)" text-xl font-bold mt1>{{
              item.title
            }}</a>
            <div class="my-3">
              <a-tag
                v-for="(tag, index) in item.tagList"
                :key="index"
                color="blue"
                border-rd-0
              >
                {{ tag }}
              </a-tag>
            </div>
          </template>
        </a-list-item-meta>
        <div>
          <div>
            {{ item.content.slice(0, 200)
            }}<span v-if="item.content.length > 200" text-gray-400
              >.......</span
            >
          </div>

          <div flex items-center>
            <span flex items-center mt3 mb2>
              <a-avatar :size="20" mr-2>
                <template #icon>
                  <img :src="avatar" alt="" />
                </template>
              </a-avatar>
              <span c-blue-6>
                {{ name }}
              </span>
              <span c-gray-3 ml-10px mr-10px> | </span>
              <span style="color: rgb(185, 185, 185)">
                {{ item.createTime }}
              </span>
            </span>
          </div>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>
