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
              prop="id"
              label="订单ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.id"
                autocomplete="off"
                placeholder="请输入订单ID"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
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
              prop="itemImg"
              label="商品图片:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.itemImg"
                autocomplete="off"
                placeholder="请输入商品图片"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="itemType"
              label="商品类型:1课程,2培训班:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.itemType"
                autocomplete="off"
                placeholder="请输入商品类型:1课程,2培训班"
                :disabled="operationStatus === 1"
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
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="amount"
              label="订单实付金额:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.amount"
                autocomplete="off"
                placeholder="请输入订单实付金额"
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
              prop="giftFlag"
              label="是否为赠送礼物:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.giftFlag"
                autocomplete="off"
                placeholder="请输入是否为赠送礼物"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="giftTo"
              label="赠送给用户ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.giftTo"
                autocomplete="off"
                placeholder="请输入赠送给用户ID"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="discountId"
              label="折扣活动ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.discountId"
                autocomplete="off"
                placeholder="请输入折扣活动ID"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="discount"
              label="折扣:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.discount"
                autocomplete="off"
                placeholder="请输入折扣"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="coupon"
              label="优惠码:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.coupon"
                autocomplete="off"
                placeholder="请输入优惠码"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="couponDiscount"
              label="优惠码扣减金额:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.couponDiscount"
                autocomplete="off"
                placeholder="请输入优惠码扣减金额"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="payWay"
              label="订单支付方式（1：支付宝，2：微信，3：余额）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.payWay"
                autocomplete="off"
                placeholder="请输入订单支付方式（1：支付宝，2：微信，3：余额）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="coinAmount"
              label="虚拟币支付额:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.coinAmount"
                autocomplete="off"
                placeholder="请输入虚拟币支付额"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="coinRate"
              label="虚拟币汇率:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.coinRate"
                autocomplete="off"
                placeholder="请输入虚拟币汇率"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="priceType"
              label="创建订单时的标价类型(1:人民币,2:虚拟币):"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.priceType"
                autocomplete="off"
                placeholder="请输入创建订单时的标价类型(1:人民币,2:虚拟币)"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="bank"
              label="银行编号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.bank"
                autocomplete="off"
                placeholder="请输入银行编号"
                :disabled="operationStatus === 1"
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
              label="订单业务数据:"
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
              label="订单创建时间:"
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
              prop="token"
              label="令牌:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.token"
                autocomplete="off"
                placeholder="请输入令牌"
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
              label="订单来源（1：APP，2：PC，3：后台）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.source"
                autocomplete="off"
                placeholder="请输入订单来源（1：APP，2：PC，3：后台）"
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
        dicUrl: 'order_status'
      }, {
        label: '商品标题',
        prop: 'title'
      }, {
        label: '商品类型',
        prop: 'itemType',
        dicUrl: 'goods_type'
      }, {
        label: '商品ID',
        prop: 'itemId'
      }, {
        label: '订单实付金额',
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
        label: '支付流水号',
        prop: 'cashSn'
      }, {
        label: '备注',
        prop: 'note'
      }, {
        label: '订单创建时间',
        prop: 'createTime'
      }, {
        label: '交易号',
        prop: 'tradeSn'
      }, {
        label: '订单来源',
        prop: 'source',
        dicUrl: 'order_source'
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
    }

  }
}
</script>
