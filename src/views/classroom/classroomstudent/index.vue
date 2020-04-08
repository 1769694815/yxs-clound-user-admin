<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索栏 -->
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
    >

      <el-form-item label="加入方式:" label-width="80px">
        <single-change
          v-model="searchForm.joinType"
          status-type="classroom_join_type"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item label="已学完:" label-width="80px">
        <single-change
          v-model="searchForm.finish"
          status-type="common_flag"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item label="锁定:" label-width="80px">
        <single-change
          v-model="searchForm.locked"
          status-type="common_flag"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleFilter"
        >搜 索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="default"
          icon="el-icon-delete"
          size="small"
          @click="handleEmpty"
        >清 空
        </el-button>
      </el-form-item>
    </el-form>
    <Xtable
      :table-key="tableKey"
      :table-loading="tableLoading"
      :table-data="tableData"
      :page="page"
      :table-option.sync="tableOption"
      :add-btn="false"
      @handle-create="handleCreate"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="$router.go(-1)"
        >返回</el-button>
        <el-button
          v-if="permissions['classroom_classroomstudent_add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button>
        <el-button
          v-if="permissions['classroom_classroomstudent_import_template']"
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="handleDownload"
        >下载导入模板</el-button>
        <el-button
          v-if="permissions['classroom_classroomstudent_import']"
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="handleImport"
        >导入学员</el-button>
        <el-button
          v-if="permissions['classroom_importlog_list']"
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="handleImportLog"
        >导入记录</el-button>
      </template>
      <template
        slot="role"
        slot-scope="scope"
      >
        <el-tag>{{ scope.row.role }}</el-tag>
      </template>
      <template
        slot="menu"
        slot-scope="scope"
      >
        <el-button
          type="text"
          icon="el-icon-view"
          size="mini"
          @click="handleView(scope.row)"
        >查看
        </el-button>
        <el-button
          v-if="permissions['classroom_classroomstudent_edit']"
          type="text"
          icon="el-icon-view"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="permissions['classroom_classroomstudent_del']"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(scope.row, scope.index)"
        >删除
        </el-button>
      </template>
    </Xtable>

    <!-- 表单弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :title="operationStatus | dialogTitle"
    >
      <el-row
        style="padding: 0 20px;"
        :span="24"
        :gutter="20"
      >
        <el-form
          ref="dataForm"
          :rules="formRules"
          :model="form"
        >

          <el-col :span="12">
            <el-form-item
              prop="joinType"
              label="加入方式:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.joinType"
                :disabled="operationStatus === 1"
                status-type="classroom_join_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="studentId" label="学员姓名:" :label-width="formLabelWidth">
              <el-input
                v-model="form.studentName"
                autocomplete="off"
                placeholder="请输入学员姓名"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="deadline" label="过期时间:" :label-width="formLabelWidth">
              <el-input
                v-model="form.deadline"
                autocomplete="off"
                placeholder="过期时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="finish" label="已学完:" :label-width="formLabelWidth">
              <single-change
                v-model="form.finish"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="finishTime" label="完成时间:" :label-width="formLabelWidth">
              <el-input
                v-model="form.finishTime"
                autocomplete="off"
                placeholder="请输入完成时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sort" label="排序:" :label-width="formLabelWidth">
              <el-input
                v-model="form.sort"
                autocomplete="off"
                placeholder="请输入排序"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark" label="备注:" :label-width="formLabelWidth">
              <el-input
                v-model="form.remark"
                autocomplete="off"
                placeholder="请输入备注"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="locked" label="锁定:" :label-width="formLabelWidth">
              <single-change
                v-model="form.locked"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="createTime" label="加入时间:" :label-width="formLabelWidth">
              <el-input
                v-model="form.createTime"
                autocomplete="off"
                placeholder="请输入学员加入课程时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          v-if="operationStatus === 0"
          type="primary"
          size="small"
          @click="create"
        >保 存
        </el-button>
        <el-button
          v-if="operationStatus === 2"
          type="primary"
          size="small"
          @click="update"
        >修 改
        </el-button>
        <el-button
          size="small"
          @click="dialogPvVisible = false"
        >取 消
        </el-button>
      </div>
    </el-dialog>
    <!-- 表单弹窗 -->
    <el-dialog
      :visible.sync="AddDialogPvVisible"
      :title="operationStatus | dialogTitle"
    >
      <el-row
        style="padding: 0 20px;"
        :span="24"
        :gutter="20"
      >
        <el-form
          ref="dataForm"
          :rules="formRules"
          :model="form"
        >
          <el-col :span="12">
            <el-form-item prop="realName" label="真实姓名:" :label-width="formLabelWidth">
              <el-input
                v-model="form.realName"
                autocomplete="off"
                placeholder="请输入真实姓名"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone" label="手机号:" :label-width="formLabelWidth">
              <el-input
                v-model="form.phone"
                autocomplete="off"
                placeholder="手机号"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="idCard" label="身份证号:" :label-width="formLabelWidth">
              <el-input
                v-model="form.idCard"
                autocomplete="off"
                placeholder="手机号"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark" label="备注:" :label-width="formLabelWidth">
              <el-input
                v-model="form.remark"
                autocomplete="off"
                placeholder="请输入备注"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          v-if="operationStatus === 0"
          type="primary"
          size="small"
          @click="create"
        >保 存
        </el-button>
        <el-button
          v-if="operationStatus === 2"
          type="primary"
          size="small"
          @click="update"
        >修 改
        </el-button>
        <el-button
          size="small"
          @click="AddDialogPvVisible = false"
        >取 消
        </el-button>
      </div>
    </el-dialog>
    <!-- 表单弹窗 -->
    <el-dialog :visible.sync="importView" title="导入学员">
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="importDataForm" :rules="importFormRules" :model="form">
          <el-col :span="12">
            <el-form-item prop="fileList" label="导入学员" :label-width="formLabelWidth">
              <singleFile
                ref="importDataUpload"
                v-model="form.fileList"
                title="请选择导入文件"
                :limit="1"
                accept=".xls,.xlsx"
                :status="12"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="primary" size="small" @click="importStudent">提交</el-button>
        <el-button size="small" @click="importView = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj, importStudent } from '@/api/classroom/classroomstudent'
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
      tableOption: [
        {
          label: '课程学员记录ID',
          prop: 'id',
          hide: true
        }, {
          label: '班级标题',
          prop: 'classroomTitle',
          width: '250'
        }, {
          label: '加入方式',
          prop: 'joinType',
          dicUrl: 'classroom_join_type',
          dicData: []
        }, {
          label: '学员姓名',
          prop: 'studentName'
        }, {
          label: '过期时间',
          prop: 'deadline',
          width: '160'
        }, {
          label: '已学完',
          prop: 'finish',
          dicUrl: 'common_flag',
          dicData: []
        }, {
          label: '完成时间',
          prop: 'finishTime',
          width: '160'
        }, {
          label: '排序',
          prop: 'sort'
        }, {
          label: '备注',
          prop: 'remark'
        }, {
          label: '锁定',
          prop: 'locked',
          dicUrl: 'common_flag',
          dicData: []
        }, {
          label: '创建人',
          prop: 'createUserId',
          hide: true
        }, {
          label: '加入时间',
          prop: 'createTime',
          width: '160'
        }, {
          label: '更新人',
          prop: 'updateUserId',
          hide: true
        }, {
          label: '最后更新时间',
          prop: 'updateTime',
          hide: true
        }, {
          label: '租户id',
          prop: 'tenantId',
          hide: true
        }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ]
      },
      importFormRules: {
        fileList: [
          { required: true, message: '请选择要导入的文件', trigger: 'blur' }
        ]
      },
      searchForm: {},
      dialogPvVisible: false,
      AddDialogPvVisible: false,
      importView: false,
      operationStatus: 0,
      form: {},
      formLabelWidth: '90px'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },
  methods: {
    /**
             * 获取列表数据
             */
    getList() {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.page.current,
            size: this.page.size,
            classroomId: this.$route.query.classroomId
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
             * 搜索
             */
    handleFilter() {
      this.getList()
    },
    /**
             * 清空搜索表单
             */
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    /**
             * 点击新增
             */
    handleCreate() {
      this.AddDialogPvVisible = true
      this.operationStatus = 0
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.form = {
          classroomId: this.$route.query.classroomId
        }
      })
    },
    /**
             * 点击查看
             */
    handleView(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      this.form = row
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    /**
             * 点击编辑
             */
    handleUpdate(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    handleDownload() {
      var elemIF = document.createElement('iframe')
      elemIF.src = 'classroom/classroomstudent/import/template'
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    },
    handleImport() {
      this.importView = true
      this.$nextTick(() => {
        this.$refs.importDataUpload.clearFiles()
      })
    },
    importStudent() {
      this.$refs.importDataForm.validate(valid => {
        if (valid) {
          this.tableLoading = true
          let fileList = []
          if (typeof (this.form.fileList) === 'string') {
            fileList = JSON.parse(this.form.fileList)
          }
          this.form.fileUrl = fileList[0].url
          this.form.classroomId = this.$route.query.classroomId
          importStudent(this.form)
            .then(res => {
              this.importView = false
              this.tableLoading = false
              this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
              })
            })
            .catch(() => {
              this.tableLoading = false
            })
        }
      })
    },
    handleImportLog() {
      this.$router.push({
        path: '/classroom/importlog',
        query: {
          type: 0,
          objId: this.$route.query.classroomId
        }
      })
    },
    /**
             * 新增保存
             */
    create() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.tableLoading = true
            addObj(this.form)
              .then(res => {
                this.AddDialogPvVisible = false
                this.tableLoading = false
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.getList()
              })
              .catch(() => {
                this.tableLoading = false
              })
          }
        })
    },
    /**
             * 编辑保存
             */
    update() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.tableLoading = true
            putObj(this.form)
              .then(res => {
                this.dialogPvVisible = false
                this.tableLoading = false
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.getList()
              })
              .catch(() => {
                this.tableLoading = false
              })
          }
        })
    },
    /**
             * 点击删除
             */
    handleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    }

  }
}
</script>
