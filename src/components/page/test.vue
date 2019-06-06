<template>
    <div class="container">
      <el-button><a href="http://localhost:8082/index.html?name=http://localhost:8082/S1_方案概要.pdf" class="target"  target="_blank">测试 </a></el-button>
    </div>
</template>
<script>
import {
  postJsonRequest,
  postRequest,
  getRequest,
  downloadFile
} from "../../main.js";
import pdf from 'vue-pdf';
export default {
  components:{
      pdf
  },
  data() {
    return {
        src:"/file/S2_%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.pdf",
        currentPage1:1,
        pageCount:0,
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
  created(){
      var headers = {
        'Authorization': 'Bearer SOME_TOKEN',
        'x-ipp-device-uuid': 'SOME_UUID',
        'x-ipp-client': 'SOME_ID',
        'x-ipp-client-version': 'SOME_VERSION'
};
var loadingTask = pdf.createLoadingTask({

    url:this.src,
    httpHeaders:headers

});
      this.src = pdf.createLoadingTask(this.src)
  },
  mounted() {
      let  _this = this;
      setTimeout(function(){
       console.log(_this.pageCount);
      },500)
      
    // this.getTopDepartment();
  },
  methods: {
      go(){
        let target = this.$refs.target;
        target.setAttribute("href","http://localhost:8082/index.html");
        target.click();
        //   window.open(newpage.href,'_blank');
      },
      loadPdfHandler(){
          this.currentPage1 = 1;

      },
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage1 = val;
      },
      download(){
          window.location.href = "/api/getName?name=demo.pptx"
      },
      downloadFile(){
          console.log(344334)
          let _this = this;
          downloadFile("/api/getName",{
              name:"ff.png"
          }).then((result) => {
              let data = result.data;
              if(!data){
                  return;
              }

              const blob = new Blob([data]);
          }).catch((err) => {
              
          });
      },
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


