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
    <el-form
      ref="search"
      :inline="true"
      class="search"
      size="medium"
    >

      <el-form-item
        label="文件名:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.fileName"
          type="text"
          size="small"
          placeholder="请输入文件名"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleFilter"
        >搜 索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="default"
          icon="el-icon-delete"
          size="small"
          @click="handleEmpty"
        >清 空</el-button>
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
        <el-button
          type="text"
          size="mini"
          icon="el-icon-download"
          @click="download(scope.row)"
        >下载
        </el-button>
      </template>
    </Xtable>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogPvVisible"
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
        >
          <el-col
            v-if="operationStatus === 0"
            :span="12"
          >
            <el-form-item label="附近上传:">
              <el-upload
                v-show="!imageUrl"
                ref="upload"
                :data="dataObj"
                :action="upload_qiniu_url"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                class="upload-demo"
              >
                <el-button
                  type="primary"
                  size="small"
                >点击上传</el-button>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >上传同步至文件服务器</div>
              </el-upload>
              <div
                v-show="imageUrl.length>0"
                class="image-preview"
              >
                <div
                  v-show="imageUrl.length>1"
                  class="image-preview-wrapper"
                >
                  <img :src="imageUrl">
                  <div class="image-preview-action">
                    <i
                      class="el-icon-delete"
                      @click="handleRemove"
                    />
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          size="small"
          @click="dialogPvVisible = false"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/sys-file'
import { handleDown, randomLenNum } from '@/utils/index'
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
    return {
      tableKey: 0,
      tableLoading: false,
      tableOption: [
        {
          label: '编号',
          prop: 'id',
          hide: true
        },
        {
          label: '附件上传',
          prop: 'imgUrl',
          hide: true
        },
        {
          label: '空间',
          prop: 'bucketName',
          overHidden: true,
          width: '120'
        },
        {
          label: '文件名',
          prop: 'fileName',
          overHidden: true
        },
        {
          label: '原文件名',
          prop: 'original',
          overHidden: true
        },
        {
          label: '文件类型',
          prop: 'type',
          width: '80'
        },
        {
          label: '文件大小',
          prop: 'fileSize',
          width: '100'
        },
        {
          label: '上传人',
          prop: 'createUser'
        },
        {
          width: 180,
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
      form: {},
      upload_qiniu_url: this.$upload_qiniu_url,
      dataObj: { token: '', key: '' },
      imageUrl: ''
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
    download(row) {
      handleDown(row.fileName, row.bucketName)
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken()
          .then(response => {
            const key = randomLenNum(32)
            const token = response.data
            _self._data.dataObj.token = token
            _self._data.dataObj.key = 'upload2/' + key + '.jpg'
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
      })
    },
    handleSuccess(res, file) {
      console.log('res', res)
      const imgUrl = this.$qiniuAddr + res.key
    },
    handleRemove() {}
  }
}
</script>
