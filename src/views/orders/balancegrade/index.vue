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
        label="价格:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.price"
          type="number"
          size="small"
          placeholder="请输入价格"
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
              prop="yb"
              label="益币:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.yb"
                autocomplete="off"
                placeholder="请输入益币"
                :disabled="operationStatus === 1"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="price"
              label="价格（元）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.price"
                autocomplete="off"
                placeholder="请输入价格（元）"
                :disabled="operationStatus === 1"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="iosId"
              label="ios商品id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.iosId"
                autocomplete="off"
                placeholder="请输入ios商品id"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="goodsImg"
              label="商品图片:"
              :label-width="formLabelWidth"
            >
              <single-image
                v-model="form.goodsImg"
                status="4"
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
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/orders/balancegrade'
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
          label: '益币',
          prop: 'yb'
        }, {
          label: '价格（元）',
          prop: 'price'
        }, {
          label: 'IOS商品ID',
          prop: 'iosId'
        }, {
          label: '商品图片',
          prop: 'goodsImg',
          img: true
        }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {
        yb: [{
          required: true,
          message: '请输入益币',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
        iosId: [{
          required: true,
          message: '请输入IOS 商品ID',
          trigger: 'blur'
        }],
        goodsImg: [{
          required: true,
          message: '请上传商品图片',
          trigger: 'blur'
        }]
      },
      searchForm: {},
      dialogPvVisible: false,
      dialogDictItem: false,
      operationStatus: 0,
      form: {},
      formLabelWidth: '90px',
      imageUrl: ''
    }
  },
  computed: {
    ...mapGetters(['permissions', 'access_token'])
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
    /**
     * 文件上传方法
     * @param file
     * @returns {boolean|boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传商品图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleSuccess(res, file) {
      this.form.goodsImg = res.url
    }

  }
}
</script>
