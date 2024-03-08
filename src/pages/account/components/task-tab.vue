<script setup lang="ts">
import { message } from "ant-design-vue";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons-vue";
import VirtualList from "@/components/virtual-list/index.vue";
import TaskVO = API.TaskVO;
import {
  getTaskByStatusUsingPost,
  getTaskByUserUsingPost,
  getTaskDataUsingPost,
  listTaskUsingPost,
  searchTaskUsingPost,
} from "~/servers/api/taskController.ts";
import CrudTableModal from "~/pages/task/components/task-list-modal.vue";
import TaskData = API.TaskData;

const { userId } = useUserStore();

const dataSource = ref([]);

/*
  获取数据
*/
async function getList() {
  const data = await getTaskByUserUsingPost({ userId: userId });
  const res = await getTaskDataUsingPost({ userId: userId });
  dataSource.value = data.data ?? [];
  taskCount.value = res.data.taskCount;
  unFinishTaskCount.value = res.data.unFinishTaskCount;
  finishTaskCount.value = res.data.finishTaskCount;
  doingTaskCount.value = res.data.doingTaskCount;
  pagination.value.total = data.data?.length ?? 0;
}

async function onSearch(searchText: string) {
  const res = await searchTaskUsingPost({ searchText });
  if (res.code === 200) {
    //重新加载dataSource
    dataSource.value = res.data;
    pagination.value.total = res.data?.length ?? 0;
    message.success("查询成功");
    searchValue.value = "";
  }
}

async function handleDelete(record: TaskVO) {
  try {
    const res = await deleteTaskUsingPost({
      id: record.id,
    });
    if (res.code === 200) message.success("删除成功");
    else message.error(res.data);
  } catch (e) {
    message.error(`删除失败:${e}`);
  } finally {
    await getData();
    close();
  }
}

// 打开对话框
function handleEdit(record: TaskVO) {
  crudTableModal.value?.open(record);
}

function handleAdd() {
  crudTableModal.value?.open();
}

onMounted(async () => {
  await getList();
});

async function cleanQuery() {
  await getList();
  message.success("重置成功");
}

const radioValue = ref("全部");

async function radioChange(radio: any) {
  if (radio == "全部") {
    radioValue.value = "全部";
    await getList();
    return;
  }
  radioValue.value = radio;
  const { data } = await getTaskByStatusUsingPost({
    status: radio,
    userId: userId,
  });
  dataSource.value = data;
}
</script>

<template>
  <!-- 列表 -->
  <a-card class="mt-5">
    <template #title>
      <a-card :bordered="false">
        <a-row style="font-weight: normal">
          <a-col :span="14">
            <b text-16px mr-30px>我的任务</b>
          </a-col>
          <a-col :span="10" class="flex">
            <div>
              <a-radio-group v-model:value="radioValue" @change="radioChange">
                <a-radio-button value="全部" @click="radioChange('全部')">
                  全部
                </a-radio-button>
                <a-radio-button value="未开始" @click="radioChange('未开始')">
                  未开始
                </a-radio-button>
                <a-radio-button value="进行中" @click="radioChange('进行中')">
                  进行中
                </a-radio-button>
                <a-radio-button value="已完成" @click="radioChange('已完成')">
                  已完成
                </a-radio-button>
                <!--                  <a-radio-button value="延迟" @click="radioChange('延迟')">-->
                <!--                    延迟-->
                <!--                  </a-radio-button>-->
              </a-radio-group>
            </div>
            <div class="ml-5">
              <a-input-search
                v-model:value="searchValue"
                placeholder="请输入"
                style="width: 270px"
                @search="onSearch"
              />
            </div>
          </a-col>
        </a-row>
      </a-card>
    </template>
    <!-- 列表主体 -->
    <a-list :data-source="dataSource" v-if="dataSource.length > 0">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-row>
            <a-list-item-meta>
              <template #title>
                <a href="">{{ item.taskName }}</a>
              </template>
              <template #description>
                关联文章：《{{ item.post.title }}》
              </template>
            </a-list-item-meta>
          </a-row>

          <a-row class="flex text-gray-400" :span="24">
            <a-row class="w-50 flex items-center mr30px">
              进度：
              <a-progress :percent="item.progress" :status="item.status" />
            </a-row>
            <div class="flex flex-col items-center mr30px ml30px">
              <div>优先级</div>
              <div>
                <b v-if="item.priority == '高'" c-red-6>{{ item.priority }}</b>
                <b v-if="item.priority == '中'" c-yellow-4>{{
                  item.priority
                }}</b>
                <b v-if="item.priority == '低'" c-green-6>{{
                  item.priority
                }}</b>
              </div>
            </div>
            <div class="flex flex-col items-center mr30px ml30px">
              <div>创建用户</div>
              <div>
                <a-avatar size="small" :src="item.user.avatar" />
                <a href="">{{ item.user.username }}</a>
              </div>
            </div>
            <div class="flex flex-col items-center mr30px ml30px">
              <div>负责人</div>
              <div>
                <a-avatar size="small" :src="item.principal.avatar" />
                <a href="">{{ item.principal.username }}</a>
              </div>
            </div>
            <div class="px-5 mr30px ml30px">
              <div>开始时间</div>
              <div>{{ item.startTime }}</div>
            </div>
            <div class="px-5 mr30px ml30px" v-if="item.endTime">
              <div>结束时间</div>
              <div>{{ item.endTime }}</div>
            </div>
          </a-row>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style>
.a-extra {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
