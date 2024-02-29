<script setup lang="ts">
import { UploadOutlined } from '@ant-design/icons-vue'

import { message } from 'ant-design-vue'
import { updateUserUserUsingPut } from '~/servers/api/userController.ts'
import { uploadFileUsingPost } from '~/servers/api/fileController.ts'

const {
  avatar,
  name,
  email,
  mobile,
  sex,
  userId,
  username,
  address,
  description,
} = useUserStore()

const { t } = useI18n()

const formRef = ref()
const labelCol = { span: 0 }
const wrapperCol = { span: 13 }
const formState = reactive({
  userId,
  username,
  email,
  name,
  sex,
  desc: description,
  address,
  phoneNumber: mobile,
  avatar,
})
const rules: any = computed(() => {
  return {
    name: [
      {
        required: true,
        message: t('account.settings.form-rule-name'),
        trigger: 'change',
      },
    ],
    username: [
      {
        required: true,
        message: t('account.settings.form-rule-username'),
        trigger: 'change',
      },
    ],

    phoneNumber: [
      {
        required: true,
        message: t('account.settings.form-rule-phoneNumber'),
        trigger: 'change',
      },
    ],
    address: [
      {
        required: true,
        message: t('account.settings.form-rule-address'),
        trigger: 'change',
      },
    ],
    sex: [
      {
        required: true,
        message: t('account.settings.form-rule-sex'),
        trigger: 'change',
      },
    ],
    email: [
      {
        required: true,
        message: t('account.settings.form-rule-email'),
        trigger: 'change',
      },
    ],
    desc: [
      {
        required: false,
        message: t('account.settings.form-rule-desc'),
        trigger: 'blur',
      },
    ],
  }
})

async function onSubmit() {
  try {
    await formRef.value.validate()
    const body = {
      user_id: formState.userId,
      username: formState.username,
      email: formState.email,
      name: formState.name,
      sex: formState.sex,
      description: formState.desc,
      address: formState.address,
      mobile: formState.phoneNumber,
      avatar: formState.avatar,
    }
    const res = await updateUserUserUsingPut(body)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('个人资料更新成功')
  }
  catch (error) {
    console.error('个人资料更新失败', error)
    message.error('个人资料更新失败')
  }
}

async function handleChange(info) {
  const uploadedFile = info.file.originFileObj
  try {
    // 调用 uploadFileUsingPost 方法，传入参数 biz="avatar" 和文件对象
    const response = await uploadFileUsingPost(
      { biz: 'avatar' },
      {},
      uploadedFile,
    )
    if (response.code == 200) {
      const avatarUrl = response.data
      formState.avatar = avatarUrl // 假设 response.data 返回的是文件的 URL
      message.success('文件上传成功')
    }
    else {
      message.error(response.message)
    }
  }
  catch (error) {
    message.error('文件上传失败')
  }
}
</script>

<template>
  <a-card :title="t('account.settings.basic-setting')" :bordered="false">
    <a-row>
      <a-col :span="12">
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-item
            :label-col="{ span: 24 }"
            :label="t('account.settings.form-username')"
            name="username"
          >
            <a-input
              v-model:value="formState.username"
              :placeholder="t('account.settings.form-input-plac')"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item
            :label-col="{ span: 24 }"
            :label="t('account.settings.form-email')"
            name="email"
          >
            <a-input
              v-model:value="formState.email"
              :placeholder="t('account.settings.form-input-plac')"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item
            :label-col="{ span: 24 }"
            :label="t('account.settings.form-name')"
            name="name"
          >
            <a-input
              v-model:value="formState.name"
              :placeholder="t('account.settings.form-input-plac')"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item
            :label="t('account.settings.form-sex')"
            :label-col="{ span: 24 }"
            name="sex"
          >
            <a-radio-group v-model:value="formState.sex">
              <a-radio value="男">
                男
              </a-radio>
              <a-radio value="女">
                女
              </a-radio>
              <a-radio value="保密">
                保密
              </a-radio>
            </a-radio-group>
          </a-form-item><a-form-item
            :label-col="{ span: 24 }"
            :label="t('account.settings.form-phoneNumber')"
            name="phoneNumber"
          >
            <a-input
              v-model:value="formState.phoneNumber"
              :placeholder="t('account.settings.form-input-plac')"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item
            :label-col="{ span: 24 }"
            :label="t('account.settings.form-address')"
            name="address"
          >
            <a-input
              v-model:value="formState.address"
              :placeholder="t('account.settings.form-input-plac')"
              style="width: 320px"
            />
          </a-form-item>

          <a-form-item
            name="desc"
            :label="t('account.settings.form-desc')"
            :label-col="{ span: 24 }"
          >
            <a-textarea
              v-model:value="formState.desc"
              :placeholder="t('account.settings.form-input-plac')"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">
              {{ t("account.settings.form-submit") }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4">
        <p>
          {{ t("account.settings.basic-avatar") }}
        </p>
        <div class="flex flex-col items-center">
          <a-avatar v-model:value="formState.avatar" :size="100">
            <template #icon>
              <img :src="formState.avatar" alt="">
            </template>
          </a-avatar>
          <a-upload name="file" :file-list="[]" @change="handleChange">
            <a-button class="mt-4">
              <UploadOutlined />
              {{ t("account.settings.basic-avatar.upload") }}
            </a-button>
          </a-upload>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
