<!--
 * @Date: 2020-02-13 17:54:11
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-07 15:26:54
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
      :disabled="operationStatus === 1"
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
        :current-node-key="value"
        :defalut-checked-keys="value"
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
    operationStatus: {
      type: Number,
      default: function() {
        return 0
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
        }
      },
      immediate: true
    },
    treeData: {
      handler: function(val) {
        if (this.value === '' || this.value === null) {
          return
        }
        console.log(!isNaN(this.value))
        if (!isNaN(this.value)) {
          // this.text = this.showName(this.value, val)
          console.log('测试文化考试何炅', this.showName(this.value, val))
        } else {
          const arr = this.value.split(',')
          console.log(arr)
          arr.forEach(ele => {
            console.log(this.showName(ele, val))
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    showName(val, list) {
      console.log(val, list)
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item.children.length > 0) {
          this.showName(val, item.children)
          if (Number(val) === item.id) {
            console.log(item.name)
            return item.name
          }
        }
      }
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
