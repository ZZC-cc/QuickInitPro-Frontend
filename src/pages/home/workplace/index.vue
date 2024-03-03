<script setup lang="ts">
import {
  NotificationTwoTone
} from "@ant-design/icons-vue";
import EditableLinkGroup from '~/pages/dashboard/workplace/editable-link-group.vue'
import {message, notification} from "ant-design-vue";
import {addViewUsingGet, getHomeUsingGet} from "~/servers/api/homeController.ts";
import HomeVO = API.HomeVO;
import {getNewsNoticeUsingGet} from "~/servers/api/noticeController.ts";
import ProductVO = API.ProductVO;
import PostVO = API.PostVO;
import OrderVO = API.OrderVO;
import CommentVO = API.CommentVO;
import Notice = API.Notice;

const productsList = ref<ProductVO>()
const postsList = ref<PostVO>()
const ordersList = ref<OrderVO>()
const commentsList = ref<CommentVO>()
const noticeList = ref<Notice>()

const {
  avatar,
  name,
  email,
  mobile,
  sex,
  userId,
  role,
  username,
  address,
  description,
} = useUserStore()

const HomeData = ref<HomeVO>();

async function getData() {
  try {
    const response = await getHomeUsingGet();
    HomeData.value = response.data;
    productsList.value = response.data?.productList;
    postsList.value = response.data?.postList;
    ordersList.value = response.data?.orderList;
    commentsList.value = response.data?.commentList;
    noticeList.value = response.data?.notice;
    console.log(noticeList.value)
  } catch (error) {
    message.error("获取数据失败:" + error);
  }
}


const currentTime = ref(new Date());

onMounted(() => {
  updateTime();
  getData();
  setInterval(updateTime, 60000);
  addViewUsingGet()
  getNewsNoticeUsingGet().then((res) => {
    if (res.code === 200 && res.data) {
      notification.success({
        message: res.data?.title,
        description: res.data?.content,
        duration: 5,
        style: {
          width: "100%",
          whiteSpace: 'pre-line',
          marginTop: '30px',
        },
      })
    }
  })
});

const greeting = computed(() => {
  const hour = currentTime.value.getHours();

  if (hour >= 5 && hour < 12) {
    return '早上好';
  } else if (hour >= 12 && hour < 14) {
    return '中午好';
  } else if (hour >= 14 && hour < 18) {
    return '下午好';
  } else if (hour >= 18 && hour < 24) {
    return '晚上好';
  } else {
    return '凌晨好';
  }
});

function updateTime() {
  currentTime.value = new Date();
}

defineOptions({
  name: 'Workplace',
})

const currentUser = {
  avatar: avatar,
  name: name,
  userid: userId,
  email: email,
  description: description
}


const formatTimeAgo = (timeString: string) => {
  const currentTime = new Date();
  const createTime = new Date(timeString);
  const timeDifference = currentTime.getTime() - createTime.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return `${seconds}秒前`;
  }
};
</script>

<template>
  <page-container>
    <template #content>
      <div class="pageHeaderContent">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar"/>
        </div>
        <div class="content">
          <div class="contentTitle">
            {{ greeting }}，
            {{ currentUser.name }}
            ，祝你开心每一天！
          </div>
          <div>
            {{ currentUser.description }}
          </div>
        </div>
      </div>
    </template>
    <template #extraContent>
      <div class="extraContent">
        <div class="statItem">
          <a-statistic title="用户数" :value="HomeData?.userCount" suffix="位"/>
        </div>
        <div class="statItem">
          <a-statistic title="文章数" :value="HomeData?.postCount" suffix="篇"/>
        </div>
        <div class="statItem">
          <a-statistic title="评论数" :value="HomeData?.commentCount" suffix="条"/>
        </div>
        <div class="statItem">
          <a-statistic title="商品数" :value="HomeData?.productCount" suffix="件"/>
        </div>
        <div class="statItem">
          <a-statistic title="订单数" :value="HomeData?.orderCount" suffix="单"/>
        </div>
        <div class="statItem">
          <a-statistic title="订单总金额" :value="HomeData?.orderTotalPrice" suffix="元"/>
        </div>
        <div class="statItem">
          <a-statistic title="网站访问" :value="HomeData?.visitCount" suffix="次"/>
        </div>
      </div>
    </template>

    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card
            class="projectList"
            :style="{ marginBottom: '24px' }"
            title="最新文章"
            :bordered="false"
            :loading="false"
            :body-style="{ padding: 0 }"
        >
          <template #extra>
            <router-link to="/post">
              全部文章
            </router-link>
          </template>
          <a-card-grid v-for="item in postsList" :key="item.id" class="projectGrid">
            <a-card :body-style="{ padding: 0 }" style="box-shadow: none" :bordered="false">
              <a-card-meta
                  :description="item.content.slice(0,100)"
                  class="w-full"
              >
                <template #title>
                  <div class="cardTitle" ml--10px>
                    <a :href="/postShow/+item.id">
                      {{ item.title }}
                    </a>
                  </div>
                </template>
              </a-card-meta>
              <div mt3 w-full>
                <a-tag v-for="tag in item.tagList" color="blue" border-rd-0>{{ tag }}</a-tag>
              </div>
              <div mt3>
                <span><a-avatar :src="item.user.avatar" size="small"/><span ml-5px>{{ item.user.name }}</span></span>
                <span c-gray-3 ml3 mr1>|</span>
                <span class="datetime" ml-2 :title="item.createTime">
                  {{ item.createTime }}
                </span>
              </div>
            </a-card>
          </a-card-grid>
        </a-card>
        <a-card
            class="productList"
            :style="{ marginBottom: '24px' }"
            title="最新商品"
            :bordered="false"
            :loading="false"
            :body-style="{ padding: 0 }"
        >
          <template #extra>
            <router-link to="/product">
              全部商品
            </router-link>
          </template>
          <a-card-grid v-for="item in productsList" :key="item.id" class="projectGrid">
            <a-card :body-style="{ padding: 0 }" style="box-shadow: none" :bordered="false">
              <a-card-meta
                  class="w-full"
              >
                <template #description>
                  <a-row :span="24" h-140>
                    <a-col :span="6">
                      <a-image :src="item.images" w-20px h-20px></a-image>
                    </a-col>
                    <a-col :span="1">
                    </a-col>
                    <a-col :span="17">
                      {{ item.description }}
                    </a-col>
                  </a-row>
                </template>
                <template #title>
                  <div class="cardTitle" ml--10px>
                    <router-link to="/product">
                      {{ item.title }}
                    </router-link>
                  </div>
                </template>
              </a-card-meta>
              <div mt3>
                <span text-16px c-red-5 font-bold ml-10px mr-18px>￥{{ item.price }}</span>
                <span class="datetime" ml-2 :title="item.createTime">
                  {{ item.createTime }}
                </span>
              </div>
            </a-card>
          </a-card-grid>
        </a-card>
        <a-card
            :body-style="{ padding: 0 }"
            :bordered="false"
            class="activeCard"
            title="评论动态"
            :loading="false"
        >
          <template #extra>
            <router-link to="/comment-crud-table">
              评论管理
            </router-link>
          </template>
          <a-list
              :data-source="commentsList"
              class="activitiesList"
          >
            <template #renderItem="{ item }">
              <a-list-item :key="item.id">
                <a-list-item-meta>
                  <template #title>
                    <span>
                      <span class="username">{{ item.user.name }}</span>&nbsp;
                      <span class="event">
                        <span>在</span>&nbsp;
                        <a :href="/postShow/+item.post_id">{{ item.post_name }} </a>&nbsp;
                        <span>评论</span>&nbsp;
                        <a :href="/postShow/+item.post_id" bg-gray-1> {{ item.content }} </a>
                      </span>
                    </span>
                  </template>
                  <template #avatar>
                    <a-avatar :src="item.user.avatar"/>
                  </template>
                  <template #description>
                    <span class="datetime" :title="item.createTime">
                      {{ formatTimeAgo(item.createTime) }}
                    </span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
        <a-card
            :style="{ marginBottom: '24px' }"
            title="最新通知"
            :bordered="false"
            :body-style="{ padding: 0 }"
        >
          <template #extra>
            <router-link to="/control/notice-crud-table">
              通知管理
            </router-link>
          </template>
          <a-list item-layout="horizontal" ma p30px>
            <div ma text-16px font-bold w-full mb-20px>

              <div>
                <NotificationTwoTone/>&nbsp;
                {{ noticeList?.title }}
              </div>
            </div>
            <div style="white-space: pre-line;" ml-20px mr-20px>
              {{ noticeList?.content }}
            </div>
            <a-divider mt-20px mb-20px/>
            <div c-gray-4 ml-20px mb--10px>
              {{ noticeList?.create_user }} 发布于
              {{ noticeList?.createTime }}
            </div>
          </a-list>
        </a-card>
        <a-card
            :style="{ marginBottom: '24px' }"
            title="快速开始 / 便捷导航"
            :bordered="false"
            :body-style="{ padding: 0 }"
        >
          <EditableLinkGroup/>
        </a-card>
        <a-card
            :style="{ marginBottom: '24px' }"
            :bordered="false"
            title="最新订单"
        >
          <template #extra>
            <router-link to="/control/order-crud-table">
              订单管理
            </router-link>
          </template>
          <div v-for="(order, index) in ordersList" :key="index" mb-15px>
            <a-row mt-10px>
              <a-col :span="24">
                <span c-blue-6><a-avatar size="small" :src="order.user.avatar" mr-5px/>{{ order.name }}</span>
                <span c-gray-4 ml-10px>{{ order.createTime }}</span>

                <span c-gray-4 mr-5px ml-5px>购买了</span>
              </a-col>
            </a-row>
            <a-row mt-10px>
              <a-col :span="24">
                                <span v-for="(detail, index) in order.orderDetails" :key="index ">
                      <a-image :src="detail.product.images" width="30px"/>
                      <span ml-2 mt>{{ detail.product.title }}</span>
                      <span ml-2 mt>× <a-tag ml-5px>{{ detail.quantity }}</a-tag></span>
                      <span ml-4 mt c-red-5 font-550>￥{{ detail.price }}</span>
                  <div h-1px w-full ma true-gray-2></div>
                </span>
              </a-col>
            </a-row>
            <a-divider v-if="index !== ordersList.length - 1"/>
          </div>
        </a-card>
        <!--        <a-card-->
        <!--            :body-style="{ paddingTop: '12px', paddingBottom: '12px' }"-->
        <!--            :bordered="false"-->
        <!--            title="团队"-->
        <!--        >-->
        <!--          <div class="members">-->
        <!--            <a-row :gutter="48">-->
        <!--              <a-col v-for="item in projectNotice" :key="`members-item-${item.id}`" :span="12">-->
        <!--                <router-link :to="item.href">-->
        <!--                  <a-avatar :src="item.logo" size="small"/>-->
        <!--                  <span class="member">{{ item.member }}</span>-->
        <!--                </router-link>-->
        <!--              </a-col>-->
        <!--            </a-row>-->
        <!--          </div>-->
        <!--        </a-card>-->
      </a-col>
    </a-row>
  </page-container>
</template>

<style scoped lang="less">
.textOverflow() {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}

// mixins for clearfix
// ------------------------
.clearfix() {
  zoom: 1;
  &::before,
  &::after {
    display: table;
    content: ' ';
  }
  &::after {
    clear: both;
    height: 0;
    font-size: 0;
    visibility: hidden;
  }
}

.activitiesList {
  padding: 0 24px 8px 24px;

  .username {
    color: var(--text-color);
  }

  .event {
    font-weight: normal;
  }
}

.pageHeaderContent {
  display: flex;

  .avatar {
    flex: 0 1 72px;

    & > span {
      display: block;
      width: 72px;
      height: 72px;
      border-radius: 72px;
    }
  }

  .content {
    position: relative;
    top: 4px;
    flex: 1 1 auto;
    margin-left: 24px;
    color: var(--pro-ant-color-text-tertiary);
    line-height: 22px;

    .contentTitle {
      margin-bottom: 12px;
      color: var(--pro-ant-color-text);
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
  }
}

.extraContent {
  .clearfix();

  float: right;
  white-space: nowrap;

  .statItem {
    position: relative;
    display: inline-block;
    padding: 0 32px;

    > p:first-child {
      margin-bottom: 4px;
      color: var(--pro-ant-color-text-tertiary);
      font-size: 14px;
      line-height: 22px;
    }

    > p {
      margin: 0;
      color: var(--pro-ant-color-text);
      font-size: 30px;
      line-height: 38px;

      > span {
        color: var(--pro-ant-color-text-tertiary);
        font-size: 20px;
      }
    }

    &::after {
      position: absolute;
      top: 8px;
      right: 0;
      width: 1px;
      height: 40px;
      content: '';
    }

    &:last-child {
      padding-right: 0;

      &::after {
        display: none;
      }
    }
  }
}

.members {
  a {
    display: block;
    height: 24px;
    margin: 12px 0;
    color: var(--text-color);
    transition: all 0.3s;
    .textOverflow();

    .member {
      margin-left: 12px;
      font-size: 14px;
      line-height: 24px;
      vertical-align: top;
    }

    &:hover {
      color: #1890ff;
    }
  }
}

.productList {
  :deep(.ant-card-meta-description) {
    height: 88px;
    overflow: hidden;
    color: var(--pro-ant-color-text-tertiary);
    line-height: 22px;
  }

  .cardTitle {
    font-size: 0;

    a {
      display: inline-block;
      height: 24px;
      margin-left: 12px;
      color: var(--pro-ant-color-text);
      font-size: 14px;
      line-height: 24px;
      vertical-align: top;

      &:hover {
        color: var(--pro-ant-color-primary-hover);
      }
    }
  }

  .projectGrid {
    width: 33.33%;
  }

  .projectItemContent {
    display: flex;
    height: 20px;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    .textOverflow();

    a {
      display: inline-block;
      flex: 1 1 0;
      color: var(--pro-ant-color-text-tertiary);
      .textOverflow();

      &:hover {
        color: var(--pro-ant-color-primary-hover);
      }
    }

    .datetime {
      flex: 0 0 auto;
      float: right;
      color: var(--pro-ant-color-text-quaternary);
    }
  }
}

.projectList {
  :deep(.ant-card-meta-description) {
    height: 44px;
    overflow: hidden;
    color: var(--pro-ant-color-text-tertiary);
    line-height: 22px;
  }

  .cardTitle {
    font-size: 0;

    a {
      display: inline-block;
      height: 24px;
      margin-left: 12px;
      color: var(--pro-ant-color-text);
      font-size: 14px;
      line-height: 24px;
      vertical-align: top;

      &:hover {
        color: var(--pro-ant-color-primary-hover);
      }
    }
  }

  .projectGrid {
    width: 33.33%;
  }

  .projectItemContent {
    display: flex;
    height: 20px;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    line-height: 20px;
    .textOverflow();

    a {
      display: inline-block;
      flex: 1 1 0;
      color: var(--pro-ant-color-text-tertiary);
      .textOverflow();

      &:hover {
        color: var(--pro-ant-color-primary-hover);
      }
    }

    .datetime {
      flex: 0 0 auto;
      float: right;
      color: var(--pro-ant-color-text-quaternary);
    }
  }
}

.datetime {
  color: var(--pro-ant-color-text-quaternary);
}

@media screen and (max-width: 1200px) and (min-width: 992px) {
  .activeCard {
    margin-bottom: 24px;
  }

  .members {
    margin-bottom: 0;
  }

  .extraContent {
    margin-left: -44px;

    .statItem {
      padding: 0 16px;
    }
  }
}

@media screen and (max-width: 992px) {
  .activeCard {
    margin-bottom: 24px;
  }

  .members {
    margin-bottom: 0;
  }

  .extraContent {
    float: none;
    margin-right: 0;

    .statItem {
      padding: 0 16px;
      text-align: left;

      &::after {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .extraContent {
    margin-left: -16px;
  }

  .projectList {
    .projectGrid {
      width: 50%;
    }
  }
}

@media screen and (max-width: 576px) {
  .pageHeaderContent {
    display: block;

    .content {
      margin-left: 0;
    }
  }

  .extraContent {
    .statItem {
      float: none;
    }
  }
}

@media screen and (max-width: 480px) {
  .projectList {
    .projectGrid {
      width: 100%;
    }
  }
}
</style>
