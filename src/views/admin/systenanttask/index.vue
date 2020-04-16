<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索栏 -->
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
    >

      <el-form-item
        label="类型:"
        label-width="80px"
      >
        <single-change
          v-model="searchForm.status"
          :disabled="operationStatus === 1"
          status-type="tenant_task_status"
          type="select"
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
          v-if="permissions['admin_systenanttask_add']"
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
          v-if="permissions['admin_systenanttask_edit']"
          type="text"
          icon="el-icon-view"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="permissions['admin_systenanttask_del']"
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

          <el-col
            :span="12"
          >
            <el-form-item
              prop="id"
              label="id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.id"
                autocomplete="off"
                placeholder="请输入id"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="tenantId"
              label="租户id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.tenantId"
                autocomplete="off"
                placeholder="请输入租户id"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="status"
              label="状态:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="tenant_task_status"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="exceptionDetail"
              label="异常信息:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.exceptionDetail"
                autocomplete="off"
                placeholder="请输入异常信息"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="createTime"
              label="创建时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.createTime"
                autocomplete="off"
                placeholder="请输入创建时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="createBy"
              label="创建人:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.createBy"
                autocomplete="off"
                placeholder="请输入创建人"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="updateTime"
              label="修改时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.updateTime"
                autocomplete="off"
                placeholder="请输入修改时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="updateBy"
              label="修改人:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.updateBy"
                autocomplete="off"
                placeholder="请输入修改人"
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
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/systenanttask'
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
        }, {
          label: '租户id',
          prop: 'tenantId'
        }, {
          label: '状态',
          prop: 'status',
          dicUrl: 'tenant_task_status',
          dicData: []
        }, {
          label: '异常信息',
          prop: 'exceptionDetail',
          hide: true
        }, {
          label: '创建时间',
          prop: 'createTime'
        }, {
          label: '创建人',
          prop: 'createBy'
        }, {
          label: '修改时间',
          prop: 'updateTime'
        }, {
          label: '修改人',
          prop: 'updateBy'
        }],
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

      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.form = {}
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
        this.form = row
        this.$refs.dataForm.resetFields()
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
