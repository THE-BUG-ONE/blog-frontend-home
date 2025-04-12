<template>
  <div class="blog-wrap">
    <div class="blog container">
      <div
        class="left"
        v-infinite-scroll="getBlogTo"
        :infinite-scroll-distance="20"
        :infinite-scroll-disabled="loading"
        infinite-scroll-window="false"
      >
        <div class="article concise" v-for="item of activeList" :key="item.id">
          <router-link :to="'/article/' + item.id" class="title">
            <div class="header">
              <span class="title" v-html="item.activeTitle"></span>
              <span class="date">
                {{ item.createTime }}<FieldTimeOutlined/>
              </span>
            </div>
            <div class="body">
              <Image
                class="image concise"
                v-if="item.articleCover"
                fit="cover"
                :src="item.articleCover"
                :lazy="true"
              >
                <template #placeholder>
                  <svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;" width="200" height="200" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(30 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(60 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(90 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(120 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(150 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(180 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(210 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(240 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(270 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(300 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(330 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></rect></svg>
                </template>
                <template #error>
                  <img
                    style="width: 60%; margin: 0 20%"
                    :src="logoSvg"
                  />
                </template>
              </Image>
              <div class="content" v-html="item.articleDesc"></div>
            </div>
            <div class="footer">
              <div class="info-arti">
                <a v-for="tag in item.tagNameList"><TagsOutlined />
                  {{ tag.tagName }}
                </a>
                <router-link
                  :to="'/blog?label=' + vlave"
                  v-for="(vlave, index) of item.label"
                  :key="index"
                  ><TagOutlined />{{ vlave }}</router-link
                >
              </div>
              <!-- <div class="info-data">
                <router-link :to="'/blog/' + item.id"
                  ><SketchOutlined />{{ item.clicks }}</router-link
                >
                <router-link :to="'/blog/' + item.id + '#comment'"
                  ><LikeOutlined /> {{ item.click }}</router-link
                >
                <router-link :to="'/blog/' + item.id"
                  ><MessageOutlined />{{ item.message_count }}</router-link
                >
              </div> -->
            </div>
          </router-link>
        </div>
        <template v-if="loading">
          <Skeleton
            v-for="item of 6"
            :key="'Skeleton' + item"
            class="concise"
            active
          ></Skeleton>
        </template>
        <p class="last" v-if="current_page == last_page">
          —— 我可是有底线的！( •̥́ ˍ •̀ू ) ——
        </p>
      </div>
      <div class="right">
        <div class="info concise">
          <img
          :src="
              userInfo
                ? userInfo.avatar
                : 'https://media.fgo.wiki/thumb/f/f9/%E7%8E%89%E8%97%BB%E5%89%8D%E6%84%9A%E4%BA%BA%E8%8A%82%E7%AB%8B%E7%BB%98.png/424px-%E7%8E%89%E8%97%BB%E5%89%8D%E6%84%9A%E4%BA%BA%E8%8A%82%E7%AB%8B%E7%BB%98.png'
            "
            class="avatar">
          <p class="name">{{ userInfo ? userInfo.nickname : '青松' }}</p>
          <div class="about">
            <span class="btn quant"> 文章{{ userInfo ? userInfo.articleCount : count }}</span>
            <!-- <DropDown>
              <span class="btn me"> 关注我 </span>
              <template #menu>
                <a
                  href="http://wpa.qq.com/msgrd?v=3&uin=2401694354&site=qq&menu=yes"
                  target="_blank"
                  class="btn qq"
                >
                  <QqOutlined />
                </a>
                <a
                  href="https://github.com/baymaxsjj"
                  target="_blank"
                  class="btn github"
                >
                  <GithubOutlined />
                </a>
                <a
                  href="https://gitee.com/baymaxsjj"
                  target="_blank"
                  class="btn gitee"
                >
                  <svg
                    t="1607663929573"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="4199"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z"
                      fill="#888888"
                      p-id="4200"
                      data-spm-anchor-id="a313x.7781069.0.i0"
                    ></path>
                  </svg>
                </a>
                <a href="/" target="_blank" class="btn weibo">
                  <WeiboOutlined />
                </a>
              </template>
            </DropDown> -->
          </div>
        </div>
        <div class="class concise">
          <div class="serach-wrap">
            <input type="text" class="serach" placeholder="输入关键字..." ref="keyword" @keyup.enter="searchArticle"/>
            <span class="serach-btn" title="搜索一下吧！" @click="searchArticle">
              <SearchOutlined />
            </span>
          </div>
          <el-button class="class-item" @click="activeList = list"> 全部文章 </el-button>
          <el-button
            class="class-item"
            :class="{ 'class-item-active': $route.query.class == item.classty }"
            v-for="item of classList"
            :key="item.id"
            @click="activeList = list.filter(article => article.categoryName === item.categoryName)">
            {{ item.categoryName + "  (" + item.articleCount + ")"}}
          </el-button>
          <Skeleton v-if="classLoading" active></Skeleton>
        </div>
        <div class="label concise">
          <el-tag v-for="item in labelList" :key="item.id" class="tag" round>
            {{ item.tagName + " | " + item.articleCount }}
          </el-tag>
          <Skeleton v-if="labelLoading" active></Skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DropDown from "@/components/navbar/drop-down";
import {
  SearchOutlined,
  FieldTimeOutlined,
  TagOutlined,
  TagsOutlined,
  SketchOutlined,
  MessageOutlined,
  LikeOutlined,
  QqOutlined,
  GithubOutlined,
  WeiboOutlined,
} from "@ant-design/icons-vue";
import Image from "@/components/image/image";
import {
  getArticleList,
  getClasList,
  getLabelList,
  getBlogInfo,
} from "./article.js";
import { computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import Skeleton from "@/components/skeleton/skeleton";
import utils from "@/components/utils";
import logoSvg from '../../assets/logo.svg'
import { useStore } from "vuex";
export default {
  name: "Blog",
  components: {
    DropDown,
    SearchOutlined,
    FieldTimeOutlined,
    TagsOutlined,
    TagOutlined,
    SketchOutlined,
    MessageOutlined,
    LikeOutlined,
    QqOutlined,
    GithubOutlined,
    WeiboOutlined,
    Image,
    Skeleton,
  },
  setup() {
    const {
      getBlog,
      list,
      activeList,
      count,
      loading,
      current_page,
      last_page,
    } = getArticleList();
    const { classList, classLoading } = getClasList();
    const { labelList, labelLoading } = getLabelList();
    const route = useRoute();
    const name = route.name;
    getBlog();
    const getBlogTo = () => {
      if (name == route.name) {
        getBlog();
      }
    };
    watch(
      () => route.query,
      () => {
        console.log(route.path);
        const name = route.name;
        if (name == "Blog") {
          console.log("更新博客列表");
          current_page.value = 0;
          last_page.value = 1;
          getBlog();
          utils.scrollTo(0, {});
        }
      }
    );
    const store = useStore();
    const userInfo = computed(() => store.state.user.user);
    console.log(userInfo.value)
    return {
      logoSvg,
      list,
      activeList,
      getBlogTo,
      userInfo,
      loading,
      classLoading,
      labelLoading,
      labelList,
      classList,
      count,
      current_page,
      last_page,
    };
  },
  methods: {
    searchArticle() {
      const keyword = this.$refs.keyword.value
      if (keyword.length > 0) {
        const keywordPattern = '(' + keyword + ')+'
        const keywordReg = new RegExp(keywordPattern, 'gi')
        console.log(keywordPattern,keywordReg)
        const hightlight = `<span style="color: red">${keyword}</span>`;
        this.activeList = this.list.filter(article => keywordReg.test(article.articleTitle));
        console.log(this.activeList)
        this.activeList.forEach(article => {
          article.activeTitle = article.articleTitle.replace(keywordReg, hightlight)
        });
        console.log(this.activeList)
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.blog-wrap {
  background-color: #f6f8f9;
}

.blog {
  display: flex;
  flex-flow: row nowrap;
  padding: 0 10px;
  padding-top: 72px;
  box-sizing: border-box;

  .right {
    width: 300px;
    min-width: 24px;
    flex-shrink: 0;
    margin-left: 20px;

    .class, .info, .label {
      margin-top: 10px;
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all 0.4s;
     
      .avatar {
        padding: 0 10px;
        width: 150px;
        height: 150px;
        margin: 0;
        padding: 0;
        color: #3da8f5;
        text-align: center;
        cursor: pointer;
        background: #fff;
        line-height: 44px;
        border: 2px solid #dcf4ff
        box-sizing: border-box;
        border-radius: 50%;
        color: #c4c4c4;
        transition all .3s;
        object-fit: cover;
      }
       &:hover{
        .avatar{
          transform rotate(360deg)!important
        }
      }
      .name {
        margin-top: 10px;
        font-size: 16px;
        color: #2e3a59;
        font-weight: 700;
        font-family: GlowSansSC-ExtendedHeavy;
      }

      .about {
        margin-top: 10px;

        .btn {
          padding: 5px 10px;
          border-radius: 10px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          margin: 0 5px;
        }

        .quant {
          background: linear-gradient(180deg, #fff0ce, #fffcf6);
        }

        .me {
          background: linear-gradient(180deg, #dcf4ff, #f4fcff);
          cursor: pointer;
        }

      :deep(.drop-down ){
          display: inline-block;

          .drop-down-menu {
            min-width: 90px;
          }

          .btn {
            padding: 5px 10px;
            border-radius: 10px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
            margin: 5px;
            display: inline-block;
            background: linear-gradient(180deg, #dcf4ff, #f4fcff);

            &:hover {
              background: linear-gradient(180deg, #fff0ce, #fffcf6);
            }
          }

          .gitee {
            svg {
              display: inline-block;
              color: inherit;
              font-style: normal;
              text-align: center;
              text-transform: none;
              vertical-align: -0.125em;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          }
        }
      }
    }

    .class {
      .serach-wrap {
        display: flex;
        align-items: center;
        padding: 8px 0 8px 10px;
        box-sizing: border-box;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 15px;

        .serach {
          flex: 1 1 auto;
          outline: none;
          border: 0;
          height: 20px;
          color: rgba(0, 0, 0, 0.45);
        }

        .serach-btn {
          color: #ccc;
          height: 30px;
          width: 30px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s;
          cursor: pointer;

          &:hover {
            background: linear-gradient(180deg, #dcf4ff, #f4fcff);
          }
        }
      }

      .class-item {
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        display: block;
        padding: 6px 5px;
        border-bottom: 1px solid #fafafa;
        margin-top: 5px;
        font-size: 14px;
        border-radius: 10px;
        transition: all 0.3s;

        &:hover {
          background: linear-gradient(180deg, #fff0ce, #fffcf6);
        }
      }

      .class-item-active {
        background: linear-gradient(180deg, #dcf4ff, #f4fcff);
        margin-left: 0;
      }
    }

    .label {
      .el-tag {
        color: #00BFFF;
        margin: 0.3em;
      }

      .label-item {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 10px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin: 5px;
        background: linear-gradient(180deg, #dcf4ff, #f4fcff);

        &:hover {
          box-shadow: 0 0px 10px 5px rgba(46, 58, 89, 0.1);
        }
      }

      .label-item-active {
        background: linear-gradient(180deg, #fff0ce, #fffcf6);
      }
    }
  }

  .left {
    flex: 1 1 auto;

    .article {
      box-sizing: border-box;
      margin-bottom: 10px;

      .header {
        padding-bottom: 15px;
        position: relative;
        border-bottom: 1px solid #fafafa;

        .title {
          color: #336a99;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.5em;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        .date {
          position: absolute;
          bottom: 0;
          right: 0;
          transform: translateY(50%);
          font-size: 14px;
          color: #bebebe;

          .anticon {
            margin-left: 10px;
          }
        }
      }

      .body {
        padding: 15px 0;
        overflow: hidden;
        border-bottom: 1px solid #fafafa;

        .image {
          width: 300px;
          // height 150px
          overflow: hidden;
          float: left;
          margin: 0 10px 10px 0;
          padding: 0;
        }

        .content {
          font-size: 14px;
          line-height: 24px;
          color: #bebebe;
          cursor: pointer;
          text-align: justify;
        }
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        padding-top: 15px;

        .info-arti, .info-data {
          a {
            margin: 0 5px;
            cursor: pointer;
            font-size: 14px;
            color: #bababa;

            span {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .last {
      text-align: center;
      color: #bababa;
      font-size: 14px;
      margin: 10px 0;
    }
  }
}

@media (max-width: 776px) {
  .blog {
    flex-direction: column;

    .left {
      margin: 0;
      width: 100%;
    }

    .right {
      .article {
        .body {
          flex-direction: column;

          .image {
            width: 100%;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>