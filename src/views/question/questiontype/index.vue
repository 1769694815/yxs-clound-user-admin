<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: zhoum
 * @Author: xw
 * @LastEditTime: 2020-03-03 14:31:36
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--题型名称-->
      <el-form-item label="题型名称:" label-width="80px">
        <el-input v-model="searchForm.name" type="text" size="small" placeholder="请输入题型名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜 索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" icon="el-icon-delete" size="small" @click="handleEmpty">清 空</el-button>
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
      <template slot="role" slot-scope="scope">
        <el-tag>{{ scope.row.role }}</el-tag>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button
          type="text"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(scope.row, scope.index)"
        >删除</el-button>
      </template>
    </Xtable>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
      :close-on-click-modal="false"
      :title="operationStatus | dialogTitle"
    >
      <el-row style="padding: 0 20px;" :span="24" :gutter="20">
        <el-form ref="dataForm" :model="form" :rules="rules">
          <!--题型名称-->
          <el-col :span="12">
            <el-form-item label="题型名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入题型名称"
                clearable
                class="question-type-input"
              />
            </el-form-item>
          </el-col>
          <!--题型分值-->
          <el-col :span="12">
            <el-form-item label="题型分值" prop="score">
              <el-input
                v-model="form.score"
                placeholder="请输入题型分值"
                clearable
                class="question-type-input"
              />
            </el-form-item>
          </el-col>
          <!--漏选分值-->
          <el-col :span="12">
            <el-form-item label="漏选分值" prop="missScore">
              <el-input
                v-model="form.missScore"
                placeholder="请输入漏选分值"
                clearable
                class="question-type-input"
              />
            </el-form-item>
          </el-col>
          <!--题型排序-->
          <el-col :span="12">
            <el-form-item label="题型排序" prop="sort">
              <el-input
                v-model="form.sort"
                placeholder="请输入题型排序"
                clearable
                class="question-type-input"
              />
            </el-form-item>
          </el-col>
          <!--题型描述-->
          <el-col :span="12">
            <el-form-item label="题型描述" prop="description">
              <el-input
                v-model="form.description"
                placeholder="请输入题型描述"
                clearable
                class="question-type-input"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="doalog-footer">
        <el-button type="success" size="small" @click="create('dataForm')">保 存</el-button>
        <el-button type="warning" size="small" @click="resetForm('dataForm')">重 置</el-button>
        <el-button size="small" @click="handleClose('dataForm')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj
} from '@/api/question/questiontype'
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
    return {
      tableKey: 0,
      tableLoading: false,
      tearcherList: [],
      treeData: [],
      tableOption: [
        {
          label: '题型名称',
          prop: 'name'
        },
        {
          label: '分值',
          prop: 'score'
        },
        {
          label: '漏选分值',
          prop: 'missScore'
        },
        {
          label: '排序',
          prop: 'sort'
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
      operationStatus: 0,
      form: {}, // 新增 编辑 数据源
      rules: {
        // 表单校验
        name: [
          { required: true, message: '题型名称不能为空', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '题型分值不能为空', trigger: 'blur' }
        ]
      }
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
     * 创建方法
     * @param form
     * @returns
     */
    create(form) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.getList()
          if (this.form.id != null) {
            putObj(this.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
              })
          } else {
            addObj(this.form)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              })
          }
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
    handleUpdate(row) {
      this.form = row
      this.dialogPvVisible = true
      this.operationStatus = 2
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
    },
    handleRemove() {},
    getNodeData() {}
  }
}
</script>
<style>
.question-type-input {
  width: 250px;
}

.course-upload__tip {
  font-size: 12px;
  color: #ff0000;
  margin-top: 7px;
  margin-left: 100px;
}

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
