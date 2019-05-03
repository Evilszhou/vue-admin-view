<template>
    <div>
        <el-button @click="send"></el-button>
    </div>
</template>
<script>
import $ from 'jquery';
import {postJsonRequest,postRequest,getRequest} from '../../main.js';
export default {
    data(){

        return{

        }

    },
    mounted(){

    },
    methods:{
        send(){
            postJsonRequest("/api/testapi").then((result) => {
                console.log(result);
            }).catch((err) => {
                
            });

        },
        getToken(){
            console.log(localStorage.getItem("token"))
        },
        getRequest(){
            let that = this;
            $.ajax({
                url:"http://localhost:8081/require_auth",
                methods:'get',
                contentType: 'application/json',
                dataType:"json",
                headers:{
                    "token":localStorage.getItem("token")
                },
                success:function(res){
                    console.log(res);
                    that.$router.push("/dashboard");
                },
                failed:function(res){
                    console.log(res);
                }

            })

        }

    }
}
</script>

<style scoped>

</style>


