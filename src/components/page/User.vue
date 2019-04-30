<template>
   <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-input v-model="input" placeholder="用户名" class="username"></el-input>
            <el-button type="danger" style="margin-left:10px">新增</el-button>
            <el-button type="primary">查询</el-button>
            <el-table
                :data="tableData"
                style="width: 100%;margin-top:10px"
                :row-class-name="tableRowClassName">
                <el-table-column
                prop="date"
                label="序号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
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
                prop="permission"
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
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="10">
                </el-pagination>
            </div>
        </div>
   </div>
</template>

<script>
export default {
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
        console.log(index, row);
      },
        handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
    },
    data() {
      return {
          input: '',
          cur_page:1,
        tableData: [{
          date: '1',
          name: '王小虎',
          realname:"高耀智",
          department:"财务科",
          permission: '管理员',
          islock:"否"
        }, {
          date: '2',
          realname:"徐剑楠",
          name: '王小虎',
          department:"财务科",
          permission: '管理员',
          islock:"否"
        }, {
          date: '4',
          realname:"高耀智",
          name: '王小虎',
           department:"财务科",
          permission: '普通用户',
          islock:"否"
        },
        {
          date: '8',
          realname:"高耀智",
          name: '王小虎',
           department:"财务科",
          permission: '普通用户',
          islock:"否"
        }
        ]
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


