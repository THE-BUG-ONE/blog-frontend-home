import http from '@/utils/httpindex.js'
const formatDate = () => {
    var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}
const user = {
    state: {
        list: [],
        friendList: [],
        dailyEnglish: {},
        loginShow: false
    },
    mutations: {
        setCarousels(state, data) { //写入token
            state.list = data
        },
        setFriendList(state, data) { //写入token
            state.friendList = data
            console.log(state.friendList)
        },
        showLogin(state, show = true) {
            state.loginShow = show
        }
    },
    actions: {
        async getCarousels({ commit }) {
            // await http.get('/api/user/logout')
            const res = await http.get('/api/carousel/list')
            console.log(res.data)
            commit('setCarousels', res.data)
        },
        async getFriendList({ commit }) {
            // await http.get('/api/user/logout')
            const res = await http.get('/api/link/list?type=0')
            commit('setFriendList', res.data)
        }
    }
}
export default user