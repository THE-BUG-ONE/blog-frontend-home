<template>
<div>
<div class="occlusion-wrap">
    <div class="occlusion" @click="jump" :style="{'background-image':dailyEnglish.bg?`url(${dailyEnglish.bg})`:false}">
      <h4 class="title">每日一句英语</h4>
      <div class="content">
        <p>{{ dailyEnglish.name }}</p>
        <p>{{ dailyEnglish.lrc }}</p>
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
  <div class="friend container">
    <div class="friend-list">
      <div
        class="friend-list-item concise"
        v-for="(item, index) of friendList"
        :key="'friend' + index"
        :class="'friend-list-item-bg-' + ((index + 1) % 4)"
      >
        <a :href="item.link" class="link" target="_blank">
          <Image :src="item.imgUrl" class="logo">
            <template #placeholder>
                  <svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;width: 100%;height: 100%;" width="200" height="200" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(30 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(60 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(90 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(120 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(150 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(180 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(210 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(240 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(270 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(300 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/></rect><rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#93dbe9" transform="rotate(330 50 50)"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"/></rect></svg>
            </template>
             <template #error>
                  <img
                    style="width: 100%;"
                    src="https://iconfont.alicdn.com/s/e8a7a96a-7f80-4f07-bc88-c162da451fe1_origin.svg"
                  />
                </template>
          </Image>
          <div style="flex: 1">
            <h4 class="name">{{ item.name }}</h4>
            <p class="info">
              {{ item.info }}
            </p>
          </div>
        </a>
      </div>
      <template v-if="friendList.length == 0">
        <Skeleton
          v-for="item of 3"
          :key="'Skeleton' + item"
          class="friend-list-item concise"
          :class="'friend-list-item-bg-' + ((item + 1) % 4)"
          avatar
          active
        ></Skeleton>
      </template>
    </div>
  </div>
</div>
  
</template>
<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import ByMusic from "@/components/music/index.js";
import Skeleton from "@/components/skeleton/skeleton";
import Image from "@/components/image/image";
export default {
  name: "Friends",
  components: {
    Image,
    Skeleton,
  },
  setup() {
    const store = useStore();
    store.dispatch("getDailyEnglish");
    store.dispatch("getFriendList");
    const friendList = computed(() => store.state.index.friendList);
    const dailyEnglish = computed(() => store.state.index.dailyEnglish);

    let current;
    watch(
      () => dailyEnglish.value,
      (english) => {
        console.log("今日英语", english);
        current = ByMusic.addMusic([
          {
            name: "今日英语",
            artist: "词霸每日一句",
            cover: english.cover,
            url: english.url,
            lrc: english.lrc,
          },
        ]);
      }
    );
    const jump = () => {
      ByMusic.jump(current);
      ByMusic.autoPlay = true;
    };
    return {
      friendList,
      dailyEnglish,
      jump,
    };
  },
};
</script>
<style lang="stylus" scoped>
.friend {
  .daily-english {
    padding: 100px 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .title {
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
      color: #336a99;
      text-align: center;
      cursor: pointer;
    }
  }

  .friend-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px auto;
    box-sizing: border-box;
    padding: 10px 0;

    &-item {
      min-width: 200px;
      width: 324px;
      margin: 10px
      transition: all 0.4s;
      box-sizing: border-box;
      padding: 30px 15px
      &:hover {
        box-shadow: 0 30px 50px 20px rgba(46, 58, 89, 0.1);
      }

      .link {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .logo {
          margin-right: 20px;
          width: 60px;
          height: 60px;
          border: 2px solid rgba(223,223,223,0.3);
          box-sizing: border-box;
          border-radius: 50%;
        }

        .name {
          font-size: 18px;
          margin-top: 1em;
        }

        .info {
          font-size: 16px;
          line-height: 32px;
          color: #336a99;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5em;
          height: 3em;
          margin-top: 15px;
          color: #5b667f;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
    }

    &-item-bg-0 {
      background: linear-gradient(180deg, #d2e5f9, #f8fbfe);
    }

    &-item-bg-1 {
      background: linear-gradient(180deg, #dcf4ff, #f4fcff);
    }

    &-item-bg-2 {
      background: linear-gradient(180deg, #fff0ce, #fffcf6);
    }

    &-item-bg-3 {
      background: linear-gradient(180deg, #ffe4cf, #fff7f1);
    }
  }
}

@media (max-width: 776px) {
  .friend {
    .daily-english {
      .title {
        font-size: 28px;
      }
    }
    .friend-list{
      &-item{
        width 100%
      }
    }
  }
}
</style>