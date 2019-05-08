<template>
  <div class="document">
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
          <el-col :span="4">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>文件分类</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="fitterDoc('txt')">txt文档</el-menu-item>
                  <el-menu-item index="1-2">word文档</el-menu-item>
                  <el-menu-item index="1-3">excel文档</el-menu-item>
                  <el-menu-item index="1-4">pdf文档</el-menu-item>
                  <el-menu-item index="1-5">ppt文档</el-menu-item>
                  <el-menu-item index="1-6">图片文档</el-menu-item>
                  <el-menu-item index="1-7">压缩文档</el-menu-item>
                </el-menu-item-group>

              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
                <i class="el-icon-document"></i>
                <span slot="title">导航三</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
              <el-menu-item index="6">
                <i class="el-icon-setting"></i>
                <span slot="title">导航四</span>
              </el-menu-item>
              <el-menu-item index="7">
                <i class="el-icon-setting"></i>
                <span @click="toUploadPage" slot="title">上传文件</span>
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="20" style="padding:20px">
            <div class="document-search">
              <el-row :gutter="20">
                <el-col :span="4">
                  <el-input placeholder="文件名"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="操作类型"></el-input>
                </el-col>
                <el-col :span="3">
                  <!-- <el-button type="primary" @click="getLogsBySearchParam">查询</el-button> -->
                </el-col>
                <el-col :span="1">
                  <svg class="icon" style="margin:0;font-size:10px" aria-hidden="true">
                    <use xlink:href="#icon-drxx07"></use>
                  </svg>
                </el-col>
              </el-row>
            </div>
            <div class="document-display">
              <el-checkbox
                class="document-display-checkAll"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  class="document-display-item"
                  v-for="item in items"
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
                    </svg>
                  </div>
                  <div class="document-display-fileName">{{item.fileName}}</div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div
              class="document-fileInfo"
              style="margin-top:20px;;border-left:7px solid lightgray;padding-left:15px; "
              :selectDocumentInfo="selectDocumentInfo"
            >
              <div>
                <label
                  style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129);"
                >文档ID:</label>
                <span style="font-size:14px">{{selectDocumentInfo.id}}</span>
              </div>
              <div>
                <label
                  style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                >文档名字:</label>
                <span style>{{selectDocumentInfo.fileName}}</span>
              </div>
              <div>
                <label
                  style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                >文档类型:</label>
                <span style>{{selectDocumentInfo.type}}</span>
              </div>
              <div>
                <label
                  style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
                >标签:</label>
                <el-tag
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="true"
                  @close="handleClose(tag)"
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
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";

export default {
  methods: {
    toUploadPage() {
      this.$router.push({path:'Upload'});
    },
    selectDocument(item) {
      console.log(item);
      this.selectDocumentInfo = item;
      this.dynamicTags = this.selectDocumentInfo.tags;

      // for(let i = 0 ;i < )
      // for(let obj in docList){
      //   if(docList[obj].id == id){
      //     console.log('id:'+id)
      //     this.selectDocumentInfo = obj;
      //     console.log(this.selectDocumentInfo)
      //   }
      // }
    },
    handleCheckAllChange() {},
    handleOpen() {},
    handleClose() {},

    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    fitterDoc(type){
      let item = this.items;
      console.log("changdu"+item.length);
      let num = item.length;
      for(let i=0;i<item.length;i++){


        if(this.items[i].type != type){
          // console.log("第"+i);

          console.log( item.splice(i,1))
        }
      }
      console.log(this.items.length);
    }
  },
  watch: {},

  mounted() {},
  data() {
    return {
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      items: [
        {
          id: "1",
          fileName: "2019-2020综测文件",
          type: "txt",
          tags: ["须立即", "高富帅"]
        },
        { id: "2", fileName: "部门综测", type: "xls", tags: ["hahaah"] },
        {
          id: "3",
          fileName: "期末学院考试通知",
          type: "ppt",
          tags: ["1111", "222"]
        },
        { id: "4", fileName: "Bar", type: "pdf", tags: ["534", "5443"] },
        { id: "5", fileName: "Foo", type: "txt", tags: ["00"] },
        { id: "6", fileName: "期末学院考试通知", type: "xls", tags: ["1ee"] },
        { id: "7", fileName: "期末学院考试通知", type: "ppt", tags: ["e98"] },
        { id: "8", fileName: "Bar", type: "word", tags: ["e5e"] },
        {
          id: "9",
          fileName: "Bwerwer23423423234werar",
          type: "img",
          tags: ["eee"]
        }
      ],
      checkList: ["1", "3"],
      selectDocumentInfo: {
        id: "2",
        fileName: "部门综测",
        type: "xls",
        tags: []
      },
      checkAll: false,
      isIndeterminate: true,
      time: []
    };
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
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
  height: 60px;
}
.document-display {
  border: 2px solid rgb(246, 246, 246);
  /* background: rgb(246, 246, 246); */
  border-radius: 5px;
  /* margin-top: 20px; */
  overflow-y: scroll;
  min-height: 295px;
  max-height: 310px;
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
</style>


