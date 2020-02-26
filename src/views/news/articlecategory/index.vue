<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
    >
      <!--导航名称-->
      <el-form-item
        label="导航名称:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.name"
          type="text"
          size="small"
          placeholder="请输入导航名称"
        />
      </el-form-item>
      <!--是否启用-->
      <el-form-item
        label="是否启用:"
        label-width="80px"
      >
        <el-select v-model="searchForm.openFlag" clearable>
          <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!--是否打开新窗口-->
      <el-form-item
        label="是否打开新窗口:"
        label-width="130px"
      >
        <el-select v-model="searchForm.newwinFlag" clearable>
          <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value" />
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
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(scope.row, scope.index)"
        >删除
        </el-button>
      </template>
    </Xtable>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :close-on-click-modal="false"
      :title="operationStatus | dialogTitle"
    >
      <el-row
        style="padding: 0 20px;"
        :span="24"
        :gutter="20"
      >
        <el-form
          ref="dataForm"
          :model="form"
          :rules="rules"
        >
        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          type="success"
          size="small"
          @click="create('dataForm')"
        >保 存
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="resetForm('dataForm')"
        >重 置
        </el-button>
        <el-button
          size="small"
          @click="handleClose('dataForm')"
        >取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/news/articlecategory/articlecategory'
import { mapGetters } from 'vuex'

export default {
  name: 'Index',
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
    return {
      tableKey: 0,
      tableLoading: false,
      typeList: [
        {
          'value': 0,
          'label': '否'
        },
        {
          'value': 1,
          'label': '是'
        }
      ],
      tableOption: [
        {
          label: '编号',
          prop: 'id',
          hide: true
        },
        {
          label: '栏目名称',
          prop: 'name',
          overHidden: true,
          width: '120'
        },
        {
          label: '是否启用',
          prop: 'published'
        },
        {
          label: '是否允许发布文章',
          prop: 'publishArticle',
          overHidden: true
        },
        {
          label: '排序',
          prop: 'weight'
        },
        {
          label: 'SEO标题',
          prop: 'seoTitle',
          overHidden: true
        },
        {
          label: '创建人',
          prop: 'userName',
          width: '180'
        },
        {
          label: '创建时间',
          prop: 'createdTime'
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
      operationStatus: 0,
      form: {}, // 新增 编辑 数据源
      rules: { // 表单校验
        name: [
          { required: true, message: '导航名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        openFlag: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ],
        newwinFlag: [
          { required: true, message: '请选择是否打开新窗口', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      },
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
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
    /**
     * 创建方法
     * @param form
     * @returns
     */
    create(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(1111)
        } else {
          return false
        }
      })
    },
    /**
     * 重置
     * @param form
     * @returns
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    handleView(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.id)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    },
    handleClose(form) {
      this.dialogPvVisible = false
      this.form = {}
      this.$refs[form].resetFields()
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.form = {}
    }
  }
}
</script>

