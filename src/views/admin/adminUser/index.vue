<template>
  <div class="app-container calendar-list-container">
    <!-- 搜索栏 -->
    <el-form
      :inline="true"
      class="search"
      size="medium"
    >
      <el-form-item
        label="用户名:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.username"
          type="text"
          size="small"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <single-change
          v-model="searchForm.roleId"
          :disabled="operationStatus === 1"
          :dic-prop="{ label: 'roleName', value: 'roleId' }"
          dic-url="/admin/role/getRoleAdminList"
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
        slot="roleList"
        slot-scope="scope"
      >
        <el-tag>{{ scope.row.roleList[0].roleName }}</el-tag>
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
      :destroy-on-close="true"
    >
      <el-row
        style="padding: 0 20px;"
        :span="24"
      >
        <el-form
          ref="dataForm"
          :rules="formRules"
          :model="form"
        >
          <el-col>
            <el-form-item
              prop="username"
              label="用户名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.username"
                autocomplete="off"
                :disabled="operationStatus === 1||operationStatus === 2"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="realName"
              label="真实姓名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.realName"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入真实姓名"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="nickName"
              label="昵称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.nickName"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入昵称"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="password"
              label="密码:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.password"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="deptId"
              label="所属部门:"
              :label-width="formLabelWidth"
            >
              <Input-tree
                v-model="form.deptId"
                :tree-data="treeDeptData"
                :disabled="operationStatus === 1"
                placeholder="请选择所属部门"
                @node-click="getNodeData"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="phone"
              label="手机号:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.phone"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="roles"
              label="角色:"
              :label-width="formLabelWidth"
            >
              <mutil-change
                v-model="form.roles"
                :disabled="operationStatus === 1"
                :dic-prop="{ label: 'roleName', value: 'roleId' }"
                dic-url="/admin/role/getRoleAdminList"
                type="select"
                multiple
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="lockFlag"
              label="状态:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.lockFlag"
                :disabled="operationStatus === 1"
                status-type="user_lock_flag"
                type="radio"
                size="medium"
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
          @click="closeDialog"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getRoleAdmin, getObj, addObj, delObj, putObj } from '@/api/admin/adminUser'
import { deptRoleList } from '@/api/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { mapGetters } from 'vuex'
import InputTree from '@/components/InputTree/index'
export default {
  name: 'Index',
  components: {
    InputTree
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
      tableKey: 0,
      roleList: [],
      tableLoading: false,
      tableOption: [
        {
          label: '用户名',
          prop: 'username'
        },
        {
          label: '真实姓名',
          prop: 'realName'
        },
        {
          label: '手机号',
          prop: 'phone'
        },
        {
          label: '角色',
          prop: 'roleList',
          slot: true
        },
        {
          label: '状态',
          prop: 'lockFlag',
          dicUrl: 'user_lock_flag',
          dicData: []
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      treeDeptData: [],
      formRules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        realName: [
          {
            required: true,
            message: '请输入真实姓名'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        deptId: [
          {
            required: true,
            message: '请选择部门',
            trigger: 'change'
          }
        ],
        roles: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ],
        lockFlag: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'blur'
          }
        ]
      },
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
    this.getRoleAdmin()
    this.getNodeData()
    this.handleDept()
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
     * 获取角色列表
     */
    getRoleAdmin() {
      getRoleAdmin().then(data => {
        this.roleList = data.data.data
      })
    },
    checkChange(list) {
      this.tableOption = list
    },
    nodeClick(data) {
      console.log(data)
      this.searchForm.page = 1
      this.searchForm.deptId = data.id
      this.getList()
    },
    handleDept() {
      fetchTree().then(res => {
        this.treeDeptData = res.data.data
      })
    },
    getNodeData() {
      deptRoleList().then(response => {
        this.rolesOptions = response.data.data
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
      this.form = {
        lockFlag: '0'
      }
      this.formRules.password[0].required = true
    },
    /**
     * 点击查看
     */
    handleView(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      getObj(row.userId).then(data => {
        this.form = data.data.data
        this.form.roleId = data.data.data.roleList[0].roleId
      })
    },
    /**
     * 点击编辑
     */
    handleUpdate(row, index) {
      this.formRules.password[0].required = false
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
      this.form.password = undefined
    },
    /**
     * 新增保存
     */
    create() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.tableLoading = true
            this.form.userName = this.form.username
            addObj(this.form)
              .then(res => {
                this.tableLoading = false
                this.dialogPvVisible = false
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
            this.form.userName = this.form.username
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
      this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(function() {
          return delObj(row.userId)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    },
    closeDialog() {
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>
