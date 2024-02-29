<!-- comment-add-model.vue -->
<template>
  <a-comment>
    <template #avatar>
      <a-avatar :src="avatar" />
    </template>
    <template #author>
      {{ name }}
    </template>
    <template #content>
      <a-form-item>
        <a-textarea
          v-model:value="value"
          :rows="4"
          :placeholder="placeholder"
          style="max-width: 600px"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          html-type="submit"
          :loading="submitting"
          type="primary"
          @click="handleSubmit"
        >
          发表评论
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { addCommentUsingPost } from "@/servers/api/commentController.ts";
import { message } from "ant-design-vue";

const { avatar, name, userId } = useUserStore();

const submitting = ref(false);
const value = ref("");
const props = defineProps<{
  postId: string;
  parentId: string;
  rootParentId: string;
  replyName: string;
}>();

const placeholder = ref("欢迎发表善意的评论");
if (props.replyName) {
  placeholder.value = "回复" + props.replyName;
}

const emits = defineEmits(["commentAdded"]);

const handleSubmit = async () => {
  if (!value.value) {
    return;
  }

  submitting.value = true;

  try {
    const body = {
      content: value.value,
      parent_id: props.parentId,
      post_id: props.postId,
      root_parent_id: props.rootParentId,
      user_id: userId,
      user_name: name,
    };

    const response = await addCommentUsingPost(body);

    if (response.code === 200) {
      message.success("评论成功");
      value.value = "";
      emits("commentAdded");
    } else {
      console.error("Failed to add comment:", response.message);
    }
  } catch (error) {
    console.error("Failed to add comment:", error);
  } finally {
    submitting.value = false;
  }
};
</script>
