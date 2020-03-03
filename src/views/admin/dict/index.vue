<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: xw
 * @LastEditTime: 2020-03-03 14:27:24
 * @Description: 字典管理
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
        label="类型:"
        label-width="80px"
      >
        <el-input
          v-model="searchForm.type"
          type="text"
          size="small"
          placeholder="请输入类型"
        />
      </el-form-item>
      <el-form-item
        label="字典类型:"
        label-width="80px"
      >
        <single-change
          v-model="searchForm.system"
          :operation-status="operationStatus"
          status-type="dict_type"
          type="select"
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
          @click="handleUpdate(scope.row)"
        >编辑
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
          @click="handleDictItem(scope.row, scope.index)"
        >字典项
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
          :rules="formRules"
          :model="form"
        >
          <el-col
            :span="12"
          >
            <el-form-item
              prop="type"
              label="类型:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.type"
                autocomplete="off"
                placeholder="请输入类型"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="description"
              label="描述:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.description"
                autocomplete="off"
                placeholder="请输入描述"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="system"
              label="字典类型:"
              :label-width="formLabelWidth"
            >
              <single-change
                v-model="form.system"
                :disabled="operationStatus === 1"
                status-type="dict_type"
                type="select"
                size="medium"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="remarks"
              label="备注信息:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="form.remarks"
                autocomplete="off"
                placeholder="请输入备注"
                :disabled="operationStatus === 1"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          v-if="operationStatus === 0"
          type="primary"
          size="small"
          @click="create"
        >保 存</el-button>
        <el-button
          v-if="operationStatus === 2"
          type="primary"
          size="small"
          @click="update"
        >修 改</el-button>
        <el-button
          size="small"
          @click="dialogPvVisible = false"
        >取 消</el-button>
      </div>
    </el-dialog>
    <!--字典项列表弹窗-->
    <el-dialog
      :visible.sync="dialogDictItem"
      title="字典项管理"
    >
      <Xtable
        :table-key="dictItem.tableKey"
        :table-loading="dictItem.tableLoading"
        :table-data="dictItem.tableData"
        :page="dictItem.page"
        :table-option.sync="dictItem.tableOption"
        @handle-create="dictItemHandleCreate"
        @refresh-change="dictItemHandleFilter"
        @page-change="dictItemGetList"
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
            @click="dictItemHandleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="dictItemHandleDelete(scope.row, scope.index)"
          >删除
          </el-button>
        </template>
      </Xtable>
    </el-dialog>
    <!-- 字典项表单弹窗 -->
    <el-dialog
      :visible.sync="dictItem.dialogPvVisible"
      :title="dictItem.operationStatus | dialogTitle"
    >
      <el-row
        style="padding: 0 20px;"
        :span="24"
        :gutter="20"
      >
        <el-form
          ref="dictItemDataForm"
          :rules="dictItem.formRules"
          :model="dictItem.form"
        >
          <el-col
            :span="12"
          >
            <el-form-item
              prop="type"
              label="类型:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.type"
                autocomplete="off"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="value"
              label="数据值:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.value"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="label"
              label="标签名:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.label"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="description"
              label="描述:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.description"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="sort"
              label="排序:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.sort"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
          >
            <el-form-item
              prop="remarks"
              label="备注信息:"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="dictItem.form.remarks"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div
        slot="footer"
        class="doalog-footer"
      >
        <el-button
          v-if="dictItem.operationStatus === 0"
          type="primary"
          size="small"
          @click="dictItemCreate"
        >保 存</el-button>
        <el-button
          v-if="dictItem.operationStatus === 2"
          type="primary"
          size="small"
          @click="dictItemUpdate"
        >修 改</el-button>
        <el-button
          size="small"
          @click="dictItem.dialogPvVisible = false"
        >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addItemObj, addObj, delItemObj, delObj, fetchItemList, fetchList, putItemObj, putObj } from '@/api/admin/dict'
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
      tableOption: [{
        label: '类型',
        prop: 'type'
      }, {
        label: '描述',
        prop: 'description'
      }, {
        label: '字典类型',
        prop: 'system',
        type: 'select',
        dicUrl: 'dict_type'
      }, {
        label: '备注信息',
        prop: 'remarks'
      }, {
        width: 150,
        label: '创建时间',
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      formRules: {
        type: [{
          required: true,
          message: '请输入字典类型',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '请输入字典描述',
          trigger: 'blur'
        }],
        system: [{
          required: true,
          message: '请输入字典类型',
          trigger: 'blur'
        }]
      },
      searchForm: {},
      dialogPvVisible: false,
      dialogDictItem: false,
      operationStatus: 0,
      form: {},
      formLabelWidth: '90px',
      dictItem: {
        tableKey: 1,
        tableLoading: false,
        tableOption: [{
          label: '类型',
          prop: 'type'
        }, {
          width: 150,
          label: '数据值',
          prop: 'value'
        }, {
          label: '标签名',
          prop: 'label'
        }, {
          label: '描述',
          prop: 'description'
        }, {
          label: '排序',
          prop: 'sort',
          type: 'number'
        }, {
          label: '备注信息',
          prop: 'remarks'
        }],
        tableData: [],
        page: {
          total: 0,
          current: 1,
          size: 10
        },
        searchForm: {},
        dialogPvVisible: false,
        dialogDictItem: false,
        operationStatus: 0,
        form: {},
        formRules: {
          value: [{
            required: true,
            message: '请输入数据值',
            trigger: 'blur'
          }],
          label: [{
            required: true,
            message: '请输入标签名',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: '请输入字典描述',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }]
        }
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

    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.operationStatus = 0
      this.form = {}
    },
    handleUpdate(row, index) {
      this.dialogPvVisible = true
      this.operationStatus = 2
      this.form = row
    },
    create() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogPvVisible = false
          this.tableLoading = true
          addObj(this.form)
            .then(res => {
              this.tableLoading = false
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.getList()
            })
            .catch(() => {
              this.tableLoading = false
            })
        }
      })
    },
    update() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogPvVisible = false
          this.tableLoading = true
          putObj(this.form)
            .then(res => {
              this.tableLoading = false
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              this.getList()
            })
            .catch(() => {
              this.tableLoading = false
            })
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
          return delObj(row)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    },
    dictItemGetList() {
      this.dictItem.tableLoading = true
      this.dictItem.searchForm.dictId = this.form.id
      fetchItemList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.dictItem.page.current,
            size: this.dictItem.page.size
          },
          this.dictItem.searchForm
        )
      )
        .then(res => {
          this.dictItem.tableData = res.data.data.records
          this.dictItem.page.total = res.data.data.total
          this.dictItem.tableLoading = false
        })
        .catch(() => {
          this.dictItem.tableLoading = false
        })
    },
    handleDictItem(row, index) {
      this.dialogDictItem = true
      this.form = row
      this.dictItemGetList(row.id, row.type)
    },
    dictItemHandleCreate() {
      this.dictItem.dialogPvVisible = true
      this.dictItem.operationStatus = 0
      this.dictItem.form = {}
      this.dictItem.form.type = this.form.type
      this.dictItem.form.dictId = this.form.id
    },
    dictItemHandleUpdate(row, index) {
      this.dictItem.dialogPvVisible = true
      this.dictItem.operationStatus = 2
      this.dictItem.form = row
    },
    dictItemHandleFilter() {
      this.dictItemGetList()
    },
    dictItemUpdate() {
      this.$refs.dictItemDataForm.validate(valid => {
        if (valid) {
          this.dictItem.dialogPvVisible = false
          this.dictItem.tableLoading = true
          putItemObj(this.dictItem.form)
            .then(res => {
              this.dictItem.tableLoading = false
              this.$message({
                showClose: true,
                message: '修改成功',
                type: 'success'
              })
              this.dictItemGetList()
            })
            .catch(() => {
              this.dictItem.tableLoading = false
            })
        }
      })
    },
    dictItemCreate() {
      this.$refs.dictItemDataForm.validate(valid => {
        if (valid) {
          this.dictItem.dialogPvVisible = false
          this.dictItem.tableLoading = true
          addItemObj(this.dictItem.form)
            .then(res => {
              this.dictItem.tableLoading = false
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.dictItemGetList()
            })
            .catch(() => {
              this.dictItem.tableLoading = false
            })
        }
      })
    },
    dictItemHandleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delItemObj(row)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.dictItemGetList()
        })
    }

  }
}
</script>
