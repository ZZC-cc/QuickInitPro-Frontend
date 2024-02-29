interface CrudTableModel {
  /** 家庭住址 */
  address?: string
  /** 头像 */
  avatar?: string
  /** 创建时间 */
  createTime?: string
  /** 个人简介 */
  description?: string
  /** 邮箱 */
  email?: string
  /** 手机号码 */
  mobile?: string
  /** 昵称 */
  name?: string
  /** 密码(加密) */
  password?: string
  /** 角色 */
  role?: string
  /** 性别 */
  sex?: string
  /** 账号状态 #1：正常, 2：禁用 */
  status?: number
  /** 更新时间 */
  updateTime?: string
  /** 用户id */
  user_id?: number
  /** 账号 */
  username?: string
}

type CrudTableParams = Partial<Omit<CrudTableModel, 'id'>>

export async function getListApi(params?: CrudTableParams) {
  return usePost<CrudTableModel[]>('/list/crud-table', params)
}

export async function deleteApi(id: string | number) {
  return useDelete(`/list/${id}`)
}

export type { CrudTableModel, CrudTableParams }
