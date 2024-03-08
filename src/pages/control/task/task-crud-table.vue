<script setup lang="ts">
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import CrudTableModal from "./components/task-crud-table-modal.vue";
import PostVO = API.PostVO;
import {
  deleteTaskUsingPost,
  listTaskUsingPost,
  searchTaskUsingPost,
} from "~/servers/api/taskController.ts";
import TaskVO = API.TaskVO;
import router from "~/router";

const columns = shallowRef([
  {
    title: "任务名称",
    dataIndex: "taskName",
  },
  {
    title: "关联文章",
    dataIndex: "post",
  },
  {
    title: "创建用户",
    dataIndex: "user",
  },
  {
    title: "任务状态",
    dataIndex: "status",
  },
  {
    title: "优先级",
    dataIndex: "priority",
  },
  {
    title: "完成百分比",
    dataIndex: "progress",
  },

  {
    title: "负责人",
    dataIndex: "principal",
  },
  {
    title: "起始时间",
    dataIndex: "time",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    dataIndex: "action",
  },
]);

onMounted(async () => {
  await getData();
});

async function getData() {
  try {
    const response = await listTaskUsingPost();
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
  } catch (error) {
    message.error(`获取文章数据失败:${error}`);
  }
}

async function reload() {
  await getData();
  message.success("刷新成功");
}

const state = reactive({
  loading: false,
  queryParams: {
    name: "",
    value: "",
    remark: "",
  },
  dataSource: [] as TaskVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

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

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchTaskUsingPost({ searchText });
  if (res.code === 200) state.dataSource = res.data || [];

  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}

function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: { id: postId }, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}
</script>

<template>
  <page-container>
    <a-card mb-4>
      <a-form class="system-crud-wrapper" :label-col="{ span: 7 }">
        <a-row :span="24">
          <a-col :span="18">
            <a-space size="middle">
              <a-button type="primary" ghost @click="reload">
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
          <a-col :span="6">
            <a-space style="float: right">
              <a-input-search
                v-model:value="searchText"
                placeholder="请输入搜索内容"
                enter-button="查询"
                style="width: 250px"
                @search="initQuery(searchText)"
              />
              <a-button @click="cleanQuery"> 重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card>
      <a-table
        row-key="id"
        :loading="state.loading"
        :columns="columns"
        :data-source="state.dataSource"
        :pagination="state.pagination"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'taskName'">
            <b>{{ scope?.record?.taskName }}</b>
          </template>
          <template v-if="scope?.column?.dataIndex === 'post'">
            <div style="width: 300px">
              <b c-blue-7
                ><a :href="getArticleDetailLink(scope?.record?.post.id)"
                  >《{{ scope?.record?.post.title }} 》</a
                ></b
              >
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <a-avatar size="small" :src="scope?.record?.user.avatar" mr-5px />
            <span>{{ scope?.record?.user.name }}</span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'principal'">
            <a-avatar
              size="small"
              :src="scope?.record?.principal.avatar"
              mr-5px
            />
            <span>{{ scope?.record?.principal.name }}</span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'priority'">
            <b v-if="scope?.record?.priority === '高'" c-red-7>高</b>
            <b v-if="scope?.record?.priority === '中'" c-orange-7>中</b>
            <b v-if="scope?.record?.priority === '低'" c-green-7>低</b>
          </template>
          <template v-if="scope?.column?.dataIndex === 'status'">
            <b v-if="scope?.record?.status === '延迟'" c-red-7>延迟</b>
            <b v-if="scope?.record?.status === '已完成'" c-green-7>已完成</b>
            <b v-if="scope?.record?.status === '进行中'" c-blue-7>进行中</b>
            <b v-if="scope?.record?.status === '未开始'" c-gray-7>未开始</b>
          </template>
          <template v-if="scope?.column?.dataIndex === 'progress'">
            <a-progress
              type="circle"
              :percent="scope?.record?.progress"
              :size="60"
            />
          </template>
          <template v-if="scope?.column?.dataIndex === 'time'">
            <span>{{ scope?.record?.startTime }}</span
            ><br />
            <span>至</span><br />
            <span>{{ scope?.record?.endTime }}</span>
            <template v-if="!scope?.record?.endTime"> 至今</template>
          </template>
          <template v-if="scope?.column?.dataIndex === 'updateTime'">
            <span v-if="!scope?.record?.updateTime"> - </span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button
                type="link"
                @click="handleEdit(scope?.record as TaskVO)"
              >
                编辑
              </a-button>
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
        </template>
      </a-table>
    </a-card>

    <CrudTableModal ref="crudTableModal" @ok="getData" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
