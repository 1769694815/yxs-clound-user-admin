<!--
 * @Author: xwen
 * @Date: 2020-03-06 17:38:07
 * @LastEditTime: 2020-03-07 10:34:38
 * @LastEditors: xwen
 * @Description: 附件上传
 -->
<template class="uploadFile">
  <div class="upload-container">
    <input :value="value" type="text" style="display: none;">
    <el-upload
      v-if="!action"
      ref="upload"
      :data="dataObj"
      :action="upload_qiniu_url"
      :file-list="fileList"
      :limit="limit"
      :on-remove="handlerRemove"
      :before-upload="beforeUpload"
      :on-success="handlerSuccess"
      :on-exceed="handlerExceed"
      :disabled="disabled"
      class="upload-demo"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div class="el-uplaod__tip">{{ title }}</div>
    </el-upload>
    <el-upload
      v-else
      ref="upload"
      :action="action"
      :file-list="fileList"
      :limit="limit"
      :on-remove="handlerRemove"
      :before-upload="beforeUpload"
      :on-success="handlerSuccess"
      :disabled="disabled"
      class="upload-demo"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div class="el-uplaod__tip">{{ title }}</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import { mapGetters } from 'vuex'
export default {
  name: 'SingleFile',
  props: {
    value: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '只能上传文件，且不超过500kb'
    },
    status: {
      type: [Number, String],
      default: 2
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      upload_qiniu_url: this.$upload_qiniu_url,
      upload_qiniu_addr: '',
      dataObj: { token: '', key: '' },
      fileList: [],
      headers: {
        Authorization: 'Bearer '
      }
    }
  },
  computed: {
    ...mapGetters(['access_token'])
  },
  watch: {
    value: {
      handler: function(val) {
        console.log(val)
        // this.fileList = [{ name: 'good.txt', url: 'http:xxxx'}]
        this.fileList = val.length > 0 ? JSON.parse(val) : []
      },
      immediate: true
    },
    action: {
      handler: function(val) {
        this.headers.Authorization = 'Bearer ' + this.access_token
      },
      immediate: true
    }
  },
  methods: {
    beforeUpload(file) {
      const _self = this
      return new Promise((resolve, reject) => {
        const params = {
          fileName: file.name,
          fileSize: file.size,
          type: this.status
        }
        getToken(params)
          .then(response => {
            const key = response.data.data.fileKey
            const token = response.data.data.token
            _self._data.upload_qiniu_addr = response.data.data.domain
            _self._data.dataObj.token = token
            _self._data.dataObj.key = key
            resolve(true)
          })
          .catch(err => {
            console.log(err)
            reject(false)
          })
      })
    },
    handlerSuccess(res, file) {
      const obj = {
        name: file.name,
        url: this.upload_qiniu_addr + res.key
      }
      this.fileList.push(obj)
      const result = JSON.stringify(this.fileList)
      console.log(result)
      this.$emit('input', result)
    },
    handlerRemove(file, fileList) {
      this.fileList = fileList
      const result = JSON.stringify(this.fileList)
      this.$emit('input', result)
    },
    handlerExceed(files, fileList) {
      console.log(files, fileList)
      this.$message({
        message: '上传图片超过限制'
      })
    }
  }
}
</script>
