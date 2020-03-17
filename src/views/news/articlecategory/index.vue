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
        label="栏目名称:"
        label-width="100px"
      >
        <el-input
          v-model="searchForm.name"
          type="text"
          size="small"
          placeholder="请输入栏目名称"
          clearable
        />
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
            :span="24"
          >
            <el-form-item
              prop="name"
              label="栏目名称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入栏目名称"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="24"
          >
            <el-form-item
              prop="published"
              label="是否启用:"
              :label-width="formLabelWidth"
            >
              <el-radio v-model="form.published" label="1" :disabled="operationStatus === 1">启用</el-radio>
              <el-radio v-model="form.published" label="0" :disabled="operationStatus === 1">不启用</el-radio>
            </el-form-item>
          </el-col>
          <el-col
            :span="24"
          >
            <el-form-item
              prop="code"
              label="地址链接:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.code"
                autocomplete="off"
                placeholder="请输入地址链接"
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
import { addObj, delObj, fetchArticleCategoryTree, getObj, putObj } from '@/api/news/articlecategory'
import { mapGetters } from 'vuex'
export default {
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
    const DIC = {
      flag: [
        {
          label: '是',
          value: 1
        }, {
          label: '否',
          value: 0
        }
      ]
    }
    return {
      formEdit: true,
      formAdd: true,
      formStatus: '',
      loading: null,
      showElement: false,
      searchForm: {
        name: ''
      },
      form: {
        name: undefined,
        published: undefined,
        code: undefined
      },
      currentId: -1,
      articleCategory_btn_add: false,
      articleCategory_btn_edit: false,
      articleCategory_btn_del: false,
      formRules: {
        menuId: [{ required: true, message: '节点ID不合法', trigger: 'blur' }],
        name: [{ required: true, message: '请输入栏目名称', trigger: 'blur' }],
        seoTitle: [{ required: true, message: 'SEO标题不合法', trigger: 'blur' }],
        seoKeyword: [{ required: true, message: 'SEO关键字不合法', trigger: 'blur' }],
        code: [{ required: true, message: '请输入地址链接', trigger: 'blur' }],
        seoDesc: [{ required: true, message: 'URL描述不合法', trigger: 'blur' }],
        weight: [{ required: true, message: '排序不合法', trigger: 'blur' }],
        publishArticle: [{ required: true, message: '请选择是否发布文章', trigger: 'blur' }],
        published: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
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
      dialogPvVisible: false,
      operationStatus: 0,
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      tableKey: 1,
      tableLoading: false,
      formLabelWidth: '100px',
      tableOption: [
        {
          label: '栏目名称',
          prop: 'name',
          width: 150
        },
        {
          label: '是否启用',
          prop: 'published',
          dicData: DIC.flag,
          width: 120
        },
        {
          label: '地址链接',
          prop: 'code',
          width: 500,
          link: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.articleCategory_btn_add = this.permissions['news_articlecategory_add']
    this.articleCategory_btn_edit = this.permissions['news_articlecategory_edit']
    this.articleCategory_btn_del = this.permissions['news_articlecategory_del']
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      fetchArticleCategoryTree().then(response => {
        // this.treeData = response.data.data
        this.tableLoading = false
        this.page.total = response.data.data.length
        this.tableData = response.data.data
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
      this.form.body = ''
    },
    /**
     * 点击查看
     */
    handleView(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 1
      getObj(row.id).then(data => {
        this.form = data.data.data
        this.init()
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
      this.$refs.dataForm.validate(valid => {
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
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data.data
      })
      this.currentId = data.id
      this.showElement = true
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
    closeDialog() {
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
  }
</style>
