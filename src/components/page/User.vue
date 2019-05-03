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

        <el-dialog title="新增用户" :visible.sync="dialogTableVisible">
          <el-form :model="user">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="user.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" :label-width="formLabelWidth">
                <el-input v-model="user.name" autocomplete="off"></el-input>
              </el-form-item>
           
              <el-form-item label="所属部门" :label-width="formLabelWidth">
                <el-select v-model="user.region" placeholder="请选择所属部门">
                  <el-option label="丽水学院" value="丽水学院"></el-option>
                  <el-option label="工学院" value="工学院"></el-option>
                </el-select>
              </el-form-item>
               <el-form-item label="所有权限" :label-width="formLabelWidth">
                <el-select v-model="user.role" placeholder="请选择权限">
                  <el-option label="管理员" value="admin"></el-option>
                  <el-option label="用户" value="user"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
   </div>
</template>

<script>
import {postJsonRequest,postRequest,getRequest} from '../../main.js';
export default {
  inject:['reload'],
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
        console.log(index, row);
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
          console.log(err)
          if(err){
            console.log("权限不够")
          }
          
        });
      },
        handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },

            getData(){
              console.log("hhhh");
              let that = this;
              postRequest("/api/public/getAllUsers",{
                page:this.cur_page
              }).then((result) => {
                console.log(result.data.code);
                if(result.data.code === 200){
                  that.tableData = result.data.data.list
                  that.total = result.data.data.total
                  this.loading = false;
                }else if(result.data.code == -1){
                  

                }
                
                console.log("total:"+this.total)

              }).catch((err) => {
                console.log(err);
                
              });
            },
            open6() {
                this.$notify.error({
                title: '错误',
                message: '无权限进行此操作'
                });
            }
    },
    created(){
      this.getData();
    },
    data() {
      return {
        dialogTableVisible:false,
        loading:true,
        input: '',
        cur_page:1,
        total:1,
        formLabelWidth: '120px',
        tableData: [
        ],
        user: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      }
    }
}
</script>

<style>
.username{
    width: 200px !important;
}
 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>


