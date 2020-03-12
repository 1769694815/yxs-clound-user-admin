<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-12 18:13:53
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--班级名称-->
      <el-form-item label="班级名称:" label-width="80px">
        <el-input v-model="searchForm.title" type="text" size="small" placeholder="请输入班级名称" />
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
      menu-width="160"
      @handle-create="handleCreate"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="role" slot-scope="scope">
        <el-tag>{{ scope.row.role }}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleCourse(scope.row)">课程管理</el-button>
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
      :before-close="closeDialog"
    >
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="120px">
          <!--班级标题-->
          <el-col :span="12">
            <el-form-item label="班级标题" prop="title">
              <el-input
                v-model="form.title"
                :disabled="operationStatus === 1"
                placeholder="请输入班级标题"
                clearable
                class="classroom-input"
              />
            </el-form-item>
          </el-col>
          <!--班级状态-->
          <el-col :span="12">
            <el-form-item label="班级状态" prop="status">
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="common_release_status"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--班主任-->
          <el-col :span="12">
            <el-form-item label="班主任" prop="headmasterId">
              <single-change
                v-model="form.headmasterId"
                :disabled="operationStatus === 1"
                :dic-prop="{ label: 'username', value: 'userId' }"
                dic-url="/admin/user/getTeacherList"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--班级助教-->
          <el-col :span="12">
            <el-form-item label="班级助教" prop="assistantId">
              <single-change
                v-model="form.assistantId"
                :disabled="operationStatus === 1"
                :dic-prop="{ label: 'username', value: 'userId' }"
                dic-url="/admin/user/getTeacherList"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--班级分类-->
          <el-col :span="12">
            <el-form-item label="班级分类" prop="categoryIds">
              <Input-tree
                v-model="form.categoryIds"
                :tree-data="treeData"
                :disabled="operationStatus === 1"
                multiline
                placeholder="请选择班级分类"
              />
            </el-form-item>
          </el-col>
          <!--授课方式-->
          <el-col :span="12">
            <el-form-item label="授课方式" prop="teachingMethod">
              <single-change
                v-model="form.teachingMethod"
                :disabled="operationStatus === 1"
                status-type="teaching_method"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--班级价格-->
          <el-col :span="12">
            <el-form-item label="班级价格" prop="price">
              <el-input-number
                v-model="form.price"
                autocomplete="off"
                placeholder="请输入班级价格"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--填写人数-->
          <el-col :span="12">
            <el-form-item label="填写人数" prop="learnNum">
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
          <!--推荐序号-->
          <el-col :span="12">
            <el-form-item label="推荐序号" prop="recommendedSeq">
              <el-input-number
                v-model="form.recommendedSeq"
                autocomplete="off"
                placeholder="请输入推荐序号"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--是否为推荐班级-->
          <el-col :span="12">
            <el-form-item label="推荐首页" prop="recommendedFlag">
              <single-change
                v-model="form.recommendedFlag"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--是否开放展示-->
          <el-col :span="12">
            <el-form-item label="开放展示" prop="showFlag">
              <single-change
                v-model="form.showFlag"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--学习有效期模式-->
          <el-col :span="12">
            <el-form-item label="有效期" prop="expiryMode">
              <single-change
                v-model="form.expiryMode"
                :disabled="operationStatus === 1"
                status-type="classroom_expiry_mode"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--有效天数-->
          <el-col :span="12">
            <el-form-item label="有效天数" prop="expiryDays">
              <el-input-number
                v-model="form.expiryDays"
                autocomplete="off"
                placeholder="请输入有效天数"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <!--报名截止日期-->
          <el-col :span="12">
            <el-form-item label="报名截止" prop="closeDate">
              <el-date-picker
                v-model="form.closeDate"
                :disabled="operationStatus === 1"
                type="date"
                placeholder="请输入报名截止日期"
                clearable
                class="classroom-input"
              />
            </el-form-item>
          </el-col>
          <!--班级说明-->
          <el-col :span="12">
            <el-form-item label="班级说明" prop="description">
              <el-input
                v-model="form.description"
                :disabled="operationStatus === 1"
                placeholder="请输入班级说明"
                clearable
                class="classroom-input"
              />
            </el-form-item>
          </el-col>
          <!-- 图片上传 -->
          <el-col :span="12">
            <el-form-item prop="smallPicture" label="图片上传:">
              <single-image
                v-model="form.smallPicture"
                :disabled="operationStatus === 1"
                status="6"
              />
            </el-form-item>
          </el-col>
          <!--班级简介-->
          <el-col :span="24">
            <el-form-item label="班级简介" prop="about">
              <tinymce ref="tinymce" v-model="form.about" :readonly="operationStatus === 1" :height="300" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="primary" size="small" @click="create('dataForm')">保 存</el-button>
        <el-button size="small" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <course-modal
      :modal-show="modalShow"
      :classroom-id="classroomId"
      :left-data="courseList"
      :right-data="courseRightList"
      @hide-modal="hideModal"
      @success="success"
    />
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  getCourseSimpleById
} from '@/api/classroom/classroom'
import { getCourseSimpleList } from '@/api/course/course'
import { mapGetters } from 'vuex'
import InputTree from '@/components/InputTree/index'
import { getCategoryTreeByNotType } from '@/api/course/category'
import CourseModal from './courseModal.vue'
import Tinymce from '@/components/Tinymce/index'

export default {
  components: {
    InputTree,
    CourseModal,
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
      modalShow: false,
      courseList: [],
      courseRightList: [],
      classroomId: null,
      tableOption: [
        {
          width: 100,
          label: '标题',
          prop: 'title'
        },
        {
          width: 100,
          label: '状态',
          prop: 'status',
          dicUrl: 'common_release_status',
          dicData: []
        },
        {
          width: 80,
          label: '授课方式',
          prop: 'teachingMethod',
          dicUrl: 'teaching_method',
          dicData: []
        },
        {
          width: 60,
          label: '价格',
          prop: 'price'
        },
        {
          width: 80,
          label: '填写人数',
          prop: 'learnNum'
        },
        {
          width: 80,
          label: '课程数',
          prop: 'courseNum'
        },
        {
          width: 80,
          label: '课时数',
          prop: 'lessonNum'
        },
        {
          width: 110,
          label: '封闭班级',
          prop: 'privateFlag',
          dicUrl: 'common_flag',
          dicData: [],
          hide: true
        },
        {
          width: 120,
          label: '推荐首页',
          prop: 'recommendedFlag',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '开放展示',
          width: 110,
          prop: 'showFlag',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '开放购买',
          width: 110,
          prop: 'buyFlag',
          dicUrl: 'common_flag',
          dicData: [],
          hide: true
        },
        {
          width: 160,
          label: '创建时间',
          prop: 'createTime'
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
      form: {
        topFlag: 0
      }, // 新增 编辑 数据源
      rules: {
        // 表单校验
        title: [
          { required: true, message: '请输入班级标题', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择班级状态', trigger: 'change' }
        ],
        categoryIds: [
          { required: true, message: '请选择班级分类', trigger: 'change' }
        ],
        teachingMethod: [
          { required: true, message: '请选择授课方式', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入班级价格', trigger: 'blur' }
        ],
        learnNum: [
          { required: true, message: '请输入填写人数', trigger: 'blur' }
        ],
        recommendedSeq: [
          { required: true, message: '请输入推荐序号', trigger: 'blur' }
        ],
        privateFlag: [
          { required: false, message: '请选择是否封闭', trigger: 'change' }
        ],
        recommendedFlag: [
          { required: true, message: '请选择是否推荐到首页', trigger: 'change' }
        ],
        showFlag: [
          { required: true, message: '请选择是否开放展示', trigger: 'change' }
        ],
        buyFlag: [
          { required: false, message: '请选择是否开放购买', trigger: 'change' }
        ],
        expiryMode: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ],
        expiryDays: [
          { required: true, message: '请输入有效天数', trigger: 'blur' }
        ],
        closeDate: [
          { required: true, message: '请输入报名截止时间', trigger: 'blur' }
        ],
        about: [
          { required: true, validator: tinymceValidate, message: '请输入班级简介', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入班级说明', trigger: 'blur' }
        ],
        smallPicture: [
          { required: true, message: '请上传班级图片', trigger: 'change' }
        ]
      },
      dataObj: { token: '', key: '' },
      imageUrl: '', // 图片地址
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['permissions', 'access_token'])
  },
  created() {
    this.getList()
    this.getCategoryTree()
    this.headers.Authorization = 'Bearer ' + this.access_token
  },
  methods: {
    /**
     * 班级分类
     */
    getCategoryTree() {
      getCategoryTreeByNotType(2).then(res => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            descs: 'id',
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
          this.tableLoading = true
          if (this.form.id != null) {
            putObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }).catch(() => {
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
            }).catch(() => {
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
        status: '0',
        teachingMethod: '0',
        price: 0,
        learnNum: 0,
        recommendedSeq: 0,
        privateFlag: '0',
        recommendedFlag: '0',
        buyFlag: '1',
        showFlag: '1',
        expiryMode: '0',
        expiryDays: 365
      }
      this.form.about = ''
      this.init()
    },
    getNodeData() {},
    hideModal() {
      this.modalShow = false
    },
    /**
     * 课程管理页面
     */
    handleCourse(row, index) {
      this.modalShow = true
      this.classroomId = row.id
      getCourseSimpleList().then(res => {
        this.courseList = res.data.data
      })
      getCourseSimpleById(row.id).then(res => {
        this.courseRightList = res.data.data
      })
    },
    success() {
      this.modalShow = false
      this.getList()
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
<style lang="scss" scoped>
.classroom-input {
  width: 100%;
}
</style>
