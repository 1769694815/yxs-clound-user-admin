<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button-group>
        <el-button
          v-if="articleCategory_btn_add"
          type="primary"
          icon="plus"
          @click="handlerAdd"
        >添加
        </el-button>
        <el-button
          v-if="articleCategory_btn_edit"
          type="primary"
          icon="edit"
          @click="handlerEdit"
        >编辑
        </el-button>
        <el-button
          v-if="articleCategory_btn_del"
          type="primary"
          icon="delete"
          @click="handleDelete"
        >删除
        </el-button>
      </el-button-group>
    </div>

    <el-row>
      <el-col
        :span="8"
        style="margin-top: 15px"
      >
        <el-tree
          :data="treeData"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          class="filter-tree"
          node-key="id"
          highlight-current
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        />
      </el-col>
      <el-col
        :span="16"
        style="margin-top: 15px;"
      >
        <div class="box-card">
          <el-form
            ref="form"
            :label-position="labelPosition"
            :model="form"
            :rules="rules"
            label-width="100px"
          >
            <el-form-item
              label="父级节点"
              prop="parentId"
            >
              <el-input
                v-model="form.parentId"
                :disabled="true"
                label-width="100px"
                placeholder="请输入父级节点"
              />
            </el-form-item>
            <el-form-item
              v-if="form.menuId"
              label="节点ID"
              prop="menuId"
            >
              <el-input
                v-model="form.menuId"
                :disabled="formEdit || formStatus === 'update'"
                type="number"
                placeholder="请输入节点ID"
              />
            </el-form-item>
            <el-form-item
              prop="name"
              label="栏目名称:"
              label-width="100px"
            >
              <el-input
                v-model="form.name"
                :disabled="formEdit"
                placeholder="请输入栏目名称"
              />
            </el-form-item>
            <el-form-item
              prop="seoTitle"
              label="SEO标题:"
              label-width="100px"
            >
              <el-input
                v-model="form.seoTitle"
                :disabled="formEdit"
                placeholder="请输入SEO标题"
              />
            </el-form-item>
            <el-form-item
              prop="seoKeyword"
              label="SEO关键字:"
              label-width="100px"
            >
              <el-input
                v-model="form.seoKeyword"
                :disabled="formEdit"
                placeholder="请输入SEO关键字"
              />
            </el-form-item>
            <el-form-item
              prop="code"
              label="URL名称:"
              label-width="100px"
            >
              <el-input
                v-model="form.code"
                :disabled="formEdit"
                placeholder="请输入URL目录名称"
              />
            </el-form-item>
            <el-form-item
              prop="weight"
              label="排序:"
              label-width="100px"
            >
              <el-input-number
                v-model="form.weight"
                :disabled="formEdit"
                placeholder="请输入排序"
              />
            </el-form-item>
            <el-form-item
              prop="seoDesc"
              label="URL描述:"
              label-width="100px"
            >
              <el-input v-model="form.seoDesc" type="textarea" placeholder="请输入URL描述" :rows="5" :disabled="formEdit" />
            </el-form-item>
            <el-form-item
              label="发布文章:"
              prop="publishArticle"
              label-width="100px"
            >
              <el-radio
                v-model="form.publishArticle"
                :disabled="formEdit"
                label="0"
              >是</el-radio>
              <el-radio
                v-model="form.publishArticle"
                :disabled="formEdit"
                label="1"
              >否</el-radio>
            </el-form-item>
            <el-form-item
              label="启用:"
              prop="published"
              label-width="100px"
            >
              <el-radio
                v-model="form.published"
                :disabled="formEdit"
                label="0"
              >是</el-radio>
              <el-radio
                v-model="form.published"
                :disabled="formEdit"
                label="1"
              >否</el-radio>
            </el-form-item>
            <el-form-item v-if="formStatus === 'update'">
              <el-button
                type="primary"
                @click="update"
              >更新
              </el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus === 'create'">
              <el-button
                type="primary"
                @click="create"
              >保存
              </el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addObj, delObj, fetchArticleCategoryTree, getObj, putObj } from '@/api/news/articlecategory'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      formEdit: true,
      formAdd: true,
      formStatus: '',
      loading: null,
      showElement: false,
      form: {
        name: undefined,
        parentId: undefined,
        published: undefined,
        publishArticle: undefined
      },
      currentId: -1,
      articleCategory_btn_add: false,
      articleCategory_btn_edit: false,
      articleCategory_btn_del: false,
      rules: {
        menuId: [{ required: true, message: '节点ID不合法', trigger: 'blur' }],
        name: [{ required: true, message: '标题不合法', trigger: 'blur' }],
        seoTitle: [{ required: true, message: 'SEO标题不合法', trigger: 'blur' }],
        seoKeyword: [{ required: true, message: 'EO关键字不合法', trigger: 'blur' }],
        code: [{ required: true, message: 'URL目录名称不合法', trigger: 'blur' }],
        seoDesc: [{ required: true, message: 'URL描述不合法', trigger: 'blur' }],
        weight: [{ required: true, message: '排序不合法', trigger: 'blur' }],
        publishArticle: [{ required: true, message: '请选择是否发布文章', trigger: 'blur' }],
        published: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
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
      labelPosition: 'right'
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
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      fetchArticleCategoryTree().then(response => {
        this.treeData = response.data.data
        this.loading.close()
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
        // 需要把number类型更改为字符串类型
        this.form.publishArticle = String(this.form.publishArticle)
        this.form.published = String(this.form.published)
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
    handlerAdd() {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handlerEdit() {
      if (this.form.id) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
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
      this.$refs.form.validate(valid => {
        if (valid) {
          putObj(this.form).then(() => {
            this.getList()
            this.formEdit = false
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
      this.$refs.form.validate(valid => {
        console.log(this.form)
        if (valid) {
          addObj(this.form).then(() => {
            this.getList()
            this.formEdit = false
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
    onCancel() {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm() {
      this.form = {
        name: undefined,
        published: undefined,
        publishArticle: undefined,
        parentId: this.currentId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    width: 100%;
  }
</style>
