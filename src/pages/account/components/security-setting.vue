<script setup lang="ts">
import { message } from 'ant-design-vue'
import { updatePasswordUsingPost } from '~/servers/api/userController.ts'

const { userId, mobile, email } = useUserStore()

interface DataItem {
  title: string
  desc: string
}

const { t } = useI18n()

const data = computed<DataItem[]>(() => {
  return [
    {
      title: t('account.settings.security.account-password'),
      desc: '当前密码强度:中等',
    },
    {
      title: t('account.settings.security.phone'),
      desc: `已绑定手机号:${mobile?.slice(0, 3)}****${mobile?.slice(-4)}`,
    },
    // {
    //   title: t("account.settings.security-problem"),
    //   desc: t("account.settings.security-problem-desc"),
    // },
    {
      title: t('account.settings.security.email'),
      desc: `已绑定邮箱:${email?.slice(0, 3)}****${email?.slice(-8)}`,
    },
    {
      title: t('account.settings.security.MFA'),
      desc: t('account.settings.security.MFA-desc'),
    },
  ]
})
const visible = ref(false)

function setting(title: string) {
  if (title === t('account.settings.security.account-password'))
    visible.value = true

  if (title === t('account.settings.security.phone'))
    message.warning('暂未开放，请在个人设置中修改')

  if (title === t('account.settings.security.email'))
    message.warning('暂未开放，请在个人设置中修改')

  if (title === t('account.settings.security.MFA'))
    message.warning('暂未开放')
}

const formState = reactive({
  confirmPassword: '',
  newPassword: '',
  oldPassword: '',
  user_id: userId,
})

async function handleOk() {
  const ref = await updatePasswordUsingPost(formState)
  if (ref.code === 200)
    message.success('修改成功')
  else
    message.error(ref.message)

  visible.value = false
}

async function handleCancel() {
  formState.oldPassword = ''
  formState.newPassword = ''
  formState.confirmPassword = ''
  visible.value = false
}
</script>

<template>
  <a-card :title="t('account.settings.security-setting')" :bordered="false">
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.title" :description="item.desc" />
          <template #actions>
            <a-button type="link" @click="setting(item.title)">
              修改
            </a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
  <a-modal
    title="修改密码"
    :visible="visible"
    style="width: 400px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item label="旧密码">
        <a-input-password
          v-model:value="formState.oldPassword"
          width="100%"
          max-length="20"
        />
      </a-form-item>
      <a-form-item label="新密码">
        <a-input-password
          v-model:value="formState.newPassword"
          width="100%"
          max-length="20"
        />
      </a-form-item>
      <a-form-item label="确认新密码">
        <a-input-password
          v-model:value="formState.confirmPassword"
          width="100%"
          max-length="20"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">
        返回
      </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<style scoped lang="less">
:deep(.ant-card-body) {
  padding-left: 0 !important;
}
</style>
