<!--
 * @Author: xwen
 * @Date: 2020-03-10 14:25:16
 * @LastEditTime: 2020-03-10 14:59:44
 * @LastEditors: xwen
 * @Description: 颜色选择器
 -->

<template>
  <div class="color-picker">
    <input :value="value" style="display: none;">
    <el-input v-model="value">
      <template slot="append">
        <el-color-picker
          v-model="color"
          :size="size"
          :color-format="colorFormat"
          @change="colorChange"
        />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'mini'
    },
    colorFormat: {
      type: String,
      default: 'hex'
    }
  },
  data() {
    return {
      text: '',
      color: ''
    }
  },
  watch: {
    value: function(val) {
      this.text = val
    }
  },
  methods: {
    colorChange(e) {
      this.text = e
      this.$emit('input', e)
    }
  }
}
</script>
