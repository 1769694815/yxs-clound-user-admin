<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: zhoum
 * @Author: xw
 * @LastEditTime: 2020-03-03 14:30:23
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--分类名称-->
      <el-form-item label="分类名称:" label-width="80px">
        <el-input v-model="searchForm.name" type="text" size="small" placeholder="请输入分类名称" />
      </el-form-item>
      <!--是否最热-->
      <el-form-item label="是否最热:" label-width="80px">
        <el-select v-model="searchForm.hotFlag" clearable>
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
      <!--分类类型-->
      <el-form-item label="分类类型:" label-width="80px">
        <el-select v-model="searchForm.groupType" clearable>
          <el-option
            v-for="item in DIC.classificationTypeList"
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
        <el-form ref="dataForm" :model="form" :rules="rules" label-width="90px">
          <!--分类编码-->
          <el-col :span="12">
            <el-form-item label="分类编码" prop="name">
              <el-input v-model="form.name" placeholder="请输入分类名称" clearable class="category-input" />
            </el-form-item>
          </el-col>
          <!--分类编码-->
          <el-col :span="12">
            <el-form-item label="分类编码" prop="name">
              <el-input v-model="form.code" placeholder="请输入分类编码" clearable class="category-input" />
            </el-form-item>
          </el-col>
          <!--分类类型-->
          <el-col :span="12">
            <el-form-item label="分类类型" prop="groupType">
              <el-select
                v-model="form.groupType"
                clearable
                class="category-input"
                placeholder="请选择分类类型"
              >
                <el-option
                  v-for="item in DIC.classificationTypeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--父类类型-->
          <el-col :span="12">
            <el-form-item label="父类类型" prop="parentId">
              <Input-tree
                v-model="form.deptId"
                :tree-data="treeData"
                :operation-status="operationStatus"
                placeholder="请选择父类类型"
                @node-click="getNodeData"
              />
            </el-form-item>
          </el-col>
          <!--是否最热-->
          <el-col :span="12">
            <el-form-item label="是否最热" prop="hotFlag">
              <el-radio-group v-model="form.hotFlag">
                <el-radio
                  v-for="item in DIC.typeList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--是否置顶-->
          <el-col :span="12">
            <el-form-item label="是否置顶" prop="topFlag">
              <el-radio-group v-model="form.topFlag">
                <el-radio
                  v-for="item in DIC.typeList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--是否展示-->
          <el-col :span="12">
            <el-form-item label="是否展示" prop="showFlag">
              <el-radio-group v-model="form.showFlag">
                <el-radio
                  v-for="item in DIC.typeList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--字体颜色-->
          <el-col :span="12">
            <el-form-item label="字体颜色" prop="recommendedFlag">
              <el-color-picker v-model="form.fontColor" />
            </el-form-item>
          </el-col>
          <!--是否栏目推荐-->
          <el-col :span="12">
            <el-form-item label="是否栏目推荐" prop="columnFlag" label-width="120px">
              <el-radio-group v-model="form.columnFlag">
                <el-radio
                  v-for="item in DIC.typeList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--是否首页分类推荐-->
          <el-col :span="12">
            <el-form-item label="是否首页分类推荐" prop="recommendedFlag" label-width="140px">
              <el-radio-group v-model="form.recommendedFlag">
                <el-radio
                  v-for="item in DIC.typeList"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--显示顺序-->
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sort">
              <el-input-number
                v-model="form.sequence"
                placeholder="请输入显示顺序"
                clearable
                class="category-input"
              />
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
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div slot="tip" class="category-upload__tip">图片大小不能超过2MB</div>
              </el-upload>
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
  delObj,
  getAllCategoryType
} from '@/api/course/category'
import { mapGetters } from 'vuex'
import { getToken } from '@/api/qiniu'
import InputTree from '@/components/InputTree/index'

export default {
  components: {
    InputTree
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
      classificationTypeList: [
        {
          value: 1,
          label: '班级'
        },
        {
          value: 2,
          label: '课程'
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
      tableOption: [
        {
          label: '编号',
          prop: 'id',
          hide: true
        },
        {
          label: '分类名称',
          prop: 'name',
          overHidden: true,
          width: '120'
        },
        {
          label: '分类编码',
          overHidden: true,
          prop: 'code',
          width: '100'
        },
        {
          label: '是否最热',
          prop: 'hotFlag',
          overHidden: true,
          width: '100',
          dicData: DIC.typeList
        },
        {
          label: '是否置顶',
          prop: 'topFlag',
          overHidden: true,
          width: '100',
          dicData: DIC.typeList
        },
        {
          label: '是否推荐首页',
          prop: 'recommendedFlag',
          overHidden: true,
          width: '120',
          dicData: DIC.typeList
        },
        {
          label: '是否栏目推荐',
          prop: 'columnFlag',
          overHidden: true,
          width: '120',
          dicData: DIC.typeList
        },
        {
          label: '删除标记',
          prop: 'delFlag',
          overHidden: true,
          width: '100',
          dicData: DIC.typeList
        },
        {
          label: '是否展示',
          prop: 'showFlag',
          width: '100',
          dicData: DIC.typeList
        },
        {
          label: '分类类型',
          prop: 'groupType',
          dicData: DIC.classificationTypeList
        },
        {
          label: '排序',
          prop: 'sort',
          width: '60'
        },
        {
          label: '字体颜色',
          prop: 'fontColor'
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
      form: {
        topFlag: 0
      }, // 新增 编辑 数据源
      rules: {
        // 表单校验
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '分类编码不能为空', trigger: 'blur' }
        ],
        hotFlag: [
          { required: true, message: '请选择是否最热', trigger: 'change' }
        ],
        topFlag: [
          { required: true, message: '请选择是否置顶', trigger: 'change' }
        ],
        columnFlag: [
          { required: true, message: '请选择是否推荐栏目', trigger: 'change' }
        ],
        recommendedFlag: [
          { required: true, message: '请选择是否首页推荐', trigger: 'change' }
        ],
        showFlag: [
          { required: true, message: '请选择是否展示', trigger: 'change' }
        ],
        groupType: [
          { required: true, message: '请选择分类类型', trigger: 'change' }
        ],
        img: [{ required: true, message: '请上传图标', trigger: 'change' }]
      },
      dataObj: { token: '', key: '' },
      imageUrl: '', // 图片地址
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
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
    getAllCategoryType(type) {
      getAllCategoryType(type).then(res => {
        this.treeData = res.data.data
        console.log('treeData', res.data.data)
        // this.form.parentId = res.data.id;
      })
    },
    getList() {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            descs: 'id',
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
      this.form = {
        groupType: 1,
        hotFlag: 0,
        recommendedFlag: 0,
        columnFlag: 0,
        topFlag: 0,
        showFlag: 0,
        fontColor: '#000000'
      }
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
      this.form.img = res.fileKey
      this.imageUrl = res.url
    },
    handleRemove() {},
    getNodeData() {}
  }
}
</script>
<style>
.category-input {
  width: 100%;
}

.category-upload__tip {
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
