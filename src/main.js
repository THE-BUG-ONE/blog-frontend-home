import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/httpindex'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/iconfont/iconfont.js'
import InfiniteScroll from '@/components/infinite-scroll/index.js'
import '@/components/editor/show.js'
import '@/assets/style/reset.css'
// markdown 预览 markdown解析需要的配置项目
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'; // highlightjs

VMdPreview.use(githubTheme, {
   
    Hljs: hljs,
  });

router.beforeEach((to, from, next) => {
    console.log(from)
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

const app = createApp(App)
app.use(VMdPreview)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(InfiniteScroll)
app.config.globalProperties.$get = http.get
app.config.globalProperties.$post = http.post
http.defaults.baseURL = process.env.VITE_APP_HOME_URL;
app.mount('#app')