<!--
 * @Date: 2020-02-11 19:09:58
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-19 14:33:06
 * @Description: 用户管理
 -->
<template>
  <div class="user app-container calendar-list-container">
    <el-row :span="24">
      <!-- <el-col
        :xs="24"
        :sm="24"
        :md="5"
        class="user__tree"
      >
        <div class="x__filter">
          <Tree
            :option="treeOption"
            :data="treeData"
            @node-click="nodeClick"
          />
        </div>
      </el-col> -->
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
              v-model="searchForm.username"
              type="text"
              size="small"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="角色" prop="parentId">
            <Input-tree
              v-model="searchForm.deptId"
              :tree-data="treeData"
              :disabled="operationStatus === 1"
              placeholder="请选择用户角色"
              @input="getList"
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
                :disabled="operationStatus === 1"
                placeholder="请输入用户名"
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
              prop="role"
              label="角色:"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.role"
                multiple
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请选择角色"
                style="width: 100%!important;"
              >
                <el-option
                  v-for="item in rolesOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="lockFlag"
              label="状态:"
              :label-width="formLabelWidth"
            >
              <el-radio-group v-model="form.lockFlag">
                <el-radio
                  v-for="item in lockFlagList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="operationStatus !== 0">
            <el-form-item
              label="创建时间:"
              :label-width="formLabelWidth"
            >
              <el-date-picker
                v-model="form.createTime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择日期时间"
                :disabled="operationStatus !== 0"
                style="width: 100%!important;"
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
import { addObj, delObj, fetchList, putObj, getDetails } from '@/api/admin/user'
import { deptRoleList } from '@/api/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { mapGetters } from 'vuex'
import Tree from '@/components/Tree/index'
import InputTree from '@/components/InputTree/index'
export default {
  name: 'SysUser',
  components: {
    Tree,
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
    const validateUsername = (rule, value, callback) => {
      getDetails(value).then(response => {
        if (window.boxType === 'edit') callback()
        const result = response.data.data
        if (result !== null) {
          callback(new Error('用户名已经存在'))
        } else {
          callback()
        }
      })
    }
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
          slot: true
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
      searchForm: {
        username: undefined,
        deptId: undefined
      },
      total: 0,
      treeOption: {
        nodeKey: 'id',
        props: {
          label: 'name',
          value: 'id'
        }
      },
      treeData: [],
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
          },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
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
        phone: [
          {
            min: 11,
            max: 11,
            message: '长度在 11 个字符',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
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
    ...mapGetters(['permissions']),
    lockFlag() {
      return function(flag) {
        if (flag === '0') {
          return '有效'
        } else if (flag === '9') {
          return '锁定'
        }
      }
    }
  },
  created() {
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_edit = this.permissions['sys_user_edit']
    this.sys_user_del = this.permissions['sys_user_del']
    this.init()
    this.getList()
    this.getNodeData()
    this.handleDept()
  },
  methods: {
    init() {
      fetchTree().then(res => {
        this.treeData = res.data.data
      })
    },
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
    handleUpdate(row) {
      console.log(row)
      this.operationStatus = 2
      this.dialogPvVisible = true
      this.form = row
      this.form.password = undefined
      this.form.role = []
      for (let i = 0; i < this.form.roleList.length; i++) {
        this.form.role[i] = this.form.roleList[i].roleId
      }
      deptRoleList().then(res => {
        this.rolesOptions = res.data.data
      })
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
    handleCreate() {
      this.operationStatus = 0
      this.dialogPvVisible = true
      this.form = {}
    },
    create() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.dialogPvVisible = false
            this.tableLoading = true
            if (this.form.phone.indexOf('*') > 0) {
              this.form.phone = undefined
            }
            addObj(this.form)
              .then(() => {
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.tableLoading = false
              })
              .catch(() => {
                this.tableLoading = false
              })
          }
        })
    },
    update() {
      this.$refs
        .dataForm.validate(valid => {
          if (valid) {
            this.dialogPvVisible = false
            this.tableLoading = true
            if (this.form.phone && this.form.phone.indexOf('*') > 0) {
              this.form.phone = undefined
            }
            putObj(this.form)
              .then(() => {
                this.getList()
                this.tableLoading = false
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
              })
              .catch(() => {
                this.tableLoading = false
              })
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
