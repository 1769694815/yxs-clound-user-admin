<!--
 * @Date: 2020-02-15 16:57:27
 * @LastEditors  : xw
 * @Author: xw
 * @LastEditTime : 2020-02-15 19:27:21
 * @Description: 文件管理
 -->
<template>
  <div class="app-container calendar-list-container">
    <Xtable
      :tableKey="tableKey"
      :tableLoading="tableLoading"
      :tableData="tableData"
      :page="page"
      :tableOption.sync="tableOption"
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
          size="mini"
          icon="el-icon-download"
          @click="download(scope.row,scope.index)"
        >下载
        </el-button>
      </template>
    </Xtable>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/sys-file'
import Xtable from '@/components/Xtable/index'
export default {
  components: {
    Xtable
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
          overHidden: true
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
          prop: 'type'
        },
        {
          label: '文件大小',
          prop: 'fileSize'
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
      searchForm: {}
    }
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
    handleFilter() {},
    download() {},
    handleCreate() {}
  }
}
</script>