<script setup lang="ts">
import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons-vue'
import {getAllMyOrderVoUsingGet, getAllMyOrderVoUsingPost} from "~/servers/api/orderController.ts";
import OrderVO = API.OrderVO;
import {message} from "ant-design-vue";

const orderData = ref<OrderVO>({})


const {
  avatar,
  name,
  email,
  mobile,
  sex,
  userId,
  role,
  username,
  address,
  description,
} = useUserStore()

async function getOrderData() {
  try {
    const res = await getAllMyOrderVoUsingPost({id: userId})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    orderData.value = res.data
  } catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  getOrderData()
})

import {h} from 'vue';
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import {StepProps} from 'ant-design-vue';
import {forEach} from "lodash";


const current = ref(1);

function handlePageChange(page: number) {
  current.value = page;
}
</script>

<template>
  <a-card :bordered="false" v-if="orderData">
    <div v-for="(order, index) in orderData" :key="index">
      <a-row>
        <a-col :span="19">
      <span class="text-16px font-medium">
        订单号: NO.{{ order.id }}
      </span>
        </a-col>
      </a-row>
      <a-card :bordered="false" class="my-5">
        <a-row>
          <a-col :span="8">
            <div v-for="(detail, index) in order.orderDetails" :key="index ">
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
          </a-col>
          <a-col :span="8">
            <div>
              <p>
                收件人: {{ order.name }}
              </p>
              <p>
                收件号码: {{ order.phone }}
              </p>
              <p>
                收件地址: {{ order.address }}
              </p>
              <p>
                下单时间: {{ order.createTime }}
              </p>
            </div>
          </a-col>
          <a-col :span="8">
            <div>
              <p>
                订单状态: {{ order.status }}
              </p>
              <p>
                支付方式: {{ order.payMethod }}
              </p>
              <p>
                支付时间: {{ order.payTime }}
              </p>
              <p class="text-20px">
                订单金额：<span color="#ff4000" style="font-weight: 550;">￥{{ order.totalPrice }}</span>
              </p>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </a-card>

</template>
