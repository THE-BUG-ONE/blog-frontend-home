import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/index/main.vue'
const name = "青松拾光"

const routes = [{
        path: '/',
        name: 'Home',
        component: Index,
        meta: {
            title: '首页-' + name,
            keepAlive: true, // 需要被缓存
            requiresAuth: false
        }
    },
    {
        path: '/article',
        name: 'Article',
        component: () =>
            import ('../views/article/main.vue'),
        meta: {
            title: '文章-' + name,
            keepAlive: true, // 需要被缓存
            requiresAuth: false
        }
    },
    {
        path: '/article/:id',
        name: 'ArticleContent',
        component: () =>
            import ('../views/article/blog-content.vue'),
        meta: {
            title: 'loading……',
            keepAlive: true // 需要被缓存
        }
    },
    {
        path: '/link',
        name: 'Link',
        component: () =>
            import ('../views/friends/main.vue'),
        meta: {
            keepAlive: true, // 需要被缓存
            title: '友链-' + name,
        }
    },
    {
        path: '/message',
        name: 'Message',
        component: () =>
            import ('../views/message/main.vue'),
        meta: {
            // keepAlive: true, // 需要被缓存
            title: '留言-' + name,
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/login/login.vue'),
        meta: {
            title: '登录-' + name,
        }
    },
    // {
    //     path: '/project',
    //     name: 'Project',
    //     component: () =>
    //         import ('../views/circle/project.vue'),
    //     meta: {
    //         title: '项目圈-' + name,
    //     }
    // },
    // {
    //     path: '/player',
    //     name: 'Music',
    //     component: () =>
    //         import ('../views/circle/music.vue'),
    //     meta: {
    //         title: '音乐圈-' + name,
    //     }
    // },
    {
        // 会匹配所有路径
        path: '/:pathMatch(.*)*',
        name: 'Windmill',
        component: () =>
            import ('../views/windmill.vue'),
        meta: {
            title: '哎呀页面不见了-' + name
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior() {
        // return desired position
        return { top: 0 }
    },
    routes
})

export default router