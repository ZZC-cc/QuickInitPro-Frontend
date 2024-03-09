<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";
import ScoreVO = API.ScoreVO;
import { updateScoreUsingPost } from "~/servers/api/scoreController.ts";

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return (isUpdate.value = "打分");
});

const formRef = ref<FormInstance>();

const formData = ref(<ScoreVO>{});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: ScoreVO) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  formData.value.id = record?.id;
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
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
      console.log(formData.value.tagList);
      responseData = await updateScoreUsingPost(formData.value);
    }
    showTagInput.value = false;
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
    } else {
      message.error(responseData.message);
    }
    emit("ok");
    visible.value = false;
    formRef.value?.resetFields();
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
    @ok="handleOk"
    @cancel="handleCancel"
    :width="800"
  >
    <a-form
      ref="formRef"
      :model="formData"
      class="w-full"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item
        name="score"
        label="分数"
        :rules="[{ required: true, message: '请输入分数' }]"
        w-50
      >
        <a-input-number v-model:value="formData.score" :max="100" :min="0" />
      </a-form-item>
      <a-form-item
        name="appraisal"
        label="评价"
        :rules="[{ required: true, message: '请输入评价' }]"
      >
        <a-textarea
          v-model:value="formData.appraisal"
          style="height: 200px"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
