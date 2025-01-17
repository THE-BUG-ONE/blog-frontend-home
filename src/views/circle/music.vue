<template>
    <div id="music">

    </div>
</template>
<script>
import ByMusic from "@/components/music/index.js";
import {onUnmounted} from 'vue'
export default {
    name:'Music',
    setup(){
        ByMusic.mode.details.target="#music"
         ByMusic.showMode('details',true)
         onUnmounted(()=>{
             ByMusic.showMode('details',false)
         }) 
    }
}
</script>
