<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-19 18:06:39
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--题目类容-->
      <el-form-item label="题目类容:" label-width="80px">
        <el-input v-model="searchForm.stem" type="text" size="small" placeholder="请输入题目类容" />
      </el-form-item>
      <el-form-item label="所属课程" label-width="80px">
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
      :table-option.sync="tableOption"
      @handle-create="handleCreate"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="role" slot-scope="scope">
        <el-tag>{{ scope.row.role }}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
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
          <el-row>
            <el-col v-if="form.typeId != 7" :span="24">
              <el-form-item label="题目内容" prop="stem" :label-width="formLabelWidth">
                <el-input
                  v-model="form.stem"
                  :disabled="operationStatus === 1"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属年份" prop="year" :label-width="formLabelWidth">
                <el-input v-model="form.year" :disabled="operationStatus === 1" />
              </el-form-item>
            </el-col>
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
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="题目难度" prop="difficulty" :label-width="formLabelWidth">
                <single-change
                  v-model="form.questionType"
                  :disabled="operationStatus === 1"
                  status-type="question_difficulty"
                  type="select"
                  size="medium"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="题目分值" prop="score" :label-width="formLabelWidth">
                <el-input v-model="form.score" :disabled="operationStatus === 1" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--所属课程-->
            <el-col :span="12">
              <el-form-item label="所属课程" prop="courseId" :label-width="formLabelWidth">
                <el-select
                  v-model="form.courseId"
                  :disabled="operationStatus === 1"
                  clearable
                  class="question-input"
                  placeholder="请选择所属课程"
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
            <el-col :span="24">
              <el-form-item label="所属课时" prop="lessonId" :label-width="formLabelWidth">
                <el-select
                  v-model="form.lessonId"
                  :disabled="operationStatus === 1"
                  clearable
                  class="question-input"
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
          </el-row>
          <el-row
            v-for="(item, index) in singleArray"
            v-if="form.typeId === 1 || form.typeId === 2 || form.typeId === 3"
            :key="index"
          >
            <el-col :span="20">
              <el-form-item :label="'选项'+ letterArray[index]">
                <el-input
                  v-model="singleArray[index]"
                  :disabled="operationStatus === 1"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <button
              v-if="singleArray.length > 2 && form.typeId === 1"
              @click="optionDel(letterArray[index])"
            >-</button>
            <button
              v-if="singleArray.length > 4 && form.typeId === 2"
              @click="optionDel(letterArray[index])"
            >-</button>
            <button v-if="letterArray.length > singleArray.length" @click="optionAdd">+</button>
          </el-row>

          <el-row v-if="form.typeId !== 7">
            <el-col :span="24">
              <el-form-item label="题目答案" prop="answer">
                <!-- 非选择 -->
                <el-input
                  v-if="form.typeId !== 1 && form.typeId !== 2 && form.typeId !==3 && form.typeId !== 4"
                  v-model="form.answer"
                  :disabled="operationStatus === 1"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  type="textarea"
                />
                <!-- 选择题 -->
                <el-radio-group
                  v-if="form.typeId === 1"
                  v-model="form.answer"
                  :disabled="operationStatus === 1"
                >
                  <el-radio
                    v-for="(item, index) in singleArray"
                    :key="index"
                    :label="letterArray[index]"
                  >{{ letterArray[index] }}</el-radio>
                </el-radio-group>
                <!-- 多选题 -->
                <el-checkbox-group
                  v-if="form.typeId === 2 || form.typeId === 3"
                  v-model="checkArray"
                >
                  <el-checkbox
                    v-for="(item, index) in singleArray"
                    :key="index"
                    :value="index"
                    :label="letterArray[index]"
                  >{{ letterArray[index] }}</el-checkbox>
                </el-checkbox-group>
                <!-- 判断题 -->
                <el-radio-group
                  v-if="form.typeId === 4"
                  v-model="form.answer"
                  :disabled="operationStatus === 1"
                >
                  <el-radio :label="'true'">正确</el-radio>
                  <el-radio :label="'false'">错误</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.typeId !== 7">
            <el-col :span="24">
              <el-form-item label="题目解析" prop="analysis">
                <el-input
                  v-model="form.analysis"
                  :disabled="operationStatus === 1"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="color: red">
              提示文字：1.需填空内容请用下划线____或括弧（）表示，示例：七夕节又叫____？年三十又叫____？
              <br>2.同个填空多个参考答案用竖线 “| ” 分隔，不同填空答案用 “ $” 分隔，示例：乞巧节|情人节$除夕
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="success" size="small" @click="create('dataForm')">保 存</el-button>
        <el-button type="warning" size="small" @click="resetForm('dataForm')">重 置</el-button>
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
      courseList: [],
      lessonList: [],
      singleArray: [],
      checkArray: [],
      treeData: [],
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
      formLabelWidth: '90px',
      form: {}, // 新增 编辑 数据源
      rules: {
        // 表单校验
        title: [
          { required: true, message: '导航名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请选择类型', trigger: 'change' }],
        openFlag: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ],
        newwinFlag: [
          { required: true, message: '请选择是否打开新窗口', trigger: 'change' }
        ],
        img: [{ required: true, message: '请上传图片', trigger: 'change' }]
      },
      dataObj: { token: '', key: '' },
      imageUrl: '' // 图片地址
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
    getList() {
      this.tableLoading = true
      const param = { parentId: this.$route.query.parentId }
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
          this.getList()
          if (this.form.id != null) {
            putObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
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
    handleView(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleUpdate(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 2
    },
    handleAnalysisList(row, index) {
      this.$router.push({
        path: '/question/question/list/index',
        query: {
          courseId: row.id
        }
      })
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
        type: 1,
        status: 0,
        serialStatus: 1,
        recommend: 0,
        buyFlag: 0,
        doubleSpeed: 0,
        drag: 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.question-input {
  width: 100%;
}
</style>
