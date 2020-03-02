<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-02 14:14:32
 * @Description: 题目表管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- 头部菜单 -->
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
            :key="item.label"
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
            :key="item.label"
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
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课程分类-->
          <el-col :span="12">
            <el-form-item label="课程分类" prop="categoryIds">
              <Input-tree
                v-model="form.categoryIds"
                :tree-data="treeData"
                :operation-status="operationStatus"
                placeholder="请选择课程分类"
                @node-click="getNodeData"
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
                  :label="item.label"
                  :value="item.value"
                  border
                  size="medium"
                />
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
                  :label="item.label"
                  :value="item.value"
                  border
                  size="medium"
                />
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
                  :label="item.label"
                  :value="item.value"
                  border
                  size="medium"
                />
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
                  :label="item.label"
                  :value="item.value"
                  border
                  size="medium"
                />
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
                  :label="item.label"
                  :value="item.value"
                  border
                  size="medium"
                />
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
            <el-form-item label="图片上传:" prop="smallPicture">
              <el-upload
                :headers="headers"
                class="avatar-uploader"
                action="/admin/sys-file/uploadAfter/2"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="form.smallPicture" :src="form.smallPicture" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div slot="tip" class="course-upload__tip">图片大小不能超过2MB</div>
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
  getObj,
  addObj,
  putObj,
  delObj,
  getCategoryTree
} from '@/api/course/course'
import { getTeacherList } from '@/api/user'
import { getAllCategoryType } from '@/api/course/category'
import { mapGetters } from 'vuex'
import { getToken, getQiNiuYunDomain } from '@/api/qiniu'
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
          width: '160'
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
          width: '100',
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
        img: [{ required: true, message: '请上传图片', trigger: 'change' }]
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
    this.getTeacherList()
    this.getCategoryTree()
  },
  methods: {
    getCategoryTree() {
      getAllCategoryType(1).then(res => {
        this.treeData = res.data.data
        console.log('treeData', res.data.data)
        // this.form.parentId = res.data.id;
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
    handleChapterList(row, index) {
      this.$router.push({
        path: '/course/coursechapter/index',
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
      this.form = {
        type: 1,
        status: 0,
        serialStatus: 1,
        recommend: 0,
        buyFlag: 0,
        doubleSpeed: 0,
        drag: 0
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
      console.log('res', res)
      // this.$qiniuAddr + res.key
    },
    handleRemove() {},
    getNodeData() {}
  }
}
</script>
<style>
.course-input {
  width: 100%;
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
