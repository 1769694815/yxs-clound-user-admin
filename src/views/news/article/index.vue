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
        label-width="80px"
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
        :label-width="formLabelWidth"
      >
        <el-select v-model="searchForm.status" clearable placeholder="请选择是否发布">
          <el-option
            v-for="item in DIC.status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />

        </el-select>
      </el-form-item>
      <el-form-item
        label="是否头条:"
        :label-width="formLabelWidth"
      >
        <el-select v-model="searchForm.featured" clearable placeholder="请选择是否头条">
          <el-option
            v-for="item in DIC.flag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />

        </el-select>
      </el-form-item>
      <el-form-item
        label="是否推荐:"
        :label-width="formLabelWidth"
      >
        <el-select v-model="searchForm.promoted" clearable placeholder="请选择是否推荐">
          <el-option
            v-for="item in DIC.flag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />

        </el-select>
      </el-form-item>
      <el-form-item
        label="是否置顶:"
        :label-width="formLabelWidth"
      >
        <el-select v-model="searchForm.sticky" clearable placeholder="请选择是否置顶">
          <el-option
            v-for="item in DIC.flag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />

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
              <el-select v-model="form.categoryId" placeholder="请选择所属栏目" :disabled="operationStatus === 1" autocomplete="off" style="width: 336px;">
                <el-option
                  v-for="item in categoryTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />

              </el-select></el-form-item>
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
                style="width: 336px;"
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
                :type="3"
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
              <el-radio v-model="form.status" label="1" :disabled="operationStatus === 1">发布</el-radio>
              <el-radio v-model="form.status" label="0" :disabled="operationStatus === 1">未发布</el-radio>
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
              <el-radio v-model="form.featured" label="1" :disabled="operationStatus === 1">是</el-radio>
              <el-radio v-model="form.featured" label="0" :disabled="operationStatus === 1">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="promoted"
              label="是否推荐:"
              :label-width="formLabelWidth"
            >
              <el-radio v-model="form.promoted" label="1" :disabled="operationStatus === 1">是</el-radio>
              <el-radio v-model="form.promoted" label="0" :disabled="operationStatus === 1">否</el-radio>
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
              <el-radio v-model="form.sticky" label="1" :disabled="operationStatus === 1">是</el-radio>
              <el-radio v-model="form.sticky" label="0" :disabled="operationStatus === 1">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              prop="body"
              label="文章描述:"
              :label-width="formLabelWidth"
            >
              <tinymce ref="tinymce" v-model="form.body" :height="300" />
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
import { fetchList, getObj, addObj, putObj, delObj, getCategoryType } from '@/api/news/article'
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
    const DIC = {
      status: [
        {
          label: '已发布',
          value: '1'
        }, {
          label: '未发布',
          value: '0'
        }, {
          label: '已删除',
          value: '9'
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
      tableLoading: false,
      DIC: DIC,
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
          label: '缩略图',
          prop: 'thumb',
          img: true
        }, {
          label: '文章头图',
          prop: 'picture',
          hide: true
        }, {
          label: '状态',
          prop: 'status',
          dicData: DIC.status
        }, {
          label: '点击量',
          prop: 'hits'
        }, {
          label: '虚拟数',
          prop: 'inventedNum'
        }, {
          label: '是否头条',
          prop: 'featured',
          dicData: DIC.flag
        }, {
          label: '是否推荐',
          prop: 'promoted',
          dicData: DIC.flag
        }, {
          label: '是否置顶',
          prop: 'sticky',
          dicData: DIC.flag
        }, {
          label: '回复数',
          prop: 'postNum',
          hide: true
        }, {
          label: '点赞数',
          prop: 'upsNum',
          hide: true
        }, {
          label: '创建时间',
          prop: 'createTime'
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
          message: '请选择是否推荐',
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
    this.getCategoryType()
    this.getList()
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
     * 栏目列表
     */
    getCategoryType() {
      getCategoryType().then(data => {
        this.categoryTypeList = data.data.data
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
      })
      this.form = row
      this.init()
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
      this.init()
    },
    /**
     * 新增保存
     */
    create() {
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
    /**
     * 初始化富文本编辑器
     */
    init() {
      // 初始化富文本编辑器
      this.$nextTick(() => {
        if (this.$refs.tinymce.hasInit) {
          this.$refs.tinymce.destroyTinymce()
        }
        this.$refs.tinymce.init()
      })
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
