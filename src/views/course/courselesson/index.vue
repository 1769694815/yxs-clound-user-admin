<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-12 17:26:47
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--课时标题-->
      <el-form-item label="课时标题:" label-width="80px">
        <el-input v-model="searchForm.title" type="text" size="small" placeholder="请输入课时标题" />
      </el-form-item>
      <!--是否免费-->
      <el-form-item label="是否免费:" label-width="80px">
        <single-change
          v-model="searchForm.free"
          :disabled="operationStatus === 1"
          status-type="common_flag"
          type="select"
          size="small"
        />
      </el-form-item>
      <!--课时状态-->
      <el-form-item label="课时状态:" label-width="130px">
        <single-change
          v-model="searchForm.status"
          :disabled="operationStatus === 1"
          status-type="common_release_status"
          type="select"
          size="small"
        />
      </el-form-item>
      <!--课时类型-->
      <el-form-item label="课时类型:" label-width="80px">
        <single-change
          v-model="searchForm.type"
          :disabled="operationStatus === 1"
          status-type="lesson_type"
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
          <!--课时标题-->
          <el-col :span="12">
            <el-form-item label="课时标题" prop="title" :label-width="formLabelWidth">
              <el-input
                v-model="form.title"
                :disabled="operationStatus === 1"
                placeholder="请输入课时标题"
                clearable
                class="lesson-input"
              />
            </el-form-item>
          </el-col>
          <!--是否免费-->
          <el-col :span="12">
            <el-form-item label="是否免费" prop="free" :label-width="formLabelWidth">
              <single-change
                v-model="form.free"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--课时状态-->
          <el-col :span="12">
            <el-form-item label="课时状态" prop="status" :label-width="formLabelWidth">
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="common_release_status"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--课时类型-->
          <el-col :span="12">
            <el-form-item label="课时类型" prop="type" :label-width="formLabelWidth">
              <single-change
                v-model="form.type"
                :disabled="operationStatus === 1"
                status-type="lesson_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <!--课时资源-->
          <el-col :span="12">
            <el-form-item label="课时资源" prop="mediaUri" :label-width="formLabelWidth">
              <el-input
                v-model="form.mediaUri"
                :disabled="operationStatus === 1"
                placeholder="请输入课时资源"
                clearable
                class="lesson-input"
              />
            </el-form-item>
          </el-col>
          <!--课时简介-->
          <el-col :span="12">
            <el-form-item label="课时简介" prop="content" :label-width="formLabelWidth">
              <el-input
                v-model="form.content"
                :disabled="operationStatus === 1"
                placeholder="请输入课时简介"
                clearable
                class="lesson-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
              <el-input-number
                v-model="form.sort"
                autocomplete="off"
                placeholder="请输入排序"
                :disabled="operationStatus === 1"
                :min="0"
                style="width: 100%;"
              />
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
import { fetchList, addObj, putObj, delObj } from '@/api/course/courselesson'
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
      lessonTypeList: [],
      tableOption: [
        {
          type: 'input',
          label: '标题',
          prop: 'title'
        },
        {
          label: '课程',
          prop: 'courseTitle'
        },
        {
          label: '章节',
          prop: 'courseChapterTitle'
        },
        {
          label: '排序',
          prop: 'sort'
        },
        {
          label: '是否免费',
          prop: 'free',
          dicUrl: 'common_flag',
          dicData: []
        },
        {
          label: '状态',
          prop: 'status',
          dicUrl: 'common_release_status',
          dicData: []
        },
        {
          label: '类型',
          prop: 'type',
          dicUrl: 'lesson_type',
          dicData: []
        },
        {
          label: '时长(秒)',
          prop: 'length'
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
      form: {}, // 新增 编辑 数据源
      rules: {
        // 表单校验
        title: [
          { required: true, message: '课时名称不能为空', trigger: 'blur' }
        ],
        mediaUri: [
          { required: true, message: '课时资源不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择课时类型', trigger: 'change' }
        ],
        free: [
          { required: true, message: '请选择课时是否免费', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择课时发布', trigger: 'change' }
        ]
      },
      formLabelWidth: '90px',
      dataObj: { token: '', key: '' },
      imageUrl: '' // 图片地址
    }
  },
  computed: {
    ...mapGetters(['permissions', 'access_token'])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      const params = {
        chapterId: this.$route.query.chapterId
      }
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.page.current,
            size: this.page.size
          },
          params,
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
              this.tableLoading = false
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
            this.form.chapterId = this.$route.query.chapterId
            this.form.courseId = this.$route.query.courseId
            addObj(this.form).then(() => {
              this.tableLoading = false
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
    },
    handleUpdate(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 2
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
        free: '0',
        status: '1',
        type: '1',
        sort: 0
      }
    },
    handleRemove() {}
  }
}
</script>
