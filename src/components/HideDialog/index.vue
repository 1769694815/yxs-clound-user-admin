<!--
 * @Date: 2020-02-14 17:41:18
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-14 18:20:18
 * @Description: 
 -->
<template>
  <el-checkbox-group
    v-model="checkList"
    @change="checkChange"
  >
    <el-checkbox
      v-for="(item, index) in tableOption"
      :key="index"
      :label="item.prop"
    >{{ item.label }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'HideDialog',
  props: {
    tableOption: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      checkList: []
    }
  },
  created() {
    this.tableOption.forEach(ele => {
      if (!ele.hide) {
        this.checkList.push(ele.prop)
      }
    })
  },
  methods: {
    checkChange(val) {
      let list = JSON.parse(JSON.stringify(this.tableOption))
      list = list.map(ele => {
        ele.hide = !this.checkList.includes(ele.prop)
        return ele
      })
      this.$emit('check-change', list)
    }
  }
}
</script>