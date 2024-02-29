// @ts-ignore
/* eslint-disable */
import request from 'umi-request';
/** 创建帖子 POST /api/post/add */
export async function addPostUsingPost(body: API.PostAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>('/api/post/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 删除帖子 POST /api/post/delete */
export async function deletePostUsingPost(
  body: API.PostDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsestring>('/api/post/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 获取全部标签名称 GET /api/post/get/all/tags */
export async function getAllTagsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListstring>('/api/post/get/all/tags', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 通过id获取文章 GET /api/post/get/vo */
export async function getPostVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePostVO>('/api/post/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 获取帖子列表 POST /api/post/list */
export async function listPostByPageUsingPost(
  body: API.PostQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListPostVO>('/api/post/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 获取当前用户创建的资源列表 POST /api/post/my/list/vo */
export async function listMyPostVoUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseListPostVO>('/api/post/my/list/vo', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 多类型搜索 GET /api/post/search */
export async function searchPostBySearchTextUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchPostBySearchTextUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListPostVO>('/api/post/search', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
/** 更新帖子 POST /api/post/update */
export async function updatePostUsingPost(
  body: API.PostUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsestring>('/api/post/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
