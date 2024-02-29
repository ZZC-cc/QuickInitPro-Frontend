<script lang="ts" setup>
import type {FormInstance} from "ant-design-vue";
import {message} from "ant-design-vue";
import router from "~/router";
import {ShoppingCartOutlined, PayCircleOutlined} from "@ant-design/icons-vue";

const emit = defineEmits(["cancel", "ok"]);

const props = defineProps<{
  item: ProductVO;
}>();

const formRef = ref<FormInstance>();

const formData = ref(<ProductVO>{});
formData.value = props.item;

const labelCol = {style: {width: "100px"}};
const wrapperCol = {span: 24};

async function handleOk() {
  try {
    const responseData = await createOrderUsingPost(orderData);
    // 在这里处理接口返回的数据，例如打印日志或执行其他逻辑
    if (responseData.code === 200) {
      message.success("下单成功，请在两分钟内完成支付");
    } else {
      message.error(responseData.message);
    }
    emit("ok", responseData.data);
  } catch (errorInfo) {
    console.log("Form Validate Failed:", errorInfo);
  }
}

function handleCancel() {
  emit("cancel");
}

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
import OrderVO = API.OrderVO;
import ProductVO = API.ProductVO;
import OrderCreateRequest = API.OrderCreateRequest;
import {createOrderUsingPost} from "~/servers/api/orderController.ts";
import ProductPayModal from "~/pages/product/components/product-pay-modal.vue";

const items = [
  {
    title: '选购商品',
    status: 'finish',
    icon: h(ShoppingCartOutlined),
  },
  {
    title: '核对订单',
    status: 'process',
    icon: h(LoadingOutlined),
  },
  {
    title: '在线支付',
    status: 'wait',
    icon: h(PayCircleOutlined),
  },
  {
    title: '完成购买',
    status: 'wait',
    icon: h(SmileOutlined),
  },
] as StepProps[];

const {avatar, name, mobile, address, userId} = useUserStore()

const buyNum = ref(<number>1);
const totalPrice = ref(formData.value.price * buyNum.value);
const selectedPaymentMethod = ref(<string>'微信支付');


watch(buyNum, () => {
  totalPrice.value = formData.value.price * buyNum.value;
  orderData.orderDetails[0].quantity = buyNum.value;
  orderData.totalPrice = totalPrice.value;
});

watch(selectedPaymentMethod, () => {
  orderData.payMethod = selectedPaymentMethod.value;
});

const orderUser = ref({
  address: address,
  name: name,
  mobile: mobile,
})


const orderData = reactive(<OrderCreateRequest>{
  address: orderUser.value.address,
  count: buyNum,
  name: orderUser.value.name,
  payMethod: selectedPaymentMethod.value,
  orderDetails: [{
    orderId: 0,
    price: formData.value.price,
    productId: formData.value.id,
    quantity: buyNum.value,
    total: totalPrice.value
  }],
  phone: orderUser.value.mobile,
  totalPrice: totalPrice.value,
  userId: userId,
})

function buyNumDecrement() {
  if (buyNum.value > 1) {
    buyNum.value--;
  } else {
    message.error("购买数量不能小于1");
  }
  totalPrice.value = formData.value.price * buyNum.value;
}

function buyNumAddition() {
  if (buyNum.value < formData.value.stock) {
    buyNum.value++;
  } else {
    message.error("购买数量不能大于库存数量");
  }
  totalPrice.value = formData.value.price * buyNum.value;
}


function handlePaymentMethodChange(method) {
  selectedPaymentMethod.value = method;
  orderData.payMethod = method;
}

const visible = ref(false);

function editOrderUser() {
  visible.value = true;
}

function editOrderUserOk() {
  visible.value = false;
  orderData.address = orderUser.value.address;
  orderData.name = orderUser.value.name;
  orderData.phone = orderUser.value.mobile;
  message.success("修改成功");
}
</script>

<template>
  <a-modal
      title="下单页"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="提交订单"
      :width="800"
  >
    <a-steps :items="items" style="width: 80%;margin: 30px auto"></a-steps>
    <a-card :bordered="true" ref="formRef"
            :model="formData"
            class="w-full"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            style="border-radius: 0">
      <a-descriptions>
        <template #title>
          <span style="font-size: 14px">收货人信息
          </span>
        </template>
        <a-descriptions-item>
          <span style="color: #9c9e9c"><a-avatar :src="avatar" size="small" style="margin-right: 10px"/>{{
              orderUser.name
            }}&nbsp;&nbsp;{{ orderUser.address }}&nbsp;&nbsp;{{ orderUser.mobile }}&nbsp;&nbsp;</span>
          <a-tag style="border-radius: 0px">默认地址</a-tag>
          <a-button type="link" @click="editOrderUser">修改</a-button>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>
      <a-descriptions>
        <template #title>
          <span style="font-size: 14px">商品数量
          </span>
        </template>
        <a-descriptions-item>
          <a-row style="width: 100%">
            <a-col span="5">
              <a-image
                  :src="formData.images"
                  style="width: 100px;height: 100px"/>
            </a-col>
            <a-col span="10">
              <b>{{ formData.title }}</b>
              <a-row mt5>
                <span style="color: #9c9e9c;margin-top: 3px">数量：</span>
                <a-row>
                  <a-tag
                      @click="buyNumDecrement()"
                      style="border-radius: 0px;width: 30px;height:30px;font-size: 20px;font-weight: 550;text-align: center;line-height: 20px">
                    -
                  </a-tag>
                  <a-input-number style="margin-right: 10px;height: 30px;width: 70px;border-radius: 0; "
                                  v-model:value="buyNum" min="1" :max="formData.stock"/>
                  <a-tag
                      @click="buyNumAddition()"
                      style="border-radius: 0px;width: 30px;height:30px;font-size: 20px;font-weight: 550;text-align: center;line-height: 20px">
                    +
                  </a-tag>
                </a-row>
              </a-row>
            </a-col>
            <a-col span="9">
              <a-row mt11>
                <a-col span="13">
                  <div style="color: #ff4000;font-weight: bold;font-size: 18px;margin-top: -2px;float: right">
                    ￥{{ formData.price }}
                  </div>
                </a-col>
                <a-col span="7">&nbsp;×&nbsp;<a-tag style="border-radius: 0">{{ buyNum }}</a-tag>
                </a-col>
                <a-col span="4" style="color: #9c9e9c" v-if="formData.stock>0">有货</a-col>
                <a-col span="4" style="color: #9c9e9c" v-else>无货</a-col>
              </a-row>

            </a-col>
          </a-row>
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions>
        <template #title>
          <span style="font-size: 14px">支付方式
          </span>
        </template>
        <a-descriptions-item>

          <a-row mr1>
            <img src="@/assets/pay/wx.png" w-5 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == '微信支付'"
                             @change="handlePaymentMethodChange('微信支付')">微信支付
            </a-checkable-tag>
          </a-row>
          <a-row>
            <img src="@/assets/pay/ali.png" w-5 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == '支付宝支付'"
                             @change="handlePaymentMethodChange('支付宝支付')">支付宝支付
            </a-checkable-tag>
          </a-row>
          <a-row>
            <img src="@/assets/pay/py.png" w-5 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == 'PY支付'"
                             @change="handlePaymentMethodChange('PY支付')">PY支付
            </a-checkable-tag>
          </a-row>
          <a-row>
            <img src="@/assets/pay/visa.png" w-8 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == 'visa支付'"
                             @change="handlePaymentMethodChange('visa支付')">visa支付
            </a-checkable-tag>
          </a-row>
          <a-row>
            <img src="@/assets/pay/yl.png" w-6 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == '银联支付'"
                             @change="handlePaymentMethodChange('银联支付')">银联支付
            </a-checkable-tag>
          </a-row>
          <a-row>
            <img src="@/assets/pay/Master.png" w-5 h-5/>
            <a-checkable-tag :checked="selectedPaymentMethod == 'Master支付'"
                             @change="handlePaymentMethodChange('Master支付')">Master支付
            </a-checkable-tag>
          </a-row>
        </a-descriptions-item>
      </a-descriptions>

    </a-card>
    <div style="background-color:#f4f4f4;height: 80px;padding:30px 20px">
      <a-row style="float: right;">应付总额：<span
          style="color: #ff4000;font-weight: bold;font-size: 22px;margin-top: -8px">￥{{
          totalPrice
        }}</span>
      </a-row>
    </div>
    <a-modal v-model:visible="visible" title="修改收货人信息" width="600px" @ok="editOrderUserOk"
             style="margin-top: 180px">
      <a-form :model="orderUser" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="收货人">
          <a-input v-model:value="orderUser.name" placeholder="请输入收货人"/>
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input v-model:value="orderUser.mobile" placeholder="请输入手机号码"/>
        </a-form-item>
        <a-form-item label="收货地址">
          <a-textarea v-model:value="orderUser.address" placeholder="请输入收货地址" :rows="4"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>
