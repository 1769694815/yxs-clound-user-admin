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
        label="搜索字段1:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.field1"
          type="text"
          size="small"
          placeholder="请输入搜索字段1"
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
              prop="id"
              label=":"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.id"
                autocomplete="off"
                placeholder="请输入"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
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
            :span="12"
          >
            <el-form-item
              prop="code"
              label="URL目录名称:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.code"
                autocomplete="off"
                placeholder="请输入URL目录名称"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="weight"
              label="权重:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.weight"
                autocomplete="off"
                placeholder="请输入权重"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="publishArticle"
              label="是否允许发布文章(1:是,2:否):"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.publishArticle"
                autocomplete="off"
                placeholder="请输入是否允许发布文章(1:是,2:否)"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="seoTitle"
              label="栏目标题:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.seoTitle"
                autocomplete="off"
                placeholder="请输入栏目标题"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="seoKeyword"
              label="SEO 关键字:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.seoKeyword"
                autocomplete="off"
                placeholder="请输入SEO 关键字"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="seoDesc"
              label="栏目描述（SEO）:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.seoDesc"
                autocomplete="off"
                placeholder="请输入栏目描述（SEO）"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="published"
              label="是否启用（1:启用 2:停用):"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.published"
                autocomplete="off"
                placeholder="请输入是否启用（1:启用 2:停用)"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="parentId"
              label="父类ID:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.parentId"
                autocomplete="off"
                placeholder="请输入父类ID"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="userName"
              label="创建人:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.userName"
                autocomplete="off"
                placeholder="请输入创建人"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="createdTime"
              label="创建时间:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.createdTime"
                autocomplete="off"
                placeholder="请输入创建时间"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="tenantId"
              label="租户id:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.tenantId"
                autocomplete="off"
                placeholder="请输入租户id"
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
import { fetchList, getObj, addObj, putObj, delObj } from '@/api/news/articlecategory'
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
      openFlag: [
        {
          label: '启用',
          value: '1'
        }, {
          label: '禁用',
          value: '0'
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
          label: '栏目名称',
          prop: 'name'
        }, {
          label: 'URL目录名称',
          prop: 'code'
        }, {
          label: '权重',
          prop: 'weight'
        }, {
          label: '是否允许发布文章',
          prop: 'publishArticle',
          dicData: DIC.flag
        }, {
          label: '栏目标题',
          prop: 'seoTitle'
        }, {
          label: 'SEO 关键字',
          prop: 'seoKeyword'
        }, {
          label: '栏目描述（SEO）',
          prop: 'seoDesc'
        }, {
          label: '是否启用（1:启用 2:停用)',
          prop: 'published'
        }, {
          label: '父类ID',
          prop: 'parentId'
        }, {
          label: '创建人',
          prop: 'userName'
        }, {
          label: '创建时间',
          prop: 'createdTime'
        }, {
          label: '租户id',
          prop: 'tenantId'
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
