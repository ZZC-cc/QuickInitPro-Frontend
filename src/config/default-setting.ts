import type {LayoutSetting} from '~@/stores/app'

export default {
    title: import.meta.env.VITE_GLOB_APP_TITLE,
    theme: 'light',
    logo: '/logo.svg',
    collapsed: false,//侧边栏折叠
    drawerVisible: true,//侧边栏显示
    colorPrimary: '#1677FF',
    layout: 'side',//布局模式
    contentWidth: 'Fluid',//布局宽度
    fixedHeader: true,//固定头部
    fixedSider: true,
    splitMenus: false,//菜单折叠
    header: true,
    menu: true,
    watermark: true,
    menuHeader: true,
    footer: true,
    colorWeak: false,
    colorGray: false,
    multiTab: true,
    multiTabFixed: false,
    keepAlive: true,
    accordionMode: false,
    leftCollapsed: true,
    compactAlgorithm: true,
    headerHeight: 48,
    copyright: import.meta.env.VITE_GLOB_APP_COPYRIGHT,
    animationName: 'slide-fadein-right',
} as LayoutSetting


export const animationNameList = [
    {
        label: 'None',
        value: 'none',
    },
    {
        label: 'Fadein Up',
        value: 'slide-fadein-up',
    },
    {
        label: 'Fadein Right',
        value: 'slide-fadein-right',
    },
    {
        label: 'Zoom Fadein',
        value: 'zoom-fadein',
    },
    {
        label: 'Fadein',
        value: 'fadein',
    },
]
export type AnimationNameValueType = 'none' | 'slide-fadein-up' | 'slide-fadein-right' | 'zoom-fadein' | 'fadein'
