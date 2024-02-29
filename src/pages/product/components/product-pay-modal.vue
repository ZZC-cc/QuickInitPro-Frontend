<script lang="ts" setup>
import type {FormInstance} from "ant-design-vue";
import {message} from "ant-design-vue";
import router from "~/router";
import {ShoppingCartOutlined, FieldTimeOutlined} from "@ant-design/icons-vue";

const emit = defineEmits(["cancel", "ok"]);

const props = defineProps<{
  orderId: any;
}>();


const formRef = ref<FormInstance>();

const labelCol = {style: {width: "100px"}};
const wrapperCol = {span: 24};


defineExpose({
  open,
});


import {h} from 'vue';
import {
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue';
import {StepProps} from 'ant-design-vue';
import {createOrderUsingPost, getOrderVoByIdUsingGet, updatePayStatusUsingPost} from "~/servers/api/orderController.ts";
import {getAllProductVoUsingPost} from "~/servers/api/productController.ts";
import OrderVO = API.OrderVO;
import OrderUpdateRequest = API.OrderUpdateRequest;

const items = [
  {
    title: '选购商品',
    status: 'finish',
    icon: h(ShoppingCartOutlined),
  },
  {
    title: '核对订单',
    status: 'finish',
    icon: h(SolutionOutlined),
  },
  {
    title: '在线支付',
    status: 'process',
    icon: h(LoadingOutlined),
  },
  {
    title: '完成购买',
    status: 'wait',
    icon: h(SmileOutlined),
  },
] as StepProps[];

const deadline = ref(Date.now() + 2 * 60 * 1000);

const orderData = ref(<OrderVO>{})

async function getData() {
  try {
    const response = await getOrderVoByIdUsingGet({id: props.orderId});
    orderData.value = response.data;
  } catch (error) {
    message.error("获取订单数据失败:" + error);
  }
}

onMounted(async () => {
  await getData();
  deadline.value = Date.now() + 1 * 60 * 1000;
});

const updatePay = reactive(<OrderUpdateRequest>{})

async function handleOk() {
  try {
    updatePay.status = "支付"
    updatePay.id = props.orderId;
    const responseData = await updatePayStatusUsingPost(updatePay);
    if (responseData.code === 200) {
      message.success("支付成功");
    } else {
      message.error(responseData.message);
    }
    emit("ok");
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

async function handleCancel() {
  try {
    updatePay.status = "取消"
    updatePay.id = props.orderId;
    await updatePayStatusUsingPost(updatePay);
    message.error("取消支付");
    emit("ok");
    deadline.value = Date.now() + 1 * 60 * 1000;
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

// 在倒计时结束时触发事件
async function handleCountdownFinish() {
  try {
    updatePay.status = "关闭"
    updatePay.id = props.orderId;
    await updatePayStatusUsingPost(updatePay);
    message.warning("订单已自动关闭，因支付超时。");
    emit("ok");
  } catch (errorInfo) {
    console.log("关闭订单失败:", errorInfo);
  }
}
</script>

<template>
  <a-modal
      title="支付页"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="确认支付"
      :width="800"
  >
    <a-steps :items="items" style="width: 80%;margin: 30px auto"></a-steps>
    <a-card :bordered="true" ref="formRef"
            class="w-full"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            style="border-radius: 0">
      <a-descriptions>
        <template #title>
          <span style="font-size: 14px">在线支付
          </span>
        </template>
        <a-row span="24">
          <a-statistic-countdown
              title="支付剩余时间"
              :value="deadline"
              format="HH:mm:ss"
              style="margin: 0 auto"
              @finish="handleCountdownFinish"
          />
        </a-row>
        <a-row span="24">
          <p style="text-align: center;color: #bdbdbd;margin: 30px auto;margin-top: -20px">逾期订单将自动取消哦⁓</p>
        </a-row>
        <a-row span="24">
          <a-col span="7"></a-col>
          <b>订单编号：</b>{{ orderId }}
        </a-row>
        <a-row span="24">
          <a-col span="7"></a-col>
          <b>下单时间：</b>{{ orderData.orderTime }}
        </a-row>
        <a-row span="24">
          <a-col span="7"></a-col>
          <b>支付金额：</b><span
            style="color: #ff4000;font-weight: bold;font-size: 18px">￥{{ orderData.totalPrice }}</span>
        </a-row>
        <a-row span="24">
          <a-col span="7"></a-col>
          <b>支付方式：</b>
          <span mt1 v-if="orderData.payMethod=='微信支付'"><img src="~@/assets/pay/wx.png"
                                                                style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
          <span mt1 v-if="orderData.payMethod=='支付宝支付'"><img src="~@/assets/pay/ali.png"
                                                                  style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
          <span mt1 v-if="orderData.payMethod=='PY支付'"><img src="~@/assets/pay/py.png"
                                                              style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
          <span mt1 v-if="orderData.payMethod=='银联支付'"><img src="~@/assets/pay/yl.png"
                                                                style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
          <span mt1 v-if="orderData.payMethod=='visa支付'"><img src="~@/assets/pay/visa.png"
                                                                style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
          <span mt1 v-if="orderData.payMethod=='Master支付'"><img src="~@/assets/pay/Master.png"
                                                                  style="width: 35px;height: 35px;"/>{{
              orderData.payMethod
            }}</span>
        </a-row>
      </a-descriptions>
      <!--      <a-divider style="margin-bottom: 32px"/>-->
    </a-card>
  </a-modal>

</template>
