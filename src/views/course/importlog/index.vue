<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索栏 -->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <el-form-item v-if="false" label="导入类型:" label-width="80px">
        <single-change
          v-model="searchForm.type"
          status-type="course_import_type"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item label="导入状态:" label-width="80px">
        <single-change
          v-model="searchForm.status"
          status-type="course_import_status"
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
      :add-btn="false"
      @handle-create="handleCreate"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="menuLeft">
        <el-button
          v-if="permissions['course_importlog_add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button>
        <el-button
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="$router.go(-1)"
        >返回</el-button>
      </template>
      <template slot="role" slot-scope="scope">
        <el-tag>{{ scope.row.role }}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button v-if="permissions['course_importlog_reGenResultFile']" type="text" icon="el-icon-view" size="mini" @click="handleDownLoad(scope.row)">下载导入结果</el-button>
        <el-button
          v-if="permissions['course_importlog_edit']"
          type="text"
          icon="el-icon-view"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑</el-button>
        <el-button
          v-if="permissions['course_importlog_del']"
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(scope.row, scope.index)"
        >删除</el-button>
      </template>
    </Xtable>
    <!-- 表单弹窗 -->
    <el-dialog :visible.sync="dialogPvVisible" :title="operationStatus | dialogTitle">
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="dataForm" :rules="formRules" :model="form">
          <el-col :span="12">
            <el-form-item prop="type" label="导入类型：" :label-width="formLabelWidth">
              <single-change
                v-model="form.type"
                :disabled="operationStatus === 1"
                status-type="course_import_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="rawFile" label="原始文件:" :label-width="formLabelWidth">
              <el-input
                v-model="form.rawFile"
                autocomplete="off"
                placeholder="请输入原始文件路径"
                :readonly="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="resultFile" label="导入结果:" :label-width="formLabelWidth">
              <el-input
                v-model="form.resultFile"
                autocomplete="off"
                placeholder="请输入导入结果文件"
                :readonly="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" label="导入状态:" :label-width="formLabelWidth">
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="course_import_status"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="successNum" label="成功数量:" :label-width="formLabelWidth">
              <el-input
                v-model="form.successNum"
                autocomplete="off"
                placeholder="请输入成功数量"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="failedNum" label="失败数量:" :label-width="formLabelWidth">
              <el-input
                v-model="form.failedNum"
                autocomplete="off"
                placeholder="请输入失败数量"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="total" label="总数量:" :label-width="formLabelWidth">
              <el-input
                v-model="form.total"
                autocomplete="off"
                placeholder="请输入总数量"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="createBy" label="创建人:" :label-width="formLabelWidth">
              <el-input
                v-model="form.createBy"
                autocomplete="off"
                placeholder="请输入创建人"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="createTime" label="导入时间:" :label-width="formLabelWidth">
              <el-input
                v-model="form.createTime"
                autocomplete="off"
                placeholder="请输入创建时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="updateTime" label="完成时间:" :label-width="formLabelWidth">
              <el-input
                v-model="form.updateTime"
                autocomplete="off"
                placeholder="请输入完成时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="resultJson" label="结果JSON:" :label-width="formLabelWidth">
              <el-input
                v-model="form.resultJson"
                type="textarea"
                :rows="5"
                autocomplete="off"
                placeholder="请输入导入结果JSON"
                :readonly="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.exceptionDetail!=null&&form.exceptionDetail!=''" :span="24">
            <el-form-item prop="exceptionDetail" label="异常信息:" :label-width="formLabelWidth">
              <el-input
                v-model="form.exceptionDetail"
                type="textarea"
                :rows="5"
                autocomplete="off"
                placeholder="请输入异常信息"
                :readonly="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button v-if="operationStatus === 0" type="primary" size="small" @click="create">保 存</el-button>
        <el-button v-if="operationStatus === 2" type="primary" size="small" @click="update">修 改</el-button>
        <el-button size="small" @click="dialogPvVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj, reGenResultFile } from '@/api/course/importlog'
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
          label: 'id',
          prop: 'id',
          hide: true
        },
        {
          label: '导入类型',
          prop: 'type',
          dicUrl: 'course_import_type',
          dicData: []
        },
        {
          label: '原始文件路径',
          hide: true,
          prop: 'rawFile'
        },
        {
          label: '导入结果文件',
          hide: true,
          prop: 'resultFile'
        },
        {
          label: '导入状态',
          prop: 'status',
          dicUrl: 'course_import_status',
          dicData: []
        },
        {
          label: '成功数量',
          prop: 'successNum'
        },
        {
          label: '失败数量',
          prop: 'failedNum'
        },
        {
          label: '总数量',
          prop: 'total'
        },
        {
          label: '导入时间',
          prop: 'createTime'
        },
        {
          label: '导入人',
          prop: 'createBy'
        },
        {
          label: '完成时间',
          prop: 'updateTime'
        },
        {
          label: '更新人',
          prop: 'updateBy'
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {},
      searchForm: {},
      dialogPvVisible: false,
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
            type: this.$route.query.type,
            objId: this.$route.query.objId
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
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    /**
     * 点击查看
     */
    handleView(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.form = row
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
    handleDownLoad(row, index) {
      if (row.resultFile == null || row.resultFile == '') {
        reGenResultFile(row.id).then(res => {
          var elemIF = document.createElement('iframe')
          elemIF.src = res.data.data.resultFile
          elemIF.style.display = 'none'
          document.body.appendChild(elemIF)
        })
      } else {
        var elemIF = document.createElement('iframe')
        elemIF.src = row.resultFile
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
    },
    /**
     * 新增保存
     */
    create() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.tableLoading = true
          addObj(this.form)
            .then(res => {
              this.dialogPvVisible = false
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
      this.$refs.dataForm.validate(valid => {
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
