<!--
 * @Author: xwen
 * @Date: 2020-03-02 14:54:36
 * @LastEditTime: 2020-03-03 10:30:18
 * @LastEditors: xwen
 * @Description: 基本设置
 -->
<template>
  <div class="execution app-container calendar-list-container">
    <!-- 头部菜单 -->
    <el-form />
    <!-- 表格 -->
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
          v-if="admin_systenant_edit"
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleUpdate(scope.row)"
        >编辑
        </el-button>
        <el-button
          v-if="admin_systenant_del"
          type="text"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete(scope.row, scope.$index)"
        >删除
        </el-button>
      </template>
    </Xtable>
  </div>
</template>

<script>
export default {
  name: 'Setting',
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
      tableOption: [
        {
          label: '网站名称',
          prop: 'name'
        },
        {
          label: '域名',
          prop: 'name'
        },
        {
          label: 'SEO',
          prop: 'seo'
        },
        {
          label: '备案号',
          prop: 'num'
        },
        {
          label: '联系电话',
          prop: 'phone'
        },
        {
          label: '客服QQ',
          prop: 'qq'
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {},
      tableKey: 0,
      tableLoading: false,
      dialogPvVisible: false,
      operationStatus: 0,
      form: {},
      formLabelWidth: '90px'
    }
  },
  created() {

  },
  methods: {
    getList() {
      this.tableLoading = true
      // DOTO 请求接口
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      // DOTO 清空searchForm
      this.getList()
    },
    handleView(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    create() {

    },
    handleUpdate(row) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
    },
    update() {

    },
    handleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          // DOTO delObj() 删除方法
          // return delObj(row.id)
        })
        .then(data => {
          _this.tableData.splice(index, 1)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
    }
  }
}
</script>
