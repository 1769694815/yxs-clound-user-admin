<!--
 * @Date: 2020-02-14 17:09:18
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-03 14:01:14
 * @Description: 表格组件
 -->
<template>
  <div class="x__table">
    <div class="x__menu">
      <div class="x__menu__left">
        <template>
          <el-button
            v-if="addBtn"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleCreate"
          >新 增</el-button>
          <slot
            v-else
            name="menuLeft"
          />
        </template>
      </div>
      <div class="x__menu__right">
        <el-tooltip
          placement="top"
          content="刷新"
        >
          <el-button
            icon="el-icon-refresh"
            size="small"
            circle
            @click="handleRefresh"
          />
        </el-tooltip>
        <el-tooltip
          placement="top"
          content="显隐"
        >
          <el-button
            icon="el-icon-menu"
            size="small"
            tooltip
            circle
            @click="hideVisible = true"
          />
        </el-tooltip>
      </div>
    </div>
    <el-table
      :key="tableKey"
      v-loading="tableLoading"
      :data="tableData"
      border
      stripe
      highlight-current-row
    >
      <el-table-column
        v-if="index"
        type="index"
        label="序号"
        align="center"
        width="50"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + (page.current - 1) * page.size + 1 }}</span>
        </template>
      </el-table-column>
      <template v-for="(item, index) in tableOption">
        <el-table-column
          v-if="!item.hide"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'center'"
          :show-overflow-tooltip="item.overHidden || true"
        >
          <template slot-scope="scope">
            <slot
              v-if="item.slot"
              :name="scope.column.property"
              :row="scope.row"
              :$index="scope.$index"
            />
            <span v-else-if="item.dicData">
              <el-tag>{{ scope.row[scope.column.property] | statusFilter(item.dicData) }}</el-tag>
            </span>
            <span
              v-else-if="item.dicUrl"
            >
              <el-tag>{{ scope.row[scope.column.property] | statusFilter(item.dicData) }}</el-tag>
            </span>
            <span v-else>{{ scope.row[scope.column.property] }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <slot
            name="menu"
            :row="scope.row"
            :$index="scope.$index"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <Pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.size"
      @pagination="pageChange"
    />
    <el-dialog
      :visible.sync="hideVisible"
      title="多选"
    >
      <el-checkbox-group
        v-model="checkList"
        @change="checkChange"
      >
        <el-checkbox
          v-for="(item, index) in tableOption"
          :key="index"
          :label="item.prop"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { remote } from '@/api/admin/dict'
export default {
  name: 'XTable',
  components: {
    Pagination
  },
  filters: {
    statusFilter(status, list) {
      let result
      for (const i in list) {
        const item = list[i]
        if (status === item.value) {
          result = item.label
        }
      }
      return result
    }
  },
  props: {
    index: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    addBtn: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    tableKey: {
      type: Number,
      default: function() {
        return 0
      }
    },
    tableLoading: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableOption: {
      type: Array,
      default: function() {
        return []
      }
    },
    page: {
      type: Object,
      default: function() {
        return {
          total: 0,
          current: 1,
          page: 10
        }
      }
    }
  },
  data() {
    return {
      hideVisible: false,
      checkList: []
    }
  },
  created() {
    this.tableOption.forEach(ele => {
      if (!ele.hide) {
        this.checkList.push(ele.prop)
      }
      if (ele.dicUrl && !ele.slot) {
        remote(ele.dicUrl).then(res => {
          ele.dicData = res.data.data
        })
      }
    })
    console.log('tableOption', this.tableOption)
  },
  methods: {
    checkChange(val) {
      let list = JSON.parse(JSON.stringify(this.tableOption))
      list = list.map(ele => {
        ele.hide = !this.checkList.includes(ele.prop)
        return ele
      })
      this.$emit('update:tableOption', list)
    },
    handleCreate() {
      this.$emit('handle-create')
    },
    handleRefresh() {
      this.$emit('refresh-change')
    },
    pageChange() {
      this.$emit('page-change')
    }
  }
}
</script>
