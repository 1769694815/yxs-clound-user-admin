<!--
 * @Author: xwen
 * @Date: 2020-04-09 11:23:04
 * @LastEditTime: 2020-04-11 15:27:44
 * @LastEditors: xwen
 * @Description: 题目校对
 -->

<template>
  <div class="app-container calendar-list-container">
    <!-- 头部搜索 -->
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
      label-width="80px"
    >
      <el-form-item label="题目内容:">
        <el-input
          v-model="searchForm.stem"
          type="text"
          size="small"
          placeholder="请输入题目内容"
        />
      </el-form-item>
      <el-form-item label="所属课程:">
        <el-select
          v-model="searchForm.courseId"
          clearable
          class="question-input"
          placeholder="请选择所属课程"
          size="small"
        >
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题目题型:">
        <single-change
          v-model="searchForm.typeId"
          :dic-prop="{ label: 'name', value: 'id' }"
          dic-url="/question/questiontype/getAllQuestionType"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜 索</el-button>
        <el-button type="default" icon="el-icon-delete" size="small" @click="handleEmpty">清 空</el-button>
      </el-form-item>
    </el-form>
    <!-- content -->
    <div class="content">
      <div id="preview" />
    </div>
    <!-- pagination -->
    <Pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="pageChange"
    />
    <!-- modal -->
    <modify-modal :dialog-pv-visible="dialogPvVisible" :info="row" @handle-save="handleSave" @handle-close="handleClose" />
  </div>
</template>

<script>
import {
  fetchList,
  putObj,
  getCourseList } from '@/api/question/question'
import Pagination from '@/components/Pagination'
import 'froala-editor/css/froala_style.css'
import 'froala-editor/css/froala_editor.pkgd.css'
import load from 'load-script'
import ModifyModal from './modify-modal'
export default {
  name: 'Proofread',
  components: {
    Pagination,
    ModifyModal
  },
  data() {
    return {
      searchForm: {},
      courseList: [],
      page: {
        total: 0,
        current: 1,
        size: 10
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
      }],
      parentId: 0,
      detail: [],
      previewDom: '',
      dialogPvVisible: false,
      row: {}
    }
  },
  created() {
    const CDN1 = '/batchImport/js/jquery.min.js'
    const CDN2 = '/batchImport/js/froala_editor.pkgd.min.js'
    const CDN3 = '/batchImport/js/markdown-v1.1.js'
    this.loadScript([CDN1, CDN2, CDN3])
  },
  methods: {
    async loadScript(cdnArr) {
      for (let i = 0, l = cdnArr.length; i < l; i++) {
        await new Promise((resolve, reject) => {
          load(cdnArr[i], (err) => {
            if (err) {
              this.$message.error(err.message)
              reject()
            } else {
              resolve()
            }
          })
        })
      }
      this.getList()
      this.getCourseList()
    },
    initFroala() {
      const nameReg = /^\n?\s*(([0-9]+\s*[.|、])|(((\()|（)[0-9]+((\))|）)))\s*(.*?)\s*(?:\n|$)/g
      const singleReg = /^\n?\s*(答案[:：])\s*(.*?)\s*(?:\n|$)/g
      const fillReg = /([\(|\（]\s*[\)|\）])/g
      const answerReg = /^\s*\n?【\s*答案\s*】\s*/
      const answerJude = /\n\n\n\s*【\s*答案\s*】|\n\n\n\s*答案[:：]/g
      window.qt_type = '1'
      window.typeName = ['单选题', '多选题', '判断题', '填空题', '问答题']
      this.detail = []
      var newArr = []
      var indexArr = []
      var questionArr = []
      // 数据内容
      var contentText = []
      // var contentText = ''.html.get().replace(/<p>/g, '\n\n').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n\n').replace(/auto;">/g, 'auto;">\n\n').split('\n')
      // 去除空格
      contentText.forEach(value => {
        if (value) {
          value = value.replace(/&nbsp;/g, ' ')
          value = '&nbsp;&nbsp;&nbsp;' + value
          value = value.replace(/&nbsp;/g, '\n')
          newArr.push(value)
        }
      })
      // 寻找相应的下标
      newArr.forEach((value, index) => {
        if (value.match(nameReg)) {
          indexArr.push(index)
        }
      })
      // 截取完整小题
      indexArr.forEach((value, index) => {
        questionArr.push(newArr.slice(indexArr[index], indexArr[index + 1]))
      })
      // 判断题型，赋值qt_type
      questionArr.forEach(value => {
        var allValue = value.join('')
        // 匹配没有答案的情况(  答案：/【答案】)
        if (!allValue.match(/\n+\s*【\s*答案\s*】\s*/g) && !allValue.match(/\n+\s*(答案[:：])\s*/g)) {
          // 匹配到选项存在则默认为单选题先判断是否带有a.类似标志
          if (allValue.match(/\n+\s*[a-h]\s*[.|、]/ig)) {
            this.getClassify(value, 1)
          } else if (fillReg.test(allValue)) {
            // 在判断是否带有（）
            this.getClassify(value, 4)
          } else {
            // 否则默认为问答题
            this.getClassify(value, 5)
          }
        } else {
          // 针对存在多个答案的情况
          if (allValue.match(answerJude).length > 1) {
            value.forEach((ele, i) => {
              if (ele.match(answerJude)) {
                value = value.slice(0, i + 1)
              }
            })
          }
          value.forEach(val => {
            // 处理下中文括号
            if (answerReg.test(val)) {
              val = val.replace(answerReg, '答案: ')
            }
            // 只有答案二个字的情况
            if (/^\s*\n?答案\s*\n?$/.test(val)) {
              val = val.replace(/^\s*\n?答案\s*\n?$/, '答案：')
            }

            if (val.match(singleReg)) {
              var m = val.match(singleReg)// 匹配答案项
              var isAnswer = m[0].replace(/^\n?\s*(答案[:|：])\s*/, '')// 寻找答案后的字符串
              // 有答案字段，没有正确的答案
              if (!isAnswer) {
                var newString = value.join('')
                if (newString.match(/\n?\s*[a-h][.|、]\s*/ig)) {
                  this.getClassify(value, 1)
                } else {
                  // 填空题筛选
                  if ((newString.split('答案')[0]).match(fillReg)) {
                    this.getClassify(value, 4)
                    return false
                  }
                  // 无选项情况下，默认为问答题（主要包括判断题与问答题的区分）
                  this.getClassify(value, 5)
                }
              } else {
                if (isAnswer.match(/^([a-h][,|，]){0,7}([a-h])$/ig)) {
                  isAnswer = isAnswer.replace(/,|，/g, '')
                }
                var isSelect = isAnswer.match(/^\s*[a-h]{1,8}\s*(?:\n|$)/i)// 单选/多选
                var isJude = isAnswer.match(/^\s*(正确|错误|对|错)\s*(?:\n|$)/i)// 判断
                var isSelects = [] // 该数组用于接收处理玩空字符串之后的isSelect
                // 针对大小写选项重复
                if (isSelect) {
                  //  数组去重
                  isSelect = (isSelect[0].split('')).filter(function(ele, i, array) {
                    return array.indexOf(ele) === i
                  })
                  // 二次处理isSelect,去除空字符串
                  isSelect.forEach(function(value1) {
                    if (value1.trim()) {
                      isSelects.push(value1)
                    }
                  })
                  // 排序
                  isSelects.sort()
                  // 1，2项比较是否为同一个选项(a,A)
                  if (isSelects.length === 2 && isSelects[0].toLocaleLowerCase() === isSelects[1]) {
                    isSelects = isSelects.splice(0, 1)
                  }
                }
                // 单选题
                if (isSelects && isSelects.length === 1) {
                  this.getClassify(value, 1)
                }
                // 多选题
                if (isSelects && isSelects.length > 1) {
                  this.getClassify(value, 2)
                }
                // 判断题
                if (isJude) {
                  this.getClassify(value, 3)
                }
                if (!isSelect && !isJude) {
                  // 填空题
                  if ((((value.join(' ').split('答案:'))[0].match(fillReg)) && (value.join(' ').split('答案:')).length > 1) ||
                    (((value.join(' ').split('答案：'))[0].match(fillReg))) && (value.join(' ').split('答案：')).length > 1) {
                    this.getClassify(value, 4)
                  } else {
                    // 问答题
                    this.getClassify(value, 5)
                  }
                }
              }
            }
          })
        }
      })
      var ii = -1
      this.detail.forEach(value => {
        ii++
        window.qt_type = value.qt_type
        // eslint-disable-next-line
        this.previewDom = markdown.toHTML((value.name).join(''))

        // 标记答案
        this.markAnswer(ii)
        this.changeSize(ii)
      })
    },
    initList() {
      // 清空 preview 内容
      // eslint-disable-next-line
      $('div#preview').empty()
      window.qt_type = '1'
      window.typeName = ['单选题', '多选题', '不定项选择题', '判断题', '填空题', '问答题']
      window.proofread = true
      this.detail = []
      for (let idx = 0, len = this.tableData.length; idx < len; idx++) {
        const ele = this.tableData[idx]
        // 下标index DOTO size
        const index = idx + 1 + ((this.page.current - 1) * this.page.size)
        const obj = {
          name: [`\n${index}.\n${ele.stem}${ele.score ? '(' + ele.score + '分)' : ''}\n`],
          type: ele.typeId
        }
        const answer = `\n答案:${ele.answer}\n`
        const analysis = `\n解析:${ele.analysis !== null || '无'}\n`
        const difficulty = `\n难度:${this.statusFilter(ele.difficulty, this.difficultyList)}\n`
        // 判断题目类型
        if (obj.type === 1 || obj.type === 2 || obj.type === 3) {
          const optionsContent = JSON.parse(ele.optionsContent) || []
          for (let i = 0, l = optionsContent.length; i < l; i++) {
            const item = optionsContent[i]
            obj.name.push(`\n${item.name}、${item.content}\n`)
          }
        }
        obj.name.push(answer)
        obj.name.push(analysis)
        obj.name.push(difficulty)
        this.getClassify(obj.name, obj.type)
      }
      let ii = -1
      this.detail.forEach(value => {
        ii++
        window.qt_type = value.type
        // console.log(value.name)
        // eslint-disable-next-line
        $('div#preview').append(markdown.toHTML((value.name).join('')))

        // 标记答案
        this.markAnswer(window.qt_type, ii)
      })
    },
    getClassify(value, num) {
      this.detail.push({
        name: value,
        type: num
      })
    },
    markAnswer(type, ii) {
      const list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      const _this = this
      /* eslint-disable */
      $('.question').eq(ii).each(function(index, element) {
        var $that = $(this)
        var titleNum = $(this).find('.type-box .title').text()
        var answerText = $(this).find('.qt_answer').text().replace(/^\s*答案\s*[:：]/, '')
        // word版多选题带,号处理
        if (answerText.match(/^([a-h][,|，]){0,7}([a-h])$/ig)) {
          answerText = answerText.replace(/,|，/g, '')
        }
        var answer = answerText.toUpperCase()
        // 处理下只有图片的情况
        var checkTitle = $(this).find('.qt_title').text().replace($(this).find('.type-box').text(), '')

        if ($.trim(checkTitle) === '') {
          // if ($(this).find('.qt_title img').size() < 1) {
          //   $(this).find('.qt_title').addClass('qt_error').html('题目（至少两个字)')
          // }
        }
        // 检测是否按顺序排序
        var select = $(this).find('.key .title').text()
        var type = $(this).data('type')
        select = select.split('.').join('')

        // 处理题目中的题号带括号，替换下中文括号
        titleNum = titleNum.replace(/（/, '(')
        titleNum = titleNum.replace(/）/, ')')
        $(this).find('.type-box .title').text(titleNum)

        // 错误标记check_error
        if ($(this).find('.error,.qt_error').size() > 0) {
          $(this).addClass('check_error')
        }

        if (type == '1' || type == '2' || type == '3') {
          for (var k = 0, selectLen = select.length; k < selectLen; k++) {
            // 根据选项与ACSII的比较，判断是否为正常的排序及重复选项的存在
            if (!(select[k] === String.fromCharCode(65 + k))) {
              $(this).addClass('check_error')
              $(this).find('.key').addClass('qt_error')
            }
          }
          for (var i = 0, listLen = list.length; i < listLen; i++) {
            // 标记选项框
            if (answer.search(list[i]) !== -1) {
              $(this).find('.key_' + list[i] + ' .checkOrRadio').prop('checked', true)
            } else {
              $(this).find('.key_' + list[i] + ' .checkOrRadio').attr('disabled', true)
            }
          }
          // 根据选项最后一位的ASCII码 与选项对比小于即为不存选项（大写比较）
          // 单选题判断答案是否存在
          // 过滤空字符串
          var answerhandle = answer.split('').filter(function(msg) {
            return msg && msg.trim()
          })
          // 单选题判断答案是否存在
          if (answerhandle.length === 1) {
            if (select.slice(-1).charCodeAt() < answerhandle[0].toLocaleUpperCase().charCodeAt()) {
              $that.addClass('check_error')
              $that.find('.qt_answer').removeAttr('hidden').addClass('qt_error').text('答案不存在！')
            }
          }

          // 多选题判断答案是否存在
          if (answerhandle.length > 1) {
            for (var j = 0, answerLen = answerhandle.length; j < answerLen; j++) {
              if (answerhandle[j].charCodeAt() > select.slice(-1).charCodeAt()) {
                $that.addClass('check_error')
                $that.find('.qt_answer').removeAttr('hidden').addClass('qt_error').text('答案不存在！')
              }
            }
          }
          // 题目有错误时把单多选按钮隐藏
          if ($(this).find('.qt_error').length !== 0) {
            $(this).find('.change-type').hide()
          } else {
            $(this).find('.change-type').show()
          }
        }
        if (type == '5') {
          //  填空题括号与答案对应，先进行空元素匹配，在进行重复答案匹配
          var fillReg = /([\(|\（]\s*[\)|\）])/g
          var newAnswer = []
          if ($(this).find('.qt_title').text().match(fillReg)) {
            var fillNum = $(this).find('.qt_title').text().match(fillReg).length
          }
          var answerNum = answerText.split('|')

          // 先判断长度是否相等
          if (fillNum !== answerNum.length) {
            $(this).addClass('check_error')
            // 长度不相等即为错
            $(this).find('.qt_answer').addClass('qt_error')
          } else {
            // 去除空元素
            answerNum.forEach(function(value) {
              if ($.trim(value)) {
                newAnswer.push(value)
              }
            })
            if (fillNum !== newAnswer.length) {
              $(this).addClass('check_error')
              // 长度不相等即为错
              $(this).find('.qt_answer').addClass('qt_error')
            }
          }
        }
        if (type == '6') {
          // 问答题答案为空时标记为错误
          if (answerText.length === 0) {
            $(this).addClass('check_error')
            $(this).find('.qt_answer').addClass('qt_error')
          }
        }
        // 点击修改
        $(this).find('.modify').on('click', () => {
          // 修改数据
          const item = _this.tableData[ii]
          console.log(`第${ii}条数据`, item)
          _this.handleUpdate(item)
        })
      })
      /* eslint-disable */
    },
    getList() {
      const param = { parentId: this.parentId }
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.page.current,
            size: this.page.size
          },
          this.searchForm,
          param
        )
      )
        .then(res => {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.initList()
        })
        .catch(() => {})
    },
    getCourseList() {
      getCourseList().then(res => {
        this.courseList = res.data
      })
    },
    statusFilter(status, list) {
      let result
      list.map(ele => {
        if (status === ele.value) {
          result = ele.label
        }
      })
      return result
    },
    handleUpdate(item) {
      this.dialogPvVisible = true
      this.row = item
    },
    handleSave(info) {
      // 题目修改
      console.log('题目信息', info)
      putObj(info).then(res => {
        console.log(res)
        if (res.data.code !== 0) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
          return
        }
        this.dialogPvVisible = false
        this.getList()
      })
    },
    handleClose() {
      this.dialogPvVisible = false
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    pageChange() {
      this.getList()
    }
  }
}

</script>

<style src="@/assets/css/markdown.css"></style>
<style lang="scss" scoped>
  .content {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 30px;
  }
</style>
