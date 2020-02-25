<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-02-20 10:52:43
 * @Description: 文件管理
 -->
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
      <!--类型-->
      <el-form-item
        label="类型:"
        label-width="80px"
      >
        <el-select v-model="searchForm.code" clearable>
          <el-option v-for="item in navigationTypeList" :key="item.label" :label="item.label" :value="item.value" />
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
          <!--导航名称-->
          <el-col :span="12">
            <el-form-item label="导航名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入导航名称" clearable class="navigation-input" />
            </el-form-item>
          </el-col>
          <!--类型-->
          <el-col :span="12">
            <el-form-item label="类型" prop="code">
              <el-select v-model="form.code" clearable placeholder="请选择类型" class="navigation-input">
                <el-option
                  v-for="item in navigationTypeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--是否启用-->
          <el-col :span="12">
            <el-form-item label="是否启用" prop="openFlag">
              <el-select v-model="form.openFlag" clearable class="navigation-input" placeholder="请选择是否启用">
                <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--链接地址-->
          <el-col :span="12">
            <el-form-item label="外链" prop="url">
              <el-input v-model="form.url" placeholder="请输入链接地址" clearable class="navigation-input" />
            </el-form-item>
          </el-col>
          <!--新窗口-->
          <el-col :span="12">
            <el-form-item label="打开窗口" prop="newwinFlag">
              <el-select v-model="form.newwinFlag" clearable class="navigation-input" placeholder="请选择是否打开新窗口">
                <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!--显示顺序-->
          <el-col :span="12">
            <el-form-item label="顺序" prop="sequence">
              <el-input-number v-model="form.sequence" placeholder="请输入显示顺序" clearable class="navigation-input" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片上传:" prop="img">
              <el-upload
                :headers="headers"
                class="avatar-uploader"
                action="/admin/sys-file/uploadAfter/2"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="form.pic" :src="form.pic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div slot="tip" class="navigation-upload__tip">图片大小不能超过2MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
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
import { delObj, fetchList, dictType } from '@/api/news/navigation/navigation'
import { mapGetters } from 'vuex'
import { getToken, getQiNiuYunDomain } from '@/api/qiniu'

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
      headers: {
        'Authorization': 'Bearer ' + getToken
      },
      tableLoading: false,
      navigationTypeList: [],
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
          label: '导航名称',
          prop: 'name',
          overHidden: true,
          width: '120'
        },
        {
          label: '链接地址',
          prop: 'url',
          hide: true
        },
        {
          label: '类型',
          prop: 'code',
          overHidden: true
        },
        {
          label: '图片',
          prop: 'pic',
          hide: true
        },
        {
          label: '是否启用',
          prop: 'openFlag',
          overHidden: true
        },
        {
          label: '是否打开新窗口',
          prop: 'newwinFlag',
          width: '180'
        },
        {
          label: '显示顺序',
          prop: 'sequence',
          width: '100'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          width: 180,
          label: '修改时间',
          prop: 'updateTime'
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
      dataObj: { token: '', key: '' },
      imageUrl: '' // 图片地址
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.dictTypeList()
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
    dictTypeList() {
      dictType()
        .then(response => {
          this.navigationTypeList = response.data.data
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
    },
    /**
     * 文件上传方法
     * @param file
     * @returns {boolean|boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 文件上传成功后方法
     * @param res
     * @param file
     */
    handleSuccess(res, file) {
      console.log('res', res)
      // this.$qiniuAddr + res.key
    },
    handleRemove() {
    }
  }
}
</script>
<style>
  .navigation-input {
    width: 250px;
  }

  .navigation-upload__tip {
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
    border-color: #409EFF;
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
