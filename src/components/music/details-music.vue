<template>
  <div class="details-music">
    <div
      class="music-bg-blur"
      :style="{ 'background-image': 'url(' + list[current].cover + ')' }"
    ></div>
    <!-- <div>
     
    </div> -->
    <div class="pic-lrc-content">
      <div
        style="padding: 50px 0; flex: 1; display: flex; justify-content: center"
      >
        <div class="pic-content">
          <img
            src="~@/assets/cke.png"
            class="pic-pointer"
            :class="{ 'pic-pointer-play': status }"
          />
          <div
            class="disc"
            :style="{
              'animation-play-state': status ? 'running' : 'paused',
            }"
          >
            <!-- <div
              class="song-img"
              :style="{
                'background-image': 'url(' + list[current].cover + ')',
              }"
            /> -->
            <ByImage class="song-img" :src="list[current].cover">
              <template  #placeholder>
                <img src="~@/assets/cho.png" style="width: 100%;"/>
              </template>
              <template  #error>
                <img src="~@/assets/cho.png" style="width: 100%;"/>
              </template>
            </ByImage>
          </div>
          <div class="controller">
            <!-- 上一首 -->
            <IconFont
              class="by-music-icon prev"
              type="iconskip"
              @click="$emit('click-jump', current - 1)"
            />
            <!-- 播放暂停 -->
            <IconFont
              class="by-music-icon play"
              :type="status ? 'iconpause' : 'iconplay'"
              @click="$emit('click-toggle')"
            />
            <!-- 下一首 -->
            <IconFont
              class="by-music-icon next"
              type="iconskip-copy"
              @click="$emit('click-jump', current + 1)"
            />
          </div>
        </div>
      </div>

      <div style="padding: 50px 0; flex: 1; min-width: 50%">
        <div class="music-info">
          <span class="title">{{ list[current].name  }}</span>
          <span class="author">{{ list[current].artist }}</span>
        </div>

        <div class="by-music-lrc">
          <div
            class="by-music-lrc-contents"
            :style="{
              transform:
                'translateY(-' +
                (lrcPosition > 5 ? (lrcPosition - 5) * 25 : 0) +
                'px)',
            }"
          >
            <p
              :class="{ 'by-music-lrc-current': lrcPosition == index }"
              v-for="(item, index) of fromatLrc"
              :key="'by-details-lrc-'+index"
            >
              {{ item[1] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="by-music-contrl">
      <!-- <span>{{formatTime(currentTime)}}</span> -->
      <!-- 循环模式 -->
      <div class="by-music-contrl-left">
        <IconFont
          class="by-music-icon cycle-mode"
          :type="cycleMode == 0 ? 'iconorder-list' : 'iconorder-random'"
          @click="$emit('click-cycle')"
        />
        <!-- 播放模式 -->
        <IconFont
          class="by-music-icon playback-mode"
          :type="
            playbackMode == 0
              ? 'iconloop-none'
              : playbackMode == 1
              ? 'iconloop-one'
              : 'iconloop-all'
          "
          @click="$emit('click-playback')"
        />
        <span class="by-music-tiem">{{ formatTime(currentTime) }}</span>
      </div>

      <BySlider
        class="by-music-slider"
        :max="totalTime"
        v-model:value="mCurrentTime"
        @after-change="$emit('after-change', $event)"
      />
      <div class="by-music-contrl-right">
        <span class="by-music-tiem">{{ formatTime(totalTime) }}</span>
        <!-- 音量控制器 -->
        <div class="by-volume-wrap">
          <IconFont class="by-music-icon" :type="volumeStyle" />
          <BySlider
            v-model:value="mVolume"
            class="by-volume-slider"
            :vertical="true"
            @change="$emit('update:volume', $event)"
          />
        </div>
        <div class="by-music-switch">
          <!-- 列表开关 -->
          <IconFont
            type="iconmenu"
            class="by-music-icon iconmenu"
            @mouseenter="scrollCurrent"
            @click="listShow = !listShow"
          />
          <div
            class="by-music-list"
            :class="{ 'by-music-list-hide': listShow }"
            :style="{ 'max-height': '250px' }"
          >
            <ol ref="ByMusicList">
              <li
                v-for="(item, index) of list"
                :key="`by-details-music-${index}`"
                :class="{ 'by-music-list-play': index == current }"
                @click="$emit('click-jump', index)"
              >
                <span class="by-music-list-index">{{ index + 1 }}</span>
                <span class="by-music-list-title">{{ item.name  }}</span>
                <span class="by-music-list-author">{{ item.artist }}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>
<script>
import BySlider from "../slider/slider";
import ByImage from '../image/image'
import utils from "./utils";
import IconFont from "../icon-font/icon-font";
// import { createFromIconfontCN } from '@ant-design/icons-vue';

// const IconFont = createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_2209704_fv5dd37z5hn.js',
// });
export default {
  name: "DetailsMusic",
  props: {
    list: Array,
    status: Boolean,
    current: Number,
    totalTime: Number,
    currentTime: Number,
    volume: Number,
    playbackMode: Number, //播放模式：0 播放完暂停。1 单曲循环 2循环播放
    cycleMode: Number, // 循环模式： 0 顺序播放。1随机播放
    loading: Boolean,
    mode: {
      type: String,
      default: "list",
    },
    config: Object,
  },
  emits: [
    "click-toggle",
    "click-cycle",
    "click-playback",
    "click-jump",
    "after-change",
    "update:volume",
  ],
  components: {
    BySlider,
    IconFont,
    ByImage
  },
  computed: {
    volumeStyle() {
      let style;
      if (this.mVolume == 0) {
        style = "iconvolume-off";
      } else if (this.volume == 100) {
        style = "iconvolume-up";
      } else {
        style = "iconvolume-down";
      }
      return style;
    },
    lrcPosition() {
      const larList=this.fromatLrc
      const leng=larList.length
      let i
      for(i=0;i<leng;i++){
          if(i==leng-1||this.currentTime<larList[0][0]){
              break
          }else if(this.currentTime>=larList[i][0]&&this.currentTime<larList[i+1][0]){
            break
          }
      }
      return i
    },
    fromatLrc() {
      return utils.parse(this.list[this.current].lrc);
    },
  },
  data() {
    return {
      mCurrentTime: this.currentTime,
      mVolume: this.volume,
      listShow: false,
      bodyShow: false,
    };
  },
  watch: {
    currentTime(newVal) {
      this.mCurrentTime = newVal;
    },
    volume(newVal){
      this.mVolume=newVal
    },
  },
  methods: {
    formatTime(time) {
      return utils.transTime(time);
    },
    scrollCurrent(){
      console.log('scrollCurrent')
        const list = this.$refs.ByMusicList;
        const scrollTop = list.scrollTop;
        if (
          this.current * 33 < scrollTop ||
          this.current * 33 - scrollTop >= list.clientHeight
        ) {
          console.log(list)
          utils.scrollTo(this.current * 33, { getContainer: () => list });
          // list.scrollTop=this.current*33
        }
    }
  },
  mounted() {
      const list=this.$refs.ByMusicList
      list.scrollTop=this.current*33
  },
};
</script>
<style lang="stylus" scoped>
.details-music {
  position: relative;
  margin: 0 auto;
  padding: 80px;
  .music-bg-blur {
   position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color:#dcf4ff
    filter: blur(50px);
    transform: scale(1.05);
    z-index: -1;
    transition: all 1s;
  }

  .pic-lrc-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;

    .pic-content {
      position: relative;
      .pic-pointer {
        height: 150px;
        position: absolute;
        top: -75px;
        left: 50%;
        z-index: 2;
        transform: translateX(-18.7%) rotate(-40deg);
        transform-origin: 18.7% 17.3%;
        transition: all 1s;
      }

      .pic-pointer-play {
        transform: translateX(-18.7%) rotate(-10deg);
      }

      .disc {
        position: relative;
        width: 270px;
        height: 270px;
        border-radius: 50%;
        background-size: 103%;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('~@/assets/cid.png');
        border: 6px solid rgba(255, 255, 255, 0.7);
        animation: rotate 10s linear infinite forwards;
        animation-play-state: paused;
        .song-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          transform: translate(-50%, -50%) rotate(0deg);
          width: 184px;
          height: 184px;
          // background-image: url('~@/assets/cho.png');
          // background-size: cover;
          // background-repeat: no-repeat;
          // background-position: center;
          border-radius: 50%;
        }
      }

      .controller {
        position: absolute;
        left: 50%;
        bottom: -50px;
        transform: translateX(-50%);
        color: #fff;
        font-size: 40px;
      }
    }

    .music-info {
      margin: 20px 0;
      text-align: center;

      .title {
        font-size: 22px;
        color: #000;
      }

      .author {
        font-size: 14px;
        margin-left: 5px;
        color: #fff;
      }
    }

    .by-music-lrc {
      position: relative;
      height: 275px;
      text-align: center;
      overflow: hidden;

      .by-music-lrc-contents {
        width: 100%;
        transition: all 0.5s ease-out;
        user-select: text;
        cursor: default;

        p {
          font-size: 14px;
          color: rgba(59, 58, 58, 0.8);
          line-height: 25px !important;
          height: 25px !important;
          padding: 0 !important;
          margin: 0 !important;
          transition: all 0.5s ease-out;
          overflow: hidden;
        }

        .by-music-lrc-current {
          opacity: 1;
          overflow: visible;
          height: auto !important;
          min-height: 25px;
          color: #fff;
        }
      }
    }
  }

  .by-music-contrl {
    display: flex;
    align-items: center;
    color: rgba(59, 58, 58, 0.8);
    font-size: 20px;

    .icon {
      margin: 0 2px;
    }

    .by-music-tiem {
      font-size: 14px;
    }

    .by-music-contrl-left {
    }

    .by-music-slider {
      flex: 1 1 auto;
    }

    .by-music-contrl-right {
      display: flex;
      align-items: center;

      .by-volume-wrap {
        position: relative;
        display: inline-block;
        margin-left: 3px;
        cursor: pointer !important;

        &:hover {
          .by-volume-slider {
            height: 80px;
          }
        }

        .by-volume-slider {
          margin: 0;
          position: absolute;
          bottom: 25px;
          right: 13px;
          width: 10px;
          height: 0;
          z-index: 99;
          overflow: hidden;
          transition: all 0.2s ease-in-out;

          :deep(.by-slider-handle ){
            display: none !important;
          }
        }
      }

      .by-music-switch {
        position: relative;

        &:hover {
          .by-music-list {
            height: 250px;
            opacity: 1;
          }
        }

        .by-music-list {
          overflow: auto;
          transition: all 0.5s ease;
          will-change: height;
          display: block;
          overflow: hidden;
          max-height: 250px;
          position: absolute;
          bottom: 20px;
          width: 300px;
          right: 0;
          background: #fff;
          height: 0;
          margin-bottom: 10px;
          opacity: 0;

          ol {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            max-height: 250px;

            &::-webkit-scrollbar {
              display: none;
            }

            li {
              position: relative;
              height: 32px;
              line-height: 32px;
              padding: 0 15px;
              font-size: 12px;
              border-top: 1px solid #e9e9e9;
              cursor: pointer;
              transition: all 0.2s ease;
              overflow: hidden;
              text-align: left;
              margin: 0;

              &:first-child {
                border-top: none;
              }

              &:hover {
                background: #e9e9e9;
              }

              .by-music-list-index {
                color: #666;
                margin-right: 12px;
                cursor: pointer;
              }

              .by-music-list-title {
              }

              .by-music-list-author {
                color: #666;
                float: right;
                cursor: pointer;
              }
            }

            .by-music-list-play {
              background: #e9e9e9;
              border-left: 2px solid #ccc;
            }
          }
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
@media (max-width:768px) {
  .details-music .pic-lrc-content .pic-content{
      transform: scale(0.8);
  }
}
</style>