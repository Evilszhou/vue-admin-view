<template>
   <div class="banner">
   <div class="agileinfo-dot">
	<h1>用户登录</h1>

	<div class="w3layoutscontaineragileits">
	<h2>Sign In</h2>
		<form action="#" method="post">
			<input type="email" Name="Username" placeholder="邮箱" required="">
			<input type="password" Name="Password" placeholder="密码" required="">
			<ul class="agileinfotickwthree">
				<li>
					<input type="checkbox" id="brand1" value="">
					<label for="brand1"><span></span>Remember me</label>
					<a href="#">注册</a>
				</li>
			</ul>
			<div class="aitssendbuttonw3ls">
				<input type="submit" value="SIGNIN">
				<div class="clear"></div>
			</div>
		</form>
	</div>
	
	
	<div class="w3footeragile">
		<p> &copy; 2019 User Signin Form. All Rights Reserved | Design by <a href="#" target="_blank">Bardsix</a></p>
	</div>

</div>
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
@import url("../../assets/css/login.css");
</style>


