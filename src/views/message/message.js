import { ref } from 'vue'
import http from '@/utils/httpindex.js'
import message from "@/components/message/index.js";

function getMessList(id) {
    const current_page = ref(0)
    const last_page = ref(1)
    const list = ref([])
    const loading = ref(false)
    const getMess = async(my) => {
        if (my) {
            id = my
            current_page.value = 0
            last_page.value = 1
            list.value = []
            console.log('my开始更新')
        }
        if (current_page.value < last_page.value) {
            current_page.value += 1
            loading.value = true
            await http.get(`/api/message/list?page=${current_page.value}&limit=20`)
                .then((res) => {
                    loading.value = false
                    list.value = list.value.concat(res.data.recordList)
                    console.log(current_page.value, last_page.value)
                    console.log(list.value)
                })
        }
    }

    function replyAdd(data) {
        http.post("/api/admin/message/add", data)
            .then(function(res) {
                message.success(`回复成功！`);
                // for (let i = 0, len = list.value.length; i < len; i++) {
                //     if (list.value[i].id == data.mess_id) {
                //         // bug:当列表回复为空时！不能添加的回复列表
                //         if (!list.value[i]['reply']) {
                //             list.value[i]['reply'] = []
                //         }
                //         console.log(list.value[i]['reply'])
                //         list.value[i].reply.push(res.data)
                //         break
                //     }
                // }
                if (list.value.length % 20 == 0) {
                    list.value.pop()
                }
                list.value.unshift(res.data)
            }).catch(() => {
                message.error(`回复失败！`);
            })
    }

    function messageAdd(data, isMess = true) {
        const mess = isMess ? '留言' : '回复'
        data["parentId"] = 0
        http.post("/api/admin/message/add", data)
            .then(function(res) {
                message.success(`${mess}成功！`);
                if (list.value.length % 20 == 0) {
                    list.value.pop()
                }
                list.value.unshift(res.data)
            })
            .catch(() => {
                message.error(`${mess}失败！`);
            })
    }

    function deleteMess(info) {
        http.delete("/api/admin/message/delete",{
                data: [info.id]
            })
            .then(function() {
                message.success(`删除成功！`);
            })
            .catch(function() {
                message.success(`删除成功！`);
            });
    }

    return {
        current_page,
        last_page,
        list,
        loading,
        getMess,
        messageAdd,
        replyAdd,
        deleteMess,
    }
}


export {
    getMessList,
}