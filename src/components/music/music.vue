<template>
  <div>
    <!-- <span @click="skipBack">上一首</span>
    <span @click="toggle">播放暂停</span>
    <span @click="skipForward">下一首</span>
    <span @click="setPlayBackMode">播放模式{{ playbackMode }}</span>
    <span @click="setCycleMode">循环设置{{ cycleMode }}</span>
    <BySlider
      v-model:value="currentTime"
      :min="0"
      :max="totalTime"
      @after-change="mouseup"
    /> -->
    <template v-for="(item, key) of mode" :key="'by-music-mode'+key">
        <teleport :to="item.target" :display="item.target" v-if="item.show&&list.length>0">
          <component
            class="fade"
            v-model:volume="volume"
            :is="item.template"
            :playbackMode="playbackMode"
            :cycleMode="cycleMode"
            :list="list"
            :status="status"
            :current="current"
            :totalTime="totalTime"
            :currentTime="currentTime"
            :loading="loading"
            @after-change="mouseup"
            @click-cycle="setCycleMode"
            @click-playback="setPlayBackMode"
            @click-jump="jump"
            @click-toggle="toggle"
            @click-play="play"
            @click-pause="pause"
            @click-seek="seek"
            :mode="key"
            :config="item"
          />
        </teleport>
    </template>
  </div>
</template>
<script>
import BySlider from "../slider/slider.vue";
import FlexMusic from "./flex-music.vue";
import DetailsMusic from "./details-music.vue";
import utils from "./utils";
import { markRaw } from "vue";
const temp={//列表项模板
        name:'',
        url:'',
        cover:'',
        artist:'',
        lrc:''
      }
export default {
  name: "Music",
  components: {
    BySlider,
    FlexMusic,
    DetailsMusic
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          list: null,
          autoPlay: true, //自动播放
          playbackMode: 0, //播放模式：0 播放完暂停。1 单曲循环 2循环播放
          cycleMode: 0, // 循环模式： 0 顺序播放。1随机播放
          volume: 50, //播放音量
        };
      },
    },
  },
  data() {
    return {
      audio: null,
      list: [], //列表
      autoPlay: true, //自动播放
      status: false,//播放状态
      current: -1, //当前播放位置
      playbackMode: 0, //播放模式：0 播放完暂停。1 单曲循环 2循环播放
      cycleMode: 0, // 循环模式： 0 顺序播放。1随机播放
      randomlist: [],
      totalTime: 0, //播放总时长
      currentTime: 0, //当前播放时间
      volume: 50, //播放音量
      loading: false,
      error: -1,
      temp,
      mode: {
        //显示模式
        fixed: {
          show: false,
          target: "body",
          listShow: true,
          bodyShow:true,
          listMaxHeight: 100,
          template: "FlexMusic",
          lrcType: true,
        },
        list: {
          show: false,
          target: "body",
          listFolded: true,
          listMaxHeight: 100,
          template: markRaw(FlexMusic),
          lrcType: true,
        },
        mini: {
          show: false,
          target: "body",
          template: "FlexMusic",
          lrcType: false,
        },
        details: {
          show: false,
          target: "body",
          template: "DetailsMusic",
          lrcType: false,
        },
      },
    };
  },
  watch: {
    volume(newVal) {
      this.setVolume(newVal);
    },
  },
  methods: {
    mouseup(val) {
      console.log("快进到", val);
      this.seek(val);
    },
    //播放
    play() {
      if (this.list[this.current].url) {
        this.audio.play();
        this.status = true;
      }
    },
    //暂停
    pause() {
      this.audio.pause();
      this.status = false;
    },
    //跳转
    seek(time) {
      if (!this.audio.paused || this.audio.currentTime != 0) {
        this.audio.currentTime = time;
      }
    },
    //暂停播放切换
    toggle() {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
    },
    showMode(name, show) {
      this.mode[name].show = show;
    },
    addMode(name,config){ 
      if(config)
      this.mode[name]=config
    },
    //设置音量(0,1)
    setVolume(volume) {
      this.volume = volume;
      this.audio.volume = volume / 100;
    },
    //上一首
    skipBack() {
      this.jump(this.current - 1);
    },
    //下一首
    skipForward() {
      this.jump(this.current + 1);
    },
    //切换
    jump(index) {
      index = utils.limit(index, 0, this.list.length - 1);
      this.current = index;
      console.log(this.current)
      this.loading = true;
      if (this.list[this.current].url) {
        this.audio.src = this.list[index].url;
      }else {
        this.audio.pause();
      }
      
    },
    //播放模式
    setPlayBackMode() {
      this.playbackMode = utils.limit(this.playbackMode + 1, 0, 2);
    },
    //循环模式
    setCycleMode() {
      this.cycleMode = utils.limit(this.cycleMode + 1, 0, 1);
      if (this.cycleMode == 1) {
        this.randomlist = utils.randomOrder(this.list.length);
      }
    },
    searchMusic(name,content=''){
      if(typeof name=='string'){
        for(let index in this.list){
          if(this.list[index][name]==content){
            return Object.assign({},{'index':parseInt(index)},this.list[index])
          }
        }
      }else{
        name=utils.limit(name, 0, this.list.length - 1);
        if(this.list[name]){
          return  Object.assign({},{'index':name},this.list[name])
        }else{
          return false
        }
      }
    },
    //添加
    addMusic(list) {
      for (let item in list) {
        this.list.push(Object.assign({},this.temp,list[item]) );
      }
      this.init()
      return this.list.length-1
    },
    updateMusic(index, item) {
      index=utils.limit(index, 0, this.list.length - 1);
      this.list[index] = Object.assign({},this.list[index], item);
    },
    //删除
    removeMusic(index) {
      index=utils.limit(index, 0, this.list.length - 1);
      if(index==this.current){
        console.warn('当前音乐正在播放！不允许删除')
        return false
      }
      if(index<this.current){
        this.current-=1
      }
      this.list.splice(index, 1);
      return true
    },
    init(){
        if(this.list.length!=0){
          if(this.current==-1){
            this.current=0
            this.jump(this.current);
          }
        }
    },
    // 是否能播放
    mCanplay() {
      this.totalTime = this.audio.duration;
      this.loading = false;
      if (this.status || this.autoPlay) {
        this.play();
        this.autoPlay = false;
      }
    },
    mTimeUpdate() {
      const time=parseInt(this.audio.currentTime)
      if(this.currentTime!=time){
        this.currentTime =time
      }
      
    },
    //结束
    mEnded() {
      this.currentTime=0
      if (this.playbackMode == 0) {
        this.pause();
      } else if (this.playbackMode == 1) {
        this.play();
      } else {
        if (this.cycleMode == 0) {
          this.skipForward();
        } else {
          const leng=this.randomlist.length
          let i
          for(i=0;i<leng;i++){
            if(this.randomlist[i]==this.current){
              break
            }
          }
          this.jump(this.randomlist[i+1]);
        }
      }
    },
    mError() {
      this.pause();
      this.error = this.current;
      console.warn("音乐播放失败");
    },
  },
  created() {
    const that = this;
    this.audio = document.createElement("audio");
    this.init()
    this.audio.addEventListener("canplay", that.mCanplay, false),
      this.audio.addEventListener("timeupdate", that.mTimeUpdate, false);
    this.audio.addEventListener("ended", that.mEnded, false);
    this.audio.addEventListener("error", that.mError, false);
    this.audio.addEventListener('pause',function(){
      console.log('暂停')
      if(that.list[that.current].url&&that.list[that.current].url.length>0&&that.playbackMode==0){
        that.pause()
      }
    })
  },
  unmounted(){
    const that=this
    this.audio.removeEventListener('canplay',that.mCanplay)
    this.audio.removeEventListener('timeupdate',that.mTimeUpdate)
    this.audio.removeEventListener('ended',that.mEnded)
    this.audio.removeEventListener('error',that.mError)
    this.audio=null
  }
};
</script>
<style lang="stylus" scoped>
.fade{
  animation fade 1.5s
}
@keyframes fade {
    0%{
        opacity 0
        transform translateY(5px)
    }
    100%{
        opacity 1
        transform translateY(0px)
    }
}
</style>