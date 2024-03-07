<script lang="ts" setup>
import { ref, watch } from "vue";
import { DeleteOutlined, MessageOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import CommentAddModel from "~/pages/post/components/comment-add-model.vue";
import { deleteCommentUsingPost } from "~/servers/api/commentController.ts";
</script>

<script lang="ts">
import CommentVO = API.CommentVO;

const showReply = ref(false);
const replyToId = ref("");
const postId = ref("");
const { username } = useUserStore();

const emits = defineEmits(["commentAdded"]);

function showReplyForm(id: any) {
  showReply.value = !showReply.value;
  replyToId.value = id;
}

watch(postId, () => {
  handleCommentAdded();
});

function handleCommentAdded() {
  emits("commentAdded");
  showReply.value = !showReply.value;
}

async function deleteComment(id: any) {
  try {
    const response = await deleteCommentUsingPost({
      id,
    });
    if (response.code === 200) {
      message.success("删除成功");
      emits("commentAdded");
    } else {
      console.error("删除失败:", response.message);
    }
  } catch (error) {
    console.error("删除错误:", error);
  }
}

export default {
  props: {
    comments: {
      type: Array as () => CommentVO[],
      required: true,
    },
  },
};
</script>

<template>
  <div>
    <a-comment v-for="comment in comments" :key="comment.id">
      <template #actions>
        <span key="comment-nested-reply-to">
          <span>{{ comment.createTime }} &nbsp;&nbsp;</span>
          <span>
            <MessageOutlined />&nbsp;
            <a @click="showReplyForm(comment.id)">回复</a>&nbsp;&nbsp;
          </span>
          <span v-if="comment.user?.username == username">
            <a-popconfirm
              title="确定删除吗？"
              @confirm="deleteComment(comment.id)"
              ><DeleteOutlined />&nbsp;<a style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </span>
      </template>
      <template #author>
        <a>{{ comment.user.name }}</a>
      </template>
      <template #avatar>
        <a-avatar :src="comment.user.avatar" :alt="comment.user.name" />
      </template>
      <template #content>
        <p>{{ comment.content }}</p>
      </template>
      <CommentAddModel
        v-if="showReply && comment.id === replyToId"
        :post-id="comment.post_id"
        :parent-id="comment.id"
        :root-parent-id="comment.root_parent_id"
        :reply-name="comment.user?.name"
        @comment-added="handleCommentAdded()"
      />
      <!-- 递归渲染子评论 -->
      <CommentItem
        v-if="comment.child && comment.child.length"
        :comments="comment.child"
        style="margin: -30px 0"
        @comment-added="handleCommentAdded()"
      />
    </a-comment>
  </div>
</template>
