<script lang="ts" setup>
import type { FormInstance } from "ant-design-vue";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons-vue";
import PostVO = API.PostVO;
import TaskUpdateRequest = API.TaskUpdateRequest;
import { listPostByPageUsingPost } from "~/servers/api/postController.ts";
import TaskVO = API.TaskVO;

const emit = defineEmits(["cancel", "ok"]);
const isUpdate = ref(false);

const visible = ref(false);

const title = computed(() => {
  return isUpdate.value ? "编辑" : "新增";
});

const formRef = ref<FormInstance>();
const linkId = ref();
const userId = ref();
const principalId = ref();
const progress = ref(0);
const time = ref<[Dayjs, Dayjs]>([]);

const formData = ref(<TaskVO>{});

const labelCol = { style: { width: "100px" } };
const wrapperCol = { span: 24 };

function open(record?: TaskVO) {
  visible.value = true;
  isUpdate.value = !!record?.id;
  progress.value = record?.progress;
  if (record?.startTime && record?.endTime) {
    time.value = [
      dayjs(record?.startTime, "YYYY-MM-DD HH:mm:ss"),
      dayjs(record?.endTime, "YYYY-MM-DD HH:mm:ss"),
    ];
  } else if (record?.startTime) {
    time.value[0] = dayjs(record?.startTime, "YYYY-MM-DD HH:mm:ss");
  }
  formData.value = cloneDeep(record) ?? {
    ...cloneDeep(record),
    post: { title: "" },
    user: { username: "" },
    principal: { username: "" },
    progress: 0,
  };

  // 更新 linkId, userId 和 principalId
  linkId.value = record?.linkId;
  userId.value = record?.userId;
  principalId.value = record?.principalId;
}

const updateRequest = computed<TaskUpdateRequest>(() => ({
  id: formData.value.id,
  taskName: formData.value.taskName,
  linkId: linkId.value,
  principalId: principalId.value,
  priority: formData.value.priority,
  progress: progress.value,
  status: formData.value.status,
  userId: userId.value,
  startTime: "",
  endTime: "",
}));

const addRequest = computed<TaskAddRequest>(() => ({
  taskName: formData.value.taskName,
  linkId: linkId.value,
  principalId: principalId.value,
  priority: formData.value.priority,
  progress: progress.value,
  status: formData.value.status,
  userId: userId.value,
  startTime: "",
  endTime: "",
}));

async function handleOk() {
  try {
    // 更新 linkId, userId 和 principalId
    updateRequest.value.linkId = linkId.value;
    updateRequest.value.userId = userId.value;
    updateRequest.value.principalId = principalId.value;
    updateRequest.value.progress = progress.value;
    updateRequest.value.startTime = time.value[0];
    updateRequest.value.endTime = time.value[1];

    addRequest.value.linkId = linkId.value;
    addRequest.value.userId = userId.value;
    addRequest.value.principalId = principalId.value;
    addRequest.value.progress = progress.value;
    addRequest.value.startTime = time.value[0];
    addRequest.value.endTime = time.value[1];
    await formRef.value?.validate();

    // 检查是更新用户还是新建用户
    let responseData: any; // 存储接口返回的数

    // 检查是更新用户还是新建用户
    if (isUpdate.value) {
      responseData = await updateTaskUsingPost(updateRequest.value);
    } else {
      // 新建
      responseData = await addTaskUsingPost(addRequest.value);
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
    setTimeout(() => {
      // 重置表单
      formRef.value?.resetFields();
    }, 1000);
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

const showTagInput = ref(false);

import { ref } from "vue";
import UserVO = API.UserVO;
import { getUsersByCategoryUsingGet } from "~/servers/api/userController.ts";
import {
  addTaskUsingPost,
  updateTaskUsingPost,
} from "~/servers/api/taskController.ts";
import dayjs, { Dayjs } from "dayjs";
import TaskAddRequest = API.TaskAddRequest;

const increase = () => {
  const percent = progress.value + 5;
  progress.value = percent > 100 ? 100 : percent;
};

const decline = () => {
  const percent = progress.value - 5;
  progress.value = percent < 0 ? 0 : percent;
};

const postData = ref<PostVO>();
const userData = ref<UserVO>();

async function getData() {
  try {
    const postRes = await listPostByPageUsingPost({
      searchText: "",
    });
    const userRes = await getUsersByCategoryUsingGet({});
    postData.value = postRes.data;
    userData.value = userRes.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  await getData();
});

function handlePostChange(id: any) {
  linkId.value = id;
}

function handleUserChange(id: any) {
  userId.value = id;
}

function handlePrincipalChange(id: any) {
  principalId.value = id;
}
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
        name="taskName"
        label="任务名称"
        :rules="[{ required: true, message: '请输入任务名称' }]"
      >
        <a-input v-model:value="formData.taskName" />
      </a-form-item>
      <a-form-item
        name="post"
        label="关联文章"
        :rules="[{ required: true, message: '请选择关联文章' }]"
      >
        <a-select
          v-model:value="formData.post.title"
          placeholder="请选择文章"
          size="large"
        >
          <a-select-option
            v-for="item in postData"
            :key="item.id"
            :value="item.id"
            @click="handlePostChange(item.id)"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="user"
        label="创建用户"
        :rules="[{ required: true, message: '请选择创建用户' }]"
        w-300px
      >
        <a-select
          v-model:value="formData.user.username"
          placeholder="请选择用户"
          size="large"
        >
          <a-select-option
            v-for="item in userData"
            :key="item.id"
            :value="item.username"
            @click="handleUserChange(item.user_id)"
          >
            <a-avatar :src="item.avatar" mr-5px />
            {{ item.username }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        name="status"
        label="任务状态"
        :rules="[{ required: true, message: '请选择任务状态' }]"
      >
        <a-radio-group v-model:value="formData.status">
          <a-radio value="未开始">未开始</a-radio>
          <a-radio value="进行中">进行中</a-radio>
          <a-radio value="已完成">已完成</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        name="priority"
        label="优先级"
        :rules="[{ required: true, message: '请选择优先级' }]"
        w-200px
      >
        <a-select v-model:value="formData.priority" size="large">
          <a-select-option value="高">高</a-select-option>
          <a-select-option value="中">中</a-select-option>
          <a-select-option value="低">低</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="time" label="起始时间">
        <a-range-picker
          v-model:value="time"
          :bordered="false"
          :show-time="true"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
      <a-form-item
        name="progress"
        label="完成百分比"
        :rules="[{ required: true, message: '请调整完成百分比' }]"
      >
        <a-progress type="circle" :percent="progress" :size="60" mr-5px />
        <a-button-group>
          <a-button @click="decline">
            <template #icon>
              <minus-outlined />
            </template>
          </a-button>
          <a-button @click="increase">
            <template #icon>
              <plus-outlined />
            </template>
          </a-button>
        </a-button-group>
      </a-form-item>
      <a-form-item
        name="user"
        label="负责人"
        :rules="[{ required: true, message: '请选择负责人' }]"
        w-300px
      >
        <a-select
          v-model:value="formData.principal.username"
          placeholder="请选择用户"
          size="large"
        >
          <a-select-option
            v-for="item in userData"
            :key="item.id"
            :value="item.username"
            @click="handlePrincipalChange(item.user_id)"
          >
            <a-avatar :src="item.avatar" mr-5px />
            {{ item.username }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
