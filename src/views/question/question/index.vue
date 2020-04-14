<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-04-09 11:48:14
 * @Description: 题目表管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--题目类容-->
      <el-form-item label="题目内容:" label-width="80px">
        <el-input v-model="searchForm.stem" type="text" size="small" placeholder="请输入题目内容" />
      </el-form-item>
      <el-form-item label="所属课程:" label-width="80px">
        <el-select
          v-model="searchForm.courseId"
          :disabled="operationStatus === 1"
          clearable
          class="question-input"
          placeholder="请选择所属课程"
          size="small"
          @change="getLessonList('searchForm')"
        >
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="lessonList.length>0" label="所属课时" label-width="80px">
        <el-select
          v-model="searchForm.lessonId"
          :disabled="operationStatus === 1"
          clearable
          class="question-input"
          placeholder="请选择所属课时"
          size="small"
        >
          <el-option
            v-for="item in lessonList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="题目题型:" label-width="80px">
        <single-change
          v-model="searchForm.typeId"
          :disabled="operationStatus === 1"
          :dic-prop="{ label: 'name', value: 'id' }"
          dic-url="/question/questiontype/getAllQuestionType"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item label="题目类型:" label-width="80px">
        <single-change
          v-model="searchForm.questionType"
          :disabled="operationStatus === 1"
          status-type="question_type"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item label="题目难度" label-width="80px">
        <single-change
          v-model="searchForm.difficulty"
          :disabled="operationStatus === 1"
          status-type="question_difficulty"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜 索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="el-icon-delete" size="small" @click="handleEmpty">清 空</el-button>
      </el-form-item>
    </el-form>
    <Xtable
      :table-key="tableKey"
      :table-loading="tableLoading"
      :table-data="tableData"
      :page="page"
      :add-btn="false"
      :table-option.sync="tableOption"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="menuLeft">

        <el-button
          v-if="hasParentId"
          type="warning"
          icon="el-icon-back"
          size="mini"
          @click="handleBack"
        >
          返回
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="goto('/question/batchImport')"
        >批量录入</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="goto('/question/proofread')"
        >题目校对</el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button
          v-if="!hasParentId"
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleAnalysisList(scope.row,scope.index)"
        >分析题列表</el-button>
        <el-button
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(scope.row, scope.index)"
        >删除</el-button>
      </template>
    </Xtable>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :close-on-click-modal="false"
      :title="operationStatus | dialogTitle"
    >
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="dataForm" :model="form" :rules="rules">
          <!--题目内容-->
          <el-col :span="24">
            <el-form-item label="题目内容" prop="stem" :label-width="formLabelWidth">
              <el-input
                v-model="form.stem"
                :disabled="operationStatus === 1"
                :autosize="{ minRows: 2, maxRows: 6}"
                type="textarea"
                placeholder="请输入题目内容"
                clearable
                class="question-textarea"
              />
            </el-form-item>
          </el-col>
          <!--所属年份-->
          <el-col :span="12">
            <el-form-item label="所属年份" prop="year" :label-width="formLabelWidth">
              <el-date-picker
                v-model="form.year"
                :disabled="operationStatus === 1"
                type="year"
                placeholder="请输入所属年份"
                clearable
                size="medium"
                class="question-input"
              />
            </el-form-item>
          </el-col>
          <!--题目题型-->
          <el-col :span="12">
            <el-form-item label="题目题型" prop="typeId" :label-width="formLabelWidth">
              <single-change
                v-model="form.typeId"
                :disabled="operationStatus === 1"
                :dic-prop="{ label: 'name', value: 'id' }"
                dic-url="/question/questiontype/getAllQuestionType"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--题目类型-->
          <el-col :span="12">
            <el-form-item label="题目类型" prop="questionType" :label-width="formLabelWidth">
              <single-change
                v-model="form.questionType"
                :disabled="operationStatus === 1"
                status-type="question_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--题目难度-->
          <el-col :span="12">
            <el-form-item label="题目难度" prop="difficulty" :label-width="formLabelWidth">
              <single-change
                v-model="form.difficulty"
                :disabled="operationStatus === 1"
                status-type="question_difficulty"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--题目分值-->
          <el-col :span="12">
            <el-form-item label="题目分值" prop="score" :label-width="formLabelWidth">
              <el-input
                v-model="form.score"
                :disabled="operationStatus === 1"
                placeholder="请输入题目分值"
                clearable
                size="medium"
                class="question-input"
              />
            </el-form-item>
          </el-col>
          <!--所属课程-->
          <el-col :span="12">
            <el-form-item label="所属课程" prop="courseId" :label-width="formLabelWidth">
              <el-select
                v-model="form.courseId"
                :disabled="operationStatus === 1"
                clearable
                class="question-input"
                placeholder="请选择所属课程"
                size="medium"
                @change="getLessonList('form')"
              >
                <el-option
                  v-for="item in courseList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--所属课时-->
          <el-col v-if="form.courseId!=null" :span="24">
            <el-form-item label="所属课时" prop="lessonId" :label-width="formLabelWidth">
              <el-select
                v-model="form.lessonId"
                :disabled="operationStatus === 1"
                clearable
                class="question-input"
                size="medium"
                placeholder="请选择所属课时"
              >
                <el-option
                  v-for="item in lessonList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--题目选项-->
          <el-col
            v-for="(item, index) in singleArray"
            :key="index"
          >
            <template v-if="form.typeId === 1 || form.typeId === 2 || form.typeId === 3">
              <el-col :span="20">
                <el-form-item :label="'选项'+ letterArray[index]" :label-width="formLabelWidth">
                  <el-input
                    v-model="singleArray[index]"
                    :disabled="operationStatus === 1"
                    :autosize="{ minRows: 2, maxRows: 6}"
                    type="textarea"
                    size="medium"
                    class="question-textarea"
                  />
                </el-form-item>
              </el-col>
              <button
                v-if="(singleArray.length > 2 && form.typeId === 1) && !(operationStatus === 1)"
                @click="optionDel(letterArray[index])"
              >-</button>
              <button
                v-if="(singleArray.length > 4 && form.typeId === 2) && !(operationStatus === 1)"
                @click="optionDel(letterArray[index])"
              >-</button>
              <button v-if="(letterArray.length > singleArray.length) && !(operationStatus === 1)" @click="optionAdd">+</button>
            </template>
          </el-col>
          <!-- 题目答案 -->
          <!-- // 题型(1:选择题，2：多选题，3：不定项选择题，4：判断题，5：填空题，6：问答题，7：材料分析题) -->
          <el-col v-if="form.typeId != 7" :span="24">
            <el-form-item label="题目答案" prop="answer" :label-width="formLabelWidth">
              <!-- 非选择题 -->
              <el-input
                v-if="form.typeId !== 1 && form.typeId !== 2 && form.typeId !==3 && form.typeId !== 4"
                v-model="form.answer"
                :disabled="operationStatus === 1"
                :autosize="{ minRows: 2, maxRows: 6}"
                type="textarea"
                placeholder="请输入题目答案"
                clearable
                size="medium"
                class="question-textarea"
              />
              <!-- 选择题 -->
              <el-radio-group
                v-if="form.typeId === 1"
                v-model="form.answer"
                size="medium"
                :disabled="operationStatus === 1"
              >
                <el-radio
                  v-for="(item, index) in singleArray"
                  :key="index"
                  size="medium"
                  :label="letterArray[index]"
                >{{ letterArray[index] }}</el-radio>
              </el-radio-group>
              <!-- 多选题 -->
              <el-checkbox-group
                v-if="form.typeId === 2 || form.typeId === 3"
                v-model="checkArray"
                size="medium"
                :disabled="operationStatus === 1"
              >
                <el-checkbox
                  v-for="(item, index) in singleArray"
                  :key="index"
                  :value="index"
                  size="medium"
                  :label="letterArray[index]"
                >{{ letterArray[index] }}</el-checkbox>
              </el-checkbox-group>
              <!-- 判断题 -->
              <el-radio-group
                v-if="form.typeId === 4"
                v-model="form.answer"
                size="medium"
                :disabled="operationStatus === 1"
              >
                <el-radio :label="'true'" size="medium">正确</el-radio>
                <el-radio :label="'false'" size="medium">错误</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--题目解析-->
          <el-col :span="24">
            <el-form-item label="题目解析" prop="analysis" :label-width="formLabelWidth">
              <el-input
                v-model="form.analysis"
                :autosize="{ minRows: 2, maxRows: 6}"
                type="textarea"
                placeholder="请输入题目解析"
                clearable
                size="medium"
                class="question-textarea"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>

          <!--图片上传-->
          <el-col :span="24">
            <el-form-item prop="img" label="图片上传:" :label-width="formLabelWidth">
              <single-image v-model="form.imgUrl" status="7" :disabled="operationStatus === 1" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="primary" size="small" @click="create('dataForm')">保 存</el-button>
        <el-button size="small" @click="handleClose('dataForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  getCourseList,
  getLessonList } from '@/api/question/question'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(type, list) {
      let result
      list.map(ele => {
        if (type === ele.value) {
          result = ele.label
        }
      })
      return result
    },
    dialogTitle(type) {
      const titleMap = {
        0: '新 增',
        1: '查 看',
        2: '编 辑',
        3: '删 除'
      }
      return titleMap[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      tableLoading: false,
      tearcherList: [],
      treeData: [],
      courseList: [],
      lessonList: [],
      questionListType: [],
      singleArray: ['', '', '', ''],
      letterArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      checkArray: [],
      tableOption: [
        {
          label: '题型',
          prop: 'questionTypeName',
          width: 100
        },
        {
          label: '题目内容',
          prop: 'stem'
        },
        {
          label: '题目类型',
          prop: 'questionType',
          dicUrl: 'question_type',
          dicData: [],
          width: 100
        },
        {
          label: '年份',
          prop: 'year',
          width: 60
        },
        {
          label: '参考答案',
          prop: 'answer',
          width: 120
        },
        {
          label: '难度',
          prop: 'difficulty',
          dicUrl: 'question_difficulty',
          dicData: [],
          width: 80
        },
        {
          label: '课程',
          prop: 'courseId',
          width: 120
        },
        {
          label: '课时',
          prop: 'lessonId',
          width: 120
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 160
        },
        {
          label: '分值',
          prop: 'score',
          width: 60
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {},
      dialogPvVisible: false,
      operationStatus: 0,
      labelWidth: '90px',
      form: {}, // 新增 编辑 数据源
      formLabelWidth: '90px',
      rules: {
        // 表单校验
        typeId: [{ required: true, message: '请选择题目题型', trigger: 'blur' }],
        stem: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
        questionType: [{ required: true, message: '请选择题目题型', trigger: 'blur' }],
        year: [{ required: true, message: '请输入年份', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入参考答案', trigger: 'blur' }],
        difficulty: [{ required: true, message: '请输入难度', trigger: 'blur' }],
        courseId: [{ required: true, message: '请选择所属课程', trigger: 'blur' }],
        score: [{ required: true, message: '请输入题目分值', trigger: 'blur' }]
      },
      parentId: 0,
      hasParentId: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getCourseList()
  },
  methods: {
    goto(path) {
      this.$router.push({
        path,
        query: {
          // courseId: row.id
        }
      })
    },
    getList() {
      this.tableLoading = true
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
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    /**
     * 创建方法
     * @param form
     * @returns
     */
    create(form) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogPvVisible = false
          this.tableLoading = true
          if (
            this.form.typeId === 1 ||
            this.form.typeId === 2 ||
            this.form.typeId === 3
          ) {
            const optionsContent = []
            for (let i = 0; i < this.singleArray.length; i++) {
              const content = {
                name: this.letterArray[i],
                content: this.singleArray[i]
              }
              optionsContent.push(content)
            }
            const jsonstr = JSON.stringify(optionsContent)
            this.form.optionsContent = jsonstr
            const checkAnswer = []
            if (this.form.typeId === 2 || this.form.typeId === 3) {
              for (let i = 0; i < this.checkArray.length; i++) {
                checkAnswer.push(this.checkArray[i])
              }
              const jsonAnswer = JSON.stringify(checkAnswer)
              this.form.answer = jsonAnswer
            }
          }
          if (this.form.id != null) {
            putObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
              .catch(() => {
                this.tableLoading = false
              })
          } else {
            addObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
              .catch(() => {
                this.tableLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    /**
     * 课程列表
     */
    getCourseList() {
      getCourseList().then(res => {
        this.courseList = res.data
      })
    },
    /**
     * 课时列表
     */
    getLessonList(type) {
      getLessonList(this[type].courseId).then(res => {
        this.lessonList = res.data
      })
    },
    /**
     * 重置
     * @param form
     * @returns
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    getOptionsContent(row) {
      const json = JSON.parse(row.optionsContent)
      const type = row.typeId
      if (type === 2) {
        if (json === null || json === '') {
          this.checkArray = []
        } else {
          this.checkArray = row.answer.split('')
        }
      }
      if (type === 1 || type === 2 || type === 3) {
        if (json === null || json === '') {
          this.singleArray = ['', '', '', '']
        } else {
          this.singleArray = []
          for (let i = 0; i < json.length; i++) {
            this.singleArray.push(json[i].content)
          }
        }
      }
    },
    handleView(row) {
      this.form = row
      this.getOptionsContent(row)
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleUpdate(row) {
      this.form = row
      this.getOptionsContent(row)
      this.dialogPvVisible = true
      this.operationStatus = 2
    },
    handleAnalysisList(row, index) {
      this.parentId = row.id
      this.hasParentId = true
      this.getList()
    },
    handleBack(row, index) {
      this.parentId = 0
      this.hasParentId = false
      this.getList()
    },
    handleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.id)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    },
    handleClose(form) {
      this.dialogPvVisible = false
      this.form = {}
      this.$refs[form].resetFields()
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.form = {
        parentId: this.parentId,
        typeId: 1,
        questionType: '1',
        difficulty: '1',
        score: 0,
        year: new Date().getFullYear() + ''
      }
    },
    optionAdd() {
      if (this.singleArray.length < this.letterArray.length) {
        this.singleArray.push('')
      }
    },
    optionDel(index) {
      this.singleArray.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.question-textarea {
  width: 90%;
}
.question-input {
  width: 250px;
}
</style>
