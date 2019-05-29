<template>
  <div class="department">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 机构管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div
      style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);background:white;padding-top:20px"
    >
      <div class="department-top" style="padding-left:20px">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-input v-model="searchParam" placeholder="输入部门名字"></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
          <el-col :span="3" :offset="13">
            <el-button type="primary" @click="showAddDilog(null)">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <dragTreeTable
        v-loading="loading"
        style="background:white"
        :data="treeData"
        :onDrag="onTreeDataChange"
        :isdraggable="true"
      ></dragTreeTable>
    </div>
    <!-- 新增组织 -->
    <el-dialog title="新增组织" :visible.sync="dialogTableVisible">
      <el-form :model="department">
        <el-form-item label="组织名" :label-width="formLabelWidth">
          <el-input v-model="department.departmentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织简介" :label-width="formLabelWidth">
          <el-input v-model="department.departmentIntroduction" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-cascader
            placeholder="选择部门"
            :options="this.treeData.children"
            filterable
            :change-on-select="true"
            @change="selectDepartment"
          ></el-cascader>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancerAddDepartment">取 消</el-button>
        <el-button type="primary" @click="commitAddDepartment">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改组织 -->
    <el-dialog title="修改组织" :visible.sync="dialogTableVisible1">
      <el-form :model="department">
        <el-form-item label="组织名" :label-width="formLabelWidth">
          <el-input v-model="department.departmentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织简介" :label-width="formLabelWidth">
          <el-input v-model="department.departmentIntroduction" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-cascader
            ref="cascader"
            placeholder="试试搜索：工学院"
            :options="this.treeData.children"
            filterable
            change-on-select
            @change="selectDepartment"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commitEditDepartment('0')">取 消</el-button>
        <el-button type="primary" @click="commitEditDepartment('1')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";
import dragTreeTable from "drag-tree-table";
import { constants } from "crypto";
export default {
  name: "department",
  inject: ["reload"],
  data() {
    return {
      parentName: "",
      dialogTableVisible1: false,
      options: [],
      searchParam: "",
      formLabelWidth: "120px",
      dialogTableVisible: false,
      selectItem: {},
      loading: false,
      // selectDepartmentId: 0,
      selectParientId: 0, //父级部门id
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
        parent_id: 0,
        departmentIntroduction: ""
      }
      // newDepartment: {
      //   departmentName: "",
      //   instroduction: "",
      //   parent_id: 0
      // }
    };
  },
  components: {
    dragTreeTable
  },
  methods: {
    deepTraversal(list) {
      let nodes = [];
      let isInclude = false;
      let result = { isInclude: isInclude, nodes: nodes };
      if (list !== null) {
        for (let i = 0; i < list.length; i++) {
          let child = list[i];
          if (child.name == this.searchParam) {
            result.isInclude = true;
          }
          console.log(child);
          result.nodes.push(child);
          let isInclude = this.deepTraversal(child.children).isInclude;
          if (isInclude) {
            child.open = true;
            result.isInclude = true;
            console.log(child.name + "is true");
          } else {
            child.open = false;
          }
        }
      }
      return result;
    },
    search() {
      let result = this.deepTraversal(this.treeData.children);
      console.log(result);
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
      };
      this.treeData = { ...newTreeData };
    },

    getAllchildDepartments(department, childList) {
      if (department.children == null) {
        return;
      } else {
        let lists = department.children;
        for (let i = 0; i < lists.length; i++) {
          childList.push(lists[i]);
          this.getAllchildDepartments(lists[i], childList);
        }
      }
    },
    getDepartmentsTree() {
      this.loading = true;
      getRequest("/api/admin/getAllDepartments")
        .then(result => {
          if (result.data.code === 200) {
            this.treeData.children = result.data.data;
          } else {
            alert("获取失败");
          }
        })
        .catch(e => {
          console.log(e);
        });
        this.loading = false;
    },
    openChildList(node) {
      node.child = true;
    },
    onTreeDataChange(list) {
      this.$confirm("确认要移动该部门吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            console.log(list);
            this.treeData.children = list;
          }
        })
        .catch(err => {});
    },
    deleteDepatment(item) {
      this.$confirm("确认要删除该部门吗,下级部门也将会删除,谨慎操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            getRequest("/api/admin/delDepartmentById", {
              departmentId: item.id
            })
              .then(result => {
                if (result.data.code === 200) {
                  this.getDepartmentsTree;
                  this.reload();
                } else {
                  alert("获取失败");
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        })
        .catch(err => {});
      //  getRequest("/api/admin/getAllDepartments")
      //   .then(result => {
      //     if (result.data.code === 200) {
      //       this.treeData.children = result.data.data;
      //       console.log(this.treeData)
      //       console.log( this.treeData.children);

      //       // this.total = result.data.data.total;
      //     } else {
      //       alert("获取失败");
      //     }
      //   })
      //   .catch(e => {
      //     console.log(e);
      //   });
      console.log("删除", item);
    },

    /**
     * 打开编辑部门窗口
     * @param item 选中部门
     */
    showEditDialog(item) {
      console.log("修改", item);
      this.selectItem = item;
      this.dialogTableVisible1 = true;
      this.department.departmentName = item.name;
      this.department.departmentIntroduction = item.instroduction;
      this.department.id = item.id;
      this.department.parent_id = item.parent_id;
    },

    /**
     * 提交编辑部门
     * @param option 操作
     */
    commitEditDepartment(option) {
      if (option == 0) {
        let obj = {};
        obj.stopPropagation = () => {};
        this.$refs.cascader.clearValue(obj);
        this.selectParientId = 0;
      } else if (option == 1) {
        let childList = [];
        this.getAllchildDepartments(this.selectItem, childList);
        for (let i = 0; i < childList.length; i++) {
          if (childList[i].id == this.selectParientId) {
            this.$notify.error({
              title: "错误",
              message: "所属部门不能为下级部门"
            });
            return;
          }
        }
        if (this.department.id == this.selectParientId) {
          this.$notify.error({
            title: "错误",
            message: "所属部门不能为本部门"
          });
          return;
        }
        postJsonRequest("/api/admin/editDepartment", {
          name: this.department.departmentName,
          instroduction: this.department.departmentIntroduction,
          id: this.department.id,
          parent_id:
            this.selectParientId == 0
              ? this.department.parent_id
              : this.selectParientId
        })
          .then(result => {
            if (result.data.code === 200) {
              this.getDepartmentsTree;
              this.reload();
            } else {
              alert(result.data.msg);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
      this.dialogTableVisible1 = false;
      this.department = {
        departmentName: "",
        parent_id: 0,
        departmentIntroduction: ""
      };
    },

    // selectDepartment(data) {
    //   if (data != null && data.length > 0) {
    //     this.selectDepartmentId = data[data.length - 1];
    //     console.log(this.selectDepartmentId);
    //   }
    // },

    /**
     * 选择父部门
     */
    selectDepartment(data) {
      if (data != null && data.length > 0) {
        this.selectParientId = data[data.length - 1];
        console.log(this.selectParientId);
      }
    },

    getParentName(item) {
      if (item.parent_id == 0) {
        return item.name + "";
      } else {
        for (let i = 0; i < this.treeData.length; i++) {
          if (this.treeData[i].id == id) {
            this.parentName = this.parentName + this.treeData[i].name + "/";
          }
          return getParentName(item.parent_id) + this.parentName;
        }
      }
    },

    commitAddDepartment() {
      let a = typeof this.department.departmentName;
      console.log(a);
      if (
        this.department.departmentName == null ||
        this.department.departmentName.match(/^[ ]*$/)
      ) {
        this.$notify.error({
          title: "错误",
          message: "部门名字不能为空"
        });
      } else {
        postJsonRequest("/api/admin/addDepartment", {
          parent_id: this.selectParientId,
          name: this.department.departmentName,
          instroduction: this.department.departmentIntroduction
        })
          .then(result => {
            if (result.data.code === 200) {
              this.getDepartmentsTree;
              this.reload();
            } else {
              alert(result.data.msg);
            }
          })
          .catch(e => {
            console.log(e);
          });
        this.dialogTableVisible = false;
        this.department = {
          departmentName: "",
          departmentIntroduction: "",
          parent_id: 0
        };
      }
    },
    cancerAddDepartment() {
      this.dialogTableVisible = false;
      this.selectParientId = 0;
      this.department.departmentName = "";
      this.department.departmentIntroduction = "";
    },
    showAddDilog(item) {
      this.dialogTableVisible = true;
      if (item == null) {
      } else {
        this.selectParientId = item.id;
      }
    }
  },
  watch: {
    searchParam(val) {
      if (val != "") {
        this.searchParam = val;
        console.log(this.searchParam);
      }
    }
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
        align: "left",
        flex: 1,
        formatter: item => {
          return "<span>" + item.instroduction + "</span>";
        }
      },
      {
        title: "操作",
        type: "action",
        width: 150,
        align: "center",
        actions: [
          {
            text: "增加",
            onclick: this.showAddDilog,
            formatter: item => {
              return "<i style='color:rgb(103, 194, 58);font-size:20px;margin-right:10px' class='el-icon-lx-add'></i>";
            }
          },
          {
            text: "删除",
            onclick: this.deleteDepatment,
            formatter: item => {
              return "<i style='color:rgb(245, 108, 108);font-size:20px;margin-right:10px' class='el-icon-lx-deletefill'></i>";
            }
          },
          {
            text: "修改",
            onclick: this.showEditDialog,
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
.drag-tree-table-header {
  /* background-color: white; */
  border-top-width: 0;
  border: 1px solid rgb(238, 238, 238);
  border-top-width: 0;
  height: 40px !important;
  background: #fff !important;
  line-height: 40px;
  padding: 0 !important;
  color: rgb(144, 147, 153);
}
</style>


