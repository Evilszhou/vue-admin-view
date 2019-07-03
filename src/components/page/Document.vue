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
                      @node-click="nodeClick"
                check-strictly
                style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;  display: block;margin-top:10px"
                ref="tree"
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
                <span
                        @click="resetLabel"
                        style="cursor:pointer;display:inline-block;padding-left:19px;font-size:10px;font-weight:500;color:#409EFF;">重置选中</span>
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
                  <el-col :span="5" >
                      <div style="width:100px;height: 29px;line-height: 29px;">
                          <span style="color: #909399;font-size: 14px;">{{selectedLabel}}</span>
                      </div>
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
                        <span v-for="item in props.row.annexes" :key="item.annexId" style="margin-left:10px">
                          {{ item.annexName }}
                           <i class="el-icon-lx-down"  @click="downLoadAnnex(item)" style="margin-left:5px;margin-right:5px;color:blue;cursor:pointer" />
                           <i class="el-icon-lx-delete" @click="deleteAnnex(item)" style="margin-right:10px;color:red;cursor:pointer"></i>
                        </span>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" size="mini" @click="addAnnex(props.row)">添加附件</el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="docName" label="文件名" @click="perview(scope.row)">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px;cursor: pointer" @click="perview(scope.row)">{{ scope.row.docName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fileSourceName" label="文件来源"></el-table-column>
                <!--<el-table-column prop="docType" label="文件类型"></el-table-column>-->
                <el-table-column prop="departmentName" label="上传部门"></el-table-column>
                <el-table-column
                  prop="docPostTime"
                  sortable
                  :formatter="dateTimeFormat"
                  label="形成日期"
                ></el-table-column>
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button @click="download(scope.row)" size="mini" type="success">下载</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="openEditWindows(scope.row)"
                    >编辑</el-button>
                    <el-button size="mini" type="normal">打印</el-button>
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
                <span>是否将附件一同打包下载?</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="singledownload">否</el-button>
                  <el-button type="primary" @click="batchdownload">是</el-button>
                </span>
              </el-dialog>
              <el-dialog
              title="编辑"
              :visible.sync="dialogVisible2"
              @close="canelUpdate"
              width="50%">
              <el-form :model="editForm" label-width="120px">
                  <el-form-item label="文件名:">
                    <el-input v-model="editForm.docName" style="width:80%"></el-input>
                  </el-form-item>
                  <el-form-item v-model="editForm.department" label="上传部门" >
                     <el-cascader
                    :placeholder="editForm.departmentName"
                    :options="departments"
                    filterable
                    :change-on-select="true"
                    @change="selectDepartment"
                    clearable
                  ></el-cascader>
                  </el-form-item>
                  <el-form-item label="所属分类:" style="width:60%">
                     <el-input v-model="editForm.docLabelArrayList"  style="width:300px" placeholder="请选择文件类型"> 
                     </el-input> 
                  </el-form-item>
                  <el-button size="mini" style="margin-left:450px;margin-top:-50px;display:flex;height:32px" @click="choosetp">选择分类</el-button>
                  <el-form-item label="文件来源:" style="width:100%;margin-top:15px">
                     <el-select v-model="editForm.fileSourceName">
                      <el-option
                      style="width:300px"
                      v-for="item in fileSources"
                      :key="item.fileSourceId"
                      :value="item.source_name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="文件标签:" style="width:100%;margin-top:15px">
                      <el-tag
                        :type="tag.type"
                        :key="tag.tagName"
                        v-for="tag in editForm.dynamicTags"
                       @click="tipTag(tag)"
                        style="margin-left:10px;cursor:pointer"
                        @close="handleClose(tag)">
                        {{tag.tagName}}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                  </el-form-item>
                  
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="reupload" type="danger">重新上传</el-button>
                    <el-button @click="canelUpdate">取 消</el-button>
                    <el-button type="primary" @click="confimupdate">确 定</el-button>
                  </span>
                  </el-dialog>
                 <el-dialog
                  title="选择文本分类"
                  :visible.sync="dialogVisible3"
                  width="30%">
                  <el-tree
                  ref="tree"
                  :data="docLabelsTree"
                  show-checkbox
                  check-strictly
                  node-key="label"
                  default-expand-all
                  :default-checked-keys="defaultKey"
                  >
                </el-tree>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible3 = false">取 消</el-button>
                    <el-button type="primary" @click="confimType">确 定</el-button>
                  </span>
                </el-dialog>

<el-dialog title="添加附件" :visible.sync="dialogVisible4" width="40%">
   <el-upload
        :data="args"
        style="margin-left:100px"
          :headers="config"
          class="upload-demo"
          name="file"
          ref="uploadannex"
          drag
          :auto-upload="false"
          :action="uploadsannex"
          :on-success="upannex"
          multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="uploadAnneix">确 定</el-button>
        </span>
</el-dialog>

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
import pdf from "vue-pdf";
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";

export default {
  inject: ["reload"],
  components: {
    pdf
  },
  created() {},
  computed: {
    uploadsannex: function() {
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/uploadannex";
      } else {
        url = "/uploadannex";
      }
      return url;
    }
  },
  methods: {
    getAllFileSources(){
      let url = "";
      let _this = this;
      if (process.env.NODE_ENV === "development") {
        url = "/api/getAllFileSource";
      } else {
        url = "/getAllFileSource";
      }
      postRequest(url).then((result) => {
        console.log(result)
        this.fileSources = result.data.data
        console.log("---------------------------------------------------------------")
      }).catch((err) => {
        
      });
    },
    reupload(){
      console.log("重新上传");
      console.log(this.editForm);
      this.$router.push("/upload")
    },
    resetLabel() {
      this.reload();
    },
    nodeClick(node) {
      this.clickNode = [];
      this.getChildNodeList(node, this.clickNode);
      this.clickNode.push(node);
      console.log("clickNode");
      console.log(this.clickNode);
      this.search();
    },
    getChildNodeList(node, list) {
      this.selectedLabel = node.label;
      if (node.children == null) {
        list.push(node);
        return;
      }
      let children = node.children;
      for (let i = 0; i < children.length; i++) {
        this.getChildNodeList(children[i], list);
      }
    },
    canelUpdate() {
      console.log("haha");
      for (let i = 0; i < this.allTags.length; i++) {
        this.allTags[i].type = "normal";
      }
      this.dialogVisible2 = false;
    },
    tipTag(item) {
      console.log(item);
      if (item.type == "danger") {
        item.type = "normal";
      } else {
        item.type = "danger";
      }
    },
    confimupdate() {
      // this.editForm.tagArrayList = "非重要文件";
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/editDoc";
      } else {
        url = "/public/editDoc";
      }
      let tagList = "";
      for (let i = 0; i < this.editForm.dynamicTags.length; i++) {
        if (this.editForm.dynamicTags[i].type == "danger") {
          if (i < this.editForm.dynamicTags.length - 1) {
            tagList = tagList + this.editForm.dynamicTags[i].tagName + ",";
          } else {
            tagList = tagList + this.editForm.dynamicTags[i].tagName;
          }
        }
      }
      this.editForm.tagArrayList = tagList;
      console.log(this.editForm);
      let edit = {
        docId: this.editForm.docId,
        docName: this.editForm.docName,
        docSavePath: this.editForm.docSavePath,
        userId: this.editForm.userId,
        departmentName: this.editForm.departmentName,
        departmentId: this.editForm.departmentId,
        tagList: this.editForm.tagArrayList,
        suffixName: this.editForm.suffixName,
        docLabelList: this.editForm.docLabelArrayList,
        // fileSourceId:this.editForm.fileSourceId,
        fileSourceName:this.editForm.fileSourceName
      };
      console.log(edit);
      let _this = this;

      postJsonRequest(url, edit)
        .then(result => {
          console.log(result);
          if (result.data.code == 200) {
          }
          for (let i = 0; i < _this.allTags.length; i++) {
            _this.allTags[i].type = "normal";
          }
          // _this.dialogVisible2 = false;
        })
        .catch(err => {
          for (let i = 0; i < _this.allTags.length; i++) {
            _this.allTags[i].type = "normal";
          }
          _this.dialogVisible2 = false;
        });
      _this.dialogVisible2 = false;
      this.reload();
    },
    confimType() {
      let aKey = this.$refs.tree.getCheckedNodes();
      let types = "";
      for (let i = 0; i < aKey.length; i++) {
        if (i == aKey.length - 1) {
          types = types + aKey[i].label;
        } else {
          types = types + aKey[i].label + ",";
        }
      }
      this.editForm.docLabelArrayList = types;
      this.dialogVisible3 = false;
    },
    deleteAnnex(item) {
      console.log(item);
      this.$confirm("确认删除该附件吗?", "提示")
        .then(res => {
          if (res) {
            let url = "";
            if (process.env.NODE_ENV === "development") {
              url = "/api/public/deleteAnnex";
            } else {
              url = "/public/deleteAnnex";
            }
            postJsonRequest(url, item)
              .then(result => {
                if (result.data.code != 200) {
                  this.open6(result.data.msg);
                } else {
                  this.open3(result.data.msg);
                  this.reload();
                }
              })
              .catch(err => {});
          }
        })
        .catch(err => {});

      // if()
    },
    upannex(res) {
      // this.open3("添加附件成功!")
      console.log(res);
      if (res.code != 200) {
        this.open6(res.msg);
      } else {
        this.open3(res.msg);
      }
      this.reload();
    },
    uploadAnneix() {
      this.$refs.uploadannex.submit();
      this.dialogVisible4 = false;
    },
    addAnnex(item) {
      console.log(item);
      this.args.filename = item.docName;
      this.args.suffixName = item.suffixName;
      this.dialogVisible4 = true;
    },
    choosetp() {
      this.dialogVisible3 = true;
    },
    openEditWindows(row) {
      console.log(row);
      this.editForm.docId = row.docId;
      this.editForm.docName = row.docName;
      this.editForm.suffixName = row.suffixName;
      this.editForm.docSavePath = row.docSavePath;
      this.editForm.departmentName = row.departmentName;
      this.editForm.departmentId = row.departmentId;
      this.editForm.userId = row.userId;
      this.editForm.fileSourceName = row.fileSourceName;
      if (row.tagArrayList != null) {
        let tags = [];
        for (let i = 0; i < row.tagArrayList.length; i++) {
          let tagobj = {
            isuse: 1,
            tagId: row.tagArrayList[i].tagId,
            tagName: row.tagArrayList[i].tagName,
            type: "danger"
          };
          tags.push(tagobj);
        }
        this.editForm.dynamicTags = tags;
      } else {
        this.editForm.dynamicTags = [];
      }

      if (row.docLabelArrayList != null) {
        let labels = "";
        for (let i = 0; i < row.docLabelArrayList.length; i++) {
          if (i == row.docLabelArrayList.length - 1) {
            labels = labels + row.docLabelArrayList[i].label;
          } else {
            labels = labels + row.docLabelArrayList[i].label + ",";
          }
        }
        this.editForm.docLabelArrayList = labels;
      } else {
        this.editForm.docLabelArrayList = "";
      }

      if (row.docLabelArrayList != null) {
        for (let i = 0; i < row.docLabelArrayList.length; i++) {
          this.defaultKey.push(row.docLabelArrayList[i].label);
        }
      } else {
        this.defaultKey = [];
      }
      console.log(this.allTags_1);
      console.log(row.tagArrayList);
      let _this = this;
      let nums = [];
      if (row.tagArrayList != null) {
        for (let i = 0; i < row.tagArrayList.length; i++) {
          // console.log(row.tagArrayList[i].tagName)
          for (let j = 0; j < this.allTags_1.length; j++) {
            // console.log(row.tagArrayList[i].tagName == this.allTags_1[j].tagName)
            if (row.tagArrayList[i].tagName == this.allTags_1[j].tagName) {
              // this.allTags_1[i].type = "danger";
              console.log(j);
              nums.push(j);
            }
          }
          //   for (let j = 0; j < this.allTags_1.length; j++) {
          //     if (row.tagArrayList[i].tagName == _this.allTags_1[j].tagName) {
          //       _this.allTags_1[i].type = "danger";
          //     }
          //   }
        }
      }
      console.log(nums);
      for (let i = 0; i < this.allTags_1.length; i++) {
        for (let j = 0; j < nums.length; j++) {
          if (i == nums[j]) {
            this.allTags_1[i].type = "danger";
          }
        }
      }
      this.editForm.dynamicTags = this.allTags_1;
      this.dialogVisible2 = true;
    },
    getPagePermissions() {
      let _this = this;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getPagePermission";
      } else {
        url = "/public/getPagePermission";
      }
      postJsonRequest(url)
        .then(result => {
          console.log(result.data.data[0]);
          let str = result.data.data[0].pagePermission.split(";");
          let perstr = result.data.data[0].groupPermission.split(",");
          let i = 0;
          for (; i < perstr.length; i++) {
            if ("下载" == perstr[i]) {
              break;
            }
          }
          if (i <= perstr.length - 1) {
            this.isdownload = 1;
          } else {
            this.isdownload = 0;
          }
          console.log(str);
          str.push("login");
          str.push("403");
          str.push("测试");
          str.push("备份管理");
          console.log(str);
          localStorage.setItem("permissions", str);
        })
        .catch(err => {});
    },
    open3(msg) {
      if (msg == undefined) {
        msg = "这是一条成功的提示消息";
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
    getallUserGroup() {
      let _this = this;
      let url = "";
      let name = localStorage.getItem("username");
      if (process.env.NODE_ENV === "development") {
        url = "/api/getAllUserGroup";
      } else {
        url = "/getAllUserGroup";
      }
      postJsonRequest(url)
        .then(result => {
          console.log(result.data.data);
        })
        .catch(err => {});
    },
    batchdownload() {
      if (this.isdownload == 0) {
        this.open6("你没有此权限!");
        return;
      }
      console.log("单一");
      //  window.location.href = this.url;
      console.log(this.url.split("?"));
      let downloadUrl = "";
      if (process.env.NODE_ENV === "development") {
        downloadUrl = "/api/public/downloadZip";
      } else {
        downloadUrl = "/public/downloadZip";
      }
      let res = this.url.split("?");
      let url = downloadUrl + "?" + res[1];
      console.log(url);
      window.location.href = url;
      this.dialogVisible1 = false;
    },
    singledownload() {
      if (this.isdownload == 0) {
        this.open6("你没有此权限!");
        return;
      }
      console.log("批量");
      console.log(this.url);

      window.location.href = this.url;
      this.dialogVisible1 = false;
    },
    handlePreSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handlePreCurrentChange(val) {
      this.currentPage1 = val;
      window.scrollTo(0, 0);
    },
    loadPdfHandler() {
      this.currentPage1 = 1;
    },
    perview(node) {
      // this.$router.push("/test");s
      console.log(node);

      this.src = "";
      console.log(node.suffixName);
      let data = {
        FilePath: node.docSavePath
      };
      if (
        node.suffixName != ".docx" &&
        node.suffixName != ".xls" &&
        node.suffixName != ".xlsx" &&
        node.suffixName != ".doc" &&
        node.suffixName != ".jpg" &&
        node.suffixName != ".png" &&
        node.suffixName != ".pdf"
      ) {
        this.open6("该文件类型不支持预览!");
        return;
      }
      let getnameUrl = "";
      if (process.env.NODE_ENV === "development") {
        getnameUrl = "/api/getFileNameAndFilePath";
      } else {
        getnameUrl = "/getFileNameAndFilePath";
      }

      getRequest(getnameUrl, {
        fileName: node.docName + node.suffixName
      })
        .then(result => {})
        .catch(err => {});
      this.$confirm("确定要预览该文件吗?", "提示")
        .then(result => {
          if (result) {
            let url = "";
            if (process.env.NODE_ENV === "development") {
              url = "/api/public/preViewFile";
            } else {
              url = "/public/preViewFile";
            }
            postRequest(url, data)
              .then(result => {
                console.log(result);
                if (result.data.code != 200) {
                  this.open6(result.data.msg);
                } else {
                  console.log("dasdaas");
                  let file_name = node.docName;
                  console.log(file_name);
                  this.open3("正在打开预览文档,请稍后");
                  setTimeout(() => {
                    let url = "";
                    if (process.env.NODE_ENV === "development") {
                      url = "http://localhost:8082/";
                    } else {
                      url = "http://catoy.top:8082/";
                    }
                    window.open(
                      url +
                        "PDFShow/web/viewer.html?file=/pdfPreView?fileName=" +
                        file_name,
                      "_blank"
                    );
                  }, 1500);
                }
              })
              .catch(err => {});
          }
        })
        .catch(err => {});
    },
    getherf(row) {
      console.log(4444);

      return row.url;
    },
    downLoadFileAndAnnex(item) {
      let _this = this;
      console.log(item);
      postJsonRequest("/public/downloadFileAndAnnex", item)
        .then(result => {})
        .catch(err => {});
    },
    download(row) {
      this.dialogVisible1 = true;
      // console.log(row);
      // console.log(row.url);
      let url = row.url + "&token=" + localStorage.getItem("token");
      this.url = url;
      // console.log("url:"+url);
      // window.location.href = url;
    },
    selectDepartment(data) {
      console.log(data);
      let _this = this;
      if (data != null && data.length > 0) {
        this.selectDepartmentId = data[data.length - 1];
        console.log(this.selectDepartmentId);
        _this.editForm.departmentId = this.selectDepartmentId;
      }
    },
    toUploadPage() {
      this.$router.push({ path: "Upload" });
    },
    selectDocument(item) {
      // console.log(item);
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
      if (this.isdownload == 0) {
        this.open6("你没有此权限!");
        return;
      }
      console.log(item);
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/getName";
      } else {
        url = "/getName";
      }
      window.location.href =
        url +
        "?name=" +
        item.annexName +
        "&token=" +
        localStorage.getItem("token");
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
      let _this = this;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/deleteFile";
      } else {
        url = "/deleteFile";
      }
      this.$confirm("是否要删除该文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            postJsonRequest(url, row)
              .then(result => {
                console.log(result);
                if (result.data.code != 200) {
                  this.open6(result.data.msg);
                } else {
                  this.open3(result.data.msg);
                  this.reload();
                }
              })
              .catch(err => {});
          }
        })
        .catch(err => {});
    },
    handleOpen() {},
    handleClose(item) {
      this.editForm.dynamicTags.splice(this.dynamicTags.indexOf(item), 1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDocsBySearchParam();
    },
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
        console.log(this.tags.indexOf(item));
        for (let i = 0; i < this.tags.length; i++) {
          if (this.tags[i].tagId == item.tagId) {
            this.tags.splice(i, 1);
          }
        }
      }
      console.log(this.tags);
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      let obj = {
        type: "danger",
        tagName: inputValue,
        isuse: "",
        tagId: ""
      };
      if (inputValue) {
        this.editForm.dynamicTags.push(obj);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

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
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getDocsBySearchParam";
      } else {
        url = "/public/getDocsBySearchParam";
      }

      postJsonRequest(url, {
        pageInfo: { pageSize: this.pageSize, currentPage: this.currentPage },
        docLabels: this.clickNode,
        tags: this.tags,
        departmentId: this.selectDepartmentId,
        docName: this.docSearchName,
        selectYear: moment(this.selectYear).format("YYYY")
      })
        .then(result => {
          console.log(this.$refs.tree.getCheckedNodes());
          if (result.data.code === 200) {
            // this.tableData = result.data.data.list;
            let url = "";
            if (process.env.NODE_ENV === "development") {
              url = "/api/getName";
            } else {
              url = "/getName";
            }
            console.log(result.data.data);
            let table = [];
            for (let i = 0; i < result.data.data.list.length; i++) {
              let item = result.data.data.list[i];
              console.log(
                item.docName.substring(0, item.docName.lastIndexOf("."))
              );
              let tableobj = {
                annexes: item.annexes,
                departmentId: item.departmentId,
                departmentName: item.departmentName,
                docId: item.docId,
                docLabels: item.docLabels,
                docName: item.docName.substring(
                  0,
                  item.docName.lastIndexOf(".")
                ),
                docPostTime: item.docPostTime,
                docSavePath: item.docSavePath,
                suffixName: item.suffixName,
                userId: item.userId,
                url: url + "?name=" + item.docName,
                tagArrayList: item.tagArrayList,
                docLabelArrayList: item.docLabelArrayList,
                fileSourceName: item.fileSourceName,
                fileSourceId: item.fileSourceId
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
    getMyChildDepartments() {
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/admin/getMyChildDepartments";
      } else {
        url = "/admin/getMyChildDepartments";
      }
      getRequest(url)
        .then(result => {
          if (result.data.code === 200) {
            this.departments = result.data.data;
            console.log(JSON.stringify(this.departments));
          } else {
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          // this.loading = false;
          console.log(e);
        });
    },
    getDocLabelsTree() {
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getDocLabelsTree";
      } else {
        url = "/public/getDocLabelsTree";
      }
      getRequest(url)
        .then(result => {
          if (result.data.code === 200) {
            console.log(result.data);
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
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getAllTags";
      } else {
        url = "/public/getAllTags";
      }
      postJsonRequest(url)
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
              _this.allTags_1.push(obj);
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
    filterText(val) {
      console.log(val);
      this.$refs.tree.filter(val);
    },
    departs(val) {
      if (val != null && val.length == 0) {
        this.selectDepartmentId = -1;
      }
      // console.log(this.selectDepartmentId);
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
    this.getAllFileSources();
    // this.getallUserGroup();
    // this.getAllDocInfo();
  },
  data() {
    return {
      
      fileSources:[],
      defaultKey: [],
      inputVisible: false,
      inputValue: "",
      config: {
        token: localStorage.getItem("token")
      },
      args: {
        filename: "",
        suffixName: ""
      },
      isdownload: 1,
      loading: true,
      src: "",
      currentPage1: 1,
      pageCount: 0,
      url: "",
      editForm: {
        docId: "",
        docName: "",
        docSavePath: "",
        userId: "",
        departmentName: "",
        departmentId: "",
        tagList: "",
        suffixName: "",
        tagArrayList: "",
        docLabelArrayList: "",
        dynamicTags: ["标签一"],
        fileSourceName:""
      },
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
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
      allTags_1: [],
      tags: [],
      fitterItems: [],
      checkList: [],
      allCheckList: [],
      checkAll: false,
      isIndeterminate: true,
      time: [],
      docSearchName: "",
      defaultOpeneds: ["1"],
      docLabels: [],
      departments: [],
      clickNode: [],
      selectedLabel: ""
    };
  }
};
</script>

<style>
/* .el-tag + .el-tag {
  margin-left: 10px;
} */
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


