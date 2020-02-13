<!--
 * @Date: 2020-02-11 19:09:58
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-13 20:24:53
 * @Description: 用户管理
 -->
<template>
  <div class="user app-container calendar-list-container">
    <el-row :span="24">
      <el-col
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
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="19"
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
              v-model="listQuery.username"
              type="text"
              size="small"
              placeholder="请输入用户名"
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
        <!-- 表格操作 -->
        <div class="x__menu">
          <el-button
            v-if="sys_user_add"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleCreate"
          >添 加</el-button>
        </div>
        <!-- 表格 -->
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          stripe
          highlight-current-row
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            prop="username"
            label="用户名"
            align="center"
          />
          <el-table-column
            prop="phone"
            label="手机号"
            align="center"
          />
          <el-table-column
            label="角色"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-for="(role,index) in scope.row.roleList"
                :key="index"
              >
                <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <el-tag>{{ lockFlag(scope.row.lockFlag)  }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
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
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <Pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :title="dialogTitle(operationStatus)"
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
                :treeData="treeDeptData"
                :operationStatus="operationStatus"
                @node-click="getNodeData"
                placeholder="请选择所属部门"
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
          size="small"
          @click="dialogPvVisible = false"
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
import Pagination from '@/components/Pagination/index'
import Tree from '@/components/Tree/index'
import InputTree from '@/components/InputTree/index'
export default {
  name: 'SysUser',
  components: {
    Pagination,
    Tree,
    InputTree
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
      listLoading: true,
      list: [],
      listQuery: {
        page: 1,
        limit: 10,
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
      role: [],
      roleList: [],
      rolesOptions: []
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    dialogTitle() {
      return function(status) {
        let value = ''
        switch (status) {
          case 0:
            value = '新 增'
            break
          case 1:
            value = '查 看'
            break
          case 2:
            value = '编 辑'
            break
          case 3:
            value = '删 除'
            break
          default:
            value = ''
        }
        return value
      }
    },
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
    this.handleDept()
  },
  methods: {
    init() {
      fetchTree().then(res => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.data.records
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    nodeClick(data) {
      console.log(data)
      this.listQuery.page = 1
      this.listQuery.deptId = data.id
      this.getList()
    },
    handleDept() {
      fetchTree().then(res => {
        this.treeDeptData = res.data.data
      })
    },
    getNodeData() {
      console.log('form', this.form)
      deptRoleList().then(response => {
        this.rolesOptions = response.data.data
        console.log(this.rolesOptions)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.listQuery.username = undefined
      this.listQuery.deptId = undefined
      this.getList()
    },
    handleUpdate(row) {
      console.log(row)
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
    handleCreate() {
      this.operationStatus = 0
      console.log(this.operationStatus)
      this.dialogPvVisible = true
    },
    create() {}
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
