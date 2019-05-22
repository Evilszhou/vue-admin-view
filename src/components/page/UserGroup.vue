<template>
    <div>
         <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
           <el-button type="primary" @click="createGroup">新建分组</el-button>
            <el-table
              :data="tableData"
              stripe
              style="width: 100%;margin-top:10px">
              <el-table-column
                type="index"
                width="180"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                prop="groupName"
                label="用户组"
                width="180">
              </el-table-column>
              <el-table-column
                prop="groupPermission"
                label="权限名">
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
            <el-dialog
              title="编辑分组"
              :visible.sync="centerDialogVisible"
              width="30%"
              style="height:1000px"
             >
             <el-form :model="form">
                <el-form-item label="用户组名" :label-width="formLabelWidth">
                  <el-input v-model="form.groupName" style="width:85%" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户权限" :label-width="formLabelWidth" >
                   <el-checkbox-group v-model="form.groupPermission" @change="changePermissions">
                    <el-checkbox label="预览"></el-checkbox>
                    <el-checkbox label="打印"></el-checkbox>
                    <el-checkbox label="上传"></el-checkbox>
                    <el-checkbox label="下载"></el-checkbox>
                    <el-checkbox label="删除"></el-checkbox>
                    <el-checkbox label="检索"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confimUpdate">确 定</el-button>
              </div>
            </el-dialog>

              <el-dialog
              title="新增分组"
              :visible.sync="DialogVisible"
              width="30%"
              style="height:1000px"
             >
             <el-form :model="userGroup">
                <el-form-item label="用户组名" :label-width="formLabelWidth">
                  <el-input v-model="userGroup.groupName" style="width:85%" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户权限" :label-width="formLabelWidth" >
                   <el-checkbox-group v-model="userGroup.groupPermission" @change="choosePermissions">
                    <el-checkbox label="预览"></el-checkbox>
                    <el-checkbox label="打印"></el-checkbox>
                    <el-checkbox label="上传"></el-checkbox>
                    <el-checkbox label="下载"></el-checkbox>
                    <el-checkbox label="删除"></el-checkbox>
                    <el-checkbox label="检索"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="DialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confimCreateUser">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {postJsonRequest,postRequest,getRequest} from '../../main.js';
export default {
  inject:['reload'],
    data(){
        return{
          DialogVisible:false,
          formLabelWidth: '120px',
          checkList: ['复选框 A'],
          centerDialogVisible: false,
          tableData: [],
          form:{
            groupName:"",
            groupPermission:[]
          },
          userGroup:{
            groupName:"",
            groupPermission:[]
          }
          }
    },
    methods:{
      createGroup(){
        this.DialogVisible = true;
      },
      indexMethod(index) {
        return index + 1;
      },
      handleEdit(index, row) {
        console.log(row)
        let permissions = row.groupPermission.split(",");
        console.log(permissions)
        this.form.groupName = row.groupName;
        this.form.groupPermission = permissions;
       
        this.centerDialogVisible = true;
      },
      getallUserGroup(){
        let _this = this;
        postJsonRequest("/api/getAllUserGroup").then((result) => {
          console.log(result.data.data);

          
          _this.tableData = result.data.data;
        }).catch((err) => {
          
        });
      },
      handleDelete(index, row) {
        // console.log(index, row);
        console.log(row);
        postJsonRequest("/api/deleteUserGroup",row).then((result) => {
          if(result.data.code == 200){
            this.open2(result.data.msg)
            this.reload();
          }
        }).catch((err) => {
          
        });
      },
      changePermissions(permissions){
        let name = "";
        return name;
        for(let i = 0;i < permissions.length;i++){
          if(i == permissions.length - 1 ){
            name = name + permissions[i];
          }else{
            name = name + permissions[i]+","
          }
        }
        console.log(name);
        return name;
      },
      choosePermissions(){

      },
      confimUpdate(){
        console.log(this.form);
        let name = "";
        
        for(let i = 0 ;i < this.form.groupPermission.length;i++){
          if(i == this.form.groupPermission.length - 1 ){
            name = name + this.form.groupPermission[i];
          }else{
            name = name + this.form.groupPermission[i]+","
          }
        }
        let userGroup = {
          groupName:this.form.groupName,
          groupPermission:name
        }
        postJsonRequest("/api/updateUserGroup",userGroup).then((result) => {
          console.log(result);
          if(result.data.code == 200){
            this.open2(result.data.msg);
            this.reload();
          }
        }).catch((err) => {
          
        });
        this.centerDialogVisible = false;
      },
      confimCreateUser(){
        let permissions = this.userGroup.groupPermission;
        let name = "";
        for(let i = 0;i < permissions.length;i++){
          if(i == permissions.length - 1 ){
            name = name + permissions[i];
          }else{
            name = name + permissions[i]+","
          }
        }
        let userGroup = {
          groupName:this.userGroup.groupName,
          groupPermission:name
        }
        postJsonRequest("/api/addUserGroup",userGroup).then((result) => {
          console.log(result);   
          if(result.data.code === 200){
            this.open2(result.data.msg);
            this.reload();
          }
        }).catch((err) => {
        });
        this.DialogVisible = false;
      },
       open2(msg) {
        this.$message({
          message:msg,
          type: 'success'
        });
      },
    },
    mounted(){
      this.getallUserGroup();
    }
}
</script>

<style scoped>

</style>


