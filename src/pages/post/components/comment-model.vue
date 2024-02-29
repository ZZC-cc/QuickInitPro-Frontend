<!-- comment-model.vue -->
<template>
  <a-tabs>
    <a-tab-pane tab="评论">
      <div>
        <comment-item
          :comments="comments"
          @commentAdded="getComments(postId)"
        />
      </div>
      <comment-add-model
        :postId="postId"
        @commentAdded="getComments(postId)"
        parent-id="0"
        root-parent-id="0"
        reply-name=""
      />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { getCommentsByPostIdUsingGet } from "@/servers/api/commentController.ts";
import CommentAddModel from "~/pages/post/components/comment-add-model.vue";
import CommentItem from "~/pages/post/components/comment-Item.vue";
import CommentCrudTable from "~/pages/control/comment/comment-crud-table.vue";

const props = defineProps<{
  postId: any;
}>();

const current = ref(1);

const comments = ref([]);
const postId = ref(props.postId);

// 获取评论
const getComments = async () => {
  try {
    if (!postId.value) return;
    const response = await getCommentsByPostIdUsingGet({
      postId: postId.value,
    });
    if (response.code === 200) {
      comments.value = response.data || [];
    } else {
      console.error("Failed to get comments:", response.message);
    }
  } catch (error) {
    console.error("Failed to get comments:", error);
  }
};

// 初始化获取评论
getComments();

// 监听评论变化
watch(postId, () => {
  getComments();
});
</script>
