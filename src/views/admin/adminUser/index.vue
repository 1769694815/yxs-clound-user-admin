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
        label="用户名:"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="searchForm.username"
          type="text"
          size="small"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item
        label="真实姓名:"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="searchForm.realName"
          type="text"
          size="small"
          placeholder="请输入真实姓名"
        />
      </el-form-item>
      <el-form-item
        prop="roleId"
        label="角色:"
        :label-width="formLabelWidth"
      >
        <el-select v-model="searchForm.roleId" placeholder="请选择角色">
          <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
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
      :close-on-click-modal="false"
      :before-close="closeDialog"
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
              prop="username"
              label="用户名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.username"
                autocomplete="off"
                placeholder="请输入用户名"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="realName"
              label="真实姓名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.realName"
                autocomplete="off"
                placeholder="请输入真实姓名"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="password"
              label="密码:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.password"
                autocomplete="off"
                placeholder="如果不填写密码，默认为123456"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="roleId"
              label="角色:"
              :label-width="formLabelWidth"
            >
              <el-select v-model="form.roleId" placeholder="请选择角色" :disabled="operationStatus === 1" autocomplete="off" style="width: 336px;">
                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sex"
              label="性别:"
              :label-width="formLabelWidth"
            >
              <el-radio v-model="form.sex" label="1" :disabled="operationStatus === 1">男</el-radio>
              <el-radio v-model="form.sex" label="0" :disabled="operationStatus === 1">女</el-radio>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="avatar"
              label="头像:"
              :label-width="formLabelWidth"
            >
              <single-image
                v-model="form.avatar"
                :type="3"
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
          @click="closeDialog"
        >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getRoleAdmin, getObj, addObj, delObj, putObj } from '@/api/admin/adminUser'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
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
      source: [
        {
          label: '手机',
          value: '0'
        }, {
          label: '微信',
          value: '1'
        }, {
          label: 'QQ',
          value: '2'
        },
        {
          label: 'PC',
          value: '3'
        },
        {
          label: '移动端',
          value: '4'
        },
        {
          label: '管理员',
          value: '5'
        },
        {
          label: '游客',
          value: '6'
        }
      ],
      flag: [
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
      roleList: [],
      tableLoading: false,
      DIC: DIC,
      tableOption: [
        {
          label: '用户名',
          prop: 'username'
        }, {
          label: '真实姓名',
          prop: 'realName'
        }, {
          label: '手机号',
          prop: 'phone'
        }, {
          label: '角色',
          prop: 'roleList',
          slot: true
        },
        {
          label: '注册来源',
          prop: 'source',
          dicData: DIC.source
        }, {
          label: '创建时间',
          prop: 'createTime',
          width: '200px'
        }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        realName: [{
          required: true,
          message: '请输入真实姓名',
          trigger: 'blur'
        }],
        avatar: [{
          required: true,
          message: '请上传头像',
          trigger: 'change'
        }],
        sex: [{
          required: true,
          message: '请选择性别',
          trigger: 'change'
        }],
        roleId: [{
          required: true,
          message: '请选择角色',
          trigger: 'change'
        }]
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
      getObj(row.id).then(data => {
        this.form = data.data.data
      })
    },
    /**
     * 点击编辑
     */
    handleUpdate(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
      getObj(row.id).then(data => {
        this.form = data.data.data
      })
    },
    /**
     * 新增保存
     */
    create() {
      // 默认密码
      if (this.form.password === null && this.form.password === '') {
        this.form.password = '123456'
      }
      this.$refs
        .dataForm.validate(valid => {
          console.log(this.form)
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
    closeDialog() {
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>
