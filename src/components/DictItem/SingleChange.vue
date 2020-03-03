<!--
 * @Author: xwen
 * @Date: 2020-02-22 11:19:48
 * @LastEditTime: 2020-03-03 11:28:36
 * @LastEditors: Donkey
 * @Description: 数据字典单选组件
 -->

<template>
  <div>
    <input
      :value="value"
      type="text"
      style="display:none;"
    >
    <el-select
      v-if="type === 'select'"
      v-model="status"
      size="small"
      clearable
      placeholder="请选择状态"
      @change="singleChange"
    >
      <el-option
        v-for="item in statusList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-radio-group
      v-if="type === 'radio'"
      v-model="status"
      :disabled="operationStatus === 1"
      @change="singleChange"
    >
      <el-radio
        v-for="item in statusList"
        :key="item.value"
        :label="item.value"
        border
        size="medium"
      >{{ item.label }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { remote } from '@/api/admin/dict'
export default {
  name: 'SingleChange',
  props: {
    value: {
      type: String,
      default: function() {
        return ''
      }
    },
    operationStatus: {
      type: Number,
      default: function() {
        return 0
      }
    },
    statusType: {
      type: String,
      default: function() {
        return ''
      }
    },
    type: {
      type: String,
      default: function() {
        return 'select'
      }
    }
  },
  data() {
    return {
      status: this.value,
      statusList: []
    }
  },
  created() {
    this.getStatusList()
  },
  methods: {
    getStatusList() {
      remote(this.statusType).then(res => {
        this.statusList = res.data.data
      })
    },
    singleChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>
