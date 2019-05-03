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
                  <span>导航一</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
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
                <span slot="title">导航四</span>
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="20" style="padding:20px">
              <div class="document-search">
                  <el-row :gutter="20">
        <el-col :span="4"><el-input v-model="userName" placeholder="文件名"></el-input></el-col>
        <el-col :span="10">

    <el-date-picker
      v-model="time"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>

        </el-col>
        <el-col :span="4"><el-input v-model="opLabel" placeholder="操作类型"></el-input></el-col> 
        <el-col :span="3">
            <el-button type="primary" @click="getLogsBySearchParam">查询</el-button>
        </el-col>
      </el-row>
              </div>
              <div class="document-display">
                <ul>
                    <li v-for="item in items">
                         <svg class="icon" aria-hidden="true" size="30">
                            <use v-if="item.type=='txt'" xlink:href="#icon-txt"></use>
                            <use v-if="item.type=='xls'" xlink:href="#icon-file-xls"></use>
                            <!-- <use v-if="item.type=='txt'" xlink:href="#icon-file-xls"></use>
                            <use v-if="item.type=='txt'" xlink:href="#icon-file-xls"></use> -->
                        </svg>
                        <div>{{item.fileName}}</div>
                    </li>
                </ul>
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
  methods: {},
  watch: {},

  mounted() {},
  data() {
    return {
       items: [
      { fileName: 'Foo' ,type: 'txt' },
      { fileName: 'Bar' ,type: 'xls' }
    ]
    };
  }
};
</script>

<style>
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
    min-height: 410px;
    max-height: 430px;
}
.document-display li{
    /* border: 1px solid red; */
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
.icon {
    margin: 10px auto;
}
.icon:hover {
    transform: scale(1.5);
}

</style>


