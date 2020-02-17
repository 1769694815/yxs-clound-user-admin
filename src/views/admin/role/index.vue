<!--
 * @Date: 2020-02-12 13:45:09
 * @LastEditors: xw
 * @Author: xw
 * @LastEditTime : 2020-02-14 17:37:22
 * @Description: 角色管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 表格 -->
    <Xtable
      :tableKey="tableKey"
      :tableLoading="tableLoading"
      :tableData="tableData"
      :page="page"
      :tableOption.sync="tableOption"
      @handle-create="handleCreate"
      @page-change="getList"
    >
      <template
        slot="dsType"
        slot-scope="scope"
      >
        <span>{{ scope.row.dsType | dsTypeFilter(dsTypeList) }}</span>
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
        >查看</el-button>
        <el-button
          v-if="roleManager_btn_edit"
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑</el-button>
        <el-button
          v-if="roleManager_btn_del"
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete(scope.row)"
        >删除</el-button>
        <el-button
          v-if="roleManager_btn_perm"
          type="text"
          icon="el-icon-plus"
          size="mini"
          @click="handlePermission(scope.row)"
        >权限</el-button>
      </template>
    </Xtable>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :title="operationStatus | dialogTitle"
    >
      <el-row
        v-if="operationStatus !== 4"
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
              prop="roleName"
              label="角色名称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.roleName"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="roleCode"
              label="角色标识:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.roleCode"
                autocomplete="off"
                :disabled="operationStatus === 1 || operationStatus === 2"
                placeholder="请输入角色标识"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="roleDesc"
              label="角色描述:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.roleDesc"
                type="textarea"
                autocomplete="off"
                :disabled="operationStatus === 1"
                placeholder="请输入角色描述"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              prop="dsType"
              label="数据权限:"
              :label-width="formLabelWidth"
            >
              <el-select
                v-model="form.dsType"
                placeholder="请选择数据权限"
                :disabled="operationStatus === 1"
                style="width: 100%!important;"
              >
                <el-option
                  v-for="item in dsTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="form.dsType == 1">
            <el-tree
              ref="scopeTree"
              :data="dsScopeData"
              :check-strictly="true"
              :props="defaultProps"
              :default-checked-keys="checkedDsScope"
              class="filter-tree"
              node-key="id"
              highlight-current
              show-checkbox
            />
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
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!-- 权限 -->
      <el-row
        v-else
        style="padding: 0 20px;"
        :span="24"
      >
        <div class="dialog-main-tree">
          <el-tree
            ref="menuTree"
            :data="treeData"
            :default-checked-keys="checkedKeys"
            :check-strictly="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            node-key="id"
            highlight-current
            show-checkbox
            default-expand-all
          />
        </div>
      </el-row>
      <div
        slot="footer"
        class="dialog-footer"
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
          v-if="operationStatus === 4"
          type="primary"
          size="small"
          @click="updatePermession(roleId)"
        >更 新</el-button>
        <el-button
          size="small"
          @click="dialogPvVisible = false"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  fetchList,
  fetchRoleTree,
  permissionUpd,
  putObj
} from '@/api/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import { rule } from '@/utils/validateRules'
export default {
  name: 'TableRole',
  filters: {
    dsTypeFilter(type, list) {
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
        3: '删 除',
        4: '分配权限'
      }
      return titleMap[type]
    }
  },
  data() {
    return {
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      tableKey: 0,
      tableLoading: false,
      tableOption: [
        {
          label: '角色名称',
          prop: 'roleName'
        },
        {
          label: '角色标识',
          prop: 'roleCode',
          width: '120'
        },
        {
          label: '角色描述',
          prop: 'roleDesc',
          overHidden: true,
          width: '150'
        },
        {
          label: '数据权限',
          prop: 'dsType',
          width: '180',
          slot: true
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
      searchForm: {},
      dialogPvVisible: false,
      form: {},
      formLabelWidth: '90px',
      dsTypeList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '自定义',
          value: 1
        },
        {
          label: '本级及子级',
          value: 2
        },
        {
          label: '本级',
          value: 3
        }
      ],
      operationStatus: 0, // 0: 新增 1: 查看  2：编辑 3： 删除   4：权限
      dsScopeData: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id'
      },
      treeData: [],
      checkedKeys: [],
      roleId: undefined,
      formRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          { validator: rule.validatorKey, trigger: 'blur' }
        ],
        roleDesc: [
          { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
        ],
        dsType: [
          { required: true, message: '请选择数据权限类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
    this.handleOpenBefore()
    this.getList()
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
    handleOpenBefore() {
      fetchTree().then(res => {
        this.dsScopeData = res.data.data
        if (this.form.dsScope) {
          this.checkedDsScope = this.form.dsScope.split(',')
        } else {
          this.checkedDsScope = []
        }
      })
    },
    create() {
      this.dialogPvVisible = false
      this.tableLoading = true
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      addObj(this.form)
        .then(() => {
          this.getList()
          this.$notify.success('创建成功')
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.form = {}
      this.operationStatus = 0
    },
    handleView(row) {
      this.dialogPvVisible = true
      this.form = row
      this.operationStatus = 1
    },
    handleUpdate(row) {
      this.dialogPvVisible = true
      this.form = row
      this.operationStatus = 2
    },
    update() {
      this.dialogPvVisible = false
      this.tableLoading = true
      console.log(this.form)
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      putObj(this.form)
        .then(() => {
          this.getList()
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.roleName + '"' + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delObj(row.roleId)
        })
        .then(() => {
          this.getList()
          this.$notify.success('删除成功')
        })
    },
    handlePermission(row) {
      this.operationStatus = 4
      fetchRoleTree(row.roleId)
        .then(res => {
          this.checkedKeys = res.data.data
          return fetchMenuTree()
        })
        .then(res => {
          this.treeData = res.data.data
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(
            this.treeData,
            this.checkedKeys,
            []
          )
          this.dialogPvVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    updatePermession(roleId) {
      const menuIds = this.$refs.menuTree
        .getCheckedKeys()
        .join(',')
        .concat(',')
        .concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, menuIds).then(() => {
        this.dialogPvVisible = false
        this.$store.dispatch('user/getMenu', { type: false })
        this.$notify.success('修改成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
}
</style>
