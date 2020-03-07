<!--
 * @Date: 2020-02-13 15:48:26
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-07 14:40:31
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
      ref="tree"
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      :node-key="option.nodeKey"
      :show-checkbox="showCheckbox"
      default-expand-all
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
      :filter-node-method="filterNode"
      @node-click="getNodeData"
      @check="handleCheckChage"
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
    },
    showCheckbox: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    currentNodeKey: {
      type: [Number, String],
      default: function() {
        return ''
      }
    },
    defalutCheckedKeys: {
      type: [Number, String],
      default: function() {
        return ''
      }
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: this.option.props.label,
        value: this.option.props.value
      },
      checkIdList: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    defalutCheckedKeys: {
      handler: function(val) {
        if (this.showCheckbox) {
          const arr = val.length > 0 ? val.split(',') : []
          this.setCheckedKeys(arr)
        }
      },
      immediate: true
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    getNodeData(data) {
      if (this.showCheckbox) {
        return
      }
      this.$emit('node-click', data)
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    handleCheckChage(data, checked) {
      const checkList = []
      const checkedNodes = checked.checkedNodes
      const checkedKeys = checked.checkedKeys
      // 判断id是否为选择
      if (checkedKeys.includes(data.id)) {
        // 选择的
        this.checkIdList.push(data.id)
      } else {
        // 取消的
        for (let i = 0; i < this.checkIdList.length; i++) {
          if (!checkedKeys.includes(this.checkIdList[i])) {
            this.checkIdList.splice(i, 1)
          }
        }
      }
      for (let i = 0; i < checkedNodes.length; i++) {
        for (let j = 0; j < this.checkIdList.length; j++) {
          if (this.checkIdList[j] === checkedNodes[i].id) {
            checkList.push(checkedNodes[i])
          }
        }
      }
      this.$emit('check-change', checkList)
    },
    setCheckedKeys(val) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(val)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  margin-bottom: 15px;
}
</style>
