<template>
   
    <div class="container">
     <el-tree
  :data="data"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]"
  :props="defaultProps">
</el-tree>


 <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
    <el-select v-model="select" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>

    </div>
</template>
<script>
import {
  postJsonRequest,
  postRequest,
  getRequest,
  downloadFile
} from "../../main.js";
export default {
  data() {
    return {
        tags:["标签一"],
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

          
        value: [],
          selectedOptions2: [],
      val: "",
      checkList: ["选中且禁用", "复选框 A"],
      labels: [{ label: "复选框" }, { label: "复选框2" }],
     
      props: {
        value: "label",
        children: "cities"
      }
    };
  },
  mounted() {
    // this.getTopDepartment();
  },
  methods: {
        handleChange(value) {
        console.log(value);
      }
  }
};
</script>

<style scoped>
.tag{
    width: 100px !important;
}
</style>


