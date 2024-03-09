<script setup lang="ts">
import { Modal } from "ant-design-vue";
import {
  ColumnHeightOutlined,
  DownOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
import type { MenuProps, PaginationProps, TableProps } from "ant-design-vue";
import type {
  ConsultTableModel,
  ConsultTableParams,
} from "~@/api/list/table-list";
import { deleteApi, getListApi } from "~@/api/list/table-list";
import {
  getAllScoreVoUsingPost,
  searchScoreUsingPost,
} from "~/servers/api/scoreController.ts";
import ScoreVO = API.ScoreVO;
import router from "~/router";

const statusMap = {
  O: "关闭",
  1: "运行中",
  2: "上线",
  3: "错误",
};
const message = useMessage();
const columns = shallowRef([
  {
    title: "任务名称",
    dataIndex: "task",
    width: "250px",
  },
  {
    title: "文章名称",
    dataIndex: "post",
    width: "350px",
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
    width: 200,
  },
]);
const loading = shallowRef(false);
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30", "40"],
  current: 1,
  total: 100,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize;
    pagination.current = current;
    init();
  },
});
const dataSource = shallowRef<ScoreVO[]>([]);
const formModel = reactive<ScoreVO>({});

const tableSize = ref<string[]>(["large"]);
const sizeItems = ref<MenuProps["items"]>([
  {
    key: "large",
    label: "默认",
    title: "默认",
  },
  {
    key: "middle",
    label: "中等",
    title: "中等",
  },
  {
    key: "small",
    label: "紧凑",
    title: "紧凑",
  },
]);
const open = ref(false);
const options = computed(() => {
  return columns.value.map((item) => {
    if (item.dataIndex === "action") {
      return {
        label: item.title,
        value: item.dataIndex,
        disabled: true,
      };
    }
    return {
      label: item.title,
      value: item.dataIndex,
    };
  });
});
const dropdownVisible = ref(false);
const getCheckList = computed(() =>
  columns.value.map((item) => item.dataIndex)
);
const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkList: getCheckList.value,
});

async function init() {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await getAllScoreVoUsingPost();
    dataSource.value = data ?? [];
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

const searchText = ref("");

async function onSearch(searchText: string) {
  const res = await searchScoreUsingPost({ searchText });
  if (res.code === 200) dataSource.value = res.data;
  if (res.data === null) dataSource.value = [];
  message.success("查询成功");
}

async function onReset() {
  // 清空所有参数重新请求
  await init();
}

/**
 * 密度切换
 *
 */
const handleSizeChange: MenuProps["onClick"] = (e) => {
  tableSize.value[0] = e.key as string;
};

/**
 * 过滤
 *
 */
function filterAction(value: string[]) {
  return columns.value.filter((item) => {
    if (value.includes(item.dataIndex)) {
      // 为true时，循环遍历的值会暴露出去
      return true;
    }
    return false;
  });
}

// 备份columns
const filterColumns = ref(filterAction(getCheckList.value));

/**
 * 全选/反选事件
 *
 */

function handleCheckAllChange(e: any) {
  Object.assign(state, {
    checkList: e.target.checked ? getCheckList.value : [],
    indeterminate: true,
  });
  filterColumns.value = e.target.checked
    ? filterAction(getCheckList.value)
    : filterColumns.value.filter((item) => item.dataIndex === "action");
}

watch(
  () => state.checkList,
  (val) => {
    state.indeterminate =
      !!val.length && val.length < getCheckList.value.length;
    state.checkAll = val.length === getCheckList.value.length;
  }
);

/**
 * 重置事件
 *
 */
function handleResetChange() {
  state.checkList = getCheckList.value;
  filterColumns.value = filterAction(getCheckList.value);
}

/**
 * checkbox点击事件
 *
 */
function handleCheckChange(value: any) {
  const filterValue = filterAction(value);
  filterColumns.value = filterValue;
}

onMounted(() => {
  init();
});

const expand = ref(false);

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
  <a-card title="成绩列表">
    <template #extra>
      <a-space size="large">
        <a-tooltip title="刷新">
          <ReloadOutlined @click="onSearch" />
        </a-tooltip>
        <a-tooltip title="密度">
          <a-dropdown trigger="click">
            <ColumnHeightOutlined />
            <template #overlay>
              <a-menu
                v-model:selected-keys="tableSize"
                :items="sizeItems"
                @click="handleSizeChange"
              />
            </template>
          </a-dropdown>
        </a-tooltip>
        <a-tooltip title="列设置">
          <a-dropdown v-model:open="dropdownVisible" trigger="click">
            <SettingOutlined />
            <template #overlay>
              <a-card>
                <template #title>
                  <a-checkbox
                    v-model:checked="state.checkAll"
                    :indeterminate="state.indeterminate"
                    @change="handleCheckAllChange"
                  >
                    列选择
                  </a-checkbox>
                </template>
                <template #extra>
                  <a-button type="link" @click="handleResetChange">
                    重置
                  </a-button>
                </template>
                <a-checkbox-group
                  v-model:value="state.checkList"
                  :options="options"
                  style="display: flex; flex-direction: column"
                  @change="handleCheckChange"
                />
              </a-card>
            </template>
          </a-dropdown>
        </a-tooltip>
        <a-input-search
          v-model:value="searchText"
          placeholder="请输入搜索内容"
          enter-button="查询"
          style="width: 250px"
          @search="onSearch(searchText)"
        />
        <a-button :loading="loading" @click="onReset"> 重置</a-button>
      </a-space>
    </template>
    <a-table
      :loading="loading"
      :columns="filterColumns"
      :data-source="dataSource"
      :size="tableSize[0] as TableProps['size']"
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
            v-else-if="scope?.record?.score !== 0 && scope?.record?.score >= 60"
          >
            <b c-orange-6>{{ scope?.record?.score }}</b>
          </div>
          <div
            v-else-if="scope?.record?.score !== 0 && scope?.record?.score < 60"
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
              查看文章
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
</template>
