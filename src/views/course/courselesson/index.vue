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
    <el-form ref="search" :inline="true" class="search" size="medium">
      <!--课时标题-->
      <el-form-item label="课时标题:" label-width="80px">
        <el-input v-model="searchForm.title" type="text" size="small" placeholder="请输入课时标题" />
      </el-form-item>
      <!--是否免费-->
      <el-form-item label="是否免费:" label-width="80px">
        <el-select v-model="searchForm.free" clearable>
          <el-option
            v-for="item in DIC.typeList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--课时状态-->
      <el-form-item label="课时状态:" label-width="130px">
        <el-select v-model="searchForm.status" clearable>
          <el-option
            v-for="item in DIC.lessonStatus"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!--课时类型-->
      <el-form-item label="课时类型:" label-width="80px">
        <el-select v-model="searchForm.type" clearable>
          <el-option
            v-for="item in DIC.fileType"
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
        <el-form ref="dataForm" :model="form" :rules="rules">
          <!--课时标题-->
          <el-col :span="12">
            <el-form-item label="课时标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入课时标题" clearable class="lesson-input" />
            </el-form-item>
          </el-col>
          <!--是否免费-->
          <el-col :span="12">
            <el-form-item label="是否免费" prop="free">
              <el-select v-model="form.free" clearable class="lesson-input" placeholder="请选择是否免费">
                <el-option
                  v-for="item in DIC.typeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课时状态-->
          <el-col :span="12">
            <el-form-item label="课时状态" prop="status">
              <el-select v-model="form.status" clearable class="lesson-input" placeholder="请选择课时状态">
                <el-option
                  v-for="item in DIC.lessonStatus"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课时类型-->
          <el-col :span="12">
            <el-form-item label="课时类型" prop="type">
              <el-select v-model="form.type" clearable class="lesson-input" placeholder="请选择课时类型">
                <el-option
                  v-for="item in DIC.fileType"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--课时资源-->
          <el-col :span="12">
            <el-form-item label="课时资源" prop="mediaUri">
              <el-input
                v-model="form.mediaUri"
                placeholder="请输入课时资源"
                clearable
                class="lesson-input"
              />
            </el-form-item>
          </el-col>
          <!--课时简介-->
          <el-col :span="12">
            <el-form-item label="课时简介" prop="content">
              <el-input
                v-model="form.content"
                placeholder="请输入课时简介"
                clearable
                class="lesson-input"
              />
            </el-form-item>
          </el-col>
          <!--课时封面-->
          <el-col :span="12">
            <el-form-item label="课时封面:" prop="cover">
              <el-upload
                :headers="headers"
                class="avatar-uploader"
                action="/admin/sys-file/uploadAfter/2"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="form.cover" :src="form.cover" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
                <div slot="tip" class="lesson-upload__tip">图片大小不能超过2MB</div>
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
  delObj
} from "@/api/course/courselesson";
import { mapGetters } from "vuex";
import { getToken, getQiNiuYunDomain } from "@/api/qiniu";

export default {
  filters: {
    statusFilter(type, list) {
      let result;
      list.map(ele => {
        if (type === ele.value) {
          result = ele.label;
        }
      });
      return result;
    },
    dialogTitle(type) {
      const titleMap = {
        0: "新 增",
        1: "查 看",
        2: "编 辑",
        3: "删 除"
      };
      return titleMap[type];
    }
  },
  data() {
    const DIC = {
      typeList: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      lessonStatus: [
        {
          label: "未发布",
          value: 0
        },
        {
          label: "发布",
          value: 1
        }
      ],
      fileType: [
        {
          label: "视频",
          value: 1
        },
        {
          label: "音频",
          value: 2
        },
        {
          label: "文档",
          value: 3
        }
      ]
    };
    return {
      DIC: DIC,
      tableKey: 0,
      headers: {
        Authorization: "Bearer " + getToken
      },
      tableLoading: false,
      lessonTypeList: [],
      tableOption: [
        {
          type: "input",
          label: "标题",
          prop: "title"
        },
        {
          label: "课程",
          prop: "courseId"
        },
        {
          label: "章节",
          prop: "chapterId"
        },
        {
          label: "排序",
          prop: "sort"
        },
        {
          label: "是否免费",
          prop: "free",
          dicData: DIC.typeList
        },
        {
          label: "状态",
          prop: "status",
          dicData: DIC.lessonStatus
        },
        {
          label: "类型",
          prop: "type",
          dicData: DIC.fileType
        },
        {
          label: "时长(秒)",
          prop: "length"
        },
        {
          label: "删除标记",
          prop: "delFlag"
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "160"
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
        title: [
          { required: true, message: "课时名称不能为空", trigger: "blur" }
        ],
        mediaUri: [
          { required: true, message: "课时资源不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择课时类型", trigger: "change" }
        ],
        free: [
          { required: true, message: "请选择课时是否免费", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择课时发布", trigger: "change" }
        ],
        cover: [
          { required: true, message: "请上传课时封面", trigger: "change" }
        ]
      },
      dataObj: { token: "", key: "" },
      imageUrl: "" // 图片地址
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      let params = {
        chapterId: this.$route.query.chapterId
      };
      fetchList(
        Object.assign(
          {
            descs: "create_time",
            current: this.page.current,
            size: this.page.size
          },
          this.searchForm
        )
      )
        .then(res => {
          this.tableData = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    /**
     * 创建方法
     * @param form
     * @returns
     */
    create(form) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.getList();
          if (this.form.id != null) {
            putObj(this.form)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success",
                  duration: 2000
                });
              })
              .catch(() => {
                loading();
              });
          } else {
            addObj(this.form)
              .then(() => {
                this.$notify({
                  title: "成功",
                  message: "创建成功",
                  type: "success",
                  duration: 2000
                });
              })
              .catch(() => {
                loading();
              });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 重置
     * @param form
     * @returns
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleFilter() {
      this.getList();
    },
    handleEmpty() {
      this.searchForm = {};
      this.getList();
    },
    handleView(row) {
      this.form = row;
      this.dialogPvVisible = true;
      this.operationStatus = 1;
    },
    handleUpdate(row) {
      this.form = row;
      this.dialogPvVisible = true;
      this.operationStatus = 2;
    },
    handleDelete(row, index) {
      var _this = this;
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delObj(row.id);
        })
        .then(data => {
          _this.$message.success("删除成功");
          this.getList();
        });
    },
    handleClose(form) {
      this.dialogPvVisible = false;
      this.form = {};
      this.$refs[form].resetFields();
    },
    handleCreate() {
      this.dialogPvVisible = true;
      this.form = {
        free: 0,
        status: 0,
        type: 1
      };
    },
    /**
     * 文件上传方法
     * @param file
     * @returns {boolean|boolean}
     */
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    /**
     * 文件上传成功后方法
     * @param res
     * @param file
     */
    handleSuccess(res, file) {
      console.log("res", res);
      // this.$qiniuAddr + res.key
    },
    handleRemove() {}
  }
};
</script>
<style>
.lesson-input {
  width: 250px;
}

.lesson-upload__tip {
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
