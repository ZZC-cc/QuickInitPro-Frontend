<script setup lang="ts">
import {
  PlusOutlined,
  ManOutlined,
  WomanOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import CrudTableModal from "./components/order-crud-table-modal.vue";
import {
  deleteUserUsingDelete,
  getUsersByCategoryUsingGet,
  getUsersBySearchTextUsingGet,
} from "~/servers/api/userController.ts";
import User = API.User;
import {message} from "ant-design-vue";
import {
  deletePostUsingPost,
  listPostByPageUsingPost,
  searchPostBySearchTextUsingGet,
} from "~/servers/api/postController.ts";
import Post = API.Post;
import PostVO = API.PostVO;
import {
  deleteOrderUsingPost,
  getAllOrderVoUsingPost,
  searchOrderBySearchTextUsingGet,
  updatePayStatusUsingPost
} from "~/servers/api/orderController.ts";
import OrderVO = API.OrderVO;
import OrderDetailVO = API.OrderDetailVO;
import OrderUpdateRequest = API.OrderUpdateRequest;
import {searchProductBySearchTextUsingGet} from "~/servers/api/productController.ts";

const columns = shallowRef([
  {
    title: "订单内容",
    dataIndex: "orderDetail",
  },
  {
    title: "购买信息",
    dataIndex: "Detail",
  }, {
    title: "订单状态",
    dataIndex: "status",
  },
  {
    title: "用户信息",
    dataIndex: "user",
  },

  {
    title: "其他信息",
    dataIndex: "order",
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
    const response = await getAllOrderVoUsingPost();
    // 处理响应数据，将数据赋值给 state.dataSource
    state.dataSource = response.data || [];
  } catch (error) {
    message.error("获取数据失败:" + error);
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
  dataSource: [] as OrderDetailVO[], // 添加 dataSource 属性
  pagination: {},
  rowSelections: [],
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: Post) {
  try {
    const res = await deleteOrderUsingPost({
      id: record.id,
    });
    if (res.code === 200) {
      message.success("删除成功");
    } else {
      message.error(res.message);
    }
  } catch (e) {
    message.error("删除失败:" + e);
  } finally {
    await getData();
    close();
  }
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchOrderBySearchTextUsingGet({searchText: searchText});
  if (res.code === 200) {
    state.dataSource = res.data;
    message.success("查询成功");
  }
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}

const updatePay = reactive(<OrderUpdateRequest>{})

async function orderOk(id: any) {
  try {
    updatePay.status = "完成"
    updatePay.id = id;
    const responseData = await updatePayStatusUsingPost(updatePay);
    if (responseData.code === 200) {
      message.success("订单已完成");
      await getData();
    } else {
      message.error(responseData.message);
    }
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
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
          <template v-if="scope?.column?.dataIndex === 'orderDetail'">
            <div v-for="(detail, index) in scope.record.orderDetails" :key="index" class="order-detail-item">
              <a-row mt2>
                <a-col :span="24">
                  <a-image :src="detail.product.images" width="30px"/>
                  <span class="ml-2 mt">{{ detail.product.title }}</span>
                  <span class="ml-2 mt">✖️&nbsp;<a-tag>{{ detail.quantity }}</a-tag></span>
                  <span class="ml-4 mt" style="color: #ff4000;font-weight: 550">￥{{ detail.price }}</span>
                </a-col>
              </a-row>
              <div style="background-color: rgba(213,212,212,0.13);height: 1px;width: 100%;margin: 10px auto;"></div>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'Detail'">
            <div><b>购买数量：</b>{{ scope?.record?.count }}</div>
            <div><b>总价格：</b>
              <span style="color: #ff4000;font-weight: 550">￥{{ scope?.record?.totalPrice }}</span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'status'">
            <div><b>
              <span v-if="scope?.record?.status === 0" style="color: red">未支付</span>
              <span v-if="scope?.record?.status === 1" style="color: blue">已支付</span>
              <span v-if="scope?.record?.status === 2" style="color: gray">已取消</span>
              <span v-if="scope?.record?.status === 3" style="color: yellow">已关闭</span>
              <span v-if="scope?.record?.status === 4" style="color: green">已完成</span></b>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'user'">
            <div flex gap-2>
              <b>收件人：</b>
              <a-avatar :src="scope?.record?.user?.avatar" size="small"/>
              <div flex flex-col>
                <div>{{ scope?.record?.name }}</div>
              </div>
            </div>
            <div flex flex-col mt2>
              <div><b>手机号：</b>
                <span>{{ scope?.record?.phone }}</span>
              </div>
            </div>
            <div flex flex-col mt2>
              <div><b>收货地址：</b>
                <span>{{ scope?.record?.address }}</span>
              </div>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'order'">
            <div><b>订单编号：</b>NO.{{ scope?.record?.id }}</div>
            <div><b>支付方式：</b>{{ scope?.record?.payMethod }}</div>
            <div><b>下单时间：</b>{{ scope?.record?.orderTime }}</div>
            <div><b>支付时间：</b>{{ scope?.record?.payTime }}<span v-if="!scope?.record?.payTime">-</span></div>
            <div><b>更新时间：</b>{{ scope?.record?.updateTime }}</div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <!--              <a-button-->
              <!--                  type="link"-->
              <!--                  @click="handleEdit(scope?.record as PostVO)"-->
              <!--              >-->
              <!--                编辑-->
              <!--              </a-button>-->
              <a-button
                  type="link"
                  @click="orderOk(scope?.record?.id)"
                  v-if="scope?.record?.status === 1"
              >
                完成订单
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

    <CrudTableModal ref="crudTableModal"/>
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper {
  .ant-form-item {
    margin: 0;
  }
}
</style>
