<template>
  <div class="message container" >
    <div class="message-add" v-infinite-scroll="getMess" :infinite-scroll-distance="20" :infinite-scroll-disabled="loading" infinite-scroll-window="false">
      <h4 class="title">Speak freely!</h4>
      <Comment class="comment" @submit="submit"></Comment>
    </div>
    <div class="message-list">
      <div class="left">
        <div v-if="loading">
          <Skeleton v-for="item of 3" :key="'Skeleton'+item" :class="'message-list-item-bg-'+(item+1)%4"  class="concise" avatar active></Skeleton>
        </div>
        <template v-else>
          <MessageCard @reply="reply" @delete="deleteMess" :item="item" :replyList="getReplyList(item.id)" v-for="(item,index) of listItem.left" :key="item.id" class="message-list-card" :class="'message-list-item-bg-'+(index+1)%4"></MessageCard>
        </template>
        
      </div>
      <div class="right">
        <template v-if="loading">
          <Skeleton v-for="item of 3" :key="'Skeleton'+item" :class="'message-list-item-bg-'+(item+1)%4"  class="concise" avatar active></Skeleton>
        </template>
        <template v-else>
          <MessageCard @reply="reply" @delete="deleteMess" :item="item" :replyList="getReplyList(item.id)" v-for="(item,index) of listItem.right" :key="item.id" class="message-list-card" :class="'message-list-item-bg-'+(index+1)%4"></MessageCard>
        </template>
        
      </div>
    </div>
      <p class="last" v-if="current_page==last_page">—— 我可是有底线的！——</p>
  </div>
</template>
<script>
import { computed } from "vue";
import Comment from "./comment";
import { getMessList } from "./message";
import MessageCard from "./message-card";
import Skeleton from "@/components/skeleton/skeleton";
import { ref } from 'vue';
export default {
  name: "Message",
  components: {
    Comment,
    MessageCard,
    Skeleton
  },
  setup() {
    const { list,getMess,loading,current_page,last_page,messageAdd,replyAdd,deleteMess} = getMessList(0);
    const listItem = computed(() => {
      const left = [];
      const right = [];
      const messageList = ref(list.value.filter(message => message.rootId === 0))
      console.log(messageList.value)
      for (let i = 0, leng = messageList.value.length; i < leng; i++) {
        if ((i + 1) % 2) {
          left.push(messageList.value[i]);
        } else {
          right.push(messageList.value[i]);
        }
      }
      return {
        left,
        right,
      };
    });
    getMess();
    const getReplyList = (id) => {
      const replyList = ref(list.value.filter(message => message.rootId === id))
      console.log(replyList.value,id)
      return replyList
    }
    const submit=(content)=>{
      const data={
        message:content,
        parentId:0,
        rootId:0,
        fromUserId:0
      }
      messageAdd(data)
    }
    const reply=(data)=>{
      replyAdd(data)
    }
    return {
      listItem,
      getMess,
      loading,
      submit,
      reply,
      deleteMess,
      current_page,
      last_page,
      getReplyList
    };
  },
};
</script>
<style lang="stylus" scoped>
.message {
  margin: 0 auto;
  &-add {
    padding: 100px 50px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .title {
      font-weight: 800;
      font-size: 48px;
      line-height: 110%;
      margin: 90px 0 28px;
      text-shadow: 0px 10px 15px rgba(46, 58, 89, 0.5);
    }

    .comment {
      box-shadow: 0 30px 50px 20px rgba(46, 58, 89, 0.1);
      border-radius: 20px;
      background-color #fff
    }
  }

  &-list {
    display: flex;
    .left, .right {
      flex: 1;
      // overflow: hidden;
      padding 10px
     :deep(.message-list-card ){
        width: 100%;
        box-sizing: border-box;
        transition: all 0.4s;
        margin-bottom 20px
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
  .last{
        text-align: center;
        color: #bababa;
        font-size: 14px;
        margin: 10px 0;
    }
}

@media (max-width: 776px) {
  .message {
    &-add {
        padding: 100px 10px;
      .title {
        font-size: 28px;
      }
      .comment{
          margin 0 10px
         box-sizing: border-box;
      }
    }

    &-list {
      flex-direction: column;

      .message-list-card {
        width: 90%;
      }
    }
  }
}
</style>