<!--
 * @Date: 2020-02-17 18:17:06
 * @LastEditors: xw
 * @Author: xw
 * @LastEditTime: 2020-02-17 18:17:07
 * @Description: 图片上传
 -->

<template class="uploadImg">
  <div class="upload-container">
    <el-upload
      v-show="!imageUrl"
      ref="upload"
      :data="dataObj"
      list-type="picture-card"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :action="upload_qiniu_url"
      class="image-uplaoder"
    >
      <i class="el-icon-plus" />
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
    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/api/qiniu'
import { randomLenNum } from '@/utils/index'
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
    }
  },
  data() {
    return {
      upload_qiniu_url: this.$upload_qiniu_url,
      dataObj: { token: '', key: '' },
      image_uri: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    handleRemove() {
      this.$emit('handleSuccess', '')
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
    beforeUpload() {
      const _self = this
      return new Promise((resolve, reject) => {
        getToken()
          .then(response => {
            const key = randomLenNum(32)
            const token = response.data
            // console.log('token', token)
            _self._data.dataObj.token = token
            _self._data.dataObj.key = 'upload2/' + key + '.jpg'
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
      const imgUrl = this.$qiniuAddr + res.key
      this.$emit('handleSuccess', imgUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;
  .image-uploader {
    height: 100%;
  }
  .image-preview {
    width: 100%;
    height: 100%;
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
</style>
