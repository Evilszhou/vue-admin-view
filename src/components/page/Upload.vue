<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 文件上传
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="plugins-tips">将文件拖拽到此处</div>
      <el-upload class="upload-demo"  ref="upload" :data="table" 
      :headers="config"
      :file-list="fileList" drag :action="uploadFile" name="file" 
      :before-upload="beforeUpload" :on-success="success" :on-error="wrong" :auto-upload="false"
      :limit="1" :on-exceed="overNumber" >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">文件不能超过100M</div>
      </el-upload>
       <el-form :model="form" style="width:30%;position:fixed;top:260px;left:600px;height:200px">
    <!-- <el-form-item label="部门" :label-width="formLabelWidth">
     <el-select v-model="form.department" placeholder="请选择处事">
        <el-option label="行政部" value="行政部"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="处事" :label-width="formLabelWidth">
      <el-select v-model="form.region" placeholder="请选择处事">
        <el-option label="行政部" value="行政部"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item> -->
    <el-form-item label="类别:" :label-width="formLabelWidth">
       <!-- <el-select
    v-model="value"
    multiple
    filterable
    allow-create
    focus="popWindows"
    default-first-option
    placeholder="请选择文章标签">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select> -->
     <el-input readonly="true" style="width:300px" placeholder="请选择文件类型" v-model="value">
        
        
      </el-input>
      <el-button type="primary" style="margin-left:320px;margin-top:-32px;display: flex" @click="chooseType">选择类别</el-button>
    </el-form-item>
    <el-form-item label="文件编号:" :label-width="formLabelWidth">
      <el-input v-model="form.number" placeholder="请输入内容"></el-input>
    </el-form-item>
         <el-form-item label="文件页数:" :label-width="formLabelWidth">
           <el-input v-model="form.pageNum" placeholder="请输页数"></el-input>
         </el-form-item>
    <el-form-item label="日期:" :label-width="formLabelWidth">
      <el-date-picker
      v-model="form.date"
      type="date"
      placeholder="选择日期:">
    </el-date-picker>
    </el-form-item>
  </el-form>
      <el-row style="margin-top:30px" :gutter="20">
        <el-col :span="20">
          <label
            style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
          >标签:</label>
          <el-tag
            style="cursor:pointer"
            :key="tag"
            
            v-for="tag in form.tags"
            @click="chooseTag(tag)"
            :type="tag.type"
            :disable-transitions="true"
            @close="handleClose(tag)"
          >{{tag.tagName}}</el-tag>
          <el-input
            placeholder="请选择文件分类"
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-col>
        <el-col :span="4">
          <el-button
            style="float:right;"
            type="primary"
            @click="submit"
          >确定</el-button>
        </el-col>
      </el-row>
    </div>
          <el-dialog
        title="添加附件"
        :visible.sync="dialogVisible"
        width="40%">
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
          :on-success="uploadAnneixSuccess"
          multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false;this.$router.push('/document')">取 消</el-button>
          <el-button type="primary" @click="uploadAnneix">确 定</el-button>
        </span>
      </el-dialog>


      <el-dialog
  title="选择文本分类"
  :visible.sync="dialogVisible3"
  width="30%">
  <el-tree
  check-strictly
  ref="tree"
  :data="data"
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
</el-dialog>




  </div>
</template>

<script>
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import VueCropper from "vue-cropperjs";
import { fail } from "assert";
import { setTimeout } from "timers";
import moment from 'moment';
export default {
  name: "upload",
  inject: ["reload"],
  data: function() {
    return {
      data: [
        {
            "superId": 0,
            "children": [
                {
                    "superId": 19,
                    "children": null,
                    "list": null,
                    "id": 22,
                    "label": "表情包"
                },
                {
                    "superId": 19,
                    "children": [
                        {
                            "superId": 26,
                            "children": null,
                            "list": null,
                            "id": 27,
                            "label": "ppt素材"
                        }
                    ],
                    "list": null,
                    "id": 26,
                    "label": "透明素材"
                }
            ],
            "list": null,
            "id": 19,
            "label": "图片"
        },
        {
            "superId": 0,
            "children": null,
            "list": null,
            "id": 20,
            "label": "背景图"
        },
        {
            "superId": 0,
            "children": null,
            "list": null,
            "id": 21,
            "label": "风景图"
        }
    ],
      dialogVisible3:false,
      dialogVisible4:false,
      value: [],
      table: {
        department: "",
        region: "",
        type: "",
        date: "",
        number: "",
        tags: [],
        pageNum: ""
      },
      danger: "normal",
      dialogVisible: false,
      config: {
        token: localStorage.getItem("token")
      },
      annix: {
        file: localStorage.getItem("file")
      },
      args: {
        filename: ""
      },
      form: {
        department: "",
        region: "",
        type: "",
        date: "",
        number: "",
        tags: [],
        pageNum: ""
      },
      chooseTags: [],
      formLabelWidth: "120px",
      defaultSrc: require("../../assets/img/img.jpg"),
      fileList: [],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      dynamicTags: ["标签一"],
      inputVisible: false,
      inputValue: ""
    };
  },
  mounted() {
    // this.reload();
    console.log(this.tags);
    console.log(JSON.stringify(this.dynamicTags));
    // this.reload();
    this.getAllTags();
    this.getDocLabelsTree();
  },
  computed: {
    uploadFile:function(){
      let url = ""
      if(process.env.NODE_ENV === 'development'){
        url = "/api/uploadFile";
      }else{
        url = "/uploadFile";
      }
      return url;       
    },
    uploadsannex:function(){
      let url = "";
      if(process.env.NODE_ENV === 'development'){
        url = "/api/uploadannex";
      }else{
        url = "/uploadannex";
      }
      return url;
    }
  },
  components: {
    VueCropper
  },
 
  methods: {
    getDocLabelsTree() {
      let url = "";
      if(process.env.NODE_ENV === 'development'){
        url = "/api/public/getDocLabelsTree";
      }else{
        url = "/public/getDocLabelsTree";
      }       
      getRequest(url)
        .then(result => {
          if (result.data.code === 200) {
            this.data = result.data.data;
            console.log(this.data);
          } else {
            console.log(result.data.msg);
          }
        })
        .catch(e => {
          // this.loading = false;
          console.log(e);
        });
    },
    confimType(){
      this.value = [];
      let aKey = this.$refs.tree.getCheckedNodes();
      console.log(aKey)
      for(let i = 0;i < aKey.length;i++){
        this.value.push(aKey[i].label);
      }
      this.dialogVisible3 = false;
    },
    chooseType(){
      this.dialogVisible3 = true;

    },
    popWindows(){
      this.dialogVisible = true;
    },
    chooseTag(item) {
      console.log(item);
      if (item.type === "normal") {
        item.type = "danger";
      } else {
        item.type = "normal";
      }
    },
    wrong(err){
      console.log(err);

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
    getAllTags() {
      let _this = this;
      let url = "";
      if(process.env.NODE_ENV === 'development'){
        url = "/api/public/getAllTags";
      }else{
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
              _this.form.tags.push(obj);
            }
          }
        })
        .catch(err => {});
    },
    beforeUpload() {
      console.log(this.fileList);
    },
    open3(msg) {
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      });
    },
    success(res) {
      console.log(res)
      this.open6(res.msg)
      console.log(this.form.tags);
      if (res.code == 200) {
        this.open3(res.msg);
        localStorage.setItem("file", res.data);
        console.log(localStorage.getItem("file"));
        this.$confirm("要继续上传附件吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          showCancelButton:true
        })
          .then(result => {
            console.log(result)
            if (result == "confirm") {
              let _this = this;
              setTimeout(function() {
                _this.dialogVisible = true;
              }, 500);
              //  _this.reload();
            }
            
          })
          .catch(err => {
            console.log(err)
            let _this = this;
            if(err){
              _this.reload();
              setTimeout(function(){
                _this.$router.push("/document");
              },1000)
             
            }
          });
        
      } else {
      }
      //
    },
    overNumber() {
      this.$message.error("上传失败!!!");
    },
    setImage(e) {
      //   const file = e.target.files[0];
      //   if (!file.type.includes("image/")) {
      //     return;
      //   }
      //   const reader = new FileReader();
      //   reader.onload = event => {
      //     this.dialogVisible = true;
      //     this.imgSrc = event.target.result;
      //     this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
      //   };
      //   reader.readAsDataURL(file);
    },
    cropImage() {
      //   this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    open3(msg) {
      if(msg == undefined){
        msg = "上传附件成功!";
      }else{
        msg = "上传文件成功!"
      }
      this.$notify({
          title: '成功',
          message:msg,
          type: 'success'
        });
      },
    submit() {
      
      this.chooseTags = [];
      let tags = this.form.tags;
      let _this = this;
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].type == "danger") {
          _this.chooseTags.push(tags[i]);
        }
      }
      console.log(_this.chooseTags);
      console.log(_this.chooseTags.length);
      let names = [];
      let values = [];
      for (let i = 0; i < _this.chooseTags.length; i++) {
        names.push(_this.chooseTags[i].tagName);
      }

      for(let i = 0;i < _this.value.length;i++){
        values.push(_this.value[i]);
      }
      console.log("form:" + this.form.tags);
      let date = moment(this.form.date).format("YYYY-MM-DD HH:mm:ss")
      this.table.department = this.form.department;
      this.table.region = this.form.region;
      this.table.type = this.value;
      this.table.date = date;
      this.table.number = this.form.number;
      this.table.tags = names;
      this.table.pageNum = this.form.pageNum;
      console.log(this.table);
      console.log("this.table");
      this.$refs.upload.submit();
    },
    cancelCrop() {
      this.dialogVisible = false;
      this.cropImg = this.defaultSrc;
    },
    imageuploaded(res) {
      console.log(res);
    },
    handleError() {
      this.$notify.error({
        title: "上传失败",
        message: "图片上传接口上传失败，可更改为自己的服务器接口"
      });
    },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    uploadAnneix() {
      this.args.filename = localStorage.getItem("file");
      this.$refs.uploadannex.submit();
    },
    uploadAnneixSuccess() {
      
      this.open3();
      console.log(this.fileList);
      this.reload();
      this.dialogVisible = false;

     let _this = this;
     setTimeout(function(){
        _this.$router.push("/document")
     },1000)
     
      
      // this.reload();
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      let obj = {
        tagName: this.inputValue,
        type: "danger"
      };
      if (inputValue) {
        this.form.tags.push(obj);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  created() {
    // this.reload();
    this.cropImg = this.defaultSrc;
  },
  
};
</script>

<style scoped>
.el-upload-list el-upload-list--text{
  width: 100px !important;
}
.el-upload-list__item is-ready{
  width: 100px !important;
}
.el-upload-list__item-name{
  width: 100px !important;
}
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

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
</style>