<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 备份管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-button type="primary" @click="backup">创建备份</el-button>
      <el-table v-loading="loading" :data="tableData" stripe style="width: 100%;margin-top:10px">
        <el-table-column :index="indexMethod" type="index" width="70"></el-table-column>
        <el-table-column
          align="center"
          prop="timestamp"
          :formatter="dateTimeFormat"
          label="备份时间"
          width="160"
        ></el-table-column>
        <el-table-column align="center" prop="backupPath" label="备份目录" width="300"></el-table-column>
        <el-table-column align="center" prop="sqlFileName" label="脚本文件名"></el-table-column>
        <el-table-column align="center" prop="docDirName" label="目录名"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="recover(scope.$index, scope.row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
export default {
  inject: ["reload"],
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 5,
      tableData: [],
      loading: false,
      fullscreenLoading: false
      // form: {
      //   recordPoindID: 0,
      //   timestamp: "",
      //   sqlFileName: "",
      //   docDirName: "",
      //   backupPath: ""
      // },
    };
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
     openFullScreen(msg) {
        const loading = this.$loading({
          lock: true,
          text: msg,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      },

    getAllRecordPoint() {
      this.loading = true;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/getAllRecordPoint";
      } else {
        url = "/admin/getAllRecordPoint";
      }
      getRequest(url, {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
        .then(result => {
          if (result.data.code === 200) {
            this.tableData = [...result.data.data.list];
            this.total = result.data.data.total;
            console.log(result.data)
          } else {
            this.$notify({
              title: "错误",
              message: result.data.msg,
              type: "error"
            });
          }
        })
        .catch(e => {
          this.$notify({
            title: "错误",
            message: "数据获取失败",
            type: "error"
          });
        });
      let _this = this;
      setTimeout(function() {
        _this.loading = false;
      }, 1000);
    },

    dateTimeFormat(row, column, cellValue, index) {
      let date = cellValue;
      if (date == undefined) {
        return "";
      }
      return moment(parseInt(cellValue)).format("YYYY-MM-DD HH:mm:ss");
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllRecordPoint();
    },

    recover(index, row) {
      console.log(row)
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/recover";
      } else {
        url = "/admin/recover";
      }
      this.$confirm("确认要恢复该备份点吗,该备份点之后的数据都将被删除,谨慎操作,", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            this.openFullScreen("数据正在恢复");
            postJsonRequest(url, row)
              .then(result => {
                if (result.data.code === 200) {
                  this.$notify.success({
                    title: "提示",
                    message: result.data.msg
                  });
                  this.getAllRecordPoint();
                } else {
                  this.$notify.error({
                    title: "提示",
                    message: result.data.msg
                  });
                }
              })
              .catch(e => {
                this.$notify.error({
                  title: "错误",
                  message: "操作失败"
                });
              });
          }
        })
        .catch(err => {});
    },

    backup() {
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/backup";
      } else {
        url = "/admin/backup";
      }
      this.$confirm("确认要备份当前所有数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            this.openFullScreen("数据正在备份");
            getRequest(url)
              .then(result => {
                if (result.data.code === 200) {
                  this.getAllRecordPoint();
                  this.$notify.success({
                    title: "提示",
                    message: result.data.msg
                  });
                } else {
                  this.$notify.error({
                    title: "提示",
                    message: result.data.msg
                  });
                }
              })
              .catch(e => {
                this.$notify.error({
                  title: "错误",
                  message: "操作失败"
                });
              });
          }
        })
        .catch(err => {});
    },

    delRecordPoint(index, row) {
      console.log(row);
    }
  },
  mounted() {
    this.getAllRecordPoint();
  }
};
</script>

<style scoped>
</style>


