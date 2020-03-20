<!--
 * @Date: 2020-02-14 12:01:46
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-20 09:40:45
 * @Description: 菜单管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <Xtable
      :table-key="tableKey"
      :table-loading="tableLoading"
      :table-data="tableData"
      :page="page"
      :table-option.sync="tableOption"
      :add-btn="false"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @refresh-change="handleFilter"
      @page-change="getList"
    >
      <template slot="menuLeft">
        <el-button
          v-if="menuManager_btn_add"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleCreate"
        >新 增</el-button>
      </template>
      <template
        slot="type"
        slot-scope="scope"
      >
        <el-tag v-if="scope.row.type === '1'" type="info">按钮</el-tag>
        <el-tag v-else>菜单</el-tag>
      </template>
      <template
        slot="icon"
        slot-scope="scope"
      >
        <svg-icon :icon-class="scope.row.icon" :class-name="scope.row.icon" />
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
          v-if="menuManager_btn_edit"
          type="text"
          icon="el-icon-view"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="menuManager_btn_del"
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
          :rules="rules"
          :model="form"
          :label-width="formLabelWidth"
        >
          <el-col :span="12">
            <el-form-item
              label="名称:"
              prop="name"
            >
              <el-input
                v-model="form.name"
                auto-complete="off"
                placeholder="请输入名称"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="类型:"
              prop="type"
            >
              <el-radio
                v-model="form.type"
                :disabled="operationStatus === 1"
                label="0"
                border
              >菜单</el-radio>
              <el-radio
                v-model="form.type"
                :disabled="operationStatus === 1"
                label="1"
                border
              >按钮</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="路由路径:"
              prop="path"
            >
              <el-input
                v-model="form.path"
                auto-complete="off"
                placeholder="/xx/xxx || http://"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menuId"
              label="节点ID"
              prop="menuId"
            >
              <el-input
                v-model="form.menuId"
                :disabled="operationStatus === 1"
                type="number"
                placeholder="请输入节点ID"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上级菜单:"
              prop="parentId"
            >
              <Input-tree
                v-model="form.parentId"
                :tree-data="treeData"
                :disabled="operationStatus === 1"
                title="上级菜单"
                placeholder="请选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="图标:"
              prop="icon"
            >
              <el-input
                v-model="form.icon"
                auto-complete="off"
                placeholder="请输入图标"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="权限标识:"
              prop="permission"
            >
              <el-input
                v-model="form.permission"
                auto-complete="off"
                type="number"
                placeholder="请输入权限标识"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.type === '0'"
              label="排序:"
              prop="sort"
            >
              <el-input
                v-model="form.sort"
                auto-complete="off"
                type="number"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.type === '0'"
              label="路由缓冲"
              prop="type"
            >
              <el-switch
                v-model="form.keepAlive"
                :disabled="operationStatus === 1"
                :active-value="&quot;0&quot;"
                :inactive-value="&quot;1&quot;"
                active-color="#13ce66"
                inactive-color="#ff4949"
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
import { addObj, delObj, fetchMenuTree, getObj, putObj } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import InputTree from '@/components/InputTree/index'
export default {
  name: 'Menu',
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
      formAdd: true,
      formStatus: '',
      showElement: false,
      form: {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: undefined,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      },
      currentId: -1,
      menuManager_btn_add: false,
      menuManager_btn_edit: false,
      menuManager_btn_del: false,
      rules: {
        menuId: [{ required: true, message: '节点ID不合法', trigger: 'blur' }],
        name: [{ required: true, message: '标题不合法', trigger: 'blur' }],
        type: [{ required: true, message: '类型不合法', trigger: 'blur' }],
        path: [{ validator: this.checkPath, trigger: 'blur' }]
      },
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      tableKey: 0,
      tableLoading: false,
      tableOption: [{
        label: '名称',
        prop: 'label'
      }, {
        label: '类型',
        prop: 'type',
        slot: true
      }, {
        label: '路由路径',
        prop: 'path',
        width: 200
      }, {
        label: '图标',
        prop: 'icon'
      }, {
        label: '权限标识',
        prop: 'code'
      }, {
        label: '排序',
        prop: 'sort'
      }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {},
      dialogPvVisible: false,
      operationStatus: 0,
      formLabelWidth: '90px'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.menuManager_btn_add = this.permissions['sys_menu_add']
    this.menuManager_btn_edit = this.permissions['sys_menu_edit']
    this.menuManager_btn_del = this.permissions['sys_menu_del']
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      fetchMenuTree().then(response => {
        this.treeData = response.data.data
        this.tableData = response.data.data
        this.tableLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeExpand(data) {
      const aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse(data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], oNode => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys() {
      const oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (const sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion(aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          const oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.getList()
          this.resetForm()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          putObj(this.form).then(() => {
            this.getList()
            this.dialogPvVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    create() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList()
            this.dialogPvVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetForm() {
      this.form = {
        permission: undefined,
        name: undefined,
        menuId: undefined,
        parentId: this.currentId,
        icon: undefined,
        sort: undefined,
        component: undefined,
        type: undefined,
        path: undefined
      }
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    handleFilter() {
      this.getList()
    },
    handleView(row) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      getObj(row.id).then(res => {
        console.log('res', res)
        this.form = res.data.data
      })
    },
    handleUpdate(row) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      getObj(row.id).then(res => {
        console.log('res', res)
        this.form = res.data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
}
</style>
