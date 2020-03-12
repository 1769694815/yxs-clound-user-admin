<!--
 * @Date: 2020-02-13 17:54:11
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-12 17:56:03
 * @Description: 输入框内下拉tree组件
 -->
<template>
  <div class="input-tree">
    <input
      :value="value"
      type="text"
      style="display:none;"
    >
    <el-input
      ref="input"
      v-model="text"
      clearable
      autocomplete="off"
      :disabled="disabled"
      readonly
      :placeholder="placeholder"
      @focus="onFocus"
    />
    <el-dialog
      :title="title"
      :visible.sync="showTree"
      width="30%"
      append-to-body
    >
      <Tree
        ref="inputTree"
        class="tree"
        :option="treeOption"
        :data="treeData"
        :show-checkbox="multiline"
        :current-node-key="value === null ? '' : value"
        :defalut-checked-keys="value === null ? '' : value"
        @node-click="nodeClick"
        @check-change="checkChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showTree = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tree from '@/components/Tree/index'
export default {
  components: {
    Tree
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [Number, String],
      default: function() {
        return 0
      }
    },
    title: {
      type: String,
      default: function() {
        return ''
      }
    },
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    placeholder: {
      type: String,
      default: function() {
        return ''
      }
    },
    multiline: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      text: '',
      deptId: undefined,
      showTree: false,
      treeOption: {
        nodeKey: 'id',
        props: {
          label: 'name',
          value: 'id'
        }
      }
    }
  },
  watch: {
    value: {
      handler: function(val) {
        console.log(val)
        if (!val) {
          this.text = ''
          return
        }
        this.getText()
      },
      immediate: true
    }
    // treeData: {
    //   handler: function(val) {
    //     if (this.value === '' || this.value === null) {
    //       return
    //     }
    //     this.getText()
    //   },
    //   immediate: true
    // }
  },
  methods: {
    getText() {
      if (!isNaN(this.value)) {
        this.text = this.showName(this.value, this.treeData)
      } else {
        this.text = ''
        const arr = this.value.split(',')
        arr.forEach((ele, i) => {
          this.text += i > 0 ? ',' + this.showName(ele, this.treeData) : this.showName(ele, this.treeData)
        })
      }
    },
    showName(val, list) {
      let result = null
      for (let i = 0; i < list.length; i++) {
        if (result !== null) break
        const item = list[i]
        if (Number(val) === item.id) {
          result = item.name
          console.log('item', item.name)
          break
        } else {
          if (item.children.length > 0) {
            result = this.showName(val, item.children)
          }
        }
      }
      return result
    },
    onFocus() {
      this.showTree = true
      // this.$nextTick(() => {
      //   const result = this.$refs.inputTree.getCurrentNode() && this.$refs.inputTree.getCurrentNode().name
      //   this.text = result
      // })
    },
    nodeClick(data) {
      this.deptId = data.id
      this.text = data.name
    },
    checkChange(list) {
      this.deptId = ''
      this.text = ''
      // console.log('list', list)
      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          this.deptId = list[i].id
          this.text = list[i].name
        } else {
          this.deptId += ',' + list[i].id
          this.text += ',' + list[i].name
        }
      }
    },
    submit() {
      if (this.multiline) {
        const checkedNodes = this.$refs.inputTree.getCheckedNodes().filter(item => !item.children.length)
        const checkedKeys = this.$refs.inputTree.getCheckedKeys()
        for (let i = 0; i < checkedNodes.length; i++) {
          const item = checkedNodes[i]
          if (i === 0) {
            this.text = item.name
          } else {
            this.text += `,${item.name}`
          }
        }
        this.deptId = checkedKeys.join(',')
        console.log('checkedKeys', this.deptId)
      }
      this.$emit('input', this.deptId)
      this.showTree = false
    }
  }
}
</script>

<style lang="scss" scoped>
.input-tree {
  position: relative;
  .tree {
    width: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 3px 5px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    margin: 45px 0;
    height: auto;
    overflow: hidden;
    min-width: 150px;
    max-height: 250px;
    background-color: #fff;
    z-index: 2001;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
