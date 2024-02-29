<script setup lang="ts">
import {
  getAllProductVoUsingPost,
  getAllTagsUsingGet1, getProductsByTagsUsingGet,
  searchProductBySearchTextUsingGet
} from "~/servers/api/productController.ts";
import {message} from "ant-design-vue";
import ProductVO = API.ProductVO;
import {
  ShoppingCartOutlined
} from "@ant-design/icons-vue";
import ProductOrderModal from "~/pages/product/components/product-order-modal.vue";
import ProductPayModal from "~/pages/product/components/product-pay-modal.vue";
import ProductSucessModal from "~/pages/product/components/product-success-modal.vue";
import ProductSuccessModal from "~/pages/product/components/product-success-modal.vue";

async function getData() {
  try {
    const response = await getAllProductVoUsingPost();
    data.value = response.data;
  } catch (error) {
    message.error("获取文章数据失败:" + error);
  }
}

onMounted(async () => {
  await getData();
  await getTags();
});

const data = ref<ProductVO>()

const {role} = useUserStore()

async function initQuery(searchText: string) {
  const res = await searchProductBySearchTextUsingGet({searchText: searchText});
  if (res.code === 200) {
    data.value = res.data;
  }
  message.success("查询成功");
}

const searchText = ref("");

async function searchByTag(tags: string) {
  const res = await getProductsByTagsUsingGet({tags: tags});
  if (res.code === 200) {
    data.value = res.data;
  }
  message.success("查询成功");
}

const tagData = ref();

async function getTags() {
  try {
    const response = await getAllTagsUsingGet1();
    tagData.value = response.data || [];
  } catch (error) {
    message.error("获取文章数据失败:" + error);
  }
}

async function cleanQuery() {
  searchText.value = "";
  await getData()
}

const orderModalVisible = ref(false);
const payModelVisible = ref(false);
const successModelVisible = ref(false);

const productItem = ref();

function goShopping(item: ProductVO) {
  orderModalVisible.value = true;
  productItem.value = item;
}

const orderId = ref();

function showPay(id: any) {
  orderId.value = id;
  orderModalVisible.value = false;
  payModelVisible.value = true;
}

function hiddenPay() {
  orderModalVisible.value = false;
  payModelVisible.value = false;
  successModelVisible.value = true;
}

function hiddenSuccess() {
  successModelVisible.value = false;
}
</script>

<template>
  <page-container>
    <a-card :bordered="false" style="margin-top: -10px;margin-bottom: 10px">
      <a-form>
        <a-row :span="24">
          <a-col :span="18">
            <span>分类：</span>
            <a-button
                v-for="tag in tagData"
                :key="tag.id"
                style="border-radius: 0px; margin-right: 10px"
                @click="searchByTag(tag)"
            >{{ tag }}
            </a-button>
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
    <div class="mt-2">
      <a-row :gutter="16">
        <!--        <a-col :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4" v-if="role === 'admin'">-->
        <!--          <a-button class="w-1/1 h-255px" type="dashed" style="font-size: 18px">-->
        <!--            +新增产品-->
        <!--          </a-button>-->
        <!--        </a-col>-->
        <a-col
            v-for="(item, index) in data"
            :key="index"
            :xs="16"
            :sm="8"
            :md="6"
            :lg="6"
            :xl="6"
            class="mb-4"
        >
          <a-card
              :bordered="false"
              style="borderradius: 0;"
              class="cursor-pointer hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)] transition duration-300"
          >
            <template #default>
              <div flex h-40>
                <div w-25 h-25 bg-gray-330 rounded-full>
                  <img w-25 h-25 rounded-full mr3 :src="item.images">
                </div>
                <div ml>
                  <div style="font-size: 18px; font-weight: 500">
                    {{ item.title }}
                  </div>

                  <div mt1>
                    <a-tag v-for="tag in item.tags" :key="tag.id" color="blue" style="border-radius: 0">
                      {{ tag }}
                    </a-tag>
                  </div>
                  <div mt1
                       style="color: #ff4000;font-weight: 550;font-size: 16px">
                    ￥{{ item.price }}元
                  </div>
                  <div style="color: #a1a1a1">
                    <span>库存：</span> {{ item.stock }}
                  </div>
                  <div h-16 overflow-hidden overflow style="color: #9c9e9c">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </template>
            <template #actions>

              <li style="color: #2492ff;font-weight: 550">查看详情</li>
              <li style="color: #f84444;font-weight: 550" @click="goShopping(item)">
                <ShoppingCartOutlined/>
                立即购买
              </li>
            </template>

          </a-card>
          <product-order-modal v-model:visible="orderModalVisible" :item="productItem" @ok="showPay"
                               v-if="orderModalVisible"/>
          <product-pay-modal v-model:visible="payModelVisible" :order-id="orderId" v-if="payModelVisible"
                             @ok="hiddenPay"/>
          <product-success-modal v-model:visible="successModelVisible" :order-id="orderId" @ok="hiddenSuccess"
                                 v-if="successModelVisible"/>
        </a-col>
      </a-row>
    </div>

  </page-container>
</template>

<style scoped>
.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
