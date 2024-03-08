declare namespace API {
  type BaseResponseboolean = {
    code?: number;
    data?: boolean;
    message?: string;
  };
  type BaseResponseHomeVO = {
    code?: number;
    data?: HomeVO;
    message?: string;
  };
  type BaseResponseListCommentVO = {
    code?: number;
    data?: CommentVO[];
    message?: string;
  };
  type BaseResponseListNotice = {
    code?: number;
    data?: Notice[];
    message?: string;
  };
  type BaseResponseListOrderVO = {
    code?: number;
    data?: OrderVO[];
    message?: string;
  };
  type BaseResponseListPostVO = {
    code?: number;
    data?: PostVO[];
    message?: string;
  };
  type BaseResponseListProductVO = {
    code?: number;
    data?: ProductVO[];
    message?: string;
  };
  type BaseResponseListstring = {
    code?: number;
    data?: string[];
    message?: string;
  };
  type BaseResponseListTaskVO = {
    code?: number;
    data?: TaskVO[];
    message?: string;
  };
  type BaseResponseListUser = {
    code?: number;
    data?: User[];
    message?: string;
  };
  type BaseResponselong = {
    code?: number;
    data?: number;
    message?: string;
  };
  type BaseResponseNotice = {
    code?: number;
    data?: Notice;
    message?: string;
  };
  type BaseResponseOrderVO = {
    code?: number;
    data?: OrderVO;
    message?: string;
  };
  type BaseResponsePostVO = {
    code?: number;
    data?: PostVO;
    message?: string;
  };
  type BaseResponsestring = {
    code?: number;
    data?: string;
    message?: string;
  };
  type BaseResponseTaskData = {
    code?: number;
    data?: TaskData;
    message?: string;
  };
  type BaseResponseUser = {
    code?: number;
    data?: User;
    message?: string;
  };
  type BaseResponseUserVO = {
    code?: number;
    data?: UserVO;
    message?: string;
  };
  type changeShelvesUsingGETParams = {
    /** id */
    id: number;
  };
  type CommentAddRequest = {
    content?: string;
    parent_id?: number;
    post_id?: number;
    root_parent_id?: number;
    user_id?: number;
    user_name?: string;
  };
  type CommentDeleteRequest = {
    id?: number;
  };
  type CommentVO = {
    child?: CommentVO[];
    content?: string;
    createTime?: string;
    id?: number;
    parent_id?: number;
    post_id?: number;
    post_name?: string;
    root_parent_id?: number;
    updateTime?: string;
    user?: UserVO;
    user_id?: number;
  };
  type CreateNoticeDto = {
    content?: string;
    create_user?: string;
    end_time?: string;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
  };
  type CreateUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 账号 */
    username?: string;
  };
  type DeleteNoticeDto = {
    /** 通知id */
    notice_id?: number;
  };
  type DeleteRequest = {
    id?: number;
  };
  type deleteUserUsingDELETEParams = {
    /** user_id */
    user_id: number;
  };
  type getCommentBySearchTextUsingGETParams = {
    /** searchText */
    searchText: string;
  };
  type getCommentsByPostIdUsingGETParams = {
    /** postId */
    postId: number;
  };
  type getOrderVOByIdUsingGETParams = {
    /** id */
    id: number;
  };
  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };
  type getProductsByTagsUsingGETParams = {
    /** tags */
    tags?: string;
  };
  type getUserByUserIdUsingGETParams = {
    /** user_id */
    user_id?: number;
  };
  type getUsersByCategoryUsingGETParams = {
    /** category */
    category?: string;
    /** ascending */
    ascending?: boolean;
  };
  type getUsersBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };
  type HomeVO = {
    commentCount?: number;
    commentList?: CommentVO[];
    notice?: Notice;
    orderCount?: number;
    orderList?: OrderVO[];
    orderTotalPrice?: number;
    postCount?: number;
    postList?: PostVO[];
    productCount?: number;
    productList?: ProductVO[];
    userCount?: number;
    visitCount?: number;
  };
  type LoginRequest = {
    password?: string;
    username?: string;
  };
  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | "ACCEPTED"
      | "ALREADY_REPORTED"
      | "BAD_GATEWAY"
      | "BAD_REQUEST"
      | "BANDWIDTH_LIMIT_EXCEEDED"
      | "CHECKPOINT"
      | "CONFLICT"
      | "CONTINUE"
      | "CREATED"
      | "DESTINATION_LOCKED"
      | "EXPECTATION_FAILED"
      | "FAILED_DEPENDENCY"
      | "FORBIDDEN"
      | "FOUND"
      | "GATEWAY_TIMEOUT"
      | "GONE"
      | "HTTP_VERSION_NOT_SUPPORTED"
      | "IM_USED"
      | "INSUFFICIENT_SPACE_ON_RESOURCE"
      | "INSUFFICIENT_STORAGE"
      | "INTERNAL_SERVER_ERROR"
      | "I_AM_A_TEAPOT"
      | "LENGTH_REQUIRED"
      | "LOCKED"
      | "LOOP_DETECTED"
      | "METHOD_FAILURE"
      | "METHOD_NOT_ALLOWED"
      | "MOVED_PERMANENTLY"
      | "MOVED_TEMPORARILY"
      | "MULTIPLE_CHOICES"
      | "MULTI_STATUS"
      | "NETWORK_AUTHENTICATION_REQUIRED"
      | "NON_AUTHORITATIVE_INFORMATION"
      | "NOT_ACCEPTABLE"
      | "NOT_EXTENDED"
      | "NOT_FOUND"
      | "NOT_IMPLEMENTED"
      | "NOT_MODIFIED"
      | "NO_CONTENT"
      | "OK"
      | "PARTIAL_CONTENT"
      | "PAYLOAD_TOO_LARGE"
      | "PAYMENT_REQUIRED"
      | "PERMANENT_REDIRECT"
      | "PRECONDITION_FAILED"
      | "PRECONDITION_REQUIRED"
      | "PROCESSING"
      | "PROXY_AUTHENTICATION_REQUIRED"
      | "REQUESTED_RANGE_NOT_SATISFIABLE"
      | "REQUEST_ENTITY_TOO_LARGE"
      | "REQUEST_HEADER_FIELDS_TOO_LARGE"
      | "REQUEST_TIMEOUT"
      | "REQUEST_URI_TOO_LONG"
      | "RESET_CONTENT"
      | "SEE_OTHER"
      | "SERVICE_UNAVAILABLE"
      | "SWITCHING_PROTOCOLS"
      | "TEMPORARY_REDIRECT"
      | "TOO_EARLY"
      | "TOO_MANY_REQUESTS"
      | "UNAUTHORIZED"
      | "UNAVAILABLE_FOR_LEGAL_REASONS"
      | "UNPROCESSABLE_ENTITY"
      | "UNSUPPORTED_MEDIA_TYPE"
      | "UPGRADE_REQUIRED"
      | "URI_TOO_LONG"
      | "USE_PROXY"
      | "VARIANT_ALSO_NEGOTIATES";
    view?: View;
    viewName?: string;
  };
  type Notice = {
    content?: string;
    /** 创建时间 */
    createTime?: string;
    create_user?: string;
    end_time?: string;
    isDelete?: number;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    /** 更新时间 */
    updateTime?: string;
    update_user?: string;
  };
  type OrderCreateRequest = {
    address?: string;
    count?: number;
    name?: string;
    orderDetails?: OrderDetailCreateRequest[];
    payMethod?: string;
    phone?: string;
    totalPrice?: number;
    userId?: number;
  };
  type OrderDetailCreateRequest = {
    orderId?: number;
    price?: number;
    productId?: number;
    quantity?: number;
    total?: number;
  };
  type OrderDetailVO = {
    orderId?: number;
    price?: number;
    product?: ProductVO;
    productId?: number;
    quantity?: number;
    total?: number;
  };
  type OrderUpdateRequest = {
    id?: number;
    status?: string;
  };
  type OrderVO = {
    address?: string;
    count?: number;
    createTime?: string;
    id?: number;
    name?: string;
    orderDetails?: OrderDetailVO[];
    orderTime?: string;
    payMethod?: string;
    payTime?: string;
    phone?: string;
    status?: number;
    totalPrice?: number;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };
  type PostAddRequest = {
    content?: string;
    tagList?: string[];
    title?: string;
  };
  type PostDeleteRequest = {
    post_id?: number;
  };
  type PostQueryRequest = {
    current?: number;
    pageSize?: number;
    searchText?: string;
  };
  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tagList?: string[];
    title?: string;
  };
  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };
  type ProductAddRequest = {
    description?: string;
    images?: string;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
  };
  type ProductUpdateRequest = {
    description?: string;
    id?: number;
    images?: string;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string;
    title?: string;
  };
  type ProductVO = {
    createTime?: string;
    description?: string;
    id?: number;
    images?: string;
    isShelves?: number;
    price?: number;
    stock?: number;
    tags?: string[];
    title?: string;
    updateTime?: string;
  };
  type RegisterUserDto = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 确认密码 */
    confirmPassword?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 性别 */
    sex?: string;
    /** 账号 */
    username?: string;
  };
  type searchOrderBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };
  type searchPostBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };
  type searchProductBySearchTextUsingGETParams = {
    /** searchText */
    searchText?: string;
  };
  type searchUsingPOSTParams = {
    /** searchText */
    searchText?: string;
  };
  type TaskAddRequest = {
    endTime?: string;
    linkId?: number;
    principalId?: number;
    priority?: string;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };
  type TaskCategoryRequest = {
    ascending?: string;
    category?: string;
  };
  type TaskData = {
    doingTaskCount?: number;
    finishTaskCount?: number;
    taskCount?: number;
    unFinishTaskCount?: number;
  };
  type TaskGetStatusRequest = {
    status?: string;
    userId?: number;
  };
  type TaskGetUserRequest = {
    userId?: number;
  };
  type TaskSearchRequest = {
    searchText?: string;
  };
  type TaskUpdateRequest = {
    endTime?: string;
    id?: number;
    linkId?: number;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    userId?: number;
  };
  type TaskVO = {
    createTime?: string;
    endTime?: string;
    id?: number;
    linkId?: number;
    post?: PostVO;
    principal?: UserVO;
    principalId?: number;
    priority?: string;
    progress?: number;
    startTime?: string;
    status?: string;
    taskName?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };
  type UpdateByAdminRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    user_id?: number;
    /** 账号 */
    username?: string;
  };
  type UpdateByUserRequest = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 性别 */
    sex?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
  };
  type UpdateNoticeDto = {
    content?: string;
    end_time?: string;
    /** 通知id */
    notice_id?: number;
    sort?: number;
    start_time?: string;
    status?: number;
    title?: string;
    update_user?: string;
  };
  type UpdatePasswordRequest = {
    /** 确认新密码 */
    confirmPassword?: string;
    /** 新密码 */
    newPassword?: string;
    /** 旧密码 */
    oldPassword?: string;
    user_id?: number;
  };
  type uploadFileUsingPOSTParams = {
    biz?: string;
  };
  type User = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    isDelete?: number;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 密码(加密) */
    password?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
  };
  type UserVO = {
    /** 家庭住址 */
    address?: string;
    /** 头像 */
    avatar?: string;
    /** 创建时间 */
    createTime?: string;
    /** 个人简介 */
    description?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号码 */
    mobile?: string;
    /** 昵称 */
    name?: string;
    /** 角色 */
    role?: string;
    /** 性别 */
    sex?: string;
    /** 账号状态 #1：正常, 2：禁用 */
    status?: number;
    /** 更新时间 */
    updateTime?: string;
    /** 用户id */
    user_id?: number;
    /** 账号 */
    username?: string;
  };
  type View = {
    contentType?: string;
  };
}
