<template>
<section class="main">
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 标签管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title">标签目录</div>
                    <el-input
                    class="el"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText">
                    </el-input>
                    <el-tree
                    style="margin-top:10px"
                        ref="tree"
                        class="tree"
                        :data="data"
                        node-key="id"
                        default-expand-all
                        @node-drag-start="handleDragStart"
                        @node-drag-enter="handleDragEnter"
                        @node-drag-leave="handleDragLeave"
                        @node-drag-over="handleDragOver"
                        @node-drag-end="handleDragEnd"
                        @node-drop="handleDrop"
                        draggable
                        :filter-node-method="filterNode"
                         :render-content="renderContent"
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag">
                    </el-tree>
                </div>
                <div class="drag-box-item">
                    <div class="item-title">待管理标签</div>
                    <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="doing" class="item-ul">
                            <el-tag
                            class="name"
                            v-for="tag in tags"
                            :key="tag.name"
                            size="mini"
                            @click="move(tag)"
                            closable
                            :type="tag.type">
                            {{tag.name}}
                            </el-tag>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item">
                    <div class="item-title">废弃标签</div>
                    <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="doing" class="item-ul">
                            <el-tag
                            v-for="tag in tags"
                            :key="tag.name"
                            size="mini"
                            style="height:25px;margin-right:5px;margin-bottom:4px;"
                            @click="move(tag)"
                            closable
                            :type="tag.type">
                            {{tag.name}}
                            </el-tag>
                        </transition-group>
                    </draggable>
                </div>
               
            </div>
        </div>
 

    </div>
</section>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    components:{
            draggable
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data(){
        return{
            dialogVisible:false,
            filterText: '',
            tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'success' },
          { name: '标签三', type: 'info' },
          { name: '标签四', type: 'warning' },
          { name: '标签五', type: 'danger' }
        ],
            num:1,
            label:"",
            data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
            dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [
                    {
                        id: 1,
                        content: '开发图表组件'
                    },
                    {
                        id: 2,
                        content: '开发拖拽组件'
                    },
                    {
                        id: 3,
                        content: '开发权限测试组件'
                    }
                ],
                doing: [
                    {
                        id: 1,
                        content: '开发登录注册页面'
                    },
                    {
                        id: 2,
                        content: '开发头部组件'
                    },
                    {
                        id: 3,
                        content: '开发表格相关组件'
                    },
                    {
                        id: 4,
                        content: '开发表单相关组件'
                    }
                ],
                done:[
                    {
                        id: 1,
                        content: '初始化项目，生成工程目录，完成相关配置'
                    },
                    {
                        id: 2,
                        content: '开发项目整体框架'
                    }
                ]

        }
    },
    methods:{
        filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      renderContent(h,{node,data,store}){
          return(
             <span class="custom-tree-node">
            <span><i class="el-icon-lx-tag" style="margin-right:5px"></i>{node.label}</span>
            <span>
               <i class="el-icon-lx-roundclose" on-click={() => this.remove(node, data)}></i>
            </span>
          </span>
          );

      }
      ,
        move(item){
            console.log(item);
            console.log(this.$refs.tree);
            this.label = item.name;
            for(let i = 0;i < this.tags.length;i++){
                if(this.tags[i].name === item.name){
                    this.tags.splice(i,1);
                }
            }
            this.appendchild();

        },
        appendchild(){
            // console.log("this:"+lael);
            console.log(this.label);
            const newChild = { id: this.num++, label: this.label, children: [] };
        // if (!this.data.children) {
        //   this.$set(data, 'children', []);
        // }
        this.data.push(newChild);

        },
         remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
         removeHandle(event){
                console.log(event); 
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
         },
        handleDragStart(node, ev) {
            console.log('drag start', node);

        },
        handleDragEnter(draggingNode, dropNode, ev) {
            console.log('tree drag enter: ', dropNode.label);
        },
        handleDragLeave(draggingNode, dropNode, ev) {
            console.log('tree drag leave: ', dropNode.label);
        },
        handleDragOver(draggingNode, dropNode, ev) {
            console.log('tree drag over: ', dropNode.label);
            
        },
        handleDragEnd(draggingNode, dropNode, dropType, ev) {
            console.log('tree drag end: ', dropNode && dropNode.label, dropType);
        },
        handleDrop(draggingNode, dropNode, dropType, ev) {
            console.log('tree drop: ', dropNode.label, dropType);
        },
        allowDrop(draggingNode, dropNode, type) {
            if (dropNode.data.label === '二级 3-1') {
            return type !== 'inner';
            } else {
            return true;
            }
        },
        allowDrag(draggingNode) {
            return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
        }
    },
    mounted(){

    }
    
}
</script>

<style>
.name{
    height:25px !important;
    margin-right:5px !important;
    margin-bottom:4px !important;
}
.custom-tree-node{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.el-input.el{
    width:200px;
    margin-left: 100px;
    margin-top:-30px;
    display: flex;
    /* height: 30px; */
    line-height: 20px;
}

.tree{
    background-color: #eff1f5;
}
 .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        max-width: 330px;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>


