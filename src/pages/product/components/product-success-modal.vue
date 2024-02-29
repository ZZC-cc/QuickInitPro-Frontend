<script lang="ts" setup>


const emit = defineEmits(["cancel", "ok"]);

const props = defineProps<{
  orderId: any;
}>();

async function handleCancel() {
  emit("ok");
}

</script>

<template>
  <a-modal
      title="支付成功"
      @ok="handleCancel"
      ok-text="返回"
      cancel-text="再来一单"
      :width="600"
  >
    <a-result
        status="success"
        title="购买成功!"
    >
      <template #subTitle>
        <p>订单编号:{{ props.orderId }}</p>
        <p style="margin-top: -15px">你可以在个人中心查看此订单</p>
      </template>
    </a-result>
  </a-modal>
</template>



