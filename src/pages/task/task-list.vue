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

//统计数据
const taskCount = ref(0);
const doingTaskCount = ref(0);
const finishTaskCount = ref(0);
const unFinishTaskCount = ref(0);

const workData = ref([
  {
    title: "全部任务任务",
    content: taskCount,
  },
  {
    title: "进行中的任务",
    content: doingTaskCount,
  },
  {
    title: "已完成的任务",
    content: finishTaskCount,
  },
  {
    title: "待处理的任务",
    content: unFinishTaskCount,
  },
]);

const searchValue = ref("");

const dataSource = ref([]);

const pagination = ref({
  pageSize: 5,
  pageSizeOptions: ["10", "20", "30", "40", "50"],
  showQuickJumper: true,
  total: 0,
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

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
  <page-container>
    <!-- 头部 -->
    <a-card>
      <a-row :gutter="16">
        <a-col v-for="(item, index) in workData" :key="index" :xs="24" :sm="6">
          <div class="flex flex-col items-center justify-center">
            <div class="text-zinc-400">
              {{ item.title }}
            </div>
            <div style="font-size: 24px">
              {{ item.content }}
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 列表 -->
    <a-card class="mt-5">
      <template #title>
        <a-card :bordered="false">
          <a-row style="font-weight: normal">
            <a-col :span="14">
              <b text-16px mr-30px>我的任务</b>
              <a-space size="middle">
                <a-button type="primary" ghost @click="cleanQuery">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                  刷新
                </a-button>
                <a-button type="primary" @click="handleAdd">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  新增
                </a-button>
              </a-space>
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
            <a-list-item-meta>
              <template #title>
                <a href="">{{ item.taskName }}</a>
              </template>
              <template #description>
                关联文章：《{{ item.post.title }}》
              </template>
            </a-list-item-meta>
            <template #actions>
              <div class="flex text-gray-400">
                <div class="flex flex-col items-center mr30px">
                  <div>优先级</div>
                  <div>
                    <b v-if="item.priority == '高'" c-red-6>{{
                      item.priority
                    }}</b>
                    <b v-if="item.priority == '中'" c-yellow-4>{{
                      item.priority
                    }}</b>
                    <b v-if="item.priority == '低'" c-green-6>{{
                      item.priority
                    }}</b>
                  </div>
                </div>
                <div class="flex flex-col items-center mr30px">
                  <div>创建用户</div>
                  <div>
                    <a-avatar size="small" :src="item.user.avatar" />
                    <a href="">{{ item.user.username }}</a>
                  </div>
                </div>
                <div class="flex flex-col items-center">
                  <div>负责人</div>
                  <div>
                    <a-avatar size="small" :src="item.principal.avatar" />
                    <a href="">{{ item.principal.username }}</a>
                  </div>
                </div>
                <div class="px-5">
                  <div>开始时间</div>
                  <div>{{ item.startTime }}</div>
                </div>
                <div class="px-5 mr5" v-if="item.endTime">
                  <div>结束时间</div>
                  <div>{{ item.endTime }}</div>
                </div>
                <div class="w-45 flex items-center">
                  <a-progress :percent="item.progress" :status="item.status" />
                </div>
              </div>
            </template>
            <template #extra>
              <div class="a-extra">
                <a
                  key="list-loadmore-edit"
                  class="m-4"
                  @click="handleEdit(item as TaskVO)"
                >
                  编辑
                </a>
                <a-popconfirm
                  title="确定删除该条数据？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(scope?.record as TaskVO)"
                >
                  <a-button type="link" style="color: red"> 删除</a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
    <a-button type="dashed" @click="handleAdd"> + 添加</a-button>
    <CrudTableModal ref="crudTableModal" @ok="getList()" />
  </page-container>
</template>

<style>
.a-extra {
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
