<template>
    <div class="index">
        <Carousel class="crousel" :list="list">

        </Carousel>
        <Introduce v-for="item of info" :key="item.key" :reverse="item.reverse" :url="item.url" :title="item.title" :content="item.content" :info="item.info" :class="item.key">
            <template #info="{info}" v-if="item.key=='study'" >
                <div class="study-item">
                    <div>
                         <span  class="image">
                            <img :src="info.url"/>
                        </span>
                        <p class="title">
                            {{info.title}}
                        </p>
                    </div>
                    <DoubleRightOutlined class="icon-right"/>
                </div>
            </template>
        </Introduce>
    </div>
</template>
<script>
import Carousel from './carousel.vue';
import { useStore } from "vuex";
import { computed } from 'vue';
import {DoubleRightOutlined} from '@ant-design/icons-vue'
import Introduce from './introduce.vue'
import IntroduceSvg1 from '@/assets/svg/home_introduce_1.svg'
import IntroduceSvg2 from '@/assets/svg/home_introduce_2.svg'
import IntroduceSvg3 from '@/assets/svg/home_introduce_3.svg'
console.log(IntroduceSvg1)
export default {
    name:'Index',
    components:{
        Carousel,
        Introduce,
        DoubleRightOutlined
    },
    setup(){
        const store = useStore();
        store.dispatch('getCarousels')
        const list=computed(()=>store.state.index.list)
        const info=[
            {
                url:IntroduceSvg1,
                title:'关于博客',
                content:'<p>独立开发全栈博客平台，支持文章发布、标签分类、评论互动、数据统计等功能</p>',
                key:'about'
            },
            {
                url:IntroduceSvg2,
                title:'学习目标',
                content:'<p>只有不断的学习才能进步，而循序渐进才是我的学习思想。</p><p>有了明确的学习目标才能我有动力前进，在本项目重构之前，也荒废了一段时间，沉浸在自己的完成博客的喜悦中，殊不知这才是一个开始！</p>',
                key:'study',
                reverse:true
            },
        ]
        return {
            list,
            info
        }
    }
}
</script>
<style lang="stylus" scoped>
.index
    .crousel
        height 100vh;
    .about,.about-me
        background-color #fff
    .study
        background: #f6f8f9;
        .study-item
            color: #336a99;
            display: flex;
            align-items: center;
            // flex-wrap wrap
            margin-right: 10px;
           
            .image
                img
                    width: 30px;
                    height: 30px;
                    margin-bottom: 8px;
            .title
                font-size: 14px;
            .icon-right
                margin 5px

@media (max-width:767px) 
    .index
        .crousel
            height: 450px;
            border-radius 10px
        .study
            .study-item
                height: 100px;
                width: 120px;
                justify-content center
@media (max-width:576px) 
    .index
        .crousel
            height: 300px;
            border-radius 10px
            
            

</style>