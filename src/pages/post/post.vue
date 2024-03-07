<script lang="ts" setup>
import {
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  StarOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import {
  deletePostUsingPost,
  getAllTagsUsingGet,
  listPostByPageUsingPost,
  searchPostBySearchTextUsingGet,
} from "~/servers/api/postController.ts";

import type PostModal from "~/pages/post/components/post-modal.vue";
import PostVO = API.PostVO;
import CrudTableModal from "~/pages/post/components/post-modal.vue";
import CommentModel from "~/pages/post/components/comment-model.vue";
import { ref } from "vue";
import router from "~/router";

const crudTableModal = ref<InstanceType<typeof PostModal>>();

const { username } = useUserStore();

const formData = ref();

async function getData() {
  try {
    const response = await listPostByPageUsingPost({
      searchText: "",
    });
    formData.value = response.data || [];
    totalItems.value = response.data?.length || 0;
  } catch (error) {
    message.error(`获取文章数据失败:${error}`);
  }
}

const tagData = ref();

async function getTags() {
  try {
    const response = await getAllTagsUsingGet();
    tagData.value = response.data || [];
  } catch (error) {
    message.error(`获取文章数据失败:${error}`);
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

async function handleEdit(record: PostVO) {
  crudTableModal.value?.open(record);
}

onMounted(async () => {
  await getData();
  await getTags();
});

const searchText = ref("");

async function initQuery(searchText: string) {
  const res = await searchPostBySearchTextUsingGet({ searchText });
  if (res.code === 200) formData.value = res.data || [];

  message.success("查询成功");
}

async function cleanQuery() {
  searchText.value = "";
  await getData();
  message.success("重置成功");
}

async function reload() {
  await getData();
  message.success("刷新成功");
}

// 使用对象存储每篇文章的评论显示状态
const showComment = ref<{
  [key: string]: boolean;
}>({});

// 点击评论按钮时切换对应文章的评论显示状态
function toggleComment(postId: string) {
  showComment.value = {
    ...showComment.value,
    [postId]: !showComment.value[postId],
  };
}

// 点击阅读详情链接，导航到文章详情页面
// 获取文章详情链接
function getArticleDetailLink(postId: any) {
  // 使用路由的 resolve 方法获取文章详情页面的 URL
  const articleDetailUrl = router.resolve({
    name: "PostDetail", // 文章详情页面的路由名称
    params: { id: postId }, // 文章ID作为路由参数
  });
  return articleDetailUrl.href;
}

// 分页相关的数据
const currentPage = ref(1); // 当前页数
const totalItems = ref(); // 总文章数量量

// 当用户改变页码时触发
function handlePageChange(page) {
  currentPage.value = page;
  getData(); // 获取新页的数据
}

async function handleDelete(id: any) {
  try {
    const res = await deletePostUsingPost({
      post_id: id,
    });
    if (res.code === 200) message.success("删除成功");
    else message.error(res.data);
  } catch (e) {
    message.error(`删除失败:${e}`);
  } finally {
    await getData();
    close();
  }
}
</script>

<template>
  <div>
    <a-card :bordered="false">
      <a-form>
        <a-row :span="24">
          <a-col :span="18">
            <div>
              <a-button
                type="primary"
                ghost
                style="margin-right: 10px"
                @click="reload"
              >
                <template #icon>
                  <ReloadOutlined />
                </template>
                刷新
              </a-button>
              <a-button
                type="primary"
                style="margin-right: 10px"
                @click="handleAdd"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                发布
              </a-button>
            </div>
          </a-col>
          <a-col :span="6">
            <a-space style="float: right">
              <a-input-search
                v-model:value="searchText"
                placeholder="请输入搜索内容"
                enter-button="查询"
                style="width: 250px"
                @search="initQuery(searchText)"
              />
              <a-button @click="cleanQuery"> 重置 </a-button>
            </a-space>
          </a-col>
        </a-row>
        <a-row :span="24" style="margin-top: 20px">
          <a-col :span="24">
            <span>分类：</span>
            <a-button
              v-for="tag in tagData"
              :key="tag.id"
              style="border-radius: 0px; margin-right: 10px"
              @click="initQuery(tag)"
            >
              {{ tag }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-list :data-source="formData" item-layout="vertical">
      <template #renderItem="{ item }">
        <a-card
          :key="item.id"
          :bordered="false"
          class="mt-4"
          style="margin-top: 20px"
        >
          <a-list-item-meta style="margin-bottom: 0">
            <template #title>
              <a
                :href="getArticleDetailLink(item.id)"
                class="text-xl font-bold hover-bg-black-90"
                style="color: #303030"
                >{{ item.title }}</a
              >
            </template>
          </a-list-item-meta>
          <div class="flex flex-col gap-2">
            <div>
              <a-tag v-for="tag in item.tagList" color="blue">
                {{ tag }}
              </a-tag>
            </div>
            <div style="white-space: pre-line">
              {{ item.content.slice(0, 80) }}
              <span v-if="item.content.length > 80">......<br /></span>
            </div>
            <div>
              <a :href="getArticleDetailLink(item.id)">阅读详情</a>
            </div>
            <div class="flex items-center gap-2">
              <a-avatar :src="item.user.avatar" :size="22" />
              <span c-primary>
                {{ item.user.name }}
              </span>
              <span style="color: rgba(116, 116, 116, 0.24)">
                &nbsp;&nbsp;|&nbsp;&nbsp;
              </span>
              <span c-text-tertiary>
                {{ item.updateTime }}
              </span>
            </div>
          </div>
          <a-divider />
          <div>
            <a-row>
              <a-col :span="3">
                <StarOutlined />
                {{ item.thumbNum }}
              </a-col>
              <a-col :span="3">
                <LikeOutlined />
                {{ item.favourNum }}
              </a-col>
              <a-col :span="3">
                <MessageOutlined />
                <a @click="toggleComment(item.id)">&nbsp;评论</a>
              </a-col>
              <a-col :span="3">
                <span v-if="item.user.username == username"
                  ><EditOutlined />
                  <a @click="handleEdit(item as PostVO)">&nbsp;编辑</a>
                </span>
              </a-col>
              <a-col :span="3">
                <span v-if="item.user.username == username">
                  <a-popconfirm
                    title="确定删除该条数据？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDelete(item.id)"
                    ><DeleteOutlined />
                    <a style="color: red">&nbsp;删除</a>
                  </a-popconfirm>
                </span>
              </a-col>
            </a-row>
          </div>
          <!-- 根据文章的评论显示状态来决定是否显示评论组件 -->
          <CommentModel v-if="showComment[item.id]" :post-id="item.id" />
        </a-card>
      </template>
    </a-list>
    <CrudTableModal ref="crudTableModal" />
    <a-card style="margin-top: 10px">
      <a-pagination
        :current="currentPage"
        :total="totalItems"
        :page-size="1"
        :page="1"
        :show-total="(total) => `共 ${total} 条`"
        style="float: right"
        @change="handlePageChange"
      />
    </a-card>
  </div>
</template>
