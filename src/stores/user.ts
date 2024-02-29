import type {MenuData} from '~@/layouts/basic-layout/typing'
import {rootRoute} from '~@/router/constant'
import {generateFlatRoutes, generateRoutes,} from '~@/router/generate-route'
// import {DYNAMIC_LOAD_WAY, DynamicLoadEnum} from '~@/utils/constant'
import {getLoginUserUsingGet, userLogoutUsingGet} from "~/servers/api/userController.ts";
import UserVO = API.UserVO;

export const useUserStore = defineStore('user', () => {
    const routerData = shallowRef()
    const menuData = shallowRef<MenuData>([])
    const userInfo = shallowRef<UserVO>()
    const avatar = computed(() => userInfo.value?.avatar)
    const name = computed(() => userInfo.value?.name)
    const role = computed(() => userInfo.value?.role)
    const username = computed(() => userInfo.value?.username)
    const address = computed(() => userInfo.value?.address)
    const email = computed(() => userInfo.value?.email)
    const mobile = computed(() => userInfo.value?.mobile)
    const sex = computed(() => userInfo.value?.sex)
    const description = computed(() => userInfo.value?.description)
    const userId = computed(() => userInfo.value?.user_id)

    const userVO = computed(() => userInfo.value)


    // const getMenuRoutes = async () => {
    //     const {data} = await getRouteMenusApi()
    //     return generateTreeRoutes(data ?? [])
    // }

    const generateDynamicRoutes = async () => {
        const dynamicLoadWay = generateRoutes
        const {menuData: treeMenuData, routeData} = await dynamicLoadWay()

        menuData.value = treeMenuData

        routerData.value = {
            ...rootRoute,
            children: generateFlatRoutes(routeData),
        }
        return routerData.value
    }

    // 获取用户信息
    const getUserInfo = async () => {
        // 获取用户信息
        const {data} = await getLoginUserUsingGet()
        userInfo.value = data
        routerData.value = await generateDynamicRoutes()
    }

    const logout = async () => {
        // 退出登录
        // 1. 清空用户信息
        try {
            await userLogoutUsingGet()
        } finally {
            userInfo.value = undefined
            routerData.value = undefined
            menuData.value = []
        }
    }

    return {
        userInfo,
        role,
        getUserInfo,
        logout,
        routerData,
        menuData,
        generateDynamicRoutes,
        avatar,
        name,
        username,
        address,
        email,
        mobile,
        description,
        sex,
        userId,
        userVO
    }
})
