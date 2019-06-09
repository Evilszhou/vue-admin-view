<template>
  <section class="main">
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i> 标签管理
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <div class="drag-box">
          <div class="drag-box-item" style="margin-left:20px">
            <div class="item-title" style="width:200px">分类目录</div>
            <el-button
              type="primary"
              size="mini"            
              style="display:flex;height:25px;float:right;margin-top:-20px;margin-right:5px"
              @click="dialogVisible = true"
            >增加分类</el-button>
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
              :allow-drag="allowDrag"
            ></el-tree>
          </div>
          <div style="margin-left:100px;">
            <div class="drag-box-item" style="max-width:900px;height:200px">
              <div class="item-title">可用标签</div>
              <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                <transition-group tag="div" id="doing" class="item-ul">
                  <el-tag
                    class="name"
                    v-for="tag in tags"
                    :key="tag.name"
                    size="mini"
                    closable
                    @close="updateTag(tag,0)"
                    :type="tag.type"
                  >{{tag.name}}</el-tag>
                </transition-group>
              </draggable>
            </div>
            <div class="drag-box-item" style="max-width:700px;height:200px;margin-top:30px">
              <div class="item-title">废弃标签</div>
              <draggable v-model="doing" @remove="removeHandle" :options="dragOptions">
                <transition-group tag="div" id="doing" class="item-ul">
                  <el-tag
                    v-for="tag in tags1"
                    :key="tag.name"
                    size="mini"
                    style="height:25px;margin-right:5px;margin-bottom:4px;"
                    @click="updateTag(tag,1)"
                    :type="tag.type"
                  >{{tag.name}}</el-tag>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <el-dialog title="新增分类" :visible.sync="dialogVisible" style="margin-top:100px" width="30%">
          <el-form :model="form" label-width="80px">
            <el-form-item label="分类名:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRootLabel">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="新增分类" :visible.sync="dialogVisible1" style="margin-top:100px" width="30%">
          <el-form :model="form" label-width="80px">
            <el-form-item label="分类名:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="addLabel">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="dialogVisible2" width="30%">
          <el-form :model="editform" label-width="80px">
            <el-form-item label="分类名:">
              <el-input v-model="editform.name"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="confimUpdate">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </section>
</template>

<script>
import draggable from "vuedraggable";
import { postJsonRequest, postRequest, getRequest } from "../../main.js";
import { messages } from '../common/i18n';
export default {
  inject: ["reload"],
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
      type: "",
      docLabelsTree: [],
      form: {
        name: ""
      },
      editform: {
        name: "",
        type: ""
      },
      nodeValue: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      filterText: "",
      tags: [],
      tags1: [],
      num: 1,
      label: "",
      data: [
        {
          superId: 0,
          children: [
            {
              superId: 19,
              children: null,
              list: null,
              id: 22,
              label: "表情包"
            },
            {
              superId: 19,
              children: [
                {
                  superId: 26,
                  children: null,
                  list: null,
                  id: 27,
                  label: "ppt素材"
                }
              ],
              list: null,
              id: 26,
              label: "透明素材"
            }
          ],
          list: null,
          id: 19,
          label: "图片"
        },
        {
          superId: 0,
          children: null,
          list: null,
          id: 20,
          label: "背景图"
        },
        {
          superId: 0,
          children: null,
          list: null,
          id: 21,
          label: "风景图"
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
    };
  },

  methods: {
    confimUpdate() {
      let _this = this;
      let node = {
        id: this.nodeValue.id,
        label: this.editform.name,
        superId: this.nodeValue.superId
      };
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/updateLabels";
      } else {
        url = "/public/updateLabels";
      }

      postJsonRequest("/api/public/updateLabels", node)
        .then(result => {
          if (result.data.code != 200) {
            this.$notify.error({
              title: "错误",
              message: result.data.msg
            });
          } else {
            this.reload();
            this.$notify.success({
              title: "成功",
              message: result.data.msg
            });
          }
        })
        .catch(err => {});
    },
    addLabel(node, data) {
      console.log(this.form.name);
      let _this = this;
      let node1 = {
        label: this.form.name,
        superId: this.nodeValue.id
      };
      console.log(node1);
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/updateLabels";
      } else {
        url = "/public/updateLabels";
      }
      postJsonRequest(url, node1)
        .then(result => {
          console.log(result);
          if (result.data.code != 200) {
            this.$notify.error({
              title: "错误",
              message: result.data.msg
            });
          } else if (result.data.code == 200) {
            this.reload();
            this.$notify.success({
              title: "成功",
              message: result.data.msg
            });
          }
        })
        .catch(err => {});
      this.dialogVisible1 = false;
    },
    addRootLabel() {
      console.log(this.form.name);
      let _this = this;
      let node = {
        label: this.form.name,
        superId: 0
      };
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/addLabels";
      } else {
        url = "/public/addLabels";
      }
      postJsonRequest(url, node)
        .then(result => {
          console.log(result);
          if (result.data.code != 200) {
            this.$notify.error({
              title: "错误",
              message: result.data.msg
            });
          } else if (result.data.code == 200) {
            this.reload();
            this.$notify.success({
              title: "成功",
              message: result.data.msg
            });
          }
        })
        .catch(err => {});
      this.dialogVisible = false;
    },
    open3(msg) {
      if (msg == undefined) {
        msg = "这是一条成功的提示消息";
      }
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      });
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
    addTag(node) {
      console.log(node);
      console.log(node.data);
    },
    getDocLabelsTree() {
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getDocLabelsTree";
      } else {
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
    removetag() {
      let _this = this;
    },
    getAllTags() {
      let _this = this;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/getAllTags";
      } else {
        url = "/public/getAllTags";
      }
      postJsonRequest(url)
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
    updateTag(item,flag) {
      let url = "";
      let message = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/updateTag";
      } else {
        url = "/public/updateTag";
      }
      if(flag == 0){
        message = "是否将标签改为废弃标签"
      }else{
        message = "是否将标签改为可用标签"
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(result => {
          if (result == "confirm") {
            console.log(item);
            let obj = {
              tagName: item.name
            };
            postJsonRequest(url, obj)
              .then(result => {
                this.reload();
                this.$notify.success({
                  title: "提示",
                  message: result.data.msg
                });
              })
              .catch(err => {});
          }
        })
        .catch(err => {});
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNode(node, data) {
      console.log(data);
      this.nodeValue = data;
      this.dialogVisible1 = true;
    },
    getEditNode(node, data) {
      console.log(data);
      this.nodeValue = data;
      this.editform.name = this.nodeValue.label;
      this.dialogVisible2 = true;
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
              class="el-icon-lx-roundadd"
              on-click={() => this.getNode(node, data)}
              style="margin-right:2px"
            />
            <i
              class="el-icon-lx-edit"
              style="margin-right:2px"
              on-click={() => this.getEditNode(node, data)}
            />
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
      console.log(data);
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/deleteLabels";
      } else {
        url = "/public/deleteLabels";
      }

      this.$confirm("确认要删除该分类吗?该分类下包含"+data.docTotalQuantity+"个文件", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(result => {
          if (result == "confirm") {
            console.log("hh ");
            // console.log(eval +"node:")
            postJsonRequest(url, data)
              .then(result => {
                console.log(result);
                if (result.data.code != 200) {
                  this.open6(result.data.msg);
                } else {
                  this.open3(result.data.msg);
                  this.reload();
                }
              })
              .catch(err => {});
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
      // console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log(
        "tree drag end: ",
        draggingNode.data.label,
        dropNode.label,
        dropType
      );
      let data = {
        oldNode: draggingNode.data.label,
        newNode: dropNode.label,
        event: dropType
      };
      let _this = this;
      let url = "";
      if (process.env.NODE_ENV === "development") {
        url = "/api/public/dragLabel";
      } else {
        url = "/public/dragLabel";
      }

      postRequest(url, data)
        .then(result => {
          if (result.data.code != 200) {
            this.open6(result.data.msg);
          } else {
            this.open3(result.data.msg);
            this.reload();
          }
        })
        .catch(err => {});
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log("tree drop: ", dropNode.label, dropType);
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
    this.getDocLabelsTree();
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


