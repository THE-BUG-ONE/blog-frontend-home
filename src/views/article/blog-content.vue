<template>
  <div class="content-wrap" :style="myLoading?'padding-top:72px':''" >
    <div class="skeleton" v-if="myLoading">
        <Skeleton class="concise container" v-for="item of 2" :key="'myloading'+item" active/>
    </div>
    <div  v-else   class="content" >
      <div class="header">
        <div class="cover" :style="article.articleCover?`background-image: url(${article.articleCover})`:''"></div>
        <div class="info">
          <h4 class="title">{{ article.articleTitle }}</h4>
          <p class="desc">
            <span><IdcardOutlined />{{ article.author }}</span>
            <span><FireOutlined />{{ article.viewCount }}</span>
            <span><FieldTimeOutlined />{{ article.createTime }}</span>
          </p>
          <div class="tag">
            <TagsOutlined />
            <el-tag v-for="item in article.tagOptionList" :key="item.id" effect="dark" round>
              {{ item.tagName }}
            </el-tag>
          </div>
        </div>
        <div class="waves-area">
          <svg
            class="waves-svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z"
              ></path>
            </defs>
            <g class="parallax">
              <use xlink:href="#gentle-wave" x="48" y="0"></use>
              <use xlink:href="#gentle-wave" x="48" y="3"></use>
              <use xlink:href="#gentle-wave" x="48" y="5"></use>
              <use xlink:href="#gentle-wave" x="48" y="7"></use>
            </g>
          </svg>
        </div>
      </div>
      <div class="body container concise">
        <Preview
          :content="article.articleContent"
          :tocNav="true"
          :dompurify="false"
          @click-img="clickImg" 
          :imgView="true"
          :scroolOffset="72"
          :markedOptions="options"
        />
      </div>
      <div class="footer"></div>
    </div>
    <div class="container desc">
        <div class="skeleton"  v-if="myLoading">
    <Skeleton  class="concise skeleton container" active/>

      </div>
      <div v-else class="copyright concise">
        <div class="blog-info">
          <p>
            本文标题:
            <a href="">{{ article.articleTitle }}</a>
          </p>
          <p>
            本文链接:
            <a href="">{{url}}</a>
          </p>
          <p>
            作者:
            <a>{{ article.author }}</a
            >----
            <a
              rel="license"
              href="http://creativecommons.org/licenses/by-nc/4.0/"
              title="知识共享署名-非商业性使用 4.0 国际许可协议"
              >知识共享署名-非商业性使用 4.0 国际许可协议</a
              
            >
          </p>
        </div>

        <div class="article-prev-next" v-if="article.prevArticle">
          <router-link :to="article.prevArticle.id + ''" class="prev">
            <DoubleLeftOutlined />
            <span>{{ article.prevArticle.articleTitle }}</span>
          </router-link>
          <router-link :to="article.nextAticle.id + ''" class="next">
            <span>{{ article.nextAticle.articleTitle }}</span>
            <DoubleRightOutlined />
          </router-link>
        </div>
      </div>
        <ImageView v-model:show="imgShow" :urlList="imgList"  :url="imgSrc"/>
        <div class="skeleton"  v-if="myLoading">
          <Skeleton class="concise container" active/>
        </div>
        <!-- <template  v-else  > 
            <Comment v-if="article.message_show" class="concise" @submit="submit" />
        </template> -->
      <!-- <div v-if="article.message_show" class="message" v-infinite-scroll="getMess" :infinite-scroll-distance="20" :infinite-scroll-disabled="loading" infinite-scroll-window="false">
        <MessageCard
          @reply="reply"
          @delete="deleteMess"
          :item="item"
          v-for="(item, index) of list"
          :key="item.id"
          class="concise"
          :class="'message-list-item-bg-' + ((index + 1) % 4)"
        />
         <div class="skeleton" v-if="loading">
          <Skeleton v-for="item of 3" :key="'Skeleton'+item" :class="'message-list-item-bg-'+(item+1)%4"  class="concise" avatar active></Skeleton>
        </div>
        <p class="last" v-if="current_page==last_page">—— 我可是有底线的！( •̥́ ˍ •̀ू ) ——</p>
      </div> -->
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import http from "@/utils/httpindex.js";
import Skeleton from "@/components/skeleton/skeleton";

import {
  TagsOutlined,
  FireOutlined,
  FieldTimeOutlined,
  IdcardOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons-vue";
import Preview from "@/components/editor/preview";
import ImageView from "@/components/image/image-view";
// import Comment from "../message/comment";
// import MessageCard from "../message/message-card";
// import { getMessList } from "../message/message.js";

export default {
  name: "BlogContent",
  components: {
    TagsOutlined,
    FireOutlined,
    FieldTimeOutlined,
    IdcardOutlined,
    DoubleRightOutlined,
    DoubleLeftOutlined,
    Preview,
    ImageView,
    // Comment,
    // MessageCard,
  Skeleton

  },
  setup() {
    const route = useRoute();
    // const article=reactive({})
    const article = ref({});
    const myLoading=ref(true)
    const name=route.name
    const imgShow=ref(false)
    const imgSrc=ref('')
    const imgList=ref([])
    const url=computed(()=>{
      console.log(import.meta.env)
      const url=import.meta.env.VITE_APP_HOME_URL+'/article/'+route.params.id
      return url
    })
    const options = {
      headerIds: false,
      breaks: true,
    };
    const logo="https://p.pstatp.com/origin/137d10002a95149f1fef7"
    const desc="记录美好学习时光，分享学习点点滴滴"
    const getArticle = () => {
      const id = route.params.id;
      myLoading.value=true
      http
        .get("/api/article/" + id)
        .then((res) => {
            myLoading.value=false
            article.value = res.data
            document.title=res.data.articleTitle+'-青松拾光'
            document.querySelector('meta[name="keywords"]').setAttribute('content', res.data.tagOptionList.toString()) 
            document.querySelector('meta[name="description"]').setAttribute('content', res.data.articleDesc)
            }
        );
    };
    getArticle();
    // const {
    //   list,
    //   getMess,
    //   loading,
    //   current_page,
    //   last_page,
    //   messageAdd,
    //   replyAdd,
    //   deleteMess,
    // } = getMessList(route.params.id);
    // getMess();
    // const submit = (content) => {
    //   const data = {
    //     message: content,
    //     article_id: route.params.id,
    //   };
    //   messageAdd(data);
    // };
    // const reply = (content) => {
    //   replyAdd(content);
    // };
    const clickImg=(src,list)=>{
        imgSrc.value=src
        imgList.value=list
        imgShow.value=true

    }
    watch(
      () => route.params.id,
      (id) => {
        const newName=route.name
        if(newName==name){
            console.log(id);
            getArticle();
            // getMess(id);
        }
      }
    );
      
    return {
      article,
      options,
      // submit,
      // reply,
      // list,
      // getMess,
      // loading,
      myLoading,
      // current_page,
      // last_page,
      // deleteMess,
      clickImg,
      imgShow,
        imgSrc,
        imgList,
        url
    };
  },
};
</script>
<style lang="stylus" scoped>
.content-wrap {
  background-color: #f6f8f9;
  .content{
      padding-top 0
  }
  .header {
    position: relative;
    overflow: hidden;
    height: 80vh;
    min-height: 300px;
    max-height: 300px;
    border-radius: 20px;
    padding 0 10px
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: 50%;
      background-size: cover;
      background-image: url('https://p6-tt-ipv6.byteimg.com/img/pgc-image/cca4898a577c49efb8cd22805444a629~tplv-obj.image'); // p.pstatp.com/origin/fede00031b9922f5244a);
      z-index: 0;
      transition all .3s

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(-180deg, rgba(45, 58, 111, 0.5), rgba(0, 0, 0, 0.5));
      }
    }
    

    .info {
      position: relative;
      width: 100%;
      height: 100%;
      color: #fff;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      text-align: center;

      .title {
        color: #fff;
        font-size: 24px;
        font-weight: 500;
        line-height: 1.5em;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        margin: 10px 0;
      }

      .desc {
        font-size: 14px;
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        span {
          margin: 0 10px;
        }
      }
    }

    .tag {
      margin-top: 1em;
    }

    .el-tag {
      margin-left:1em;
      background-color: transparent;
    }
  }
  .copyright {
    .blog-info {
      border-left: 2px solid #bababa;
      padding-left: 10px;

      p {
        color: #bababa;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        a {
          color: #bababa;
          font-size: 14px;
        }
      }
    }

    .article-prev-next {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .prev, .next {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        padding: 0 16px;
        position: relative;
        flex: 1;
        color #3a8ee6
        
        .anticon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .prev {
        .anticon {
          left: 0;
        }
      }

      .next {
        text-align: right;

        .anticon {
          right: 0;
        }
      }
    }
  }

  .concise {
    padding: 40px 32px;
    border-radius: 20px;
    margin-top: 10px;
    box-sizing: border-box;
    background-color: #fff;
    transition: box-shadow .3s;
  }

  .message {
      .last{
        text-align: center;
        color: #bababa;
        font-size: 14px;
        margin: 10px 0;
    }
  :deep(.message-list-item-bg-0 ){
      background: linear-gradient(180deg, #d2e5f9, #f8fbfe);
    }

   :deep(.message-list-item-bg-1 ){
      background: linear-gradient(180deg, #dcf4ff, #f4fcff);
    }

   :deep(.message-list-item-bg-2 ){
      background: linear-gradient(180deg, #fff0ce, #fffcf6);
    }

  :deep(.message-list-item-bg-3 ){
      background: linear-gradient(180deg, #ffe4cf, #fff7f1);
    }
  }
}
@media (max-width:776px) {
  .content-wrap{
    .desc{
        padding: 0 10px;
        box-sizing: border-box;
    }
    .skeleton{
      padding 0 10px
      box-sizing border-box
    }
  }
  
}
@media (max-width: 576px) {
    .content-wrap .concise {
        padding: 20px 10px
    }
}
</style>