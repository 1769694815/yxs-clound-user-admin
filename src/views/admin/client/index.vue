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
            :span="12"
          >
            <el-form-item
              prop="clientId"
              label="编号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.clientId"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="clientSecret"
              label="密钥:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.clientSecret"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入密钥"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="scope"
              label="域:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.scope"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入域"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="autoapprove"
              label="自动放行:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.autoapprove"
                :disabled="operationStatus === 1"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="checkList"
              label="授权模式:"
              :label-width="formLabelWidth"
            >
              <el-checkbox-group v-model="form.checkList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in checkListOptions" :key="item.id" :disabled="checkboxVisible" :label="item.label">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="令牌时效:"
              prop="accessTokenValidity"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.accessTokenValidity"
                auto-complete="off"
                type="number"
                placeholder="请输入令牌时效"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="刷新时效:"
              prop="refreshTokenValidity"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.refreshTokenValidity"
                auto-complete="off"
                type="number"
                placeholder="请输入刷新时效"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="webServerRedirectUri"
              label="回调地址:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.webServerRedirectUri"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入回调地址"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="authorities"
              label="权限:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.authorities"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入权限"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="additionalInformation"
              label="扩展信息:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.additionalInformation"
                type="textarea"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="JSON格式数据"
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
import { addObj, delObj, fetchList, putObj } from '@/api/admin/client'
import { remote } from '@/api/admin/dict'
import SingleChange from '@/components/DictItem/SingleChange'
import { mapGetters } from 'vuex'
export default {
  name: 'Client',
  components: {
    SingleChange
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
      checkboxVisible: false,
      form: {
        checkList: []
      },
      authorizedGrantTypes: '',
      checkListOptions: [],
      checkListOptionsObj: null,
      checkListOptionsObjReverse: null,
      whichHandleWindow: 'new',
      hideVisible: false,
      tableOption: [
        {
          label: '编号',
          prop: 'clientId'
        },
        {
          label: '密钥',
          prop: 'clientSecret'
        },
        {
          label: '域',
          prop: 'scope'
        },
        {
          label: '自动放行',
          prop: 'autoapprove',
          dicData: [
            {
              label: '否',
              value: 'false'
            }, {
              label: '是',
              value: 'true'
            }]

        },
        {
          label: '授权模式',
          prop: 'authorizedGrantTypes'
        },
        {
          label: '令牌时效',
          prop: 'accessTokenValidity'
        },
        {
          label: '刷新时效',
          prop: 'refreshTokenValidity'
        },
        {
          label: '回调地址',
          prop: 'webServerRedirectUri',
          hide: true
        },
        {
          label: '权限',
          prop: 'authorities',
          hide: true
        },
        {
          label: '扩展信息',
          hide: true,
          prop: 'additionalInformation'
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
    handleCheckedCitiesChange(value) {
      console.log('this.checkList', this.form.checkList)
      console.log('checkListOptionsObj', this.checkListOptionsObj)
      const arr = []
      for (let i = 0; i < this.form.checkList.length; i++) {
        arr.push(this.checkListOptionsObj[this.form.checkList[i]])
      }
      this.authorizedGrantTypes = arr.join(',')
    },
    chongZhi() {
      console.log('')
    },
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

      remote('grant_types').then(res => {
        this.checkListOptions = res.data.data
        console.log('checkListOptions', this.checkListOptions)
        this.checkListOptionsObj = res.data.data.reduce(function(dictionary, next) {
          dictionary[next['label']] = next['value']
          return dictionary
        }, {})
        this.checkListOptionsObjReverse = res.data.data.reduce(function(dictionary, next) {
          dictionary[next['value']] = next['label']
          return dictionary
        }, {})
      }).catch(() => {
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
      this.checkboxVisible = true
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
