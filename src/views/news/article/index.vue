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
              label="栏目ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.categoryId"
                autocomplete="off"
                placeholder="请输入栏目ID"
                :disabled="operationStatus === 1"
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
              prop="publishedTime"
              label="发布时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.publishedTime"
                autocomplete="off"
                placeholder="请输入发布时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="body"
              label="内容正文:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.body"
                autocomplete="off"
                placeholder="请输入内容正文"
                :disabled="operationStatus === 1"
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
              <el-input
                v-model="form.thumb"
                autocomplete="off"
                placeholder="请输入缩略图"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="originalThumb"
              label="缩略图原图:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.originalThumb"
                autocomplete="off"
                placeholder="请输入缩略图原图"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="picture"
              label="文章头图，文章编辑／添加时，自动取正文的第１张图:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.picture"
                autocomplete="off"
                placeholder="请输入文章头图，文章编辑／添加时，自动取正文的第１张图"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="status"
              label="状态（0:未发布,1:已发布,9:删除）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.status"
                autocomplete="off"
                placeholder="请输入状态（0:未发布,1:已发布,9:删除）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="hits"
              label="点击量:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.hits"
                autocomplete="off"
                placeholder="请输入点击量"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="featured"
              label="是否头条（0:是,1:否）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.featured"
                autocomplete="off"
                placeholder="请输入是否头条（0:是,1:否）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="promoted"
              label="是否推荐（0:是,1:否）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.promoted"
                autocomplete="off"
                placeholder="请输入是否推荐（0:是,1:否）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sticky"
              label="是否置顶（0:是,1:否）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.sticky"
                autocomplete="off"
                placeholder="请输入是否置顶（0:是,1:否）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="postNum"
              label="回复数:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.postNum"
                autocomplete="off"
                placeholder="请输入回复数"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="upsNum"
              label="点赞数:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.upsNum"
                autocomplete="off"
                placeholder="请输入点赞数"
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
              <el-input
                v-model="form.inventedNum"
                autocomplete="off"
                placeholder="请输入虚拟数"
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
          @click="dialogPvVisible = false"
        >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/news/article'
import { mapGetters } from 'vuex'

export default {
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
      tableOption: [
        {
          label: '文章标题',
          prop: 'title'
        }, {
          label: '简叙',
          prop: 'brIfe'
        }, {
          label: '栏目ID',
          prop: 'categoryId'
        }, {
          label: '来源',
          prop: 'source'
        }, {
          label: '来源URL',
          prop: 'sourceUrl'
        }, {
          label: '发布时间',
          prop: 'publishedTime'
        }, {
          label: '缩略图',
          prop: 'thumb'
        }, {
          label: '文章头图',
          prop: 'picture'
        }, {
          label: '状态',
          prop: 'status',
          dicData: DIC.status
        }, {
          label: '点击量',
          prop: 'hits'
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
          prop: 'postNum'
        }, {
          label: '点赞数',
          prop: 'upsNum'
        }, {
          label: '虚拟数',
          prop: 'inventedNum'
        }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {},
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
      this.form = row
    },
    /**
             * 点击编辑
             */
    handleUpdate(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
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
    }

  }
}
</script>
