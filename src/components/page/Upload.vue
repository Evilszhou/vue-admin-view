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
      <el-upload class="upload-demo"  ref="upload" :data="form" 
      :headers="config"
      :file-list="fileList" drag action="/api/uploadFile" name="file" 
      :before-upload="beforeUpload" :on-success="success" :auto-upload="false"
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
    <el-form-item label="类别" :label-width="formLabelWidth">
      <el-select v-model="form.type" placeholder="请选择类别">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="序号" :label-width="formLabelWidth">
      <el-input v-model="form.number" placeholder="请输入内容"></el-input>
    </el-form-item>
    <el-form-item label="日期" :label-width="formLabelWidth">
      <el-date-picker
      v-model="form.date"
      type="date"
      placeholder="选择日期">
    </el-date-picker>



    </el-form-item>
  </el-form>
      <el-row style="margin-top:30px" :gutter="20">
        <el-col :span="20">
          <label
            style="font-family: 'PingFang SC';font-size: 16px;margin-right: 20px;line-height: 1.7;color: rgb(129, 129, 129)"
          >标签:</label>
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
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
          action="/api/uploadannex"
          :on-success="uploadAnneixSuccess"
          multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadAnneix">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import { fail } from 'assert';
import { setTimeout } from 'timers';
export default {
  name: "upload",
  data: function() {
    return {
      dialogVisible:false,
      config:{
        token:localStorage.getItem("token")
      },
      annix:{
        file:localStorage.getItem("file")
      },
      args:{
        filename:""

      },
        form: {
          department:"",
          region:"",
          type:"",
          date:"",
          number:"",
          tags:['表歉意','dada']
        },
        formLabelWidth: '120px',
      defaultSrc: require("../../assets/img/img.jpg"),
      fileList:[],
      imgSrc: "",
      cropImg: "",
      dialogVisible: false,
      dynamicTags: ["标签一"],
      inputVisible: false,
      inputValue: ""
    };
  },
  mounted(){
    console.log(this.tags)
    console.log(JSON.stringify(this.dynamicTags))
  },
  computed:{
    getTags(){
      let tags = this.dynamicTags;
      let result = "";
      for(let i = 0;i < tags.length;i++){

      }
      return resul+"=da";
    }
  },
  components: {
    VueCropper
  },
  methods: {
    beforeUpload(){
      console.log(this.fileList);

    },
     open3(msg) {
        this.$notify({
          title: '成功',
          message:msg,
          type: 'success'
        });
      },
    success(res){
      console.log(this.form.tags)
      if(res.code == 200){
       this.open3(res.msg); 
       localStorage.setItem("file",res.data);
       console.log(localStorage.getItem("file"))
       this.$confirm('要继续上传附件吗?',"提示",{
         confirmButtonText:'确定',
         cancelButtonText:"取消"
       }).then((result) => {
         if(result == "confirm"){
           let _this = this;
           setTimeout(function(){
             _this.dialogVisible = true;
           },500)
         }
         
       }).catch((err) => {
         
       });
       
      }else{

      }
    },
    overNumber(){
      this.$message.error('上传失败!!!');
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
    submit(){
      this.$refs.upload.submit();
      console.log(this.fileList);

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
    uploadAnneix(){
      this.args.filename = localStorage.getItem("file");
      this.$refs.uploadannex.submit();
    },
    uploadAnneixSuccess(){

      console.log("dasdasda");
      this.dialogVisible = false;

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
        this.form.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  created() {
    this.cropImg = this.defaultSrc;
  }
};
</script>

<style scoped>
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