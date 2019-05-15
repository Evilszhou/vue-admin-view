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
    <!-- 顶部页签结束 -->

    <!-- 中间内容开始 -->
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
                class="mulu"
                :data="data"
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
                  <li style="float:left">
                    <el-tag>标签一</el-tag>
                  </li>
                </ul>
              </el-row>
              <el-row :gutter="25" class="document-search-multipleConditions">
                <el-col :span="4">
                  <el-input v-model="docSearchName" placeholder="文件名"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-cascader
                    placeholder="输入部门"
                    :options="departments"
                    filterable
                    change-on-select
                  ></el-cascader>
                </el-col>
                <el-col :span="7">
                  <el-date-picker v-model="selectYear" type="year" placeholder="选择年"></el-date-picker>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="getDocsBySearchParam">查询</el-button>
                </el-col>
              </el-row>
            </div>
            <!-- 顶部条件搜索区结束 -->

            <!-- 文件展示区开始 -->
            <div class="document-display">
              <el-table
                :data="tableData"
                stripe
                style="width: 100%;margin-top:10px"
                :row-class-name="tableRowClassName"
              >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品名称">
                        <span>{{ props.row.name }}</span>
                      </el-form-item>
                      <el-form-item label="所属店铺">
                        <span>{{ props.row.shop }}</span>
                      </el-form-item>
                      <el-form-item label="商品 ID">
                        <span>{{ props.row.id }}</span>
                      </el-form-item>
                      <el-form-item label="店铺 ID">
                        <span>{{ props.row.shopId }}</span>
                      </el-form-item>
                      <el-form-item label="商品分类">
                        <span>{{ props.row.category }}</span>
                      </el-form-item>
                      <el-form-item label="店铺地址">
                        <span>{{ props.row.address }}</span>
                      </el-form-item>
                      <el-form-item label="商品描述">
                        <span>{{ props.row.desc }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="docName" label="文件编号" width="180"></el-table-column>
                <el-table-column prop="docName" label="操作者"></el-table-column>
                <el-table-column prop="docName" label="操作记录"></el-table-column>
                <el-table-column prop="docName" sortable :formatter="dateTimeFormat" label="操作日期"></el-table-column>
                <el-table-column prop="opLabel" label="操作类型">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  background
                  @current-change="handleCurrentChange"
                  layout="prev, pager, next"
                  :page-size="10"
                  :total="total"
                ></el-pagination>
              </div>
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
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import moment from "moment";
import { isNull } from "util";

export default {
  methods: {
    download() {
      console.log(this.checkfileList);
      postRequest("/api/downLoadFile", {
        docs: JSON.stringify(this.checkfileList)
      })
        .then(result => {
          console.log(result);
        })
        .catch(err => {});
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
    handleOpen() {},
    handleClose() {},

    // handleClose(tag) {
    //   this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    // },

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
    fitterDoc(type) {
      this.checkList = [];
      let item = this.items;
      let newItem = [];
      if (type == "") {
        this.fitterItems = this.items;
      } else {
        for (let i = 0; i < item.length; i++) {
          if (item[i].type == type) {
            newItem.push(item[i]);
          }
        }
        this.fitterItems = newItem;
      }
    },
    dateTimeFormat(row, column, cellValue, index) {
      let date = cellValue;
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getDocsBySearchParam() {
      this.checkList = [];
      let item = this.fitterItems;
      let newItem = [];
      if (this.docSearchName == "") {
        // this.fitterItems = this.items;
      } else {
        for (let i = 0; i < item.length; i++) {
          if (item[i].fileName.indexOf(this.docSearchName) != -1) {
            newItem.push(item[i]);
          }
        }
        this.fitterItems = newItem;
        this.docSearchName = "";
      }
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
    }
  },

  mounted() {
    this.fitterItems = this.items;
    for (let i = 0; i < this.items.length; i++) {
      this.allCheckList.push(this.items[i].id);
    }
  },
  data() {
    return {
      displayMode: "0", //展示模式0:列表模式1:图标模式
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",
      selectYear: "",
      filterText: "",
      tableData: [
        {
          docName: "高凸嫖历险记",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          docName: "高凸嫖历险记",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          docName: "高凸嫖历险记",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          docName: "高凸嫖历险记",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      data: [
        {
          id: 1,
          label: "数据文件hadfasdasdasdasdhah",
          children: [
            {
              id: 4,
              label: "报表",
              children: [
                {
                  id: 9,
                  label: "财务报表"
                },
                {
                  id: 10,
                  label: "公司财政"
                },
                {
                  id: 11,
                  label: "人员流动表"
                },
                {
                  id: 12,
                  label: "图片"
                }
              ]
            },
            {
              id: 14,
              label: "合同",
              children: [
                {
                  id: 15,
                  label: "财务合同"
                },
                {
                  id: 16,
                  label: "商务合同"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "图片",
          children: [
            {
              id: 5,
              label: "Basic"
            },
            {
              id: 6,
              label: "Form"
            },
            {
              id: 7,
              label: "Data"
            }
          ]
        },
        {
          id: 3,
          label: "表格表单",
          children: [
            {
              id: 7,
              label: "Axure Components"
            },
            {
              id: 8,
              label: "Sketch Templates"
            },
            {
              id: 15,
              label: "组件交互文档"
            }
          ]
        }
      ],
      items: [
        {
          id: "1",
          fileName: "2019-2020综测文件",
          type: "txt",
          tags: ["须立即", "高富帅"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "2",
          fileName: "部门综测",
          type: "xls",
          tags: ["hahaah"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "3",
          fileName: "期末学院考试通知",
          type: "ppt",
          tags: ["1111", "222"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "4",
          fileName: "Bar",
          type: "pdf",
          tags: ["534", "5443"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "5",
          fileName: "Foo",
          type: "txt",
          tags: ["00"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "6",
          fileName: "期末学院考试通知",
          type: "xls",
          tags: ["1ee"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "7",
          fileName: "期末学院考试通知",
          type: "ppt",
          tags: ["e98"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "8",
          fileName: "Bar",
          type: "word",
          tags: ["e5e"],
          userName: "小高",
          time: "2019-05-08"
        },
        {
          id: "9",
          fileName: "Bwerwer23423423234werar",
          type: "img",
          tags: ["eee"],
          userName: "小高",
          time: "2019-05-08"
        }
      ],
      fitterItems: [],
      checkList: [],
      allCheckList: [],
      selectDocumentInfo: {
        id: "2",
        fileName: "部门综测",
        type: "xls",
        tags: [],
        userName: "",
        time: "2019-05-08"
      },
      checkAll: false,
      isIndeterminate: true,
      time: [],
      docSearchName: "",
      defaultOpeneds: ["1"],
      docLabels: [
        {
          value: "shujuwenjian",
          label: "数据文件",
          children: [
            {
              value: "shejiyuanze",
              label: "报表",
              children: [
                {
                  value: "yizhi",
                  label: "财务报表"
                },
                {
                  value: "fankui",
                  label: "公司财政"
                },
                {
                  value: "xiaolv",
                  label: "人员流动表"
                },
                {
                  value: "kekong",
                  label: "进货表"
                }
              ]
            },
            {
              value: "daohang",
              label: "合同",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "财务合同"
                },
                {
                  value: "dingbudaohang",
                  label: "商务合同"
                }
              ]
            }
          ]
        },
        {
          value: "tupian",
          label: "图片",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "biaogebiaodan",
          label: "表格表单",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],

      departments: [
        {
          value: "bangongshi",
          label: "办公室",
          children: [
            {
              value: "shejiyuanze",
              label: "办公室一"
            },
            {
              value: "daohang",
              label: "办公室二"
            }
          ]
        },
        {
          value: "zonghechu",
          label: "综合处",
          children: [
            {
              value: "axure",
              label: "综合处一"
            },
            {
              value: "sketch",
              label: "综合处二"
            },
            {
              value: "jiaohu",
              label: "综合处三"
            }
          ]
        },
        {
          value: "renjiaochu",
          label: "人教处",
          children: [
            {
              value: "axure",
              label: "人教处一"
            },
            {
              value: "sketch",
              label: "人教处二"
            },
            {
              value: "jiaohu",
              label: "人教处三"
            }
          ]
        }
      ]
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


