import http from "@/utils/httpindex.js";
import Notification from "@/components/notification/index.js";
import { h } from "vue";
import { getToken, setToken } from '@/utils/auth.js'
const user = {
  state: {
    user: "",
    token: getToken,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    userInfo(state, data) {
      //写入个人信息
      state.user = data;
      Notification.success({
        message: `欢迎回来~${data.nickname}`,
        description: `上次登录时间:${data.loginTime}`,
        icon: h("img", {
          src: data.avatar,
          style:
            "position: absolute;width: 40px;height:40px;border-radius: 50%;border: 2px solid rgba(223,223,223,0.3);",
        }),
      });
    },
    logOut(state) {
      //退出
      console.log(state.user);
      Notification.success({
        message: `退出成功~${state.user.nickname}`,
        description: `欢迎下次登陆！`,
        icon: h("img", {
          src: state.user.avatar,
          style:
            "position: absolute;width: 40px;height:40px;border-radius: 50%;border: 2px solid rgba(223,223,223,0.3);",
        }),
      });
      state.token = "";
      state.user = "";
    },
  },
  actions: {
    set_token({ commit }, data) {
      // localStorage.setItem("so_token", data);
      commit("SET_TOKEN", data);
    },
    async login({ commit }, loginForm) {
      const { username, password } = loginForm
      await http.post("/api/login", {
        username: username.trim(),
        password: password
      }).then(response => {
        const { data } = response
        setToken(data)
        commit("SET_TOKEN", data)
        console.log(getToken())
      })
    },
    async userInfo({ commit }) {
      await http.get("/api/admin/user/getUserInfo").then(response => {
        const { data } = response
        commit("userInfo", data);
      });
    },
    async logOut({ commit }) {
      await http.post("/api/logout").then(() => {
        commit("logOut");
      });
    },
  },
};
export default user;
