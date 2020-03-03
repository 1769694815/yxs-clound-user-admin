<!--
 * @Date: 2020-02-13 17:54:11
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-02 11:38:36
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
    <Tree
      v-if="showTree"
      class="tree"
      :option="treeOption"
      :data="treeData"
      @node-click="nodeClick"
    />
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
      type: Number,
      default: function() {
        return 0
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
  methods: {
    onFocus() {
      this.showTree = true
    },
    onBlur() {
      this.showTree = false
    },
    nodeClick(data) {
      this.deptId = data.id
      this.text = data.name
      this.$emit('input', this.deptId)
      this.$emit('node-click')
      this.$refs.input.blur()
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
</style>
