<!--
 * @Date: 2020-02-11 19:09:58
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-23 16:32:15
 * @Description: 用户管理
 -->
<template>
  <div class="user app-container calendar-list-container">
    <el-row :span="24">
      <el-col
        :xs="24"
        :sm="24"
        :md="24"
        class="user__main"
      >
        <!-- 头部菜单 -->
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
              v-model="searchForm.userName"
              type="text"
              size="small"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item
            label="真实姓名:"
            label-width="80px"
          >
            <el-input
              v-model="searchForm.realName"
              type="text"
              size="small"
              placeholder="请输入真实姓名"
            />
          </el-form-item>
          <el-form-item
            label="手机号:"
            label-width="80px"
          >
            <el-input
              v-model="searchForm.phone"
              type="text"
              size="small"
              placeholder="请输入手机号"
            />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <single-change
              v-model="searchForm.roleId"
              :disabled="operationStatus === 1"
              :dic-prop="{ label: 'roleName', value: 'roleId' }"
              dic-url="/admin/role/list"
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
        <!-- 表格 -->
        <Xtable
          :table-key="tableKey"
          :table-loading="tableLoading"
          :table-data="list"
          :page="page"
          :table-option.sync="tableOption"
          @handle-create="handleCreate"
          @refresh-change="handleFilter"
          @page-change="getList"
        >
          <template
            slot="roleList"
            slot-scope="scope"
          >
            <span
              v-for="(role,index) in scope.row.roleList"
              :key="index"
            >
              <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
            </span>
          </template>
          <template
            slot="lockFlag"
            slot-scope="scope"
          >
            <el-tag>{{ lockFlag(scope.row.lockFlag) }}</el-tag>
          </template>
          <template
            slot="menu"
            slot-scope="scope"
          >
            <el-button
              v-if="sys_user_edit"
              type="text"
              icon="el-icon-edit"
              size="mini"
              @click="handleUpdate(scope.row)"
            >编辑
            </el-button>
            <el-button
              v-if="sys_user_del"
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row, scope.$index)"
            >删除
            </el-button>
          </template>
        </Xtable>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
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
                dic-url="/admin/role/list"
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
import { addObj, delObj, fetchList, putObj } from '@/api/admin/user'
import { deptRoleList } from '@/api/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { mapGetters } from 'vuex'
import InputTree from '@/components/InputTree/index'
export default {
  name: 'SysUser',
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
      tableLoading: false,
      hideVisible: false,
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
      list: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {},
      total: 0,
      treeOption: {
        nodeKey: 'id',
        props: {
          label: 'name',
          value: 'id'
        }
      },
      treeDeptData: [],
      form: {},
      dialogPvVisible: false,
      operationStatus: 0, // 0: 新增 1: 查看  2：编辑 3： 删除
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
      formLabelWidth: '90px',
      lockFlagList: [
        {
          label: '有效',
          value: '0'
        },
        {
          label: '锁定',
          value: '9'
        }
      ],
      roleList: [],
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_edit = this.permissions['sys_user_edit']
    this.sys_user_del = this.permissions['sys_user_del']
    this.getList()
    this.getNodeData()
    this.handleDept()
  },
  methods: {
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
      ).then(res => {
        this.list = res.data.data.records
        this.page.total = res.data.data.total
        console.log(this.searchForm.deptId)
        this.tableLoading = false
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
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm.username = undefined
      this.searchForm.deptId = undefined
      this.getList()
    },
    handleCreate() {
      this.operationStatus = 0
      this.dialogPvVisible = true
      this.form = {
        lockFlag: '0'
      }
      this.formRules.password[0].required = true
    },
    handleUpdate(row) {
      this.formRules.password[0].required = false
      this.operationStatus = 2
      this.dialogPvVisible = true
      this.form = row
      this.form.password = undefined
    },
    handleDelete(row, index) {
      this.$confirm(
        '此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          delObj(row.userId)
            .then(() => {
              this.list.splice(index, 1)
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(() => {
              this.$notify({
                title: '失败',
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            })
        })
        .catch(() => {})
    },
    create() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.tableLoading = true
            this.form.userName = this.form.username
            addObj(this.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogPvVisible = false
                this.getList()
              })
              .catch(() => {
                this.tableLoading = false
              })
          } else {
            return false
          }
        })
    },
    update() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.tableLoading = true
            this.form.userName = this.form.username
            putObj(this.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogPvVisible = false
                this.getList()
              })
              .catch(() => {
                this.tableLoading = false
              })
          } else {
            return false
          }
        })
    },
    closeDialog() {
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>

<style lang="scss">
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    > div {
      width: 99%;
      margin: 0 auto;
    }
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>
