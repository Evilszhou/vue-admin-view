<template>
  <div class="department">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 机构管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);background:white;padding-top:20px">
      <div class="department-top" style="padding-left:20px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="searchParam" placeholder="输入部门名字"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
        <el-col :span="3" :offset="13">
          <el-button type="primary" @click="dialogTableVisible = true">添加</el-button>
        </el-col>
      </el-row>
    </div>
      <dragTreeTable
      style="background:white"
      :data="treeData"
      :onDrag="onTreeDataChange"
      :isdraggable="true"
    ></dragTreeTable>
    </div>
    <el-dialog title="新增组织" :visible.sync="dialogTableVisible">
      <el-form :model="department">
        <el-form-item label="组织名" :label-width="formLabelWidth">
          <el-input v-model="department.departmentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织简介" :label-width="formLabelWidth">
          <el-input v-model="department.departmentIntroduction" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="department.departmentSuper" placeholder="请选择所属部门">
            <el-option label="丽水学院" value="丽水学院"></el-option>
            <el-option label="工学院" value="工学院"></el-option>
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
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";
import dragTreeTable from "drag-tree-table";
export default {
  name: "department",
  data() {
    return {
      searchParam: '',
      formLabelWidth: "120px",
      dialogTableVisible: false,
      treeData: {
        columns: [],
        children: [],
        custom_field: {
          id: "id",
          order: "sort",
          lists: "children",
          parent_id: "parent_id"
        }
      },
      department: {
        departmentName: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  components: {
    dragTreeTable
  },
  methods: {
    deepTraversal(list) {
      let nodes = [];
      let isInclude = false;
      let result={'isInclude':isInclude,'nodes':nodes};
      if (list !== null) {
        for (let i = 0; i < list.length; i++) {
          let child = list[i];
          if(child.name == this.searchParam){
            result.isInclude = true;
          }
          console.log(child)
          result.nodes.push(child);
          let isInclude = this.deepTraversal(child.children).isInclude;
          if(isInclude){
            child.open = true;
            result.isInclude = true;
            console.log(child.name+"is true")
          }else{
            child.open = false;
          }
        }
      }
      return result;
    },
    search() {
      let result = this.deepTraversal(this.treeData.children);
      console.log(result)
      let newTreeDataChildren = result.nodes;
      let isInclude = result.isInclude;
      let newTreeData = {
            columns: [...this.treeData.columns],
            children: newTreeDataChildren,
            custom_field: {
            id: "id",
            order: "sort",
            lists: "children",
            parent_id: "parent_id"
          }
        }
      this.treeData = {...newTreeData};
    },
    getDepartmentsTree() {
      getRequest("/api/admin/getAllDepartments")
        .then(result => {
          if (result.data.code === 200) {
            this.treeData.children = result.data.data;
            console.log(this.treeData)
            console.log( this.treeData.children);

            // this.total = result.data.data.total;
          } else {
            alert("获取失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    openChildList(node) {
      node.child = true;
    },
    onTreeDataChange(list) {
      console.log(list);
      this.treeData.children = list;
    },
    deleteDepatment(item) {
      console.log("删除", item);
    },
    editDepartment(item) {
      console.log("修改", item);
    }
  },
   watch: {
    searchParam(val) {
      if (val != "") {
        this.searchParam = val;
        console.log(this.searchParam)
      }
    },
    
    },
  mounted() {
    this.treeData.columns = [
      {
        type: "selection",
        title: "机构名称",
        field: "name",
        width: 200,
        align: "left",
        formatter: item => {
          return "<span>" + item.name + "</span>";
        }
      },
      {
        title: "机构描述",
        field: "introduction",
        width: 200,
        align: "center",
        flex: 1
      },
      {
        title: "操作",
        type: "action",
        width: 350,
        align: "center",
        actions: [
          {
            text: "删除",
            onclick: this.deleteDepatment,
            formatter: item => {
              return "<i style='color:rgb(245, 108, 108);font-size:20px;margin-right:10px' class='el-icon-lx-deletefill'></i>";
            }
          },
          {
            text: "修改",
            onclick: this.editDepartment,
            formatter: item => {
              return "<i style='color:rgb(64, 158, 255);font-size:20px' class='el-icon-lx-edit'></i>";
            }
          }
        ]
      }
    ];
    this.getDepartmentsTree();
  }
};
</script>

<style>
.drag-tree-table-header{
  /* background-color: white; */
  border-top-width: 0;
  border:1px solid rgb(238, 238, 238);
  border-top-width: 0;
  height: 40px !important;
  background: #fff !important;
  line-height: 40px;
  padding:0 !important;
  color: rgb(144, 147, 153)
}
</style>


