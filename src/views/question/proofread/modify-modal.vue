<!--
 * @Author: xwen
 * @Date: 2020-04-11 10:54:02
 * @LastEditTime: 2020-04-11 15:27:32
 * @LastEditors: xwen
 * @Description: 修改题目弹窗
 -->

<template>
  <el-dialog
    :visible.sync="dialogPvVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-row style="padding: 0 20px;">
      <el-form :model="info" :inline="true">
        <el-col :span="8">
          <el-form-item label="题目类型:">
            <single-change
              v-model="info.typeId"
              :dic-prop="{ label: 'name', value: 'id' }"
              dic-url="/question/questiontype/getAllQuestionType"
              type="select"
              size="medium"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="题目难度:">
            <el-select v-model="info.difficulty">
              <el-option
                v-for="(item, index) in difficultyList"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="题目分值:">
            <el-input
              v-model="info.score"
              type="number"
              min="0"
            />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-input
      v-model="val"
      type="textarea"
      :autosize="autosize"
    />
    <div slot="footer" class="doalog-footer">
      <el-button type="primary" size="small" @click="handleSave">保 存</el-button>
      <el-button size="small" @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModifyModal',
  props: {
    dialogPvVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      val: '',
      autosize: {
        minRows: 10
      },
      difficultyList: [{
        label: '困难',
        value: '1'
      }, {
        label: '中等',
        value: '2'
      }, {
        label: '简单',
        value: '3'
      }]
    }
  },
  watch: {
    info(val) {
      this.obj2Json(val)
    }
  },
  methods: {
    obj2Json(val) {
      const arr = [`${val.stem}`]
      const answer = `\n答案:${val.answer}`
      const analysis = `\n解析:${val.analysis !== null || '无'}`
      if (val.typeId === 1 || val.typeId === 2 || val.typeId === 3) {
        const optionsContent = JSON.parse(val.optionsContent) || []
        for (let i = 0, l = optionsContent.length; i < l; i++) {
          const item = optionsContent[i]
          arr.push(`\n${item.name}、${item.content}`)
        }
      }
      arr.push(answer)
      arr.push(analysis)
      this.val = arr.join('')
    },
    handleSave() {
      const arr = this.val.split(/[\n]/g)
      this.info.stem = arr[0]
      const optionsContent = []
      let answer = ''
      let analysis = ''
      for (let i = 1, l = arr.length; i < l; i++) {
        const item = arr[i]
        // 匹配选项
        if (item.match(/\s*[a-h|A-H]\s*[.|、]/g)) {
          const option = item.split('、')
          optionsContent.push({
            name: option[0],
            content: option[1]
          })
        }
        // 匹配答案
        if (item.match(/\s*答案[:：]\s*/g)) {
          answer = item.split('答案:')[1]
        }
        // 匹配解析
        if (item.match(/\s*解析[:：]\s*/g)) {
          analysis = item.split('解析:')[1]
        }
      }
      this.info.optionsContent = JSON.stringify(optionsContent)
      this.info.answer = answer
      this.info.analysis = analysis
      this.$emit('handle-save', this.info)
    },
    handleClose() {
      this.$emit('handle-close')
    }
  }
}
</script>
