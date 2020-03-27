<template>
  <div class="execution app-container calendar-list-container">
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
          :model="form"
        >
          <el-col
            :span="12"
          >
            <el-form-item
              prop="user_id"
              label="用户ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.user_id"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入用户ID"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="username"
              label="用户名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.username"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="access_token"
              label="令牌:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.access_token"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入令牌"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="token_type"
              label="类型:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.token_type"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入类型"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="过期时间:"
              prop="expires_in"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.expires_in"
                auto-complete="off"
                type="number"
                placeholder="请输入过期时间"
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
import { addObj, delObj, fetchList, putObj } from '@/api/admin/token'
import { mapGetters } from 'vuex'
export default {
  name: 'Token',
  components: {

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
      form: {

      },
      whichHandleWindow: 'new',
      hideVisible: false,
      formRules: {
        clientId: [
          { required: true, message: '请输入clientId', trigger: 'blur' }
        ],
        clientSecret: [
          {
            required: true,
            message: '请输入clientSecret',
            trigger: 'blur'
          }
        ],
        scope: [
          {
            required: true,
            message: '请输入scope',
            trigger: 'blur'
          }
        ],
        autoapprove: [
          {
            required: true,
            message: '请选择是否放行',
            trigger: 'blur'
          }
        ],
        checkList: [
          {
            type: 'array',
            required: true,
            trigger: 'change',
            message: '请输入授权模式'
          }
        ]
      },
      tableOption: [
        {
          label: '用户ID',
          prop: 'user_id'
        },
        {
          label: '用户名',
          prop: 'username'
        },
        {
          label: '令牌',
          prop: 'access_token'
        },
        {
          label: '类型',
          prop: 'token_type'
        },
        {
          label: '过期时间',
          prop: 'expires_in'
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      tableKey: 0,
      tableLoading: false,
      dialogPvVisible: false,
      operationStatus: 0,
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
      ).then(res => {
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
      this.searchForm.type = undefined
      this.searchForm.name = undefined
      this.searchForm.status = undefined
      this.searchForm.adminFlag = undefined
      this.searchForm.templateFlag = undefined
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
      this.form = {
        checkList: []
      }
    },
    create() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.whichHandleWindow = 'new'
          this.dialogPvVisible = false
          this.tableLoading = true
          let autoapprove = ''
          console.log('this.form.autoapprove', this.form.autoapprove, typeof (this.form.autoapprove))
          if (this.form.autoapprove === '0') {
            autoapprove = 'true'
          } else {
            autoapprove = 'false'
          }
          addObj({
            authorizedGrantTypes: this.authorizedGrantTypes,
            clientId: this.form.clientId,
            clientSecret: this.form.clientSecret,
            scope: this.form.scope,
            autoapprove: autoapprove,
            accessTokenValidity: this.form.accessTokenValidity,
            refreshTokenValidity: this.form.refreshTokenValidity,
            webServerRedirectUri: this.form.webServerRedirectUri,
            authorities: this.form.authorities,
            additionalInformation: this.form.additionalInformation
          })
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
    handleUpdate(row) {
      this.checkboxVisible = false
      console.log('row', row)
      this.whichHandleWindow = 'edit'
      this.dialogPvVisible = true
      this.operationStatus = 2
      let autoapprove = ''
      if (row.autoapprove === 'true') {
        autoapprove = '0'
      } else if (row.autoapprove === 'false') {
        autoapprove = '1'
      }
      const checkList = []
      const arr = row.authorizedGrantTypes.split(',')
      for (let i = 0; i < arr.length; i++) {
        checkList.push(this.checkListOptionsObjReverse[arr[i]])
      }
      console.log('checkList', checkList)
      this.form = Object.assign({}, row, { autoapprove, checkList })
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
      this.$confirm('是否强制' + row.username + '下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.access_token)
        })
        .then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '强制下线成功',
            type: 'success'
          })
        })
    }
  }
}
</script>
