<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-07 17:40:56
 * @Description: 课程管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!--头部搜索-->
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--课程标题-->
      <el-form-item label="课程标题:" label-width="80px">
        <el-input v-model="searchForm.title" type="text" size="small" placeholder="请输入课程标题" />
      </el-form-item>
      <!--是否推荐-->
      <el-form-item label="是否推荐:" label-width="80px">
        <el-select v-model="searchForm.recommend" clearable>
          <el-option
            v-for="item in DIC.typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--开售标志-->
      <el-form-item label="开售标志:" label-width="130px">
        <el-select v-model="searchForm.buyFlag" clearable>
          <el-option
            v-for="item in DIC.typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--课程类型-->
      <el-form-item label="课程类型:" label-width="80px">
        <el-select v-model="searchForm.type" clearable>
          <el-option
            v-for="item in DIC.courseTypeList"
            :key="item.value"
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
      <template slot="menu" slot-scope="scope">
        <el-button type="text" icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
        <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button
          type="text"
          icon="el-icon-edit"
          size="mini"
          @click="handleChapterList(scope.row,scope.index)"
        >章节列表</el-button>
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
        <el-form ref="dataForm" :model="form" :rules="rules" :label-width="labelWidth">
          <!--课程标题-->
          <el-col :span="12">
            <el-form-item label="课程标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入课程标题" clearable class="course-input" />
            </el-form-item>
          </el-col>
          <!--副标题-->
          <el-col :span="12">
            <el-form-item label="副标题" prop="brife">
              <el-input v-model="form.brife" placeholder="请输入副标题" clearable class="course-input" />
            </el-form-item>
          </el-col>
          <!--课程类型-->
          <el-col :span="12">
            <el-form-item label="课程类型" prop="type">
              <el-select v-model="form.type" clearable class="course-input" placeholder="请选择课程类型">
                <el-option
                  v-for="item in DIC.courseTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课程分类-->
          <!-- TODO: 注释树形组件多选 multiline -->
          <el-col :span="12">
            <el-form-item label="课程分类" prop="categoryIds">
              <Input-tree
                v-model="form.categoryIds"
                :tree-data="treeData"
                :operation-status="operationStatus"
                multiline
                title="课程分类"
                placeholder="请选择课程分类"
              />
            </el-form-item>
          </el-col>
          <!--课程讲师-->
          <el-col :span="12">
            <el-form-item label="课程讲师" prop="teacherId">
              <el-select
                v-model="form.teacherId"
                clearable
                class="course-input"
                placeholder="请选择课程讲师"
              >
                <el-option
                  v-for="item in tearcherList"
                  :key="item.username"
                  :label="item.username"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课程价格-->
          <el-col :span="12">
            <el-form-item label="课程价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入课程价格" clearable class="course-input" />
            </el-form-item>
          </el-col>
          <!--课程状态-->
          <el-col :span="12">
            <el-form-item label="课程状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="item in DIC.courseStatus"
                  :key="item.value"
                  :label="item.value"
                  border
                  size="medium"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--连载状态-->
          <el-col :span="12">
            <el-form-item label="连载状态" prop="serialStatus">
              <el-select
                v-model="form.serialStatus"
                clearable
                class="course-input"
                placeholder="请选择连载状态"
              >
                <el-option
                  v-for="item in DIC.serialStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--是否推荐-->
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="recommend">
              <el-radio-group v-model="form.recommend">
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
          <!--开售标志-->
          <el-col :span="12">
            <el-form-item label="开售标志" prop="buyFlag">
              <el-radio-group v-model="form.buyFlag">
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
          <!--视频拖动-->
          <el-col :span="12">
            <el-form-item label="视频拖动" prop="drag">
              <el-radio-group v-model="form.drag">
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
          <!--倍速播放-->
          <el-col :span="12">
            <el-form-item label="倍速播放" prop="doubleSpeed">
              <el-radio-group v-model="form.doubleSpeed">
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
          <!--有效天数-->
          <el-col :span="12">
            <el-form-item label="有效天数" prop="effectiveDays">
              <el-input
                v-model="form.effectiveDays"
                placeholder="请输入有效天数"
                clearable
                class="course-input"
                type="number"
                min="0"
              />
            </el-form-item>
          </el-col>
          <!--课程排序-->
          <el-col :span="12">
            <el-form-item label="课程排序" prop="sort">
              <el-input v-model="form.sort" placeholder="请输入课程排序" clearable class="course-input" />
            </el-form-item>
          </el-col>
          <!--填写人数-->
          <el-col :span="12">
            <el-form-item label="填写人数" prop="learnNum">
              <el-input
                v-model="form.learnNum"
                placeholder="请输入填写人数"
                clearable
                class="course-input"
                type="number"
                min="0"
              />
            </el-form-item>
          </el-col>

          <!--课程简叙-->
          <el-col :span="24">
            <el-form-item label="课程简叙" prop="subtitle">
              <el-input
                v-model="form.subtitle"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入课程简叙"
                clearable
                class="course-input"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <!--课程简介-->
          <el-col :span="24">
            <el-form-item label="课程简介" prop="about">
              <el-input
                v-model="form.about"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入课程简介"
                clearable
                class="course-input"
                type="textarea"
              />
            </el-form-item>
          </el-col>

          <!--图片上传-->
          <el-col :span="24">
            <el-form-item prop="smallPicture" label="图片上传:" :label-width="formLabelWidth">
              <single-image v-model="form.smallPicture" :type="5" />
            </el-form-item>
          </el-col>
          <!-- 附件上传 -->
          <!-- <el-col :span="24">
            <el-form-item label="附件上传">
              <single-file v-model="fileUrl" />
            </el-form-item>
          </el-col> -->
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
import { fetchList, addObj, putObj, delObj } from '@/api/course/course'
import { getTeacherList } from '@/api/user'
import { getCategoryTreeByNotType } from '@/api/course/category'
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
      courseTypeList: [
        {
          label: '普通课程',
          value: 1
        },
        {
          label: '直播课程',
          value: 2
        },
        {
          label: '录播公开课',
          value: 3
        },
        {
          label: '直播公开课',
          value: 4
        }
      ],
      courseStatus: [
        {
          label: '未发布',
          value: 0
        },
        {
          label: '发布',
          value: 1
        }
      ],
      serialStatusList: [
        {
          label: '非连载课程',
          value: 1
        },
        {
          label: '更新中',
          value: 2
        },
        {
          label: '已完结',
          value: 3
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
      tearcherList: [],
      treeData: [],
      tableOption: [
        {
          label: '课程标题',
          prop: 'title',
          width: '160'
        },
        {
          label: '课程类型',
          prop: 'type',
          width: '80'
        },
        {
          label: '课程分类',
          prop: 'categoryName',
          width: '100'
        },
        {
          label: '课程状态',
          prop: 'status',
          width: '80',
          dicData: DIC.courseStatus
        },
        {
          label: '连载状态',
          prop: 'serialStatus',
          width: '120',
          dicData: DIC.serialStatusList
        },
        {
          label: '是否推荐',
          prop: 'recommend',
          width: '80',
          dicData: DIC.typeList
        },
        {
          label: '开售标志',
          prop: 'buyFlag',
          width: '80',
          dicData: DIC.typeList
        },
        {
          label: '价格',
          prop: 'price',
          width: '80'
        },
        {
          label: '删除标记',
          prop: 'delFlag',
          width: '80',
          dicData: DIC.typeList
        },
        {
          label: '有效天数',
          prop: 'effectiveDays',
          width: '80'
        },
        {
          label: '排序',
          prop: 'sort',
          width: '60'
        },
        {
          label: '教师',
          prop: 'teacherName',
          width: '80'
        },
        {
          label: '视频拖动',
          prop: 'drag',
          width: '80',
          dicData: DIC.typeList
        },
        {
          label: '倍速播放',
          prop: 'doubleSpeed',
          width: '80',
          dicData: DIC.typeList
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '160'
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
      labelWidth: '90px',
      form: {}, // 新增 编辑 数据源
      formLabelWidth: '90px',
      rules: {
        // 表单校验
        title: [
          { required: true, message: '导航名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请选择类型', trigger: 'change' }],
        openFlag: [
          { required: true, message: '请选择是否启用', trigger: 'change' }
        ],
        newwinFlag: [
          { required: true, message: '请选择是否打开新窗口', trigger: 'change' }
        ],
        smallPicture: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  // watch: {
  //   // 联动需要监听主数据
  //   'form.type': function(val) {
  //     if (!val) {
  //       this.form.categoryIds = ''
  //       this.treeData = []
  //     } else {
  //       this.getCategoryTree(val)
  //     }
  //   }
  // },
  created() {
    this.getList()
    this.getTeacherList()
    this.getCategoryTree(1)
  },
  methods: {
    groupTypeChange(type) {
      this.form.categoryIds = ''
      this.getCategoryTree(type)
    },
    getCategoryTree(type) {
      getCategoryTreeByNotType(type).then(res => {
        this.treeData = res.data.data
      })
    },
    getTeacherList() {
      getTeacherList().then(res => {
        this.tearcherList = res.data.data
      })
    },
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
          console.log('form', this.form)
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
              .catch(() => {})
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
              .catch(() => {})
          }
          this.dialogPvVisible = false
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
    handleChapterList(row, index) {
      this.$router.push({
        path: '/course/coursechapter',
        query: {
          courseId: row.id
        }
      })
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
      this.operationStatus = 0
      this.form = {}
    },
    getNodeData() {}
  }
}
</script>
<style lang="scss" scoped>
.course-input {
  width: 100%;
}
</style>
