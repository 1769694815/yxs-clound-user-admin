<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: zhoum
 * @Author: xw
 * @LastEditTime: 2020-03-04 17:00:39
 * @Description: 题目表管理
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
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button
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
            <el-form-item label="题目内容" prop="stem">
              <el-input
                v-model="form.stem"
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
            <el-form-item label="所属年份" prop="year">
              <el-input v-model="form.year" placeholder="请输入所属年份" clearable class="question-input" />
            </el-form-item>
          </el-col>
          <!--题目题型-->
          <el-col :span="12">
            <el-form-item label="题目题型" prop="typeId">
              <el-select
                v-model="form.typeId"
                clearable
                class="question-input"
                placeholder="请选择题目题型"
              >
                <el-option
                  v-for="item in questionListType"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--题目类型-->
          <el-col :span="12">
            <el-form-item label="题目类型" prop="questionType">
              <el-select
                v-model="form.questionType"
                clearable
                class="question-input"
                placeholder="请选择题目类型"
              >
                <el-option
                  v-for="item in DIC.typeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--题目难度-->
          <el-col :span="12">
            <el-form-item label="题目难度" prop="difficulty">
              <el-select
                v-model="form.difficulty"
                clearable
                class="question-input"
                placeholder="请选择题目难度"
              >
                <el-option
                  v-for="item in DIC.difficultyList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--题目分值-->
          <el-col :span="12">
            <el-form-item label="题目分值" prop="score">
              <el-input
                v-model="form.score"
                placeholder="请输入题目分值"
                clearable
                class="question-input"
              />
            </el-form-item>
          </el-col>
          <!--所属课程-->
          <el-col :span="12">
            <el-form-item label="所属课程" prop="courseId">
              <el-select
                v-model="form.courseId"
                clearable
                class="question-input"
                placeholder="请选择所属课程"
                @change="getLessonList"
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
            <el-form-item label="所属课时" prop="lessonId">
              <el-select
                v-model="form.lessonId"
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
          <!--题目选项-->
          <el-col
            v-for="(item, index) in singleArray"
            v-if="form.typeId === 1 || form.typeId === 2 || form.typeId === 3"
            :key="index">
            <el-col :span="20">
              <el-form-item :label="'选项'+ letterArray[index]">
                <el-input
                  v-model="singleArray[index]"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  type="textarea"
                  class="question-textarea"
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
          </el-col>
          <!-- 题目答案 -->
          <el-col v-if="form.typeId != 7" :span="24">
            <el-form-item label="题目答案" prop="answer">
              <!-- 非选择题 -->
              <el-input
                v-if="form.typeId !== 1 && form.typeId !== 2 && form.typeId !==3 && form.typeId !== 4"
                v-model="form.answer"
                :autosize="{ minRows: 2, maxRows: 6}"
                type="textarea"
                placeholder="请输入题目答案"
                clearable
                class="question-textarea"
              />
              <!-- 选择题 -->
              <el-radio-group v-if="form.typeId === 1" v-model="form.answer">
                <el-radio
                  v-for="(item, index) in singleArray"
                  :key="index"
                  :label="letterArray[index]"
                >{{ letterArray[index] }}</el-radio>
              </el-radio-group>
              <!-- 多选题 -->
              <el-checkbox-group v-if="form.typeId === 2 || form.typeId === 3" v-model="checkArray">
                <el-checkbox
                  v-for="(item, index) in singleArray"
                  :key="index"
                  :value="index"
                  :label="letterArray[index]"
                >{{ letterArray[index] }}</el-checkbox>
              </el-checkbox-group>
              <!-- 判断题 -->
              <el-radio-group v-if="form.typeId === 4" v-model="form.answer">
                <el-radio :label="'true'">正确</el-radio>
                <el-radio :label="'false'">错误</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--题目解析-->
          <el-col :span="24">
            <el-form-item label="题目解析" prop="analysis">
              <el-input
                v-model="form.analysis"
                :autosize="{ minRows: 2, maxRows: 6}"
                type="textarea"
                placeholder="请输入题目解析"
                clearable
                class="question-textarea"
              />
            </el-form-item>
          </el-col>

          <!--图片上传-->
          <el-col :span="24">
            <el-form-item prop="img" label="图片上传:" :label-width="formLabelWidth">
              <single-image v-model="form.imgUrl" :type="7" />
            </el-form-item>
          </el-col>
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
  getLessonList,
  getAllQuestion
} from '@/api/question/question'
import { mapGetters } from 'vuex'
import { getToken } from '@/api/qiniu'

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
    const DIC = {
      typeList: [
        {
          label: '练习题',
          value: 1
        },
        {
          label: '历年真题',
          value: 2
        }
      ],
      difficultyList: [
        {
          label: '简单',
          value: 1
        },
        {
          label: '中等',
          value: 2
        },
        {
          label: '复杂',
          value: 3
        },
        {
          label: '极难',
          value: 4
        }
      ]
    }
    return {
      DIC: DIC,
      tableKey: 0,
      headers: {
        Authorization: 'Bearer ' + getToken
      },
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
          prop: 'typeId',
          // dicUrl: `/question/questiontype/getAllQuestion`,
          // dicData: "typeId",
          // props: {
          //   label: "name",
          //   value: "id"
          // }
          width: 100
        },
        {
          label: '题目内容',
          prop: 'stem'
        },
        {
          label: '题目类型',
          prop: 'questionType',
          dicData: DIC.typeList,
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
          dicData: DIC.difficultyList,
          width: 60
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
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getCourseList()
    this.getQuestionType()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const param = { parentId: 0 }
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
    getLessonList() {
      getLessonList(this.form.courseId).then(res => {
        this.lessonList = res.data
      })
    },
    /**
     * 题目题型
     */
    getQuestionType() {
      getAllQuestion().then(res => {
        this.questionListType = res.data
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
          parentId: row.id
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
      this.form = {}
    },
    /**
     * 文件上传方法
     * @param file
     * @returns {boolean|boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 文件上传成功后方法
     * @param res
     * @param file
     */
    handleSuccess(res, file) {
      console.log('res', res)
      // this.$qiniuAddr + res.key
    },
    handleRemove() {},
    getNodeData() {},
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
<style>
.question-textarea {
  width: 90%;
}
.question-input {
  width: 250px;
}

.course-upload__tip {
  font-size: 12px;
  color: #ff0000;
  margin-top: 7px;
  margin-left: 100px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
