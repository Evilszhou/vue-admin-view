<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>

<script>
export default {
    data(){
        return{
            isRouterAlive:true
        }
    },
    provide(){
        return{
            reload:this.reload
        }
    },
    methods:{
        reload(){
            this.isRouterAlive = false;
            this.$nextTick(function(){
                this.isRouterAlive = true;
            })
        }
    }
}
</script>
