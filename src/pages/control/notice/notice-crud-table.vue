<script setup lang="ts">
import {PlusOutlined, ReloadOutlined} from "@ant-design/icons-vue";
import NoticeTableModal from "~/pages/control/notice/components/notice-crud-table-modal.vue";
import {
  deleteUsingPost,
  getAllNoticeUsingGet,
  searchUsingPost,
  switchStatusUsingPost,
} from "~/servers/api/noticeController.ts";
import {message, notification} from "ant-design-vue";
import Notice = API.Notice;
import router from "~/router";

const columns = shallowRef([
  {
    title: "序号",
    dataIndex: "notice_id",
  },
  {
    title: "公告标题",
    dataIndex: "title",
  },
  {
    title: "公告内容",
    dataIndex: "content",
  },
  {
    title: "公告状态",
    dataIndex: "status",
  },
  {
    title: "排序",
    dataIndex: "sort",
  },
  {
    title: "创建人",
    dataIndex: "create_user",
  },
  {
    title: "更新人",
    dataIndex: "update_user",
  },
  {
    title: "起始时间",
    dataIndex: "seTime",
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
  await getNoticeData();
});

async function getNoticeData() {
  try {
    const response = await getAllNoticeUsingGet();
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
  } catch (error) {
    message.error("获取通知数据失败:" + error);
  }
}

async function reload() {
  await getNoticeData();
  message.success("刷新成功");
}

const state = reactive({
  loading: false,
  dataSource: [] as Notice[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const noticeTableModal = ref<InstanceType<typeof NoticeTableModal>>();

async function handleDelete(record: Notice) {
  try {
    console.log(record.notice_id);
    const res = await deleteUsingPost({
      notice_id: record.notice_id,
    });
    if (res.code === 200) {
      message.success("删除成功");
    } else {
      message.error(res.data);
    }
  } catch (e) {
    message.error("删除失败:" + e);
  } finally {
    await getNoticeData();
    close();
  }
}

function handleAdd() {
  noticeTableModal.value?.open();
}

async function handleEdit(record: Notice) {
  noticeTableModal.value?.open(record);
}

async function showNotice(record: Notice) {
  notification.success({
    message: record.title,
    description: record.content,
    duration: 5,
    style: {
      width: "100%",
      whiteSpace: "pre-line",
      marginTop: "30px",
    },
  });
}

async function handleSwitch(notice_id: number) {
  switchStatusUsingPost(notice_id).then((res) => {
    if (res.code === 200) {
      message.success(res.data);
    } else {
      message.error(res.data);
    }
  });
  router.replace(`/redirect/%2Fcontrol%2Fnotice-crud-table`);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchUsingPost({searchText: searchText});
  if (res.code === 200) {
    state.dataSource = res.data || [];
  }
  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getNoticeData();
  message.success("重置成功");
}
</script>

<template>
  <page-container>
    <a-card mb-4>
      <a-form class="system-crud-wrapper" :label-col="{ span: 7 }">
        <a-row :span="24">
          <a-col :span="18">
            <a-space size="middle">
              <a-button type="primary" @click="reload" ghost>
                <template #icon>
                  <ReloadOutlined/>
                </template>
                刷新
              </a-button>
              <a-button type="primary" @click="handleAdd">
                <template #icon>
                  <PlusOutlined/>
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
          row-key="notice_id"
          :loading="state.loading"
          :columns="columns"
          :data-source="state.dataSource"
          :pagination="state.pagination"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'status'">
            <a-switch
                :checked="true"
                v-if="scope?.record?.status == 1"
                @change="handleSwitch(scope?.record.notice_id)"
            />
            <a-switch
                :checked="false"
                v-else
                @change="handleSwitch(scope?.record.notice_id)"
            />
          </template>
          <template v-if="scope?.column?.dataIndex === 'seTime'">
            {{ scope?.record?.start_time }} 至 {{ scope?.record?.end_time }}
          </template>
          <template v-if="scope?.column?.dataIndex === 'content'">
            <div
                v-for="(item, index) in scope?.record?.content.split('\n')"
                :key="index"
            >
              {{ item }}
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'update_user'">
            <template v-if="!scope?.record?.update_user"> -</template>
          </template>
          <template v-if="scope?.column?.dataIndex === 'updateTime'">
            <template v-if="!scope?.record?.updateTime"> -</template>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button
                  type="link"
                  @click="showNotice(scope?.record as Notice)"
                  style="color: #2bc903"
              >
                预览
              </a-button>
              <a-button
                  type="link"
                  @click="handleEdit(scope?.record as Notice)"
              >
                编辑
              </a-button>
              <a-popconfirm
                  title="确定删除该条数据？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(scope?.record as Notice)"
              >
                <a-button type="link" style="color: red"> 删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <NoticeTableModal ref="noticeTableModal" @ok="getNoticeData"/>
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
