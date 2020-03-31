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
          v-model="searchForm.field1"
          type="text"
          size="small"
          placeholder="请输入订单号"
        />
      </el-form-item>
      <el-form-item
        label="订单状态:"
        label-width="80px"
      >
        <single-change
          v-model="searchForm.status"
          :disabled="operationStatus === 1"
          status-type="order_status"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="商品类型:"
        label-width="80px"
      >
        <single-change
          v-model="searchForm.itemType"
          :disabled="operationStatus === 1"
          status-type="tenant_item_type"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="来源渠道:"
        label-width="80px"
      >
        <single-change
          v-model="searchForm.channel"
          :disabled="operationStatus === 1"
          status-type="tenant_order_channel"
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
      @handle-create="handleCreate"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
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
          icon="el-icon-view"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
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
              prop="orderId"
              label="订单id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.orderId"
                autocomplete="off"
                placeholder="请输入订单id"
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
              prop="payId"
              label="支付单id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.payId"
                autocomplete="off"
                placeholder="请输入支付单id"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="status"
              label="订单状态(1.未支付, 2.支付成功, 3.退款中, 4.已退款, 5.已取消):"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.status"
                autocomplete="off"
                placeholder="请输入订单状态(1.未支付, 2.支付成功, 3.退款中, 4.已退款, 5.已取消)"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="title"
              label="订单标题:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.title"
                autocomplete="off"
                placeholder="请输入订单标题"
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
              <el-input
                v-model="form.itemType"
                autocomplete="off"
                placeholder="请输入商品类型"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="discount"
              label="折扣快照:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.discount"
                autocomplete="off"
                placeholder="请输入折扣快照"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="amount"
              label="账单金额:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.amount"
                autocomplete="off"
                placeholder="请输入账单金额"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="remark"
              label="备注                                                               :"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.remark"
                autocomplete="off"
                placeholder="请输入备注                                                               "
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="channel"
              label="来源渠道 0：租户后台:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.channel"
                autocomplete="off"
                placeholder="请输入来源渠道 0：租户后台"
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
              prop="delFlag"
              label="是否删除 0：未删除 1：已删除:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.delFlag"
                autocomplete="off"
                placeholder="请输入是否删除 0：未删除 1：已删除"
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
import { createOrder, delObj, fetchList, putObj } from '@/api/orders/tenantorder'
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
          label: '订单号',
          prop: 'orderId'
        }, {
          label: '租户名称',
          prop: 'tenantName'
        }, {
          label: '支付单号',
          prop: 'payId'
        }, {
          label: '订单状态',
          prop: 'status',
          dicUrl: 'order_status',
          dicData: []
        }, {
          label: '订单标题',
          prop: 'title'
        }, {
          label: '商品类型',
          prop: 'itemType',
          dicUrl: 'tenant_item_type',
          dicData: []
        }, {
          label: '折扣快照',
          prop: 'discount'
        }, {
          label: '账单金额',
          prop: 'amount'
        }, {
          label: '备注',
          prop: 'remark',
          hide: true
        }, {
          label: '来源渠道',
          prop: 'channel',
          dicUrl: 'tenant_order_channel',
          dicData: []
        }, {
          label: '创建时间',
          prop: 'createTime'
        }, {
          label: '创建人',
          prop: 'createBy'
        }, {
          label: '是否删除 0：未删除 1：已删除',
          prop: 'delFlag',
          hide: true
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
      formLabelWidth: '90px'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.searchForm.tenantId = this.$route.query.tenantId
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
      this.$refs
        .dataForm.resetFields()
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    /**
             * 点击查看
             */
    handleView(row, index) {
      this.$refs
        .dataForm.resetFields()
      this.dialogPvVisible = true
      this.operationStatus = 1
      this.form = row
    },
    /**
             * 点击编辑
             */
    handleUpdate(row, index) {
      this.$refs
        .dataForm.resetFields()
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
            this.tableLoading = true
            createOrder(this.form)
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
