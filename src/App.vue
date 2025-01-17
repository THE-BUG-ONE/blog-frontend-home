<template>
  <div id="nav">
    <Navbar
      class="navbar"
      title="青松拾光"
      :section="section"
      :style="nav"
    >
      <template #logo>
        <span class="logo"></span>
      </template>
      <template #footer>
        <DropDown class="user">
          <Image
          :src="
              userInfo
                ? userInfo.avatar
                : 'https://bit-images.bj.bcebos.com/bit-new/file/20210323/4inn.png'
            "
            class="avatar">
            
              <template #placeholder>
                <img style="width: 100%;height: 100%;" src="https://bit-images.bj.bcebos.com/bit-new/file/20210323/4inn.png"/>
              </template><template #error>
                <img style="width: 100%;height: 100%;" src="https://bit-images.bj.bcebos.com/bit-new/file/20210323/b72d.png"/>
              </template>
          </Image>
          <template #menu>
            <span class="user-opera" v-if="!user" @click="login"> 登录</span>
            <template v-else>
                 <router-link
                  class="user-opera"
                  :to="item.link"
                  v-for="item of userOperation"
                  :key="item.link"
                >
                  {{ item.tag }}
                </router-link>
            </template>
            <a href="/admin" target="_blank" class="user-opera" v-if="true || userInfo.roles.some(role => ['admin','user'].includes(role))" >管理后台</a>
            <span class="user-opera" v-if="user" @click="logOut">退出登录</span>
          </template>
        </DropDown>
      </template>
      <template #circle="{ item }">
        <router-link :to="item.link" custom v-slot="{ navigate }">
          <span @click="navigate" role="link" class="circle" :class="item.key">
            <span>{{ item.title }}</span>
            <span class="arrow-right"></span>
          </span>
        </router-link>
      </template>
    </Navbar>

    <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive :include="['Blog', 'Index', 'Friends','Project']">
                <component :is="Component" />
          </keep-alive>
        </transition>
    </router-view>
    <Footer />
    <Loagin></Loagin>
    <SystemMessage></SystemMessage>
    <BackTop>
      <!-- <span  class="iconfont" style=""></span> -->
      <UpOutlined />
    </BackTop>
  </div>
</template>
<script>
import BackTop from "@/components/back-top/back-top";
import Navbar from "@/components/navbar/main";
import DropDown from "@/components/navbar/drop-down";
import http from "@/utils/httpindex.js";
import Footer from "./views/index/footer.vue";
import SystemMessage from "./views/user/system-message.vue";
import { useStore } from "vuex";
import { computed, reactive, watch } from "vue";
import { UpOutlined } from "@ant-design/icons-vue";
import Loagin from './views/login/login.vue'
import Image from '@/components/image/image.vue';
import { useRoute } from 'vue-router';
export default {
  components: {
    BackTop,
    Navbar,
    DropDown,
    UpOutlined,
    Footer,
    Loagin,
    Image,
    SystemMessage
  },
  methods: {
    login() {
      this.$store.commit("showLogin")
    },
    logOut() {
      this.$store.dispatch('logOut')
    }
  },
  setup() {
  const route=useRoute()
  console.log(route)
    const nav =reactive( {
      normal: {
          "background-color": "#fff",
          'backdrop-filter': 'blur(3px)'
      },
      arrive: {
          "background-color": "#fff",
          "box-shadow": "0 4px 30px rgba(0,0,0,.07)",
      },
  });
  watch(()=>route.name,(name)=>{
    console.log(name)
    if(name=='Home'||name=="BlogContent"||name=="Link"||name=="Project"||name=="Music"){
        nav.normal['background-color']='transparent'
        nav.normal['color']='#fff'
    }else{
        nav.normal['background-color']='#fff'
        nav.normal['color']='rgba(0, 0, 0, 0.35)'
    }

  })
    const store = useStore();
    const section = [
      {
        title: "主页",
        link: "/",
        key: "home",
      },
      {
        title: "文章",
        link: "/article",
        key: "article",
      },
      {
        title: "友链",
        link: "/link",
        key: "link",
      },
      // {
      //   title: "个人圈",
      //   link: "/circle",
      //   key: "circle",
      //   childSlot: "circle",
      //   children: [
      //     {
      //       title: "项目圈",
      //       link: "/project",
      //       key: "project",
      //     },
      //   ],
      // },
      {
        title: "留言",
        link: "/message",
        key: "message",
      },
    ];
    const user = computed(() => {
      const token = store.state.user.token;
      if (token) {
        return true;
      }
      return false
    });
    const userInfo = computed(() => store.state.user.user);
    console.log(store.state.user)
    const userOperation =[
        {
          tag: "个人信息",
          link: "/user/info",
        },
        {
          tag: "我的留言",
          link: "/user/message",
        },
        // {
        //   tag: "发表文章",
        //   link: "/user/add",
        // },
        {
          tag: "系统消息",
          link: "/user/sysmess",
        },
        // {
        // id:'5',
        // tag:'退出登录',
        // link:'/user/sign'
        // }
      ]
    /* eslint-disable no-undef  */
    try {
    new qq.maps.Geolocation("MAVBZ-RQXRF-D5YJV-J46RA-VTMFS-LFFF5", "myapp");
    } catch (error) {
      console.log(error)
    }
    return {
      section,
      user,
      userInfo,
      userOperation,
      nav
    };
  },
};
</script>
<style lang="stylus">
#nav {
  // .router-view
  // padding-top 72px
  .navbar {
    .logo {
      display: block;
      height: 28.5px;
      width: 40px;
      background: url('./assets/logo.svg') no-repeat;
    }

    .user {
      margin-right: 10px;

      .avatar {
        padding: 0 10px;
        width: 48px;
        height: 48px;
        margin: 0;
        padding: 0;
        color: #3da8f5;
        text-align: center;
        cursor: pointer;
        background: #fff;
        line-height: 44px;
        border: 2px solid rgba(223, 223, 223, 0.3);
        box-sizing: border-box;
        border-radius: 50%;
        color: #c4c4c4;
      }
    }

    .user-opera {
      text-align: center;
      padding: 10px 0px;
      display: block;
      border-radius: 4px;
      transition: all 0.3s;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      font-size: 14px;
      color: #336a99;

      &:hover {
        background-color: #edf5fc;
      }
    }

    .circle {
      width: 150px;
      height: 70px;
      border-radius: 4px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: bottom;
      transition: all 0.3s;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 8px;
      font-size: 16px;
      line-height: 19px;
      color: #fff;
      font-weight: 600;
      box-sizing: border-box;

      &:hover {
        transform: translateY(-3px);
      }
    }

    .music {
      background-color: rgba(255, 215, 120, 0.4);
      background-image: url('@/assets/bzk.jpg');
      margin-bottom: 8px;
    }

    .project {
      background-color: rgba(255, 215, 120, 0.4);
      background-image: url('@/assets/bzl.jpg');
    }
  }

  .navbar-folding {
    .circle {
      width: 100%;
      height: 100px;
      transition: all 0.3s;
    }
  }
}

.back-top {
  color: #336a99;
  font-size: 18px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffff;
  border-radius: 50%;
  box-shadow: 0px 0px 10px 3px rgba(46, 58, 89, 0.1);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0px 0px 20px 6px rgba(46, 58, 89, 0.1);
  }
}

.occlusion-wrap {
  position: relative;
  height: 80vh;
  min-height: 300px;
  max-height: 500px;

  .occlusion {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #fff;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: 50%;
    background-size: cover;
    background-image: url('https://p6-tt-ipv6.byteimg.com/img/pgc-image/cca4898a577c49efb8cd22805444a629~tplv-obj.image'); // p.pstatp.com/origin/fede00031b9922f5244a);
    z-index: 0;
    transition: all 2.5s;

    .title {
      color: #fff;
      font-weight: 800;
      font-size: 48px;
      line-height: 110%;
      margin: 90px 0 28px;
      text-shadow: 0 10.3151px 41.2606px rgba(0, 0, 0, 0.05);
    }

    .content {
      display: block;
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      padding-bottom: 90px
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-image: linear-gradient(-180deg, rgba(45, 58, 111, 0.5), rgba(0, 0, 0, 0.5));
    }
  }
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
}

@media (max-width: 776px) {
  .occlusion-wrap {
    .occlusion {
      .title {
        font-size: 28px;
      }
    }
  }
}


</style>
