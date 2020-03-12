<!--
 * @Author: xwen
 * @Date: 2020-02-22 11:19:48
 * @LastEditTime: 2020-03-12 10:38:57
 * @LastEditors: xwen
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
      :size="size"
      :disabled="disabled"
      clearable
      placeholder="请选择状态"
      style="width: 100%;"
      @change="singleChange"
    >
      <el-option
        v-for="item in statusList"
        :key="item[dicProp.value]"
        :label="item[dicProp.label]"
        :value="item[dicProp.value]"
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
        :size="size"
      >{{ item.label }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import { remote, http } from '@/api/admin/dict'
export default {
  name: 'SingleChange',
  props: {
    value: {
      type: [String, Number],
      default: function() {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
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
    },
    size: {
      type: String,
      default: function() {
        return 'small'
      }
    },
    operationStatus: {
      type: [String, Number],
      default: function() {
        return 0
      }
    },
    dicUrl: {
      type: String,
      default: function() {
        return ''
      }
    },
    dicProp: {
      type: Object,
      default: function() {
        return {
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      status: '',
      statusList: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.status = val
      },
      immediate: true
    }
  },
  created() {
    this.getStatusList()
  },
  methods: {
    getStatusList() {
      if (this.statusType) {
        remote(this.statusType).then(res => {
          this.statusList = res.data.data
        })
      } else if (this.dicUrl) {
        http(this.dicUrl).then(res => {
          this.statusList = res.data.data
        })
      } else {
        new Error('必传status-type或者dic-url')
      }
    },
    singleChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>
