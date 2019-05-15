<template>
   <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-input v-model="input" placeholder="用户名" class="username"></el-input>
            <el-button type="danger" style="margin-left:10px" @click="dialogTableVisible = true">新增</el-button>
            <el-button type="primary">查询</el-button>
            <el-table
               v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
                :data="tableData"
                style="width: 100%;margin-top:10px"
                :row-class-name="tableRowClassName">
                <el-table-column
                prop="userId"
                label="序号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="userName"
                label="用户名"
                width="180">
                </el-table-column>
                <el-table-column
                prop="realname"
                label="真实姓名">
                </el-table-column>
                <el-table-column
                prop="department"
                label="所属部门">

                </el-table-column>
                <el-table-column
                prop="role"
                label="所有权限">
                </el-table-column>
              
                   <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <!--新建用户弹窗-->
        <el-dialog title="新增用户" :visible.sync="dialogTableVisible">
          <el-form :model="user">
              <el-form-item label="用户名"  :label-width="formLabelWidth">
                <el-input v-model="user.userName" placeholder="请输入用户名" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" :label-width="formLabelWidth">
                <el-input v-model="user.password" placeholder="请输入用户密码" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="真实姓名" :label-width="formLabelWidth">
                <el-input v-model="user.realname" placeholder="请输入真实姓名" autocomplete="off"></el-input>
              </el-form-item>
           
              <el-form-item label="所属部门" :label-width="formLabelWidth">
                <el-select v-model="user.department" placeholder="请选择所属部门">
                  <el-option label="丽水学院" value="丽水学院"></el-option>
                  <el-option label="工学院" value="工学院"></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="所有权限" :label-width="formLabelWidth">
                   <el-radio-group @change="choosePermission"  v-model="user.role" v-for="item in roles" :key="item">
                       <el-radio style="margin-right:10px" :label=item.groupName>{{item.groupName}}</el-radio>
                      
                   </el-radio-group>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible = false">取 消</el-button>
              <el-button type="primary" @click="createUser">确 定</el-button>
            </div>
        </el-dialog>

        <!--编辑弹窗-->
        <el-dialog title="编辑用户" :visible.sync="dialogTableVisible1">
          <el-form :model="updateuser">
              <el-form-item label="用户名"  :label-width="formLabelWidth">
                <el-input readonly v-model="updateuser.userName" placeholder="请输入用户名" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户密码" :label-width="formLabelWidth">
                <el-input v-model="updateuser.password" placeholder="请输入用户密码" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="真实姓名" :label-width="formLabelWidth">
                <el-input v-model="updateuser.realname" placeholder="请输入真实姓名" autocomplete="off"></el-input>
              </el-form-item>
           
              <el-form-item label="所属部门" :label-width="formLabelWidth">
                <el-select v-model="updateuser.department" placeholder="请选择所属部门">
                  <el-option label="丽水学院" value="丽水学院"></el-option>
                  <el-option label="工学院" value="工学院"></el-option>
                </el-select>
              </el-form-item>
                
               <el-form-item label="所有权限" :label-width="formLabelWidth">
                   <el-radio-group @change="choosePermission"  v-model="updateuser.role" v-for="item in roles" :key="item">
                       <el-radio style="margin-right:10px" :label=item.groupName>{{item.groupName}}</el-radio>
                   </el-radio-group>
              </el-form-item>
              <el-form-item>
                 <el-switch
                    style="display: block;margin-left:7%"
                    v-model="updateuser.islocked"
                    @change="changeLock"
                    active-color="#13ce66"
                    active-text="解除锁定"
                    inactive-text="用户锁定">
                  </el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible1 = false">取 消</el-button>
              <el-button type="primary" @click="sendUpdateUser">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>

<script>
import {postJsonRequest,postRequest,getRequest} from '../../main.js';
import { truncate } from 'fs';
export default {
  inject:['reload'],
  mounted(){
    this.getAllPermissions();
  },
      methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex % 4 === 1) {
          return 'warning-row';
        } else if (rowIndex % 4 === 3) {
          return 'success-row';
        }
        return '';
      },
       handleEdit(index, row) {
        // console.log(index, row);
        console.log(row);
        this.dialogTableVisible1 = true;
        this.updateuser.userId = row.userId;
        this.updateuser.department = row.department;
        this.updateuser.userName = row.userName;
        this.updateuser.password = row.password;
        this.updateuser.role = row.role;
        this.updateuser.realname = "高富帅"
        if(row.islocked == "未锁定"){
          this.updateuser.islocked = false;
        }else if(row.islocked == "已锁定"){
          this.updateuser.islocked = true;
        }
      },
      sendUpdateUser(){
        postJsonRequest("api/public/updateUserMessage",this.updateuser).then((result) => {
          console.log(result);
          this.reload();
        }).catch((err) => {
          
        });
        this.dialogTableVisible1 = false;
      },
      handleDelete(index, row) {
        console.log(row);
        console.log(row.userId)
        postRequest("/api/public/deleteUser",{
          userId:row.userId
        }).then((result) => {
          console.log(result);
          if(result.data.code == 200){
            this.reload();
          }else if(result.data.code == -1){
            this.open6();
          }
        }).catch((err) => {
        });
      },
      createUser(){
        postJsonRequest("/api/public/createUser",this.user).then((result) => {
          console.log(result)
          if(result.data.code == 200){
            this.open3();
            this.dialogTableVisible = false;
            this.reload();
          }else if(result.data.code == -1){
            this.open6();
          }
        }).catch((err) => {
        });
      },
      choosePermission(){

        console.log(this.user.role);
      },
        handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            changeLock(){
              console.log(this.value4);

            },
            getAllUserGroup(){
              

            },
            getData(){
              console.log("hhhh");
              let that = this;
              postRequest("/api/public/getAllUsers",{
                page:this.cur_page
              }).then((result) => {
                console.log(result);
                if(result.data.code === 200){
                  that.tableData = result.data.data.list
                  that.total = result.data.data.total
                  this.loading = false;
                }else if(result.data.code == -1){
                  

                }
                // console.log("total:"+this.total)
              }).catch((err) => {
                console.log(err);
                
              });
            },
            getAllPermissions(){
              let _this = this;
              let roles = [];
              postJsonRequest("/api/getAllUserGroup").then((result) => {
                  console.log(result);
                  for(let i = 0;i < result.data.data.length;i++){
                    roles.push(result.data.data[i]);
                  }
                  _this.roles = roles;
              }).catch((err) => {
                
              });
            },
            open6() {
                this.$notify.error({
                title: '错误',
                message: '无权限进行此操作'
                });
            },
              open7() {
                this.$notify.error({
                title: '错误',
                message: '用户已锁定'
                });
            },
             open3() {
        this.$notify({
          title: '成功',
          message: '这是一条成功的提示消息',
          type: 'success'
        });
      }
    },
    created(){
      this.getData();
    },
    data() {
      return {
        value4: '100',
        roles:[],
        radio:1,
        dialogTableVisible:false,
        dialogTableVisible1:false,
        loading:true,
        input: '',
        cur_page:1,
        total:1,
        formLabelWidth: '120px',
        tableData: [
        ],
        user: {
         userName:"",
         password:"",
         realname:"",
         department:"",
         role:""
        },
        updateuser:{
          userId:"",
          userName:"",
          password:"",
          realname:"",
          department:"",
          role:"",
          islocked:""
        }
      }
    }
}
</script>

<style>

.username{
    width: 200px !important;
}
 .el-table .warning-row {
    background: oldlace !important;
  }

  .el-table .success-row {
    background: #f0f9eb !important;
  }
</style>


