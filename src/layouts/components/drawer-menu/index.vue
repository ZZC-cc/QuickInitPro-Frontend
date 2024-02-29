<script setup lang="ts">
import {useLayoutState} from '../../basic-layout/context'

const {mobileCollapsed, siderWidth} = useLayoutState()
import SiderMenu from '../sider-menu/index.vue'
</script>

<template>
  <!--  <a-drawer-->
  <!--      v-model:open="mobileCollapsed"-->
  <!--      :closable="false"-->
  <!--      placement="left"-->
  <!--      :width="siderWidth"-->
  <!--  >-->
  <!--    <SiderMenu/>-->
  <!--  </a-drawer>-->
</template>
