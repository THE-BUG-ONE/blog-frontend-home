<template>
  
  <div
    class="by-music"
    :class="{
      'by-music-narrow': bodyShow,
      'by-music-fixed': mode == 'fixed',
      'by-music-mini': mode == 'mini',
      'by-music-withlrc': config.lrcType && mode == 'list',
    }"
  >
    <div class="by-music-body">
      <!-- 封面 -->
      <div class="by-music-pic">
        <Image :src="list[current].cover" fit="cover"
        style="    height: 66px;
    width: 66px;"
        >
          <template #placeholder>
           <Loading>

           </Loading>
          </template>
           <template #error>
           <Loading>

           </Loading>
          </template>
        </Image>
        <span
          class="by-music-paly"
          :class="{ 'by-music-pause': status, 'by-music-loading': loading }"
          @click="$emit('click-toggle')"
        >
          <IconFont type="iconloading" v-if="loading" />
          <IconFont :type="status ? 'iconpause' : 'iconplay'" v-else />
        </span>
      </div>
      <div class="by-music-info" v-if="mode != 'mini'">
        <!-- 歌曲信息 -->
        <div class="by-music-desc">
          <span class="by-music-title">
            {{ list[current].artist }}
          </span>
          <span class="by-music-author"> - {{ list[current].name }} </span>
        </div>
        <!-- 歌词 -->
        <div class="by-music-lrc" v-if="mode == 'list'">
          <div
            class="by-music-lrc-contents"
            :style="{ transform: 'translateY(-' + lrcPosition * 16 + 'px)' }"
          >
            <p
              :class="{ 'by-music-lrc-current': lrcPosition == index }"
              v-for="(item, index) of fromatLrc"
              :key="'by-music-lrc' + index"
            >
              {{ item[1] }}
            </p>
          </div>
        </div>
        <!-- 控制器 -->
        <div class="by-music-controller">
          <!-- 进度条 -->
          <BySlider
            class="by-music-slider"
            :max="totalTime"
            v-model:value="mCurrentTime"
            @after-change="$emit('after-change', $event)"
          />
          <div class="by-music-time">
            <!-- 歌曲时间 -->
            <span class="by-music-time-inner"
              >{{ formatTime(mCurrentTime) }}/{{ formatTime(totalTime) }}</span
            >
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
            <!-- 循环模式 -->
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
            <!-- 歌词开关 -->
            <IconFont
              v-if="mode == 'fixed'"
              type="iconlrc"
              class="by-music-icon iconlrc"
              @click="fixedLar = !fixedLar"
            />
            <!-- 列表开关 -->
            <IconFont
              type="iconmenu"
              class="by-music-icon iconmenu"
              @click="listShow"
            />
          </div>
        </div>
      </div>
      <!-- 开关 -->
      <div
        class="by-music-switch"
        @click="bodyShow = !bodyShow"
        v-if="mode == 'fixed'"
      >
        <IconFont :type="bodyShow ? 'iconright' : 'iconright-copy'" />
      </div>
      <!-- 歌曲列表 -->
    </div>
    <!-- 歌词 -->
    <div class="by-music-lrc" v-if="mode == 'fixed'" v-show="fixedLar">
      <div
        class="by-music-lrc-contents"
        :style="{ transform: 'translateY(-' + lrcPosition * 16 + 'px)' }"
      >
        <p
          :class="{ 'by-music-lrc-current': lrcPosition == index }"
          v-for="(item, index) of fromatLrc"
          :key="'by-flex-lrc' + index"
        >
          {{ item[1] }}
        </p>
      </div>
    </div>
    <div
      v-if="mode != 'mini'"
      class="by-music-list"
      :class="{ 'by-music-list-hide': listFolded }"
      :style="{ 'max-height': '250px' }"
    >
      <ol ref="ByMusicList">
        <li
          v-for="(item, index) of list"
          :key="`by-music-${index}`"
          :class="{ 'by-music-list-play': index == current }"
          @click="$emit('click-jump', index)"
        >
          <span class="by-music-list-index">{{ index + 1 }}</span>
          <span class="by-music-list-title">{{ item.name }}</span>
          <span class="by-music-list-author">{{ item.artist }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import BySlider from "../slider/slider";
import utils from "./utils";
import IconFont from "../icon-font/icon-font";
import Image from "../image/image.vue";
import Loading from './loading'
// import { createFromIconfontCN } from '@ant-design/icons-vue';

// const IconFont = createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_2209704_fv5dd37z5hn.js',
// });
export default {
  name: "FlexMusic",
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
    Image,
    Loading
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
      const larList = this.fromatLrc;
      const leng = larList.length;
      let i;
      for (i = 0; i < leng; i++) {
        if (i == leng - 1 || this.currentTime < larList[0][0]) {
          break;
        } else if (
          this.currentTime >= larList[i][0] &&
          this.currentTime < larList[i + 1][0]
        ) {
          break;
        }
      }
      return i;
    },
    fromatLrc() {
      return utils.parse(this.list[this.current].lrc);
    },
  },
  data() {
    return {
      mCurrentTime: this.currentTime,
      mVolume: this.volume,
      listFolded: false,
      bodyShow: false,
      fixedLar: true,
    };
  },
  watch: {
    currentTime(newVal) {
      this.mCurrentTime = newVal;
    },
    volume(newVal) {
      this.mVolume = newVal;
    },
    current() {
      if (this.mode != "mini" && !this.listFolded) {
        this.scrollCurrent();
      }
    },
  },
  methods: {
    formatTime(time) {
      return utils.transTime(time);
    },
    listShow() {
      this.listFolded = !this.listFolded;
      if (!this.listFolded) {
        this.scrollCurrent();
      }
    },
    scrollCurrent() {
      console.log("scrollCurrent");
      const list = this.$refs.ByMusicList;
      const scrollTop = list.scrollTop;
      if (
        this.current * 33 < scrollTop ||
        this.current * 33 - scrollTop >= list.clientHeight
      ) {
        console.log(list);
        utils.scrollTo(this.current * 33, { getContainer: () => list });
        // list.scrollTop=this.current*33
      }
    },
  },
  mounted() {
    if (this.mode != "mini") {
      const list = this.$refs.ByMusicList;
      list.scrollTop = this.current * 33;
    }
    if (this.mode == "fixed") {
      this.bodyShow = this.config.bodyShow;
      this.listFolded = this.config.listFolded;
    } else if (this.mode == "list") {
      console.log("list");
      this.listFolded = this.config.listFolded;
    }
  },
};
</script>
<style lang="stylus" scoped>
.by-music * {
  box-sizing: content-box;
}

.by-music {
  background: #fff;
  font-family: Arial, Helvetica, sans-serif;
  margin: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.07), 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  user-select: none;
  line-height: normal;
  position: relative;

  .by-music-icon {
    width: 15px;
    height: 15px;
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    opacity: 0.8;
    vertical-align: middle;
    padding: 0;
    font-size: 15px;
    margin: 0;
    display: inline-block;
    transition: all 0.3s;

    &:hover {
      color: #333;
    }
  }

  .by-music-list {
    overflow: auto;
    transition: all 0.5s ease;
    will-change: height;
    display: block;
    overflow: hidden;

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

  .by-music-list-hide {
    max-height: 0 !important;
  }

  .by-music-body {
    position: relative;

    .by-music-loading {
      animation: rotate 1s linear infinite;
    }

    .by-music-pic {
      position: relative;
      float: left;
      height: 66px;
      width: 66px;
      background-size: cover;
      background-position: 50%;
      transition: all 0.3s ease;
      cursor: pointer;

      .by-music-paly {
        position: absolute;
        border-radius: 50%;
        opacity: 0.8;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
        transition: all 0.1s ease;
        width: 26px;
        height: 26px;
        border: 2px solid #fff;
        bottom: 50%;
        right: 50%;
        margin: 0 -15px -15px 0;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .by-music-pause {
        width: 16px;
        height: 16px;
        bottom: 20px;
        right: 20px;
        font-size: 12px;
      }
    }

    .by-music-info {
      margin-left: 66px;
      padding: 14px 7px 0 10px;
      height: 66px;
      box-sizing: border-box;
      border-bottom: 1px solid #e9e9e9;

      .by-music-desc {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 0 13px 5px;
        user-select: text;
        cursor: default;
        padding-bottom: 2px;
        text-align: left;

        .by-music-title {
          font-size: 14px;
        }

        .by-music-author {
          font-size: 12px;
          color: #666;
        }
      }

      .by-music-controller {
        position: relative;
        display: flex;

        .by-music-slider {
          margin: 0 0 0 5px;
          padding: 4px 0;
          cursor: pointer !important;
          flex: 1;
        }

        .by-music-time {
          position: relative;
          right: 0;
          bottom: 4px;
          height: 17px;
          color: #999;
          font-size: 11px;
          padding-left: 7px;

          .prev, .play, .next, .iconlrc {
            display: none;
          }

          .by-music-time-inner {
            vertical-align: middle;
          }

          .by-volume-wrap {
            position: relative;
            display: inline-block;
            margin-left: 3px;
            cursor: pointer !important;

            &:hover {
              .by-volume-slider {
                height: 40px;
              }
            }

            .by-volume-slider {
              margin: 0;
              position: absolute;
              bottom: 15px;
              right: -3px;
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
        }
      }
    }

    .by-music-switch {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      background: #e6e6e6;
      width: 18px;
      border-radius: 0 2px 2px 0;

      .icon {
        height: 100%;
        width: 100%;
        color: #878787;
      }
    }
  }

  .by-music-lrc {
    position: relative;
    height: 30px;
    text-align: center;
    overflow: hidden;
    margin: -10px 0 7px;

    &:before, &:after {
      position: absolute;
      z-index: 1;
      display: block;
      overflow: hidden;
      width: 100%;
      content: ' ';
    }

    &:after {
      bottom: 0;
      height: 33%;
      background: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, 0.8));
    }

    .by-music-lrc-contents {
      width: 100%;
      transition: all 0.5s ease-out;
      user-select: text;
      cursor: default;

      p {
        font-size: 12px;
        color: #666;
        line-height: 16px !important;
        height: 16px !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: all 0.5s ease-out;
        opacity: 0.4;
        overflow: hidden;
      }

      .by-music-lrc-current {
        opacity: 1;
        overflow: visible;
        height: auto !important;
        min-height: 16px;
      }
    }
  }
}

// 迷你模式
.by-music-mini {
  max-width: 66px;
}

// 带有歌词
.by-music-withlrc {
  .by-music-body {
    .by-music-pic {
      height: 90px;
      width: 90px;
    }

    .by-music-info {
      margin-left: 90px;
      height: 90px;
      padding: 10px 7px 0;
    }
  }
}

.by-music-narrow {
  width: 66px;

  .by-music-list {
    display: none;
  }

  .by-music-body {
    max-width: 66px !important;

    .by-music-info {
      display: block;
      transform: scaleX(0);
    }
  }
}

// 吸底模式
.by-music-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 99;
  overflow: visible;
  max-width: 400px;
  box-shadow: none;

  .by-music-list {
    border: 1px solid #eee;
    border-bottom: none;
    margin-bottom: 65px;

    ol {
      overflow-y: auto;
      max-height: 250px;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .by-music-body {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    z-index: 99;
    background: #fff;
    padding-right: 18px;
    min-width  66px
    transition: max-width 0.3s ease;
    max-width: 400px;

    .by-music-info {
      .by-music-controller {
        .by-music-time {
          .prev, .play, .next, .iconmenu {
            display: block;
            position: absolute;
            bottom: 27px;
            width: 20px;
            height: 20px;
            font-size: 20px;
          }

          .prev {
            right: 75px;
          }

          .play {
            right: 50px;
          }

          .next {
            right: 25px;
          }

          .iconmenu {
            right: 0;
          }

          .iconlrc {
            display: inline;
          }
        }
      }
    }

    .by-music-switch {
      display: inline-block;
    }
  }

  .by-music-lrc {
    display: block;
    position: fixed;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0;
    z-index: 98;
    pointer-events: none;
    text-shadow: 0 0 1px #fff, 0 0 10px #fff;

    &:before, &:after {
      display: none;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>