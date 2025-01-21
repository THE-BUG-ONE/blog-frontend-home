<template>
    <footer class="footer" >
        <div class="container">
            <div class="foot-row service">
                <p class="title">记录美好学习时光，分享学习点点滴滴</p>
                    <ul class="link">
                        <li><router-link to="/message">留言</router-link></li>
                        <li><router-link to="/link">友链</router-link></li>
                        <li><router-link to="/article">博客</router-link></li>
                        <li><router-link to="/">主页</router-link></li>
                    </ul>
            </div>
            <!-- <div class="foot-row provide">
                <span><a class="a-flex" target="_blank" href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral"><span>本网站由</span><img class="ypy" src="~@/assets/logo8.png"><span>提供CDN加速/云存储服务</span></a></span>
                <div class="search-wrap">
                    <form
                        method="get"
                        action="//google.com.hk/search"
                        target="_blank"
                        autocomplete="off"
                    >
                        <input type="hidden" name="oe" value="UTF-8" />
                        <input type="hidden" name="hl" value="zh-CN" />
                        <input type="hidden" name="domains" value="www.yunmobai.cn" />
                        <input type="hidden" name="ie" value="UTF-8" />
                        <input type="hidden" name="sitesearch" value="www.yunmobai.cn" />
                        <input
                            class="search-ipt"
                            type="text"
                            placeholder="find something…"
                            name="q"
                            spellcheck="false"
                            maxlength="40"
                        />
                        <button type="submit" class="icon">
                        <i class="icon-search  el-icon-search"></i>
                        </button>
                    </form>
                </div>
            </div> -->
            <!-- <div class="foot-row publicity">
                <span><a target="_blank" href="http://beian.miit.gov.cn/">皖ICP备2020014908号-1</a></span>
                <span><a class="a-flex" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=34030002020734" >皖公网安备 34030002020734号</a></span>
            </div>
            <hr/>
            <div class="foot-row bottom">
                <p class="copyright">© 2020 - {{year}} <a href="http://www.yunmobai.cn/">青松拾光</a> All Rights Reserved.<a target="_blank" href="/apis/sitemap">网站地图</a></p>
                <div class="share">
                     <a href="http://wpa.qq.com/msgrd?v=3&uin=2401694354&site=qq&menu=yes" target="_blank" class="btn qq">
                            <QqOutlined/>
                        </a>
                        <a href="https://github.com/baymaxsjj" target="_blank" class="btn github">
                            <GithubOutlined />
                        </a>
                        <a href="https://gitee.com/baymaxsjj" target="_blank" class="btn gitee">
                            <svg t="1607663929573" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4199" width="16" height="16"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z m259.2-569.6H480c-12.8 0-25.6 12.8-25.6 25.6v64c0 12.8 12.8 25.6 25.6 25.6h176c12.8 0 25.6 12.8 25.6 25.6v12.8c0 41.6-35.2 76.8-76.8 76.8h-240c-12.8 0-25.6-12.8-25.6-25.6V416c0-41.6 35.2-76.8 76.8-76.8h355.2c12.8 0 25.6-12.8 25.6-25.6v-64c0-12.8-12.8-25.6-25.6-25.6H416c-105.6 0-188.8 86.4-188.8 188.8V768c0 12.8 12.8 25.6 25.6 25.6h374.4c92.8 0 169.6-76.8 169.6-169.6v-144c0-12.8-12.8-25.6-25.6-25.6z" fill="#888888" p-id="4200" data-spm-anchor-id="a313x.7781069.0.i0"></path></svg>
                        </a>
                </div>
            </div> -->
        </div>
    </footer>
    
</template>
<script>
import {
  QqOutlined,
  GithubOutlined,
} from "@ant-design/icons-vue";
export default {
    name:'IndexFooter',
      components: {
    QqOutlined,
    GithubOutlined,
  },
    props:{
      route:String
    },
    data(){
        return{
            year:2020,
        }
    },
   created(){
       let date=new Date();
       this.year=date.getFullYear()
   }
}
</script>
<style lang="stylus" scoped>
    .footer
        padding: 10px 30px;
        font-size 12px
        color #a7a7a7
        // background:rgba(248, 249, 250, 0.9)
        background:#fff
        font-weight:bolder
        letter-spacing: 2px;
        padding:10px
        line-height 26px
        a
            color #a7a7a7
            font-size 12px
            transition all .3s
            &:hover
                text-decoration underline 
                color #3a8ee6
        .container
            padding 0 10px
            box-sizing: border-box;
            .foot-row
                display: flex;
                justify-content space-between
                align-items: center;
                flex-wrap wrap 
            .service
                font-size 16px
                .link
                    li
                        
                        float right
                        margin 0 20px
                        a
                            font-size 14px
            .provide
                .a-flex
                    display: flex;
                    justify-content:stretch;
                    align-items: center;
                    .ypy
                        height 22px
                .search-wrap 
                    width: 300px;
                    height 22px
                    position: relative;
                    padding 2px 0
                    .search-ipt 
                        height 20px
                        position absolute 
                        right 0
                        top 0
                        width: 240px;
                        color: #3a8ee6;
                        background: none;
                        border: none;
                        border-bottom: 2px solid #f5f5f5;
                        font-family: Roboto, serif;
                        font-size: 1rem;
                        line-height: 1.75;
                        transition all .4s
                        &:focus
                            width 100%
                    .icon 
                        outline:none;
                        background-color: transparent;
                        border: none;
                        padding 7px
                        line-height 0
                        position: absolute;
                        right: 0;
                        color: #f5f5f5;
                        cursor: pointer;
           
            hr
                background-color #f0f0f0
            .bottom
                .share
                    display: flex;
                    align-items: center;
                    .btn
                        padding: 5px 10px;
                        border-radius: 10px;
                        color: rgba(0, 0, 0, 0.45);
                        font-size: 14px;
                        margin: 5px;
                        display inline-block
                        background: linear-gradient(180deg, #dcf4ff, #f4fcff);
                        &:hover
                            background: linear-gradient(180deg, #fff0ce, #fffcf6);
                    .gitee
                        display: inline-block;
                        color: inherit;
                        font-style: normal;
                        line-height: 0;
                        text-align: center;
                        text-transform: none;
                        vertical-align: -0.125em;
                        text-rendering: optimizeLegibility;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                        height: 34px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;

                    

            
     @media(max-width: 700px)
        .footer
            padding 10px
            font-size 12px
            letter-spacing: 2px;
            line-height 24px
            .container
                padding 0!important
                .foot-row
                    justify-content center!important
                .service
                    .title
                        font-size 14px
                    .link
                        li
                            margin 0 5px!important
                .provide
                    .search-wrap
                        padding 1px 0!important
                        .search-ipt 
                            right 50%!important
                            transform translateX(50%)
                .publicity
                    span 
                        margin 0 5px
                .bottom
                    .copyright
                        letter-spacing: 1px;
                
</style>