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
                            closable
                            @close="updateTag(tag)"
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
                            v-for="tag in tags1"
                            :key="tag.name"
                            size="mini"
                            style="height:25px;margin-right:5px;margin-bottom:4px;"
                            @click="updateTag(tag)"
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
import draggable from "vuedraggable";
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
export default {
  inject:['reload'],
  components: {
    draggable
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      dialogVisible: false,
      filterText: "",
      tags: [],
      tags1: [],
      num: 1,
      label: "",
      data: [
        {
          id: 1,
          label: "数据文件",
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
      defaultProps: {
        children: "children",
        label: "label"
      },
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style"
      },
      todo: [
        {
          id: 1,
          content: "开发图表组件"
        },
        {
          id: 2,
          content: "开发拖拽组件"
        },
        {
          id: 3,
          content: "开发权限测试组件"
        }
      ],
      doing: [
        {
          id: 1,
          content: "开发登录注册页面"
        },
        {
          id: 2,
          content: "开发头部组件"
        },
        {
          id: 3,
          content: "开发表格相关组件"
        },
        {
          id: 4,
          content: "开发表单相关组件"
        }
      ],
      done: [
        {
          id: 1,
          content: "初始化项目，生成工程目录，完成相关配置"
        },
        {
          id: 2,
          content: "开发项目整体框架"
        }
      ]
    };
  },

  methods: {
    removetag(){
      let _this = this;
     

    },
    getAllTags() {
      let _this = this;
      postJsonRequest("/api/public/getAllTags")
        .then(result => {
          for (let i = 0; i < result.data.data.length; i++) {
            
            let obj = {
              name: result.data.data[i].tagName,
              type: "success"
            };
            if (result.data.data[i].isuse == 1) {
              _this.tags.push(obj);
            } else {
              _this.tags1.push(obj);
            }
          }
        })
        .catch(err => {});
    },
    updateTag(item) {
      console.log(item);
      let obj = {
        tagName: item.name
      };
      postJsonRequest("/api/public/updateTag", obj)
        .then(result => {
            this.reload();
        })
        .catch(err => {});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>
            <i class="el-icon-lx-tag" style="margin-right:5px" />
            {node.label}
          </span>
          <span>
            <i
              class="el-icon-lx-roundclose"
              on-click={() => this.remove(node, data)}
            />
          </span>
        </span>
      );
    },
    move(item) {
      console.log(item);
      console.log(this.$refs.tree);
      this.label = item.name;
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].name === item.name) {
          this.tags.splice(i, 1);
        }
      }
      this.appendchild();
    },
    appendchild() {
      // console.log("this:"+lael);
      console.log(this.label);
      const newChild = { id: this.num++, label: this.label, children: [] };
      // if (!this.data.children) {
      //   this.$set(data, 'children', []);
      // }
      this.data.push(newChild);
    },
    remove(node, data) {
      this.$confirm("确认要删除该标签吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(result => {
          if (result == "confirm") {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          } else {
          }
        })
        .catch(err => {});
    },
    removeHandle(event) {
      console.log(event);
      this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
    },
    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    }
  },
  mounted() {
    this.getAllTags();
  }
};
</script>

<style>
.name {
  height: 25px !important;
  margin-right: 5px !important;
  margin-bottom: 4px !important;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree {
  background-color: #eff1f5;
}
.drag-box {
  display: flex;
  user-select: none;
}
.container .drag-box-item {
  flex: 1;
  max-width: 330px;
  min-width: 300px;
  background-color: #eff1f5;
  margin-right: 16px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}
.item-title {
  padding: 8px 8px 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}
.item-ul {
  padding: 0 8px 8px;
  height: 500px;
  overflow-y: scroll;
}
.item-ul::-webkit-scrollbar {
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
  -webkit-transition: border 0.3s ease-in;
  transition: border 0.3s ease-in;
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
.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed;
}
</style>


