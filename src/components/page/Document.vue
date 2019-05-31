<template>
  <div class="document">
    <!-- 顶部页签开始 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 文件管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="document-content">
      <div class="document-content-card">
        <el-row class="tac">
          <!-- 左侧菜单开始 -->
          <el-col :span="5">
            <div class="drag-box-item">
              <el-input class="el" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              <el-tree
                style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;  display: block;margin-top:10px"
                ref="tree"
                show-checkbox
                class="mulu"
                default-expand-all
                :data="docLabelsTree"
                node-key="id"
                :filter-node-method="filterNode"
              >
                <span class="span-ellipsis" slot-scope="{ node }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-col>
          <!-- 左侧菜单结束 -->

          <!-- 右侧文件展示开始 -->
          <el-col :span="19" style="padding:20px;padding-left:0px">
            <!-- 顶部条件搜索区开始 -->
            <div class="document-search">
              <el-row :gutter="25" class="document-search-label">
                <ul>
                  <el-tag
                    style="cursor:pointer"
                    :key="tag.tagId"
                    v-for="tag in allTags"
                    @click="chooseTag(tag)"
                    :type="tag.type"
                    :disable-transitions="true"
                    @close="handleClose(tag)"
                  >{{tag.tagName}}</el-tag>
                </ul>
              </el-row>
              <el-row :gutter="25" class="document-search-multipleConditions">
                <el-col :span="4">
                  <el-input v-model="docSearchName" placeholder="文件名"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-cascader
                    v-model="departs"
                    placeholder="输入部门"
                    :options="departments"
                    filterable
                    :change-on-select="true"
                    @change="selectDepartment"
                    clearable
                  ></el-cascader>
                </el-col>
                <el-col :span="7">
                  <el-date-picker v-model="selectYear" type="year" placeholder="选择年"></el-date-picker>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="search">查询</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- 顶部条件搜索区结束 -->

            <!-- 文件展示区开始 -->
            <div class="document-display">
              <el-table
                v-loading="loading"
                :data="tableData"
                stripe
                style="width: 100%;margin-top:10px"
                :row-class-name="tableRowClassName"
              >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="附件:">
                        <span v-for="item in props.row.annexes" :key="item.annexId">
                          {{ item.annexName }}
                          <el-button
                            type="primary"
                            size="mini"
                            style="margin-right:25px;margin-left:25px"
                            @click="downLoadAnnex(item)"
                          >下载</el-button>
                        </span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="docName" label="文件名"></el-table-column>
                <el-table-column prop="docNumber" label="文件标号"></el-table-column>
                <!--<el-table-column prop="docType" label="文件类型"></el-table-column>-->
                <el-table-column prop="departmentName" label="所属部门"></el-table-column>
                <el-table-column
                  prop="docPostTime"
                  sortable
                  :formatter="dateTimeFormat"
                  label="发文日期"
                ></el-table-column>
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button @click="download(scope.row)" size="mini" type="success">下载</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="openEditWindows(scope.row)"
                    >编辑</el-button>
                    <el-button size="mini" @click="perview(scope.row)" type="normal">预览</el-button>
                    <el-button size="mini" type="danger" @click="delDoc(scope.$index, scope.row)">删除</el-button>
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

              <el-dialog
                title="预览"
                :visible.sync="dialogVisible"
                width="50%"
                style="height:100%;">
                 <el-pagination
                style="margin-left:20%;margin-top:-10px"
              @size-change="handlePreSizeChange"
              @current-change="handlePreCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="1"
              layout="total, prev, pager, next"
              :total="pageCount">
            </el-pagination>
                <pdf :src="src" v-loading = "loading"  :page = "currentPage1" style="width:90%;height:30%;margin:0 auto;margin-top:20px" @loaded="loadPdfHandler" @num-pages = "pageCount = $event"></pdf>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>


              <el-dialog
                title="提示"
                :visible.sync="dialogVisible1"
                width="30%"
                >
                <span>是否选择下载文件及附件?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="singledownload">取 消</el-button>
                  <el-button type="primary" @click="batchdownload">确 定</el-button>
                </span>
              </el-dialog>


              <el-dialog
              title="编辑"
              :visible.sync="dialogVisible2"
              width="50%">
              <el-form :model="editForm" label-width="120px">
                  <el-form-item label="文件名:">
                    <el-input v-model="editForm.filename" style="width:80%"></el-input>
                  </el-form-item>
                  <el-form-item v-model="editForm.department" label="所属部门" >
                     <el-cascader
                    placeholder="输入部门"
                    :options="departments"
                    filterable
                    :change-on-select="true"
                    @change="selectDepartment"
                    clearable
                  ></el-cascader>
                  </el-form-item>
                  <el-form-item label="所属分类" style="width:60%">
                    <!-- <el-input readonly="true" style="width:300px" placeholder="请选择文件类型" v-model="value"> -->
                    <!-- </el-input> -->
                  </el-form-item>
                  <el-button size="mini" style="margin-left:450px;margin-top:-50px;display:flex;height:32px" @click="choosetp">选择分类</el-button>
              </el-form>
              </el-dialog>


                 <!-- <el-dialog
  title="选择文本分类"
  :visible.sync="dialogVisible3"
  width="30%"
  :before-close="handleClose">
  <el-tree
  ref="tree"
  :data="docLabelsTree"
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="[5]"
  :props="defaultProps">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible3 = false">取 消</el-button>
    <el-button type="primary" @click="confimType">确 定</el-button>
  </span>
</el-dialog> -->

              <!-- <el-checkbox
                class="document-display-checkAll"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  class="document-display-item"
                  v-for="item in fitterItems"
                  :key="item.id"
                  :label="item.id"
                >
                  <div @click="selectDocument(item)">
                    <svg class="icon" aria-hidden="true" size="30">
                      <use v-if="item.type=='txt'" xlink:href="#icon-txt"></use>
                      <use v-if="item.type=='xls'" xlink:href="#icon-xls"></use>
                      <use v-if="item.type=='pdf'" xlink:href="#icon-Pdf"></use>
                      <use v-if="item.type=='ppt'" xlink:href="#icon-ppt2"></use>
                      <use v-if="item.type=='word'" xlink:href="#icon-WORD"></use>
                      <use v-if="item.type=='img'" xlink:href="#icon-tupian"></use>
                      <use v-if="item.type=='compressDoc'" xlink:href="#icon-tupian"></use>
                    </svg>
                  </div>
                  <div class="document-display-fileName">{{item.fileName}}</div>
                </el-checkbox>
              </el-checkbox-group>-->
            </div>
            <!-- 文件展示区结束 -->
            <!-- <div
              class="document-fileInfo"
              style="margin-top:20px;border-left:7px solid lightgray;padding-left:15px;color: rgb(129, 129, 129);position:relative"
              :selectDocumentInfo="selectDocumentInfo"
            >
              <svg
                class="icon"
                style="font-size:15px;position:absolute;right:50px;bottom:-11px"
                aria-hidden="true"
              >
                <use xlink:href="#icon-drxx07"></use>
              </svg>
              <div style="float:left;width:50%">
                <div style="font-family: 'PingFang SC';">
                  <label style="margin-right: 20px;line-height: 1.7;">文档名字:</label>
                  <span style>{{selectDocumentInfo.fileName}}</span>
                </div>
                <div>
                  <label
                    style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                  >上传人员:</label>
                  <span style>{{selectDocumentInfo.userName}}</span>
                </div>
              </div>
              <div style="float:left;width:50%">
                <div>
                  <label
                    style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                  >文档类型:</label>
                  <span style>{{selectDocumentInfo.type}}</span>
                </div>
                <div>
                  <label
                    style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                  >上传时间:</label>
                  <span style>{{selectDocumentInfo.time}}</span>
                </div>
              </div>

              <div style="padding-top:50px">
                <label
                  style="font-family: 'PingFang SC';font-size: 16px;margin-right: 45px;line-height: 1.7;color: rgb(129, 129, 129)"
                >标签:</label>
                <el-tag
                  style="margin-right:10px"
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="true"
                  @close="openMessageBox('是否删除标签',tag)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </div>
            </div>-->
            <!-- 右侧文件展示结束 -->
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 中间内容结束 -->
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";

export default {
  components: {
    pdf
  },
  created() {
    var headers = {
      Authorization: "Bearer SOME_TOKEN",
      "x-ipp-device-uuid": "SOME_UUID",
      "x-ipp-client": "SOME_ID",
      "x-ipp-client-version": "SOME_VERSION"
    };
    var loadingTask = pdf.createLoadingTask({
      url: this.src,
      httpHeaders: headers
    });
    this.src = pdf.createLoadingTask(this.src);
  },
  methods: {
    choosetp(){
      this.dialogVisible3 = true;

    },
    openEditWindows(row){
      console.log(row);
      this.dialogVisible2 = true;
    },
     getPagePermissions(){
       let _this = this;
       postJsonRequest("/api/public/getPagePermission").then((result) => {
        //  console.log(result)
        //  console.log(result.data.data[0].pagePermission);
         let str = result.data.data[0].pagePermission.split(";");
         console.log(str)
         str.push("login");
         str.push("403")
         console.log(str+"-----------------------------------------------------------------------------------------");
         localStorage.setItem("permissions",str);
        //  console.log(typeof result.data.data[0].pagePermission)
        //  console.log(result.data.data[0].pagePermission.splice(";"))
        //  let permissions = result.data.data[0].pagePermission.splice(";")
        //  console.log(permissions)

       }).catch((err) => {

       });
     },
     open3(msg) {
      if(msg == undefined){
        msg = '这是一条成功的提示消息';
      }
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      });
    },
    open6(msg) {
      if (msg == undefined) {
        msg = "这是一条错误的提示消息";
      }
      this.$notify.error({
        title: "错误",
        message: msg
      });
    },
    batchdownload(){
      console.log("单一")
      //  window.location.href = this.url;
      console.log(this.url.split("?"))
      let res = this.url.split("?");
      let url = "/api/public/downloadZip?"+ res[1];
      console.log(url);
      window.location.href = url;
      this.dialogVisible1 = false;
    },
    singledownload(){
      console.log("批量");
      console.log(this.url)
      window.location.href = this.url;
      this.dialogVisible1 = false;
    },
    handlePreSizeChange(val){
        console.log(`每页 ${val} 条`);
    },
    handlePreCurrentChange(val){

        this.currentPage1 = val;
        window.scrollTo(0,0);
    },
      loadPdfHandler(){
          this.currentPage1 = 1;

      },
    perview(node){
      // this.$router.push("/test");

      this.src = "";
      console.log(node);
      let data = {
        FilePath:node.docSavePath
      }
      // if(node.suffixName != ".docx" || node.suffixName!=".xls" || node.suffixName != ".doc" || node.suffixName != ".ppt" || node.suffixName != ".pptx" || node.suffixName != ".jpg" || node.suffixName != ".png"){
      //   this.open6("该文件类型不支持预览!");
      //   return;
      // }
      postRequest("/api/public/preViewFile",data).then((result) => {
       if(result.data.code == 0){
          this.open6(result.data.msg);
        }

        let url = "/file/"+result.data.data.substring(result.data.data.lastIndexOf('\\')+1)
        this.src = url;
        let _this = this;
        // if(result.data.code != 200){
        //   this.dialogVisible =false;
        //   _this.open6(result.data.msg);

        // }
        // this.open6("你没有权限!")
        this.loading = false;
        // console.log(result.data.data.substring(result.data.data.lastIndexOf('/')))
      }).catch((err) => {

      });
      this.dialogVisible = true;
      window.scrollTo(0,0);
    },
    getherf(row){
      console.log(4444)
    
      return row.url;

    },
    downLoadFileAndAnnex(item){
      let _this = this;
      console.log(item);
      postJsonRequest("/api/public/downloadFileAndAnnex",item).then((result) => {
        
      }).catch((err) => {
        
      });
    },
    download(row) {
     this.dialogVisible1 = true;
            // console.log(row);
            // console.log(row.url);
            let url = row.url + "&token="+localStorage.getItem("token");
            this.url = url;
            // console.log("url:"+url);
            // window.location.href = url;

    },
    selectDepartment(data) {
      if (data != null && data.length > 0) {
        this.selectDepartmentId = data[data.length - 1];
        console.log(this.selectDepartmentId);
      }
    },
    toUploadPage() {
      this.$router.push({ path: "Upload" });
    },
    selectDocument(item) {
      console.log(item);
      this.selectDocumentInfo = item;
      this.dynamicTags = this.selectDocumentInfo.tags;
      this.checkfileList.push(item);
      console.log("list:" + JSON.stringify(this.checkfileList));
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.allCheckList : [];
      this.isIndeterminate = false;
    },
    downLoadAnnex(item) {
      console.log(item);
      window.location.href = "/api/getName?name="+item.annexName + "&token="+localStorage.getItem("token");
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 4 === 1) {
        return "warning-row";
      } else if (rowIndex % 4 === 3) {
        return "success-row";
      }
      return "";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    delDoc(index, row) {
      this.$confirm("是否要删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            this.$notify.success({
              title: "提示",
              message: "文件删除成功"
            });
            console.log(row);
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].docId == row.docId) {
                this.tableData.splice(i, 1);
              }
            }
          }
        })
        .catch(err => {});
    },
    handleOpen() {},
    handleClose() {},
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDocsBySearchParam();
    },
    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    // },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
      chooseTag(item) {
          console.log(item);
          if (item.type === "normal") {
              item.type = "danger";
              this.tags.push(item);
          } else {
              item.type = "normal";
              console.log(this.tags.indexOf(item))
              for(let i=0;i<this.tags.length;i++){
                  if(this.tags[i].tagId == item.tagId){
                      this.tags.splice(i,1);
                  }
              }

          }
          console.log(this.tags)
      },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // fitterDoc(type) {
    //   this.checkList = [];
    //   let item = this.items;
    //   let newItem = [];
    //   if (type == "") {
    //     this.fitterItems = this.items;
    //   } else {
    //     for (let i = 0; i < item.length; i++) {
    //       if (item[i].type == type) {
    //         newItem.push(item[i]);
    //       }
    //     }
    //     this.fitterItems = newItem;
    //   }
    // },
    dateTimeFormat(row, column, cellValue, index) {
      let date = cellValue;
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
    search() {
      this.handleCurrentChange(1);
    },
    getDocsBySearchParam() {
      this.loading = true;

      postJsonRequest("/api/public/getDocsBySearchParam", {
        pageInfo: { pageSize: this.pageSize, currentPage: this.currentPage },
        docLabels: this.$refs.tree.getCheckedNodes(),
        tags: this.tags,
        departmentId: this.selectDepartmentId,
        docName: this.docSearchName,
        selectYear: moment(this.selectYear).format("YYYY")
      })
        .then(result => {
          if (result.data.code === 200) {
            // this.tableData = result.data.data.list;
            console.log(result.data.data);
            let table = [];
            for (let i = 0; i < result.data.data.list.length; i++) {
              let item = result.data.data.list[i];
              let tableobj = {
                annexes: item.annexes,
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                docId: item.docId,
                docLabels: item.docLabels,
                docName: item.docName,
                docPostTime: item.docPostTime,
                docSavePath: item.docSavePath,
                suffixName: item.suffixName,
                userId: item.userId,
                url: "/api/getName?name=" + item.docName
              };
              table.push(tableobj);
              console.log("table:" + table);
            }
            this.tableData = table;
            console.log(this.tableData);

            // console.log(this.tableData);
            this.total = result.data.data.total;
            this.loading = false;
          } else {
            this.loading = false;
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });

      console.log(this.currentPage + "currentPage");
    },
    getAllDocInfo() {
      this.loading = true;
      getRequest("/api/public/getAllDocInfo", {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })
        .then(result => {
          if (result.data.code === 200) {
            // this.tableData = result.data.data.list;
            console.log(result.data.data);
            let table = [];
            for (let i = 0; i < result.data.data.list.length; i++) {
              let item = result.data.data.list[i];
              let tableobj = {
                annexes: item.annexes,
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                docId: item.docId,
                docLabels: item.docLabels,
                docName: item.docName,
                docPostTime: item.docLabels,
                docSavePath: item.docSavePath,
                suffixName: item.suffixName,
                userId: item.userId,
                url: "/api/getName?name=" + item.docName + "&token"
              };
              table.push(tableobj);
             
            }
            this.tableData = table;
         
            this.total = result.data.data.total;
            this.loading = false;
          } else {
            this.loading = false;
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          this.loading = false;
          console.log(e);
        });
    },
    getMyChildDepartments() {
      getRequest("/api/admin/getMyChildDepartments")
        .then(result => {
          if (result.data.code === 200) {
            this.departments = result.data.data;
            console.log(JSON.stringify(this.departments));
          } else {
            // this.loading = false;
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          // this.loading = false;
          console.log(e);
        });
    },
    getDocLabelsTree() {
      getRequest("/api/public/getDocLabelsTree")
        .then(result => {
          if (result.data.code === 200) {
            this.docLabelsTree = result.data.data;
            console.log(this.docLabelsTree);
          } else {
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          // this.loading = false;
          console.log(e);
        });
    },
    getAllTags() {
      let _this = this;
      postJsonRequest("/api/public/getAllTags")
        .then(result => {
          console.log(result);
          for (let i = 0; i < result.data.data.length; i++) {
            if (result.data.data[i].isuse == 1) {
              let obj = {
                type: "normal",
                isuse: result.data.data[i].isuse,
                tagName: result.data.data[i].tagName,
                tagId: result.data.data[i].tagId
              };
              _this.allTags.push(obj);
            }
          }
          console.log(this.tags);
          console.log("this.tags");
        })
        .catch(err => {});
    },
    openMessageBox(title, label) {
      this.$confirm(title, "是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dynamicTags.splice(this.dynamicTags.indexOf(label), 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },

  watch: {
    docSearchName(val) {
      if (val != "") {
        this.docSearchName = val;
        console.log("docSearchName" + this.docSearchName);
      }
    },

    filterText(val) {
      console.log(val);
      this.$refs.tree.filter(val);
    },
    departs(val) {
      if (val != null && val.length == 0) {
        this.selectDepartmentId = -1;
      }
      console.log(this.selectDepartmentId);
      console.log("this.selectDepartmentId");
    }
  },

  mounted() {
    // this.fitterItems = this.items;
    // for (let i = 0; i < this.items.length; i++) {
    //   this.allCheckList.push(this.items[i].id);
    // }
    this.getAllTags();
    this.getDocLabelsTree();
    this.getMyChildDepartments();
    this.getDocsBySearchParam();
    this.getPagePermissions();
    // this.getAllDocInfo();
  },
  data() {
    return {
      loading:true,
      src:"",
      currentPage1:1,
      pageCount:0,
      url:"",
      editForm:{
        filename:""

      },
      dialogVisible: false,
      dialogVisible1:false,
      dialogVisible2:false,
      dialogVisible3:false,
      departs: [],
      displayMode: "0", //展示模式0:列表模式1:图标模式
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      selectYear: "",
      filterText: "",
      pageSize: 7,
      currentPage: 1,
      total: 0,
      selectDepartmentId: -1,
      loading: false,
      tableData: [],
      docLabelsTree: [],
      allTags: [],
      tags: [],
      fitterItems: [],
      checkList: [],
      allCheckList: [],
      // selectDocumentInfo: {
      //   id: "2",
      //   fileName: "部门综测",
      //   type: "xls",
      //   tags: [],
      //   userName: "",
      //   time: "2019-05-08"
      // },
      checkAll: false,
      isIndeterminate: true,
      time: [],
      docSearchName: "",
      defaultOpeneds: ["1"],
      docLabels: [],
      departments: []
    };
  }
};
</script>

<style>
/* .el-tag + .el-tag {
  margin-left: 10px;
} */
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.document {
  width: 100%;
  position: relative;
}
.document-content {
  position: relative;
  background-color: #fff;
  width: 100%;
  /* min-height: 480px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.tac {
  min-height: 510px;
  margin-bottom: 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.document-content-card {
  position: absolute;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 95%;
}
.document-search {
  /* border: 1px solid red; */
  height: 90px;
}
.document-search .el-tag {
  margin-right: 9px;
}
.document-search-label {
  /* border: 1px solid black; */
  height: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.document-search-label ul {
  padding-left: 13px;
  padding-right: 13px;
}
.document-search-label li {
  margin-top: 5px;
  list-style: none;
}
.document-search-multipleConditions {
  margin-top: 15px;
  /* border: 1px solid yellow;   */
}
.document-display {
  border: 2px solid rgb(246, 246, 246);
  /* background: rgb(246, 246, 246); */
  border-radius: 5px;
  /* margin-top: 20px; */
  /* overflow-y: scroll; */
  min-height: 372px;
  /* max-height: 634px; */
}
.document-display-checkAll {
  margin-left: 30px;
  margin-top: 20px;
}
.document-display-item {
  /* border: 1px solid red; */
  padding-top: 15px;
  float: left;
  margin-left: 50px;
  margin-bottom: 50px;
  list-style: none;
  /* vertical-align: top; */
  font-size: 12px;
  /* letter-spacing: normal; */
  /* word-spacing: normal; */
  /* line-height: inherit; */
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  /* margin-right: 25px; */
  text-align: center;
  /* list-style: none !important; */
  cursor: pointer;
}
.document-display-fileName {
  /* border: 1px solid red; */
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.icon {
  margin: 10px auto;
}
.icon:hover {
  transform: scale(1.5);
}
.el-submenu .el-menu-item {
  min-width: 100px;
}
.drag-box-item {
  flex: 1;
  max-width: 412px;
  /* min-width: 159px; */
  margin-right: 16px;
  border-right: 2px rgb(246, 246, 246) solid;
  overflow: hidden;
  padding: 10px;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>


