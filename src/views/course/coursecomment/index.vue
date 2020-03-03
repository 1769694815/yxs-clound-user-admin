<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: zhoum
 * @Author: xw
 * @LastEditTime: 2020-03-03 16:16:56
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--评论内容-->
      <el-form-item label="评论内容:" label-width="80px">
        <el-input v-model="searchForm.content" type="text" size="small" placeholder="请输入评论内容" />
      </el-form-item>
      <!--审核状态-->
      <el-form-item label="审核状态:" label-width="80px">
        <el-select v-model="searchForm.status" clearable>
          <el-option
            v-for="item in DIC.typeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--是否置顶-->
      <el-form-item label="是否置顶:" label-width="130px">
        <el-select v-model="searchForm.topFlag" clearable>
          <el-option
            v-for="item in DIC.typeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          <!--评论内容-->
          <el-col :span="12">
            <el-form-item label="评论内容" prop="name">
              <el-input
                v-model="form.content"
                placeholder="请输入评论内容"
                clearable
                class="comment-input"
              />
            </el-form-item>
          </el-col>
          <!--父类id-->
          <el-col :span="12">
            <el-form-item label="父类id" prop="parentId">
              <el-input
                v-model="form.parentId"
                placeholder="请输入父类id"
                clearable
                class="comment-input"
              />
            </el-form-item>
          </el-col>
          <!--审核状态-->
          <el-col :span="12">
            <el-form-item label="审核状态" prop="status">
              <el-select
                v-model="form.status"
                clearable
                class="comment-input"
                placeholder="请选择审核状态"
              >
                <el-option
                  v-for="item in DIC.typeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--是否置顶-->
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="topFlag">
              <el-select
                v-model="form.topFlag"
                clearable
                class="comment-input"
                placeholder="请选择是否置顶"
              >
                <el-option
                  v-for="item in DIC.typeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
  delObj
} from '@/api/course/coursecomment'
import { mapGetters } from 'vuex'
import { getToken } from '@/api/qiniu'

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
      typeList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      auditStatus: [
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '通过'
        },
        {
          value: 2,
          label: '不通过'
        }
      ]
    }
    return {
      DIC: DIC,
      tableKey: 0,
      headers: {
        Authorization: 'Bearer ' + getToken
      },
      tableLoading: false,
      commentTypeList: [],

      tableOption: [
        {
          label: '评论内容',
          prop: 'content'
        },
        {
          label: '状态',
          prop: 'status',
          dicData: DIC.auditStatus
        },
        {
          type: 'input',
          label: '父节点',
          prop: 'parentId'
        },
        {
          label: '删除标志',
          prop: 'delFlag',
          dicData: DIC.typeList
        },
        {
          type: 'input',
          label: '用户ID',
          prop: 'createUserId'
        },
        {
          type: 'input',
          label: '创建时间',
          prop: 'createTime'
        },
        {
          label: '是否置顶',
          prop: 'topFlag',
          dicData: DIC.typeList
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
      rules: {},
      dataObj: { token: '', key: '' }
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
    handleRemove() {}
  }
}
</script>
<style>
.comment-input {
  width: 250px;
}

.comment-upload__tip {
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
