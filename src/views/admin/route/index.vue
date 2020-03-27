<template>
  <div class="execution app-container calendar-list-container">
    <el-alert
      title="路由配置是非常专业的事情，不建议非工程师操作"
      type="warning"
    />
    <vue-json-editor v-model="json" :show-btns="false" />
    <div align="center">
      <el-button @click="edit()">更新</el-button>
    </div>
  </div>
</template>

<script>
import { fetchList, putObj, refreshObj } from '@/api/admin/route'
import vueJsonEditor from 'vue-json-editor'
import { mapGetters } from 'vuex'
export default {
  name: 'Route',
  components: {
    vueJsonEditor
  },
  filters: {

  },
  data() {
    return {
      json: null
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },
  methods: {
    edit() {
      putObj(this.json).then(() => {
        refreshObj().then(() => {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    getList() {
      fetchList().then(response => {
        const result = response.data.data
        for (var i = 0; i < result.length; i++) {
          const route = result[i]
          if (route.predicates) {
            const predicates = route.predicates
            route.predicates = JSON.parse(predicates)
          }
          if (route.filters) {
            const filters = route.filters
            route.filters = JSON.parse(filters)
          }
        }
        this.json = result
      })
    }

  }
}
</script>
