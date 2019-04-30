<template>
    <div></div>
</template>
<script>
import $ from 'jquery';
export default {
    data(){

        return{

        }

    },
    mounted(){

        this.getToken();
        this.getRequest();

    },
    methods:{
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


