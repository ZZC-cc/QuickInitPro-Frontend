<script setup lang="ts">
import {
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import {userLogoutUsingGet} from '~/servers/api/userController.ts'

const message = useMessage()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
const router = useRouter()
const {avatar, name} = useUserStore()

async function handleClick({key}: any) {
  if (key === 'logout') {
    const hide = message.loading('退出登录...', 0)
    try {
      await userLogoutUsingGet()
    } finally {
      hide()
      message.success('退出登录成功', 3)
      router
          .push({
            path: '/login',
          })
          .then(() => {
            multiTabStore.clear()
            layoutMenuStore.clear()
          })
    }
  }
}
</script>

<template>
  <a-dropdown>
    <span
        hover="bg-[var(--hover-color)]"
        flex
        items-center
        h-48px
        px-12px
        cursor-pointer
        class="transition-all-300"
    >
      <a-avatar :src="avatar" mr-8px size="default"/>
      <span class="anticon" style="font-size: 16px">{{ name }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="0">
          <template #icon>
            <UserOutlined/>
          </template>
          <RouterLink to="/account/center">
            个人中心
          </RouterLink>
        </a-menu-item>
        <a-menu-item key="1">
          <template #icon>
            <ProfileOutlined/>
          </template>
          <RouterLink to="/account/settings">
            个人设置
          </RouterLink>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="logout">
          <template #icon>
            <LogoutOutlined/>
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
