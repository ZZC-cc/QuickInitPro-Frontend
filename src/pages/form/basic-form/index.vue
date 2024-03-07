<script setup lang="ts">
import type { FormInstance } from "ant-design-vue";
import RegisterUserDto = API.RegisterUserDto;
import { userRegisterUsingPost } from "~/servers/api/userController.ts";
import { message } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";

defineOptions({
  name: "BasicForm",
});
import { uploadFileUsingPost } from "~/servers/api/fileController.ts";

const formRef = ref<FormInstance>();

async function handleSubmit() {
  try {
    const res = await userRegisterUsingPost(formState);
    if (res.code === 200) {
      message.success("注册成功");
      formRef.value?.resetFields();
    } else {
      message.error(res.message);
    }
  } catch (errorInfo) {
    console.log("Failed:", errorInfo);
  }
}

async function handleReset() {
  formRef.value?.resetFields();
}

const formState = reactive<RegisterUserDto>({
  username: "",
  password: "",
  email: "",
  mobile: "",
  avatar: "",
  address: "",
  sex: "",
  name: "",
  description: "",
  confirmPassword: "",
});
const { t } = useI18n();

async function handleChange(info) {
  const uploadedFile = info.file.originFileObj;
  try {
    // 调用 uploadFileUsingPost 方法，传入参数 biz="avatar" 和文件对象
    const response = await uploadFileUsingPost(
      { biz: "avatar" },
      {},
      uploadedFile
    );
    if (response.code == 200) {
      formState.avatar = response.data;
      message.success("文件上传成功");
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("文件上传失败");
  }
}
</script>

<template>
  <page-container>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form ref="formRef" :model="formState">
        <a-form-item
          name="avatar"
          :label="t('account.settings.form-avatar')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-image
            v-model:value="formState.avatar"
            :src="formState.avatar"
            width="100px"
            height="100px"
            style="border-radius: 50px"
          />
          <br />
          <a-upload name="file" :file-list="[]" @change="handleChange">
            <a-button class="mt-4">
              <UploadOutlined />
              <span>上传头像</span>
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          name="username"
          :label="t('account.settings.form-username')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-username'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-model:value="formState.username"
            :placeholder="t('account.settings.form-rule-username')"
          />
        </a-form-item>
        <a-form-item
          name="password"
          :label="t('account.settings.form-password')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-password'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input-password
            v-model:value="formState.password"
            :placeholder="t('account.settings.form-rule-password')"
          />
        </a-form-item>
        <a-form-item
          name="confirmPassword"
          :label="t('account.settings.form-confirmPassword')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-confirmPassword'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input-password
            v-model:value="formState.confirmPassword"
            :placeholder="t('account.settings.form-rule-confirmPassword')"
          />
        </a-form-item>
        <a-form-item
          name="name"
          :label="t('account.settings.form-name')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-name'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-model:value="formState.name"
            :placeholder="t('account.settings.form-rule-name')"
          />
        </a-form-item>
        <a-form-item
          name="sex"
          :label="t('account.settings.form-sex')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-sex'),
            },
          ]"
        >
          <a-radio-group v-model:value="formState.sex">
            <a-radio value="男"> 男 </a-radio>
            <a-radio value="女"> 女 </a-radio>
            <a-radio value="保密"> 保密 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          name="mobile"
          :label="t('account.settings.form-mobile')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-mobile'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-model:value="formState.mobile"
            :placeholder="t('account.settings.form-rule-mobile')"
          />
        </a-form-item>
        <a-form-item
          name="email"
          :label="t('account.settings.form-email')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :rules="[
            {
              required: true,
              message: t('account.settings.form-rule-email'),
            },
          ]"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-input
            v-model:value="formState.email"
            :placeholder="t('account.settings.form-rule-email')"
          />
        </a-form-item>

        <a-form-item
          name="address"
          :label="t('account.settings.form-address')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-textarea
            v-model:value="formState.address"
            :placeholder="t('account.settings.form-rule-address')"
          />
        </a-form-item>
        <a-form-item
          name="description"
          :label="t('account.settings.form-description')"
          :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-textarea
            v-model:value="formState.description"
            :placeholder="t('account.settings.form-rule-description')"
            :rows="4"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button
            type="primary"
            style="margin-right: 10px"
            @-click="handleSubmit"
          >
            注册
          </a-button>
          <a-button @-click="handleReset"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </page-container>
</template>
