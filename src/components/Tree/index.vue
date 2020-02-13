<!--
 * @Date: 2020-02-13 15:48:26
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-13 19:59:14
 * @Description: 可搜索树形组件
 -->
<template>
  <div>
    <el-input
      v-model="filterText"
      type="text"
      size="small"
      placeholder="输入关键字进行过滤"
      class="filter"
    />
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      :node-key="option.nodeKey"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="getNodeData"
      ref="tree"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    option: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: this.option.props.label,
        value: this.option.props.value
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    getNodeData(data) {
      this.$emit('node-click', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  margin-bottom: 15px;
}
</style>
