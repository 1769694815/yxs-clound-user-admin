<template>
  <el-dialog
    class="classroomModal"
    title="课程管理"
    :visible="showModal"
    width="750px"
    :before-close="handleClose"
    center
  >
    <el-transfer
      v-model="value"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入课程名称"
      :titles="['可选课程', '已选课程']"
      :data="allData"
      @change="handleChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('hide-modal')">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveClassCourse } from '@/api/classroom/classroom'
export default {
  props: {
    modalShow: Boolean,
    leftData: Array,
    rightData: Array,
    classroomId: Number
  },
  data() {
    return {
      showModal: false,
      value: [],
      allData: [],
      id: null
      // rightData: []
    }
  },
  watch: {
    modalShow(newVal, oldVal) {
      this.showModal = newVal
    },
    leftData(newVal, oldVal) {
      this.allData = newVal.map(item => {
        return {
          key: item.id,
          label: item.title
        }
      })
    },
    rightData(newVal, oldVal) {
      const arr = []
      newVal.map(item => {
        arr.push(item.id)
      })
      this.value = arr
    },
    classroomId(newVal, oldVal) {
      this.id = newVal
    }
  },
  methods: {
    handleChange(value, direction, movedKeys) {
    },
    handleClose() {
      this.$emit('hide-modal')
      this.classroomId = null
    },
    filterMethod(query, item) {
      return item.label ? item.label.indexOf(query) > -1 : ''
    },
    ok() {
      let arr = []
      arr = this.value.map(item => {
        return {
          classroomId: this.classroomId,
          courseId: item
        }
      })
      const params = {
        id: this.id,
        lists: arr
      }
      saveClassCourse(params).then(res => {
        this.$message({ message: '操作成功', type: 'success' })
        this.$emit('success')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-transfer-panel {
  width: 300px;
}
</style>

