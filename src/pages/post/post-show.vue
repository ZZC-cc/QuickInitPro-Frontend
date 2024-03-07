<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getPostVoByIdUsingGet } from "@/servers/api/postController";
import PostVO = API.PostVO;

defineOptions({
  name: "BasicProfile",
});
import CommentModel from "~/pages/post/components/comment-model.vue";
import {
  LeftOutlined,
  LikeOutlined,
  StarOutlined,
} from "@ant-design/icons-vue";

const postData = ref<PostVO>([]);

// 获取路由参数中的文章ID
const router = useRouter();
const postId = router.currentRoute.value.params.id;

// 模拟从 API 获取文章数据，实际应根据你的情况调整
onMounted(async () => {
  await fetchPostById(postId);
});

// 假设这是从 API 获取文章数据的函数
async function fetchPostById(postId: any) {
  const response = await getPostVoByIdUsingGet({ id: postId });
  if (response.code === 200) postData.value = response.data;
}
</script>

<template>
  <a-card :bordered="false">
    <h1 style="color: #cacaca" @click="router.go(-1)">
      <LeftOutlined />
      返回
    </h1>
    <a-list>
      <a-list-item>
        <a-row :gutter="24">
          <a-col :span="6">
            <a-avatar
              size="large"
              :src="postData.user?.avatar"
              style="margin-top: 5px"
            />
          </a-col>
          <a-col :span="17">
            <div>
              <span style="font-size: 18px"
                >{{ postData.user?.name
                }}<a-tag
                  v-if="postData.user?.role == 'admin'"
                  color="blue"
                  style="margin-left: 10px; border-radius: 0px"
                  >管理员</a-tag
                ></span
              >
            </div>
            <span style="margin-top: 40px; color: #cacaca">{{
              postData.createTime
            }}</span>
          </a-col>
        </a-row>
      </a-list-item>
      <div
        style="font-size: 28px; font-weight: 550; padding: 30px; display: flex"
      >
        {{ postData.title }}
      </div>
      <a-list-item>
        <span
          style="
            font-size: 16px;
            color: #303030;
            white-space: pre-line;
            padding: 0 30px;
            margin-bottom: 30px;
          "
        >
          {{ postData.content }}
        </span>
      </a-list-item>
      <a-list-item>
        <template #actions>
          <span> <StarOutlined /> {{ postData.thumbNum }} </span>
          <span> <LikeOutlined /> {{ postData.favourNum }} </span>
        </template>
      </a-list-item>
    </a-list>
  </a-card>
  <a-card :bordered="false" style="margin-top: 20px">
    <a-list>
      <a-list-item>
        <CommentModel :post-id="postId" style="width: 100%" />
      </a-list-item>
    </a-list>
  </a-card>
</template>
