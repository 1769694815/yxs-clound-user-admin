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
          v-model="searchForm.code"
          :operation-status="operationStatus"
          status-type="navigation_type"
          type="select"
        />
      </el-form-item>
      <el-form-item
        label="是否启用:"
        label-width="80px"
      >
        <el-select v-model="searchForm.openFlag" clearable placeholder="请选择是否启用">
          <el-option
            v-for="item in DIC.openFlag"
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
      menu-width="200px"
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
      :close-on-click-modal="false"
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
              prop="name"
              label="导航名称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入导航名称"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="url"
              label="链接地址:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.url"
                autocomplete="off"
                placeholder="请输入链接地址"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="pic"
              label="导航图片:"
              :label-width="formLabelWidth"
            >
              <single-image
                v-model="form.pic"
                status="2"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sequence"
              label="显示顺序:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.sequence"
                autocomplete="off"
                placeholder="请输入显示顺序"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="code"
              label="类型:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.code"
                :operation-status="operationStatus"
                status-type="navigation_type"
                type="select"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="openFlag"
              label="是否启用:"
              :label-width="formLabelWidth"
            >
              <el-radio v-model="form.openFlag" label="1" :disabled="operationStatus === 1">启用</el-radio>
              <el-radio v-model="form.openFlag" label="0" :disabled="operationStatus === 1">禁用</el-radio>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="newWinFlag"
              :label-width="formLabelWidth"
              label="打开方式:"
            >
              <el-radio v-model="form.newWinFlag" label="1" :disabled="operationStatus === 1">新窗口</el-radio>
              <el-radio v-model="form.newWinFlag" label="0" :disabled="operationStatus === 1">当前窗口</el-radio>
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
import { fetchList, addObj, putObj, delObj } from '@/api/news/navigation'
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
    const DIC = {
      openFlag: [
        {
          label: '启用',
          value: '1'
        }, {
          label: '禁用',
          value: '0'
        }
      ],
      newWinFlag: [
        {
          label: '是',
          value: '1'
        }, {
          label: '否',
          value: '0'
        }
      ]
    }
    return {
      headers: {},
      tableKey: 0,
      tableLoading: false,
      tableOption: [
        {
          label: '导航名称',
          prop: 'name'
        }, {
          label: '链接地址',
          prop: 'url',
          link: true
        }, {
          label: '图片地址',
          prop: 'pic',
          img: true
        }, {
          label: '显示顺序',
          prop: 'sequence'
        }, {
          label: '类型',
          prop: 'code',
          dicUrl: 'navigation_type',
          dicData: []
        }, {
          label: '是否启用',
          prop: 'openFlag',
          dicData: DIC.openFlag
        }, {
          label: '新窗口打开',
          prop: 'newWinFlag',
          dicData: DIC.newWinFlag
        }, {
          label: '创建时间',
          prop: 'createTime'
        }, {
          label: '修改时间',
          prop: 'updateTime'
        }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {
        name: [{
          required: true,
          message: '请输入导航名称',
          trigger: 'blur'
        }],
        url: [{
          required: true,
          message: '请输入链接地址',
          trigger: 'blur'
        }, {
          message: '请输入正确的url',
          trigger: 'blur',
          type: 'url'
        }],
        pic: [{
          required: true,
          message: '请上传导航图片',
          trigger: 'blur'
        }],
        sequence: [{
          required: true,
          message: '请输入显示顺序',
          trigger: 'blur'
        }, {
          message: '请输入数字',
          trigger: 'blur',
          type: 'number'
        }],
        code: [{
          required: true,
          message: '请选择导航类型',
          trigger: 'blur'
        }],
        openFlag: [{
          required: true,
          message: '请选择是否启用',
          trigger: 'blur'
        }],
        newWinFlag: [{
          required: true,
          message: '请选择打开方式',
          trigger: 'blur'
        }]
      },
      searchForm: {},
      dialogPvVisible: false,
      dialogDictItem: false,
      operationStatus: 0,
      form: {
        pic: ''
      },
      formLabelWidth: '90px',
      DIC: DIC
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
    handleSuccess(res, file) {
      this.form.pic = res.url
    }

  }
}
</script>
<style lang="scss" scoped>
  .classroom-input {
    width: 100%;
  }
</style>
