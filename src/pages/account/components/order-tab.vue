<script setup lang="ts">
import { getAllMyOrderVoUsingPost } from "~/servers/api/orderController.ts";
import OrderVO = API.OrderVO;
import { message } from "ant-design-vue";

const orderData = ref<OrderVO>({});
const { userId } = useUserStore();

async function getOrderData() {
  try {
    const res = await getAllMyOrderVoUsingPost({ id: userId });
    if (res.code !== 200) {
      message.error(res.message);
      return;
    }
    orderData.value = res.data;
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  getOrderData();
});

// const current = ref(1)
</script>

<template>
  <div v-for="(order, index) in orderData" :key="index" px-8>
    <a-list :bordered="false" my-5>
      <a-row>
        <a-col :span="19">
          <span text-16px font-550> 订单号: NO.{{ order.id }} </span>
        </a-col>
      </a-row>
      <a-row mt1>
        <a-col :span="8">
          <div v-for="(detail, index) in order.orderDetails" :key="index">
            <a-row mt2>
              <a-col :span="24">
                <a-image :src="detail.product.images" width="30px" />
                <span ml-2 mt>{{ detail.product.title }}</span>
                <span ml-2 mt
                  >✖️&nbsp;<a-tag>{{ detail.quantity }}</a-tag></span
                >
                <span ml-4 mt c-red-5 font-550>￥{{ detail.price }}</span>
              </a-col>
            </a-row>
            <div h-1px w-full ma true-gray-2 />
          </div>
        </a-col>
        <a-col :span="8">
          <div>
            <p>收件人: {{ order.name }}</p>
            <p>收件号码: {{ order.phone }}</p>
            <p>收件地址: {{ order.address }}</p>
            <p>下单时间: {{ order.createTime }}</p>
          </div>
        </a-col>
        <a-col :span="8">
          <div>
            <p>订单状态: {{ order.status }}</p>
            <p>支付方式: {{ order.payMethod }}</p>
            <p>支付时间: {{ order.payTime }}</p>
            <p text-20px>
              订单金额：<span c-red-5 font-550>￥{{ order.totalPrice }}</span>
            </p>
          </div>
        </a-col>
      </a-row>
    </a-list>
    <a-divider />
  </div>
</template>
