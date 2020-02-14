<!--
 * @Date: 2020-02-14 13:00:50
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-14 18:25:44
 * @Description: 租户管理
 -->
<template>
  <div class="execution app-container calendar-list-container">
    <!-- 头部菜单 -->
    <el-form
      :inline="true"
      ref="search"
      class="search"
      size="medium"
    >
      <el-form-item
        label="租户名称:"
        label-width="80px"
      >
        <el-input
          v-model="listQuery.name"
          type="text"
          size="small"
          placeholder="请输入租户名称"
        />
      </el-form-item>
      <el-form-item
        label="状态:"
        label-width="80px"
      >
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
    <!-- 表格操作 -->
    <div class="x__menu">
      <div class="x__menu__left">
        <el-button
          v-if="admin_systenant_add"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button>
      </div>
      <div class="x__menu__right">
        <el-button
          icon="el-icon-refresh"
          size="small"
          circle
          @click="handleFilter"
        />
        <el-button
          icon="el-icon-menu"
          size="small"
          circle
          @click="hideVisible = true"
        />
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="tableLoading"
      :data="tableData"
      border
      stripe
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50"
      />
      <el-table-column
        prop="name"
        label="租户名称"
        align="center"
      />
      <el-table-column
        prop="code"
        label="租户编号"
        align="center"
      />
      <el-table-column
        prop="startTime"
        label="开始时间"
        align="center"
      />
      <el-table-column
        prop="endTime"
        label="结束时间"
        align="center"
      />
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | statusFilter(statusList) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
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

      </el-table-column>
    </el-table>
    <template
      slot="status"
      slot-scope="scope"
    >
      <el-tag>{{ scope.row.status | statusFilter(statusList) }}</el-tag>
    </template>
    <!-- 分页器 -->
    <Pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

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
            :span="12"
            v-if="operationStatus === 1"
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
                type="number"
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
              <el-radio-group
                v-model="form.status"
                :disabled="operationStatus === 1"
              >
                <el-radio
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
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
    <!-- 显隐 -->
    <el-dialog
      :visible.sync="hideVisible"
      title="多选"
    >
      <hide-dialog
        :tableOption="tableOption"
        @check-change="checkChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/tenant'
import { remote } from '@/api/admin/dict'
import Pagination from '@/components/Pagination/index'
import HideDialog from '@/components/HideDialog/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Tenant',
  components: {
    Pagination,
    HideDialog
  },
  computed: {
    ...mapGetters(['permissions'])
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
    return {
      hideVisible: false,
      checkList: [],
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
          prop: 'status'
        }
      ],
      searchForm: {},
      tableData: [],
      total: 0, // 总页数
      listQuery: {
        page: 1, // 当前页数
        limit: 10, // 每页显示多少条
        name: undefined,
        status: undefined
      },
      tableKey: 0,
      tableLoading: false,
      statusList: [],
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
  created() {
    this.admin_systenant_add = this.permissions['admin_systenant_add']
    this.admin_systenant_del = this.permissions['admin_systenant_del']
    this.admin_systenant_edit = this.permissions['admin_systenant_edit']
    this.getList()
    this.getStatusList()
  },
  methods: {
    checkChange(list) {
      this.tableOption = list
      console.log(this.tableOption)
    },
    getList() {
      this.tableLoading = true
      fetchList(this.listQuery)
        .then(res => {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    getStatusList() {
      remote('status_type').then(res => {
        this.statusList = res.data.data
      })
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.listQuery.name = undefined
      this.listQuery.status = undefined
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
          this.tableData.splice(index, 1, Object.assign({}, this.form))
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
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