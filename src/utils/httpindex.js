import axios from 'axios'
import store from '../store/index'
import Notification from '@/components/notification/index.js';
import { getToken } from '@/utils/auth.js';
var instance = axios.create({
    baseURL: process.env.VITE_APP_API_URL,
    timeout: 10000,
});
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    console.log(config.url)
    if (config.url === '/api/logout' || config.url.startsWith('/api/admin')) {
        config.headers['Authorization'] = getToken()
        console.log(config.headers['Authorization'])
    }
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {

    // 对响应数据做点什么
    // Message('操作成功')
    console.log(response)
    if (response.headers.authorization) {
        store.dispatch("set_token", response.headers.authorization);
    }
    console.log(response.status)
    if (response.data.status == 'success') {
        return Promise.resolve(response.data)
    } else if (response.data.status == 'error') {
        Notification.error({
            message: '错误提示',
            description: response.data.message,
        })
    } else if (response.data.code == 200 || response.status == 200) {
        return Promise.resolve(response.data)
    } else {
        Notification.error({
            message: '错误提示',
            description: response.data.message,
        })
    }
    // 打印错误信息
    return Promise.reject(response.data)
    },
    function(error) {
        // 对响应错误做点什么
        console.log(error)
        switch (error.response.code) {
            case 400:
                Notification.warning({
                    message: '错误提示',
                    description: error.response.data.msg,
                    onClose() {
                        store.commit('showLogin')
                    }
                });
                break;
            case 401:
                Notification.warning({
                    message: '请求参数有误',
                    description: error.response.data.msg,
                });
                break;
            case 403:
                Notification.warning({
                    message: '用户权限提示',
                    description: error.response.data.msg,
                    onClose() {
                        store.commit('showLogin')
                    },
                });
                break;
            case 404:
                Notification.warning({
                    message: '访问路径不正确',
                    description: error.response.data.msg,
                });
                break;
            case 422:
                Notification.warning({
                    message: '温馨提示',
                    description: error.response.data.msg,
                    iconClass: 'el-icon-warning-outline',
                    onClose() {
                        store.dispatch("logout")
                        store.commit('showLogin')
                    },
                });
                break;
            case 429:
                Notification.warning({
                    message: '温馨提示',
                    description: error.response.data.msg,
                });
                break;
            case 500:
                Notification.error({
                    message: '网络提示',
                    description: '服务器连接失败，请稍后再试',
                });
                break;
            default:
                Notification.error({
                    message: '错误提示 ' + error.response.status,
                    description: error.response.data.msg,
                });

        }
        return Promise.reject(error)
    });
export default instance;