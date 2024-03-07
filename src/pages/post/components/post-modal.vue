<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";
import { defineEmits } from "vue";

import { PlusOutlined } from "@ant-design/icons-vue";
import router from "~/router";
import PostVO = API.PostVO;
import {
  addPostUsingPost,
  updatePostUsingPost,
} from "~/servers/api/postController.ts";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑文章" : "发布文章";
});

const formRef = ref<FormInstance>();

const formData = ref<PostVO>({
  id: "",
  title: "",
  content: "",
  tagList: [],
});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: PostVO) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
    tagList: [],
  };
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      // 更新
      responseData = await updatePostUsingPost(formData.value);
    } else {
      // 新建
      responseData = await addPostUsingPost(formData.value);
    }
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
      visible.value = false;
      showTagInput.value = false;
      emit("ok");
      setTimeout(() => {
        // 重置表单
        formRef.value?.resetFields();
        router.replace(`/redirect/%2Fpost`);
      }, 1000);
    } else {
      message.error(responseData.message);
    }
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

function handleCancel() {
  formRef.value?.resetFields();
  emit("cancel");
  showTagInput.value = false;
}

defineExpose({
  open,
});

function handleTagClose(tag: string) {
  formData.value.tagList = formData.value.tagList.filter(
    (t: string) => t !== tag
  );
}

const tagInputValue = ref<string>("");

function handleTagInputConfirm() {
  const inputTag = tagInputValue.value.trim();
  if (inputTag && !formData.value.tagList.includes(inputTag)) {
    formData.value.tagList.push(inputTag);
    tagInputValue.value = "";
  }
}

const showTagInput = ref(false);
</script>

<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item
        name="title"
        label="标题"
        :rules="[{ required: true, message: '请输入文章标题' }]"
      >
        <a-input v-model:value="formData.title" />
      </a-form-item>
      <!-- 标签编辑部分 -->
      <a-form-item v-model:value="formData.tagList" name="tagList" label="标签">
        <div class="mt-2">
          <template v-if="showTagInput">
            <a-tag
              v-for="(tag, index) in formData.tagList"
              :key="index"
              :closable="true"
              @close="handleTagClose(tag)"
            >
              {{ tag }}
            </a-tag>
            <a-input
              v-model:value="tagInputValue"
              type="text"
              size="small"
              :style="{ width: '78px' }"
              @keyup.enter="handleTagInputConfirm"
              @blur="
                showTagInput = false;
                handleTagInputConfirm();
              "
            />
          </template>
          <template v-else>
            <a-tag
              v-for="(tag, index) in formData.tagList"
              :key="index"
              :closable="true"
              @close="handleTagClose(tag)"
            >
              {{ tag }}
            </a-tag>
            <a-tag @click="showTagInput = true">
              <PlusOutlined />
            </a-tag>
          </template>
        </div>
      </a-form-item>
      <!-- 标签编辑部分结束 -->
      <a-form-item
        name="content"
        label="内容"
        :rules="[{ required: true, message: '请输入文章内容' }]"
      >
        <a-textarea
          v-model:value="formData.content"
          style="height: 500px"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
