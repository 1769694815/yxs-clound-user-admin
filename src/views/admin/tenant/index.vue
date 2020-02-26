<!--
 * @Date: 2020-02-14 13:00:50
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-02-25 15:21:56
 * @Description: 租户管理
 -->
<template>
  <div class="execution app-container calendar-list-container">
    <!-- 头部菜单 -->
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
    >
      <el-form-item
        label="租户名称:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.name"
          type="text"
          size="small"
          placeholder="请输入租户名称"
        />
      </el-form-item>
      <el-form-item
        label="状态:"
        label-width="80px"
      >
        <single-change
          v-model="form.status"
          :operation-status="operationStatus"
          status-type="status_type"
          type="select"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleFilter"
        >搜 索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="default"
          icon="el-icon-delete"
          size="small"
          @click="handleEmpty"
        >清 空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
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
      <template
        slot="status"
        slot-scope="scope"
      >
        <el-tag :type="scope.row.status === '0' ? '' : 'danger'">{{ scope.row.status | statusFilter(statusList) }}</el-tag>
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
          v-if="admin_systenant_edit"
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="admin_systenant_del"
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete(scope.row, scope.$index)"
        >删除
        </el-button>
      </template>
    </Xtable>

    <!-- 弹窗 -->
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
            v-if="operationStatus === 1"
            :span="12"
          >
            <el-form-item
              prop="id"
              label="租户id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.id"
                autocomplete="off"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="name"
              label="租户名称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入租户名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="code"
              label="租户编号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.code"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入租户编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="startTime"
              label="开始时间:"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                v-model="form.startTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="datetime"
                placeholder="请选择开始时间"
                :disabled="operationStatus === 1"
                style="width: 100%!important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="endTime"
              label="结束时间:"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                v-model="form.endTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="datetime"
                placeholder="请选择结束时间"
                :disabled="operationStatus === 1"
                style="width: 100%!important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="status"
              label="状态:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.status"
                :operation-status="operationStatus"
                status-type="status_type"
                type="radio"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <tinymce v-model="form.content" :height="300" />
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
        >保 存</el-button>
        <el-button
          v-if="operationStatus === 2"
          type="primary"
          size="small"
          @click="update"
        >修 改</el-button>
        <el-button
          size="small"
          @click="dialogPvVisible = false"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/tenant'
import SingleChange from '@/components/DictItem/SingleChange'
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce/index'
export default {
  name: 'Tenant',
  components: {
    SingleChange,
    Tinymce
  },
  filters: {
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
      hideVisible: false,
      tableOption: [
        {
          label: '租户id',
          hide: true,
          prop: 'id'
        },
        {
          label: '租户名称',
          prop: 'name'
        },
        {
          label: '租户编号',
          prop: 'code'
        },
        {
          label: '开始时间',
          prop: 'startTime'
        },
        {
          label: '结束时间',
          prop: 'endTime'
        },
        {
          label: '状态',
          prop: 'status',
          dicUrl: 'status_type'
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {
        name: undefined,
        status: undefined
      },
      tableKey: 0,
      tableLoading: false,
      dialogPvVisible: false,
      operationStatus: 0,
      formRules: {
        name: [
          { required: true, message: '请输入租户名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '请输入租户编号',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请输入结束时间',
            trigger: 'blur'
          }
        ]
      },
      form: {},
      formLabelWidth: '90px',
      admin_systenant_add: false,
      admin_systenant_del: false,
      admin_systenant_edit: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.admin_systenant_add = this.permissions['admin_systenant_add']
    this.admin_systenant_del = this.permissions['admin_systenant_del']
    this.admin_systenant_edit = this.permissions['admin_systenant_edit']
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      fetchList(
        Object.assign(
          { current: this.page.current, size: this.page.size },
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
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm.name = undefined
      this.searchForm.status = undefined
      this.getList()
    },
    handleView(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    create() {
      this.dialogPvVisible = false
      this.tableLoading = true
      addObj(this.form)
        .then(res => {
          this.tableLoading = false
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleUpdate(row) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
    },
    update() {
      this.dialogPvVisible = false
      this.tableLoading = true
      putObj(this.form)
        .then(res => {
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
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
    }
  }
}
</script>
