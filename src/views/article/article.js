import { ref } from 'vue'
import { useRoute } from "vue-router";
import http from '@/utils/httpindex.js'

function getArticleList() {
    const current_page = ref(0)
    const last_page = ref(1)
    const list = ref([])
    const activeList = ref([])
    const count = ref(0)
    const loading = ref(false)
    const route = useRoute()
    const getBlog = () => {
        let type = ""
        if (route.query.label) {
            type = '&label=' + route.query.label
        } else if (route.query.class) {
            type = '&class=' + route.query.class
        } else if (route.query.search) {
            type = '&search=' + route.query.search
        }
        console.log(type)
        if (current_page.value < last_page.value) {
            current_page.value += 1
            loading.value = true
            http.get(`/api/article/list?page=${current_page.value}&limit=20`)
                .then(function(res) {
                    if (res.data.count != 0) {
                        list.value = res.data.recordList
                        activeList.value = list.value.slice()
                        activeList.value.forEach(article => {
                            article.activeTitle = JSON.parse(JSON.stringify(article.articleTitle))
                        });
                        count.value = res.data.count
                        loading.value = false
                        current_page.value = res.data.current_page
                        last_page.value = res.data.last_page
                    }
                })
        }
    }
    return {
        current_page,
        last_page,
        list,
        activeList,
        count,
        loading,
        getBlog
    }

}

function getClasList() {
    const classList = ref([])
    const classLoading = ref(true)
    http.get("/api/category/list")
        .then(function(res) {
            classLoading.value = false
            console.log(res.data)
            classList.value = res.data

        })
    return {
        classList,
        classLoading
    }
}

function getLabelList() {
    const labelList = ref([])
    const labelLoading = ref(true)
    http.get('/api/tag/list')
        .then(function(res) {
            labelLoading.value = false
            labelList.value = res.data
        })
    return {
        labelList,
        labelLoading
    }

}

function getBlogInfo() {
    const count = ref(0)
    http.get("/apis/blog/info")
        .then(function(res) {
            count.value = res.data;
        })
    return {
        count
    }
}
export {
    getArticleList,
    getClasList,
    getLabelList,
    getBlogInfo
}