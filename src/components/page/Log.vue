<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 日志管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="userName" placeholder="操作者"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="opName" placeholder="操作记录"></el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <!-- <el-input v-model="opLabel" placeholder="操作类型"></el-input> -->
          <el-cascader
            placeholder="操作类型"
            :options="allOpLabels"
            filterable
            :change-on-select="true"
            @change="selectOpLabel"
            clearable
          ></el-cascader>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%;margin-top:10px"
        :row-class-name="tableRowClassName"
      >
        <el-table-column :index="indexMethod" type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="userName" label="操作者"></el-table-column>
        <el-table-column prop="opName" label="操作记录"></el-table-column>
        <el-table-column prop="opDate" sortable :formatter="dateTimeFormat" label="操作日期"></el-table-column>
        <el-table-column
          prop="opLabel"
          label="操作类型"

        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.tag === '家' ? 'primary' : 'success'"
              disable-transitions
            >{{scope.row.opLabel}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
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
import { isNull } from "util";
import { truncate } from 'fs';

export default {
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 4 === 1) {
        return "warning-row";
      } else if (rowIndex % 4 === 3) {
        return "success-row";
      }
      return "";
    },
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex % 4 === 1) {
      //   return "warning-row";
      // } else if (rowIndex % 4 === 3) {
      //   return "success-row";
      // }
      // return "";
    },
    // handleEdit(index, row) {
    //   console.log(index, row);
    // },
    // handleDelete(index, row) {
    //   console.log(index, row);
    // },
    search() {
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.currentPage = val;
      this.getLogsBySearchParam();
    },
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    filterTag(value, row) {
      return row.opLabel === value;
    },
    dateTimeFormat(row, column, cellValue, index) {
      let date = cellValue;
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getAllLogs() {
      this.loading = true;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/getAllLogs";
      } else {
        url = "/admin/getAllLogs";
      }
      getRequest(url, {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
        .then(result => {
          if (result.data.code === 200) {
            this.tableData = result.data.data.list;
            this.total = result.data.data.total;
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
      setTimeout(function () {
          _this.loading = false;
      },1000)
    },

    selectOpLabel(opLabel) {
      this.searchOpLabel = opLabel;
    },

    getLogsBySearchParam() {
      this.loading = true;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/getLogsBySearchParam";
      } else {
        url = "/admin/getLogsBySearchParam";
      }
      postJsonRequest(url, {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        userName: this.userName,
        opName: this.opName,
        opLabel: this.searchOpLabel[0],
        startTime: this.startTime,
        endTime: this.endTime
      })
        .then(result => {
          if (result.data.code === 200) {
            // this.$notify({
            //   title: "成功",
            //   message: result.data.msg,
            //   type: "success"
            // });
            this.tableData = result.data.data.list;
            this.total = result.data.data.total;
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
              message:'数据获取失败',
              type: "error"
            });
        });
        let _this = this;
        setTimeout(function () {
            _this.loading = false;
        },1000);
    }
  },
  watch: {
    // userName(val) {
    //   if (val != "") {
    //     this.userName = val;
    //     console.log("userName" + this.userName);
    //   }
    // },
    opName(val) {
      if (val != "") {
        this.opName = val;
        // console.log("opName" + this.opName);
      }
    },
    // opLabel(val) {
    //   if (val != "") {
    //     this.opLabel = val;
    //     console.log("opLabel" + this.opLabel);
    //     console.log(this.time[0]);
    //     console.log(this.time[1]);
    //   }
    // },
    time(val) {
      if (!isNull(val)) {
        if (!isNull(val[0]) && !isNull(val[1])) {
          this.startTime = moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
          this.endTime = moment(val[1]).format("YYYY-MM-DD HH:mm:ss");
        }
      } else {
        this.startTime = null;
        this.endTime = null;
      }
    }
  },

  mounted() {
    this.getAllLogs();
  },
  data() {
    return {
      input: "",
      currentPage: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      userName: "",
      opLabel: "",
      searchOpLabel: "",
      loading: false,
      allOpLabels: [
        {
          value: "用户管理",
          label: "用户管理"
        },
        {
          value: "文件管理",
          label: "文件管理"
        },
        {
          value: "类别管理",
          label: "类别管理"
        },
        {
          value: "部门管理",
          label: "部门管理"
        },
        {
          value: "标签管理",
          label: "标签管理"
        }
      ],
      opName: "",
      time: [],
      startTime: "",
      endTime: "",
      filterTagArray: [
        { text: "用户管理", value: "用户管理" },
        { text: "文件管理", value: "文件管理" },
        { text: "类别管理", value: "类别管理" },
        { text: "组织机构管理", value: "组织机构管理" }
      ]
    };
  }
};
</script>

<style>
.search {
  display: inline-block;
}
.el-table .warning-row {
  background: red;
}

.el-table .success-row {
  background: #f0f9eb;
}

/* .el-row {
    margin-bottom: 20px;

  }
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
} */
</style>


