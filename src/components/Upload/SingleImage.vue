<!--
 * @Date: 2020-02-17 18:17:06
 * @LastEditors: xwen
 * @Author: xw
 * @LastEditTime: 2020-03-05 15:47:19
 * @Description: 图片上传  action上传图片接口，为空的话自传七牛云
 -->

<template class="uploadImg">
  <div class="upload-container">
    <input :value="value" style="display: none;">
    <el-upload
      v-show="!imageUrl && !action"
      ref="upload"
      :data="dataObj"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :action="upload_qiniu_url"
      :show-file-list="false"
      :disabled="disabled"
      class="avatar-uploader"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-upload
      v-show="!imageUrl && action"
      ref="upload"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :action="action"
      :show-file-list="false"
      :disabled="disabled"
      class="avatar-uploader"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <div
      v-show="imageUrl"
      class="image-preview"
    >
      <div
        v-show="imageUrl"
        class="image-preview-wrapper"
      >
        <el-iamge :src="imageUrl" class="avatar">
          <div slot="error" class="el-image">
            <span class="el-image__error">加载失败</span>
          </div>
        </el-iamge>
        <!-- <img :src="imageUrl" class="avatar"> -->
        <div :class="['image-preview-action', { 'not-allowed': disabled }]">
          <i
            v-show="!disabled"
            class="el-icon-delete"
            @click="handleRemove"
          />
        </div>
      </div>
    </div>
    <div slot="tip" class="course-upload__tip">{{ title }}</div>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: String,
      default: function() {
        return ''
      }
    },
    limit: {
      type: Number,
      default: function() {
        return 1
      }
    },
    action: {
      type: String,
      default: function() {
        return ''
      }
    },
    status: {
      type: [Number, String],
      default: function() {
        return 2
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    title: {
      type: String,
      default: function() {
        return '图片大小不能超过2MB'
      }
    }
  },
  data() {
    return {
      upload_qiniu_url: this.$upload_qiniu_url,
      upload_qiniu_addr: '',
      dataObj: { token: '', key: '' },
      image_uri: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      imageUrl: '',
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
        this.imageUrl = val
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
    handleRemove() {
      this.imageUrl = ''
      this.$emit('input', this.imageUrl)
    },
    handleRefresh() {
      this.$nextTick(() => {
        this.$refs['upload'].click()
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
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
            // console.log('token', token)
            _self._data.upload_qiniu_addr = response.data.data.domain + '/'
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
    handleSuccess(res, file) {
      console.log('res', res)
      this.imageUrl = this.action ? res.data.url : this.upload_qiniu_addr + res.key
      this.$emit('input', this.imageUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 178px;
  height: 230px;
  position: relative;
  .image-preview {
    width: 100%;
    height: 178px;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 150px;
      > i {
        font-size: 20px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
.uploadImg {
  width: 150px;
  height: 150px;
}
.not-allowed {
  cursor: not-allowed !important;
}
.el-image {
  width: 100%;
  height: 100%;
}
</style>
