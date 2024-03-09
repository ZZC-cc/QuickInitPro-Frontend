<script setup lang="ts">
import { ReloadOutlined } from "@ant-design/icons-vue";
import CrudTableModal from "./components/score-crud-table-modal.vue";

import { message } from "ant-design-vue";
import PostVO = API.PostVO;
import {
  deleteScoreUsingPost,
  getAllScoreVoUsingPost,
  searchScoreUsingPost,
} from "~/servers/api/scoreController.ts";
import ScoreVO = API.ScoreVO;
import router from "~/router";

const columns = shallowRef([
  {
    title: "任务名称",
    dataIndex: "task",
  },
  {
    title: "文章名称",
    dataIndex: "post",
  },
  {
    title: "用户",
    dataIndex: "user",
  },
  {
    title: "分数",
    dataIndex: "score",
  },
  {
    title: "评价",
    dataIndex: "appraisal",
  },
  {
    title: "负责人",
    dataIndex: "markUser",
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
    const response = await getAllScoreVoUsingPost();
    state.dataSource = response.data || [];
  } catch (error) {
    message.error(`获取数据失败:${error}`);
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
  dataSource: [] as ScoreVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: ScoreVO) {
  try {
    const res = await deleteScoreUsingPost({
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
  const res = await searchScoreUsingPost({ searchText });
  if (res.code === 200) state.dataSource = res.data;
  if (res.data === null) state.dataSource = [];

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
          <template v-if="scope?.column?.dataIndex === 'task'">
            <div>
              <b>{{ scope?.record?.task?.taskName }}</b>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'post'">
            <div>
              <b c-blue-5
                ><a :href="getArticleDetailLink(scope?.record?.task?.post.id)"
                  >《{{ scope?.record?.task?.post.title }}》</a
                ></b
              >
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'appraisal'">
            <div c-gray-5>{{ scope?.record?.appraisal }}</div>
            <div c-gray-5 v-if="!scope?.record?.appraisal">- 未评价 -</div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'score'">
            <div v-if="scope?.record?.score !== 0 && scope?.record?.score > 90">
              <b c-green-6>{{ scope?.record?.score }}</b>
            </div>
            <div
              v-else-if="
                scope?.record?.score !== 0 && scope?.record?.score >= 60
              "
            >
              <b c-orange-6>{{ scope?.record?.score }}</b>
            </div>
            <div
              v-else-if="
                scope?.record?.score !== 0 && scope?.record?.score < 60
              "
            >
              <b c-red-6>{{ scope?.record?.score }}</b>
            </div>
            <div c-gray-5 v-if="scope?.record?.score === 0">- 未打分 -</div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <a-avatar :src="scope?.record?.user.avatar" />
            &nbsp;{{ scope?.record?.user?.name }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'markUser'">
            <a-avatar :src="scope?.record?.markUser.avatar" />
            &nbsp;{{ scope?.record?.markUser?.name }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button
                type="link"
                :href="getArticleDetailLink(scope?.record?.task?.post.id)"
              >
                查看
              </a-button>
              <a-button
                type="link"
                @click="handleEdit(scope?.record as ScoreVO)"
              >
                打分
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(scope?.record as PostVO)"
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
