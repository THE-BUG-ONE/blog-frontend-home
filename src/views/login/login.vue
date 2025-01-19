<template>
  <teleport to="body">
    <transition name="fade">
      <div class="login-modal" v-show="mVisible">
        <div class="login-mask"></div>
        <div class="login-wrap">
          <div class="login concise">
            <span class="close" @click="close"><CloseOutlined /></span>
            <p class="title">欢迎登录</p>
            <!-- 表单区域 -->
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="0px" class="login_form">
              <el-form-item prop="username">
                <el-input 
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="Username"
                  name="username"
                  type="text"
                  tabindex="1"
                  auto-complete="on">
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="Password"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.enter.native="handleLogin">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                  <template #suffix>
                    <span class="show-pwd" @click="showPwd">
                      <EyeOutlined v-if="passwordType === ''"/>
                      <EyeInvisibleOutlined v-else/>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
import {
  ExclamationCircleOutlined,
  CloseOutlined,
  UserOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons-vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
export default {
  name: "login",
  components: {
    ExclamationCircleOutlined,
    CloseOutlined,
    UserOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6个字符'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('login', this.loginForm).then(() => {
            console.log(this.$store.state.user)
            this.$store.dispatch('userInfo')
            this.close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  },
  //   props:{
  //       visible:{
  //           type:Boolean,
  //           default:false
  //       }
  //   },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const token = route.query.token;
    if (token) {
      store.dispatch("set_Token", token);
      store.dispatch("userInfo", route.query.time);
      let page = localStorage.getItem("current_page");
      router.push(page);
      localStorage.setItem("current_page", "/article");
    }
    const partyLogin = (type) => {
      let githubUrl =
        process.env.VITE_APP_API_URL + "/login/" + type + "/redirect";
      window.location.href = githubUrl;
      localStorage.setItem("current_page", route.path);
    };
    const mVisible = computed(() => store.state.index.loginShow);
    const close = () => {
      store.commit("showLogin", false);
    };
    return {
      partyLogin,
      mVisible,
      close,
    };
  },
};
</script>
<style lang="stylus" scoped>
.login-modal {
  .login-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
  }

  .login-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    .show-pwd {
      position: absolute;
      right: 10px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .login {
      width: 430px;
      box-shadow: 0 0px 25px 5px rgba(46, 58, 89, 0.1);
      background: linear-gradient(180deg, #dcf4ff, #f4fcff);
      position: relative;

      &:hover {
        box-shadow: 0 30px 50px 20px rgba(46, 58, 89, 0.1);
      }

      .close {
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 20px;
        color: #ccc;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
      }

      .title {
        font-size: 25px;
        text-align: center;
        line-height: 46px;
        color: #2e3a59;
        margin-bottom: 10px;
        font-weight: 700;
        font-family: GlowSansSC-ExtendedHeavy;
      }

      .alert {
        margin-bottom: 16px;
        box-sizing: border-box;
        margin: 0;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5715;
        list-style: none;
        font-feature-settings: 'tnum';
        position: relative;
        padding: 8px 15px 8px 37px;
        word-wrap: break-word;
        border-radius: 20px;
        background-color: #fffbe6;
        position: relative;

        .icon {
          position: absolute;
          top: 12.0005px;
          left: 16px;
          color: #faad14;
        }
      }

      .mode {
        display: flex;
        align-items: center;
        justify-content: center;

        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 48px;
          height: 48px;
          border: 2px solid #efefef;
          border-radius: 50%;
          font-size: 24px;
          margin: 10px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .qq {
          color: #7bd4ef;

          &:hover {
            background: rgba(123, 212, 239, 0.4);
            border-color: #7bd4ef;
          }
        }

        .github {
          color: #383838;

          &:hover {
            background: rgba(56, 56, 56, 0.4);
            border-color: #383838;
          }
        }

        .gitee {
          color: #fe7300;

          &:hover {
            background: rgba(254, 115, 0, 0.4);
            border-color: #fe7300;
          }
        }
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 500px) {
  .login-modal {
    .login-wrap {
      .login {
        width: 90%;
        margin: 0 5%;

        .title {
          font-size: 20px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>