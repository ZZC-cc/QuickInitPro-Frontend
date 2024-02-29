export interface LoginParams {
  userAccount: string
  userPassword: string
}

export interface LoginMobileParams {
  mobile: string
  code: string
  type: 'mobile'
}

export interface LoginResultModel {
  token: string
}

export function loginApi(params: LoginParams) {
  return usePost<LoginResultModel, LoginParams>('/user/login', params, {
    // 设置为false的时候不会携带token
    token: false,
    // 开发模式下使用自定义的接口
    customDev: false,
    // 是否开启全局请求loading
    loading: true,
  })
}

export function logoutApi() {
  return useGet('/logout')
}
