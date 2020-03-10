<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-10 14:58:13
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
              <el-input
                v-model="form.name"
                :disabled="operationStatus === 1"
                placeholder="请输入分类名称"
                clearable
                class="category-input"
              />
            </el-form-item>
          </el-col>
          <!--分类编码-->
          <el-col :span="12">
            <el-form-item label="分类编码" prop="name">
              <el-input
                v-model="form.code"
                :disabled="operationStatus === 1"
                placeholder="请输入分类编码"
                clearable
                class="category-input"
              />
            </el-form-item>
          </el-col>
          <!--分类类型-->
          <el-col :span="12">
            <el-form-item label="分类类型" :disabled="operationStatus === 1" prop="groupType">
              <el-select
                v-model="form.groupType"
                :disabled="operationStatus === 1"
                clearable
                class="category-input"
                placeholder="请选择分类类型"
                @change="groupTypeChange"
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
                v-model="form.parentId"
                :tree-data="treeData"
                :operation-status="operationStatus"
                placeholder="请选择父类类型"
              />
            </el-form-item>
          </el-col>
          <!--是否最热-->
          <el-col :span="12">
            <el-form-item label="是否最热" prop="hotFlag">
              <el-radio-group v-model="form.hotFlag" :disabled="operationStatus === 1">
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
              <el-radio-group v-model="form.topFlag" :disabled="operationStatus === 1">
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
          <!--是否网课-->
          <el-col :span="12">
            <el-form-item label="是否网课" prop="onlineCourseFlag">
              <el-radio-group v-model="form.onlineCourseFlag" :disabled="operationStatus === 1">
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
          <!--是否面授-->
          <el-col :span="12">
            <el-form-item label="是否面授" prop="faceToFaceFlag">
              <el-radio-group v-model="form.faceToFaceFlag" :disabled="operationStatus === 1">
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
              <el-radio-group v-model="form.showFlag" :disabled="operationStatus === 1">
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
            <el-form-item label="字体颜色" prop="fontColor">
              <!-- <el-color-picker v-model="form.fontColor" :disabled="operationStatus === 1" /> -->
              <!-- 颜色格式： hsl / hsv / hex / rgb -->
              <color-picker v-model="form.fontColor" color-format="rgb" :disabled="operationStatus === 1" />
            </el-form-item>
          </el-col>
          <!--APP顶部导航-->
          <el-col :span="12">
            <el-form-item label="APP顶部导航" prop="columnFlag" label-width="120px">
              <el-radio-group v-model="form.columnFlag" :disabled="operationStatus === 1">
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
          <!--APP首页分栏-->
          <el-col :span="12">
            <el-form-item label="APP首页分栏" prop="recommendedFlag" label-width="140px">
              <el-radio-group v-model="form.recommendedFlag" :disabled="operationStatus === 1">
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
          <!--跳转类型-->
          <el-col :span="12">
            <el-form-item v-if="!form.parentId" label="跳转类型" :disabled="operationStatus === 1" prop="jumpType">
              <el-select
                v-model="form.jumpType"
                :disabled="operationStatus === 1"
                clearable
                class="category-input"
                placeholder="请选择跳转类型"
              >
                <el-option
                  v-for="item in jumpTypeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-else label="跳转类型" :disabled="operationStatus === 1">
              <el-select
                v-model="form.jumpType"
                :disabled="operationStatus === 1"
                clearable
                class="category-input"
                placeholder="请选择跳转类型"
              >
                <el-option
                  v-for="item in jumpTypeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--显示顺序-->
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="sort">
              <el-input-number
                v-model="form.sequence"
                :disabled="operationStatus === 1"
                placeholder="请输入显示顺序"
                clearable
                class="category-input"
              />
            </el-form-item>
          </el-col>
          <!--图片上传-->
          <el-col :span="24">
            <el-form-item prop="icon" label="图片上传:" :label-width="formLabelWidth">
              <single-image v-model="form.icon" :type="8" :disabled="operationStatus === 1" />
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
  getCategoryTreeByNotType
} from '@/api/course/category'
import { remote } from '@/api/admin/dict'
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
          label: '课程'
        },
        {
          value: 2,
          label: '班级'
        }
      ]
    }
    return {
      DIC: DIC,
      tableKey: 0,
      jumpTypeList: [],
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
          label: '父类名称',
          prop: 'parentName',
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
          label: 'APP首页分栏',
          prop: 'recommendedFlag',
          overHidden: true,
          width: '120',
          dicData: DIC.typeList
        },
        {
          label: 'APP顶部导航',
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
          width: '120',
          dicData: DIC.classificationTypeList
        },
        {
          label: '排序',
          prop: 'sort',
          width: '60'
        },
        {
          label: '字体颜色',
          prop: 'fontColor',
          width: '100'
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
      formLabelWidth: '90px',
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
        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ]
        // icon: [{ required: true, message: '请上传图标', trigger: 'change' }]
      },
      imageUrl: '', // 图片地址
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    // 联动需要监听主数据
    'form.groupType': function(val) {
      if (!val) {
        this.form.parentId = ''
        this.treeData = []
      } else {
        this.getCategoryTreeByNotType(val)
      }
    }
  },
  created() {
    this.getList()
    this.getJumpTypeList()
    this.dialogPvVisible = false
  },
  methods: {
    getJumpTypeList() {
      remote('jump_type').then(res => {
        this.jumpTypeList = res.data.data
      })
    },
    groupTypeChange(type) {
      this.form.parentId = ''
      this.getCategoryTreeByNotType(type)
    },
    getCategoryTreeByNotType(type) {
      getCategoryTreeByNotType(type).then(res => {
        this.treeData = res.data.data
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
          this.dialogPvVisible = false
          this.getList()
          if (this.form.id != null) {
            putObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addObj(this.form).then(() => {
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
      console.log('form', this.form)
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
<style lang="scss" scoped>
.category-input {
  width: 100%;
}
</style>
