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
        label="订单号:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.sn"
          type="text"
          size="small"
          placeholder="请输入订单号"
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
    <!-- selection: 是否展示复选框 @selection-change="handleSelectionChange" 复选框选择回调 -->
    <Xtable
      :selection="true"
      :table-key="tableKey"
      :table-loading="tableLoading"
      :table-data="tableData"
      :page="page"
      :table-option.sync="tableOption"
      :add-btn="false"
      :excel="exportExcel"
      :excel-table-data="excelTableData"
      @excel-data="excelData"
      @refresh-change="handleFilter"
      @page-change="getList"
      @selection-change="handleSelectionChange"
    >
      <template slot="menuLeft">
        <!-- <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button> -->
        <el-tooltip
          effect="dark"
          content="导出全部数据"
          placement="top"
        >
          <el-button
            :loading="downloadLoading"
            type="primary"
            icon="el-icon-document"
            size="mini"
            @click="handleDownload"
          >
            导出 Excel
          </el-button>
        </el-tooltip>
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
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
              prop="sn"
              label="订单编号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.sn"
                autocomplete="off"
                placeholder="请输入订单编号"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="status"
              label="订单状态:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.status"
                :disabled="operationStatus === 1"
                status-type="order_status"
                type="select"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="title"
              label="商品标题:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.title"
                autocomplete="off"
                placeholder="请输入商品标题"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="itemType"
              label="商品类型:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.itemType"
                :disabled="operationStatus === 1"
                status-type="goods_type"
                type="select"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="24"
          >
            <el-form-item
              prop="itemImg"
              label="商品图片:"
              :label-width="formLabelWidth"
            >
              <single-image
                v-model="form.itemImg"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="itemId"
              label="商品ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.itemId"
                autocomplete="off"
                placeholder="请输入商品ID"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="amount"
              label="实付金额:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.amount"
                autocomplete="off"
                placeholder="请输入实付金额"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="totalPrice"
              label="订单总价:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.totalPrice"
                autocomplete="off"
                placeholder="请输入订单总价"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="payWay"
              label="支付方式:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.payWay"
                :disabled="operationStatus === 1"
                status-type="pay_way"
                type="select"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="payTime"
              label="支付时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.payTime"
                autocomplete="off"
                placeholder="请输入支付时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="cashSn"
              label="支付流水号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.cashSn"
                autocomplete="off"
                placeholder="请输入支付流水号"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="note"
              label="备注:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.note"
                autocomplete="off"
                placeholder="请输入备注"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="itemData"
              label="业务数据:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.itemData"
                autocomplete="off"
                placeholder="请输入订单业务数据"
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
                placeholder="请输入订单创建时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="createUserId"
              label="创建人id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.createUserId"
                autocomplete="off"
                placeholder="请输入创建人id"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="updateTime"
              label="更新时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.updateTime"
                autocomplete="off"
                placeholder="请输入更新时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="tradeSn"
              label="交易号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.tradeSn"
                autocomplete="off"
                placeholder="请输入交易号"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="source"
              label="订单来源:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.source"
                :disabled="operationStatus === 1"
                status-type="order_source"
                type="select"
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
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/orders/orders'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'

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
      headers: {},
      tableKey: 0,
      tableLoading: false,
      tableOption: [{
        label: '订单号',
        prop: 'sn'
      }, {
        label: '订单状态',
        prop: 'status',
        dicUrl: 'order_status',
        dicData: []
      }, {
        label: '商品标题',
        prop: 'title'
      }, {
        label: '商品类型',
        prop: 'itemType',
        dicUrl: 'goods_type',
        dicData: []
      }, {
        label: '商品ID',
        prop: 'itemId'
      }, {
        label: '实付金额',
        prop: 'amount'
      }, {
        label: '订单总价',
        prop: 'totalPrice'
      }, {
        label: '支付方式',
        prop: 'payWay',
        dicUrl: 'pay_way'
      }, {
        label: '支付时间',
        prop: 'payTime'
      }, {
        label: '支付流水',
        prop: 'cashSn'
      }, {
        label: '备注',
        prop: 'note'
      }, {
        label: '创建时间',
        prop: 'createTime'
      }, {
        label: '交易号',
        prop: 'tradeSn'
      }, {
        label: '订单来源',
        prop: 'source',
        dicUrl: 'order_source',
        dicData: []
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
      dialogDictItem: false,
      operationStatus: 0,
      form: {},
      formLabelWidth: '90px',
      downloadLoading: false,
      loading: null,
      exportExcel: false,
      excelTableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['permissions', 'access_token'])
  },
  created() {
    this.getList()
    this.headers.Authorization = 'Bearer ' + this.access_token
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
      this.form = {}
    },
    /**
             * 点击查看
             */
    handleView(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      this.form = row
    },
    /**
             * 点击编辑
             */
    handleUpdate(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
    },
    /**
             * 新增保存
             */
    create() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
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
    },
    handleDownload() {
      this.downloadLoading = true
      this.loading = this.$loading({
        lock: true,
        text: '数据导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 获取所有表格数据
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: 1,
            size: this.page.total
          },
          this.searchForm
        )
      )
        .then(res => {
          this.excelTableData = res.data.data.records
          console.log('excelTableData', this.excelTableData)
          // 通知表格组件处理接口返回数据
          this.exportExcel = true
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    excelData(list) {
      console.log('list', list)
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableOption.map(item => { return item.label })
        const filterVal = this.tableOption.map(item => { return item.prop })
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '订单列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.loading.close()
        this.downloadLoading = false
        this.exportExcel = false
      })
    },
    // 批量删除
    handleBatchDelete() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: '请勾选需要删除的数据',
          type: 'error'
        })
      } else {
        // DOTO 删除操作
        this.$message({
          message: '正在拼命开发中~',
          type: 'success'
        })
      }
    },
    // 复选
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选择的数据', val)
    }
  }
}
</script>
