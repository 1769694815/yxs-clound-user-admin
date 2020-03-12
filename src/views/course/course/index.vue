<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-12 18:03:51
 * @Description: 课程管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--课程标题-->
      <el-form-item label="课程标题:" label-width="80px">
        <el-input v-model="searchForm.title" type="text" size="small" placeholder="请输入课程标题" />
      </el-form-item>
      <!--是否推荐-->
      <el-form-item label="是否推荐:" label-width="80px">
        <single-change
          v-model="searchForm.recommend"
          :disabled="operationStatus === 1"
          status-type="common_flag"
          type="select"
        />
      </el-form-item>
      <!--开售标志-->
      <el-form-item label="开售标志:" label-width="130px">
        <single-change
          v-model="searchForm.buyFlag"
          :disabled="operationStatus === 1"
          status-type="common_flag"
          type="select"
        />
      </el-form-item>
      <!--课程类型-->
      <el-form-item label="课程类型:" label-width="80px">
        <single-change
          v-model="searchForm.type"
          :disabled="operationStatus === 1"
          status-type="course_type"
          type="select"
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
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleChapterList(scope.row,scope.index)"
        >章节列表</el-button>
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
      :before-close="closeDialog"
    >
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="dataForm" :model="form" :rules="rules">
          <!--课程标题-->
          <el-col :span="12">
            <el-form-item label="课程标题" prop="title" :label-width="formLabelWidth">
              <el-input
                v-model="form.title"
                :disabled="operationStatus === 1"
                placeholder="请输入课程标题"
                clearable
                class="course-input"
              />
            </el-form-item>
          </el-col>
          <!--副标题-->
          <el-col :span="12">
            <el-form-item label="副标题" prop="brife" :label-width="formLabelWidth">
              <el-input
                v-model="form.brife"
                :disabled="operationStatus === 1"
                placeholder="请输入副标题"
                clearable
                class="course-input"
              />
            </el-form-item>
          </el-col>
          <!--课程类型-->
          <el-col :span="12">
            <el-form-item label="课程类型" prop="type" :label-width="formLabelWidth">
              <single-change
                v-model="form.type"
                :disabled="operationStatus === 1"
                status-type="course_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--课程分类-->
          <el-col :span="12">
            <el-form-item label="课程分类" prop="categoryIds" :label-width="formLabelWidth">
              <Input-tree
                v-model="form.categoryIds"
                :tree-data="treeData"
                :disabled="operationStatus === 1"
                multiline
                title="课程分类"
                placeholder="请选择课程分类"
              />
            </el-form-item>
          </el-col>
          <!--课程讲师-->
          <el-col :span="12">
            <el-form-item label="课程讲师" prop="teacherId" :label-width="formLabelWidth">
              <el-select
                v-model="form.teacherId"
                clearable
                :disabled="operationStatus === 1"
                class="course-input"
                placeholder="请选择课程讲师"
              >
                <el-option
                  v-for="item in tearcherList"
                  :key="item.username"
                  :label="item.username"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课程价格-->
          <el-col :span="12">
            <el-form-item label="课程价格" prop="price" :label-width="formLabelWidth">
              <el-input-number
                v-model="form.price"
                autocomplete="off"
                placeholder="请输入课程价格"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--课程状态-->
          <el-col :span="12">
            <el-form-item label="课程状态" prop="status" :label-width="formLabelWidth">
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="common_release_status"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--连载状态-->
          <el-col :span="12">
            <el-form-item label="连载状态" prop="serialStatus" :label-width="formLabelWidth">
              <single-change
                v-model="form.serialStatus"
                :disabled="operationStatus === 1"
                status-type="course_serial_status"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--是否推荐-->
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="recommend" :label-width="formLabelWidth">
              <single-change
                v-model="form.recommend"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--开售标志-->
          <el-col :span="12">
            <el-form-item label="开售标志" prop="buyFlag" :label-width="formLabelWidth">
              <single-change
                v-model="form.buyFlag"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--视频拖动-->
          <el-col :span="12">
            <el-form-item label="视频拖动" prop="drag" :label-width="formLabelWidth">
              <single-change
                v-model="form.drag"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--倍速播放-->
          <el-col :span="12">
            <el-form-item label="倍速播放" prop="doubleSpeed" :label-width="formLabelWidth">
              <single-change
                v-model="form.doubleSpeed"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--有效天数-->
          <el-col :span="12">
            <el-form-item label="有效天数" prop="effectiveDays" :label-width="formLabelWidth">
              <el-input-number
                v-model="form.effectiveDays"
                autocomplete="off"
                placeholder="请输入有效天数"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--课程排序-->
          <el-col :span="12">
            <el-form-item label="课程排序" prop="sort" :label-width="formLabelWidth">
              <el-input-number
                v-model="form.sort"
                autocomplete="off"
                placeholder="请输入课程排序"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--填写人数-->
          <el-col :span="12">
            <el-form-item label="填写人数" prop="learnNum" :label-width="formLabelWidth">
              <el-input-number
                v-model="form.learnNum"
                autocomplete="off"
                placeholder="请输入填写人数"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>

          <!--课程简叙-->
          <el-col :span="24">
            <el-form-item label="课程简叙" prop="subtitle" :label-width="formLabelWidth">
              <el-input
                v-model="form.subtitle"
                :disabled="operationStatus === 1"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入课程简叙"
                clearable
                class="course-input"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <!--课程简介-->
          <el-col :span="24">
            <el-form-item label="课程简介" prop="about" :label-width="formLabelWidth">
              <tinymce
                ref="tinymce"
                v-model="form.about"
                :readonly="operationStatus === 1"
                :height="300"
              />
            </el-form-item>
          </el-col>

          <!--图片上传-->
          <el-col :span="24">
            <el-form-item prop="smallPicture" label="图片上传:" :label-width="formLabelWidth">
              <single-image
                v-model="form.smallPicture"
                :disabled="operationStatus === 1"
                status="5"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="primary" size="small" @click="create('dataForm')">保 存</el-button>
        <el-button size="small" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addObj, putObj, delObj } from '@/api/course/course'
import { getTeacherList } from '@/api/user'
import { getCategoryTreeByNotType } from '@/api/course/category'
import { mapGetters } from 'vuex'
import InputTree from '@/components/InputTree/index'
import Tinymce from '@/components/Tinymce/index'

export default {
  components: {
    InputTree,
    Tinymce
  },
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
    const tinymceValidate = (rule, value, callback) => {
      if (this.form.about === '') {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      tableLoading: false,
      tearcherList: [],
      treeData: [],
      tableOption: [
        {
          label: '课程标题',
          prop: 'title',
          width: '160'
        },
        {
          label: '课程类型',
          prop: 'type',
          width: '80',
          dicUrl: 'course_type',
          dicData: []

        },
        {
          label: '课程分类',
          prop: 'categoryName',
          width: '100'
        },
        {
          label: '课程状态',
          prop: 'status',
          width: '80',
          dicUrl: 'common_release_status',
          dicData: []
        },
        {
          label: '连载状态',
          prop: 'serialStatus',
          width: '120',
          dicUrl: 'course_serial_status',
          dicData: []
        },
        {
          label: '是否推荐',
          prop: 'recommend',
          width: '80',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '开售标志',
          prop: 'buyFlag',
          width: '80',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '价格',
          prop: 'price',
          width: '80'
        },
        {
          label: '有效天数',
          prop: 'effectiveDays',
          width: '80'
        },
        {
          label: '排序',
          prop: 'sort',
          width: '60'
        },
        {
          label: '教师',
          prop: 'teacherName',
          width: '80'
        },
        {
          label: '视频拖动',
          prop: 'drag',
          width: '80',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '倍速播放',
          prop: 'doubleSpeed',
          width: '80',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '160'
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
        title: [
          { required: true, message: '请输入课程标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        categoryIds: [
          { required: true, message: '请选择课程分类', trigger: 'change' }
        ],
        teacherId: [
          { required: true, message: '请选择课程讲师', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入课程价格', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择课程状态', trigger: 'change' }
        ],
        serialStatus: [
          { required: true, message: '请选择连载状态', trigger: 'change' }
        ],
        recommend: [
          { required: true, message: '请选择是否推荐', trigger: 'change' }
        ],
        buyFlag: [
          { required: true, message: '请选择开售标志', trigger: 'change' }
        ],
        drag: [
          { required: true, message: '请选择是否允许视频拖动', trigger: 'change' }
        ],
        doubleSpeed: [
          { required: true, message: '请选择是否允许倍速播放', trigger: 'change' }
        ],
        effectiveDays: [
          { required: true, message: '请输入有效天数', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入课程排序', trigger: 'blur' }
        ],
        learnNum: [
          { required: true, message: '请输入填写人数', trigger: 'blur' }
        ],
        subtitle: [
          { required: true, message: '请输入课程简叙', trigger: 'blur' }
        ],
        about: [
          { required: true, validator: tinymceValidate, message: '请输入课程简介', trigger: 'blur' }
        ],
        smallPicture: [
          { required: true, message: '请上传课程图片', trigger: 'change' }
        ]

      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getTeacherList()
    this.getCategoryTree(1)
  },
  methods: {
    groupTypeChange(type) {
      this.form.categoryIds = ''
      this.getCategoryTree(type)
    },
    getCategoryTree(type) {
      getCategoryTreeByNotType(type).then(res => {
        this.treeData = res.data.data
      })
    },
    getTeacherList() {
      getTeacherList().then(res => {
        this.tearcherList = res.data.data
      })
    },
    getList() {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.page.current,
            size: this.page.size
          },
          this.searchForm
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
          if (this.form.id != null) {
            putObj(this.form)
              .then(() => {
                this.dialogPvVisible = false
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
            addObj(this.form)
              .then(() => {
                this.dialogPvVisible = false
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
      this.init()
    },
    handleUpdate(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.init()
    },
    handleChapterList(row, index) {
      this.$router.push({
        path: '/course/coursechapter',
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
      this.operationStatus = 0
      let defaultTeacherId = null
      if (this.tearcherList.length > 0) {
        defaultTeacherId = this.tearcherList[0].userId
      }
      this.form = {
        type: '1',
        status: '1',
        serialStatus: '1',
        recommend: '0',
        buyFlag: '1',
        price: 0,
        sort: 0,
        drag: '0',
        doubleSpeed: '0',
        effectiveDays: 365,
        learnNum: 0,
        teacherId: defaultTeacherId
      }
      this.form.about = ''
      this.init()
    },
    /**
     * 初始化富文本编辑器
     */
    init() {
      this.$nextTick(() => {
        this.$refs.tinymce.init()
      })
    },
    closeDialog() {
      this.$nextTick(() => {
        if (this.$refs.tinymce.hasInit) {
          // this.form.body = ''
          this.$refs.tinymce.destroyTinymce()
        }
      })
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>
