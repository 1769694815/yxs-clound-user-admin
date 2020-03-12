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
        label="标题:"
        label-width="60px"
      >
        <el-input
          v-model="searchForm.title"
          type="text"
          size="small"
          placeholder="请输入文章标题"
        />
      </el-form-item>
      <el-form-item
        label="状态:"
        label-width="60px"
      >
        <single-change
          v-model="searchForm.status"
          :operation-status="operationStatus"
          status-type="common_release_status"
          type="select"
          size="small"
        />

      </el-form-item>
      <el-form-item
        label="是否头条:"
        :label-width="formLabelWidth"
      >
        <single-change
          v-model="searchForm.featured"
          :operation-status="operationStatus"
          status-type="common_flag"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="推荐热门:"
        :label-width="formLabelWidth"
      >
        <single-change
          v-model="searchForm.promoted"
          :operation-status="operationStatus"
          status-type="common_flag"
          type="select"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="是否置顶:"
        :label-width="formLabelWidth"
      >
        <single-change
          v-model="searchForm.sticky"
          :operation-status="operationStatus"
          status-type="common_flag"
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
              prop="title"
              label="文章标题:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.title"
                autocomplete="off"
                placeholder="请输入文章标题"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="brIfe"
              label="简叙:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.brIfe"
                autocomplete="off"
                placeholder="请输入简叙"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="categoryId"
              label="所属栏目:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.categoryId"
                :operation-status="operationStatus"
                :dic-prop="{ label: 'name', value: 'id' }"
                dic-url="/news/articlecategory/getCategoryType"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="source"
              label="来源:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.source"
                autocomplete="off"
                placeholder="请输入来源"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sourceUrl"
              label="来源URL:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.sourceUrl"
                autocomplete="off"
                placeholder="请输入来源URL"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="inventedNum"
              label="虚拟数:"
              :label-width="formLabelWidth"
            >
              <el-input-number
                v-model="form.inventedNum"
                autocomplete="off"
                placeholder="请输入虚拟数"
                :disabled="operationStatus === 1"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="thumb"
              label="缩略图:"
              :label-width="formLabelWidth"
            >
              <single-image
                v-model="form.thumb"
                status="3"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="status"
              label="状态:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.status"
                :operation-status="operationStatus"
                status-type="common_release_status"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="featured"
              label="是否头条:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.featured"
                :operation-status="operationStatus"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="promoted"
              label="推荐热门:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.promoted"
                :operation-status="operationStatus"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sticky"
              label="是否置顶:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.sticky"
                :operation-status="operationStatus"
                status-type="common_flag"
                type="radio"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="文章描述:"
              prop="body"
              :label-width="formLabelWidth"
            >
              <tinymce ref="tinymce" v-model="form.body" :readonly="operationStatus === 1" :height="300" />
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
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/news/article'
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce/index'

export default {
  name: 'Article',
  components: {
    Tinymce
  },
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
    const tinymceValidate = (rule, value, callback) => {
      if (this.form.body === '') {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      headers: {},
      tableKey: 0,
      tableLoading: false,
      tableOption: [
        {
          label: '文章标题',
          prop: 'title'
        }, {
          label: '简叙',
          prop: 'brIfe',
          hide: true
        }, {
          label: '栏目ID',
          prop: 'categoryId',
          dicUrl: '/news/articlecategory/getCategoryType',
          dicData: [],
          dicProp: { label: 'name', value: 'id' }

        }, {
          label: '来源',
          prop: 'source',
          hide: true
        }, {
          label: '来源URL',
          prop: 'sourceUrl',
          hide: true
        }, {
          label: '生成URL',
          prop: 'url'
        }, {
          label: '缩略图',
          prop: 'thumb',
          width: '140',
          img: true
        }, {
          label: '文章头图',
          prop: 'picture',
          hide: true
        }, {
          label: '状态',
          prop: 'status',
          dicUrl: 'common_release_status',
          dicData: []
        }, {
          label: '点击量',
          prop: 'hits'
        }, {
          label: '虚拟数',
          prop: 'inventedNum'
        }, {
          label: '是否头条',
          prop: 'featured',
          dicUrl: 'common_flag',
          dicData: []
        }, {
          label: '推荐热门',
          prop: 'promoted',
          dicUrl: 'common_flag',
          dicData: []
        }, {
          label: '是否置顶',
          prop: 'sticky',
          dicUrl: 'common_flag',
          dicData: []
        }, {
          label: '回复数',
          prop: 'postNum',
          hide: true
        }, {
          label: '点赞数',
          prop: 'upsNum',
          hide: true
        }, {
          label: '发布时间',
          prop: 'publishedTime',
          width: '200px'
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
      categoryTypeList: [],
      formRules: {
        title: [{
          required: true,
          message: '请输入文章标题',
          trigger: 'blur'
        }],
        brIfe: [{
          required: true,
          message: '请输入简叙',
          trigger: 'blur'
        }],
        categoryId: [{
          required: true,
          message: '请选择所属栏目',
          trigger: 'blur'
        }],
        source: [{
          required: true,
          message: '请输入来源',
          trigger: 'blur'
        }],
        sourceUrl: [{
          required: true,
          message: '请输入来源URL',
          trigger: 'blur'
        }],
        inventedNum: [{
          required: true,
          message: '请输入虚拟数',
          trigger: 'blur'
        }],
        thumb: [{
          required: true,
          message: '请上传缩略图',
          trigger: 'blur'
        }],
        featured: [{
          required: true,
          message: '请选择是否头条',
          trigger: 'blur'
        }],
        promoted: [{
          required: true,
          message: '请选择是否推荐热门',
          trigger: 'blur'
        }],
        sticky: [{
          required: true,
          message: '请选择是否置顶',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'blur'
        }],
        body: [{
          required: true,
          validator: tinymceValidate,
          message: '请输入文章描述',
          trigger: 'blur'
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
            descs: 'create_time',
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
        status: '1',
        featured: '0',
        promoted: '0',
        sticky: '0',
        inventedNum: 0
      }
      this.form.body = ''
      this.init()
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
        this.init()
      })
    },
    /**
     * 新增保存
     */
    create() {
      this.$refs
        .dataForm.validate(valid => {
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
    /**
     * 初始化富文本编辑器
     */
    init() {
      this.$nextTick(() => {
        this.$refs.tinymce.init()
      })
    },
    closeDialog() {
      this.$nextTick(() => {
        if (this.$refs.tinymce.hasInit) {
          // this.form.body = ''
          this.$refs.tinymce.destroyTinymce()
        }
      })
      this.$refs.dataForm.resetFields()
      this.dialogPvVisible = false
    }
  }
}
</script>
