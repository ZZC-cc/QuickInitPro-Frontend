<script lang="ts" setup>
import type {FormInstance} from "ant-design-vue";
import {cloneDeep} from "lodash";
import {message} from "ant-design-vue";
import router from "~/router";
import Notice = API.Notice;
import {
  createUsingPost,
  updateUsingPost,
} from "~/servers/api/noticeController.ts";

const {name} = useUserStore();

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();

const formData = ref(<Notice>{});

const labelCol = {style: {width: "100px"}};
const wrapperCol = {span: 24};

function open(record?: Notice) {
  visible.value = true;
  isUpdate.value = !!record?.notice_id;
  formData.value = cloneDeep(record) ?? {
    content: "",
    createTime: "",
    create_user: "",
    end_time: "",
    notice_id: 0,
    sort: 0,
    start_time: "",
    status: 1,
    title: "",
    updateTime: "",
    update_user: "",
  };
}

async function handleOk() {
  try {
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      // 更新用户
      formData.value.update_user = name;
      responseData = await updateUsingPost(formData.value);
    } else {
      // 新建用户
      formData.value.create_user = name;
      responseData = await createUsingPost(formData.value);
    }

    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success(responseData.data);
      emit("ok");
      visible.value = false;
      setTimeout(() => {
        // 重置表单
        formRef.value?.resetFields();
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
}

defineExpose({
  open,
});
</script>

<template>
  <a-modal
      v-model:open="visible"
      :title="title"
      @ok="handleOk"
      @cancel="handleCancel"
      width="700px"
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
          label="公告标题"
          :rules="[{ required: true, message: '请输入公告标题' }]"
      >
        <a-input
            v-model:value="formData.title"
            :maxlength="50"
            :show-count="true"
            placeholder="请输入公告"
        />
      </a-form-item>
      <a-form-item
          name="status"
          label="公告状态"
          :rules="[{ required: true, message: '请输入公告状态' }]"
      >
        <a-radio-group v-model:value="formData.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
          name="sort"
          label="排序"
          :rules="[{ required: true, message: '请输入排序' }]"
      >
        <a-input-number
            v-model:value="formData.sort"
            :min="1"
            :max="999"
            placeholder="请输入排序"
        />
      </a-form-item>
      <a-form-item
          name="start_time"
          label="起始时间"
          :rules="[{ required: true, message: '请输入起始时间' }]"
      >
        <a-date-picker
            v-model:value="formData.start_time"
            :show-time="true"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
        至
        <a-date-picker
            v-model:value="formData.end_time"
            :show-time="true"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
      <a-form-item
          name="content"
          label="公告内容"
          :rules="[{ required: true, message: '请输入公告内容' }]"
      >
        <a-textarea
            v-model:value="formData.content"
            :maxlength="500"
            height="200px"
            :rows="4"
            :show-count="true"
            placeholder="请输入公告内容"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
