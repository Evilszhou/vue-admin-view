<template>
    <div class="container">
       <el-cascader
        :options="options"
        change-on-select
        ></el-cascader>
        <el-checkbox-group v-model="checkList" v-for="item in labels" :key="item"  >
            <el-checkbox :label=item.label></el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>
  import {postJsonRequest,postRequest,getRequest} from '../../main.js';
  export default {
    data() {
      return {
        val:"",
        checkList: ['选中且禁用','复选框 A'],
        labels:[{label:"复选框"},{label:"复选框2"}],
        options: [{
            label:"dasas",
         id: 14,
name: "办公室",
parent_id: 1,
instroduction: "负责组织起草市政府的文件、工作报告和领导讲话，以及市政府领导交办的其它文字综合材料",
sort: 0,
children: null
        }, {
          label: '浙江',
          cities: []
        }],
        props: {
          value: 'label',
          children: 'cities'
        }
      };
    },
    mounted(){
        this.getTopDepartment();
     
    },
    methods: {
      getTopDepartment(){
          let _this = this;
          getRequest("/api/admin/getAllDepartments").then((result) => {
            //   console.log(result);
              console.log(result.data.data);
            //   _this.options = result.data.data
              
          }).catch((err) => {
              
          });

      },
      getVal(val){
          console.log(val);
      },
      handleItemChange(val) {
        console.log(this.val);
        console.log('active item:', val);
        console.log(val[0])
        setTimeout(_ => {
          if (val.indexOf('江苏') > -1 && !this.options[0].cities.length) {
            this.options[0].cities = [{
              label: '南京',
              cities:[{
                  label:'南京区'
              }]
            }];
          } else if (val.indexOf('浙江') > -1 && !this.options[1].cities.length) {
            this.options[1].cities = [{
              label: '杭州'
            }];
          }
        }, 300);
      },
      serverArray(arr,lastLaboratory_id){
            var newArr = []
            for(var item = 0;item < arr.length;item++){
                if(arr[item]['parent_id']==lastLaboratory_id){
                    newArr.push(arr[item].children)
                    if(arr[item].children&&arr[item].children.length > 0){
                        newArr.push(this.serverArrayChild(arr[item].children)) //把所有子集筛选出来
                    }
                }else if(arr[item].children){
                        newArr.push(this.serverArray(arr[item].children,lastLaboratory_id)) //没有子集重新递归查找下一级
                    }
            }
            return newArr
        },
        serverArrayChild(arr) {
            var newArr = []
            for(var item = 0;item < arr.length;item++){
                newArr.push(arr[item]['parent_id'])
                if(arr[item].children&&arr[item].children.length > 0){
                    newArr.push(this.serverArrayChild(arr[item].children)) //用递归把所有子集筛选出来
                }
            }
            return newArr
        },
        selectVal(val){
            console.log(val);
             setTimeout(_ => {
                if (val.indexOf('江苏') > -1 && !this.options[0].cities.length) {
                    this.options[0].cities = [{
                    label: '南京'
                    }];
                } else if (val.indexOf('浙江') > -1 && !this.options[1].cities.length) {
                    this.options[1].cities = [{
                    label: '杭州'
                    }];
                }
                }, 300);

        }
    }
  };
</script>

<style scoped>

</style>


