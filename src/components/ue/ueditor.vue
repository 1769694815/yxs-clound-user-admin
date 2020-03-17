<!--
 * @Author: xwen
 * @Date: 2020-03-14 15:03:45
 * @LastEditTime: 2020-03-14 18:04:42
 * @LastEditors: xwen
 * @Description:
 -->

<template>
  <div>
    <script :id="id" type="text/plain" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: String,
      default: function() {
        return ''
      }
    },
    config: {
      type: Object,
      default: function() {
        return {}
      }
    },
    readyOnly: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  data() {
    return {
      editor: null,
      id: 'editor' + new Date().getTime(),
      UEInited: false
    }
  },
  computed: {
    ...mapGetters(['access_token'])
  },
  watch: {
    value(val) {
      console.log(val)
    }
  },
  mounted() {
    console.log(this.config)
    const token = this.access_token
    window.UE.ajax.setAuthorization(token)// 这里是自定义的方法，具体的文件在ueditor.all.js 24490行
    this.$nextTick(() => {
      this.editor = window.UE.getEditor(this.id, this.config) // 初始化UE
      this.editor.addListener('ready', () => {
        this.UEInited = true
        // 自定义请求参数
        this.editor.execCommand('serverparam', function(editor) {
          return {
            'token': token,
            'type': 3
          }
        })
        // 自定义请求地址
        window.UE.Editor.prototype._bkGetActionUrl = window.UE.Editor.prototype.getActionUrl
        window.UE.Editor.prototype.getActionUrl = (action) => {
          if (action === 'uploadimage' || action === 'uploadscrawl' || action === 'uploadimage' || action === 'uploadfile') {
            return '/admin/api/UEditor/editUpload'
          } else if (action === 'uploadvideo') {
            return '/admin/upload?type=5&appId=zyy'
          } else {
            return this.editor._bkGetActionUrl.call(this, action)
          }
        }
        this.editor.setContent(this.value) // 确保UE加载完成后，放入内容
        this.editor.addListener('contentChange', () => {
          // const wordCount = this.editor.getContentLength(true)
          const content = this.editor.getContent()
          // const plainTxt = this.editor.getPlainTxt()
          // const htmlCont = this.editor.getAllHtml()
          // 编辑器内容有变动,通知父组件
          // this.$emit('input', { wordCount: wordCount, content: content, plainTxt: plainTxt, htmlCont: htmlCont })
          this.$emit('input', content)
        })
        // editor初始化后操作
        this.$emit('ready', this.editor)
      })

      if (this.readyOnly) {
        this.setDisabled()
      }
    })
  },
  destroyed() {
    this.editor.destroy()
  },
  methods: {
    getUEContent() {
      return this.editor.getContent()
    },
    setContent(html) {
      try {
        return this.editor.setContent(html)
      } catch (e) {
        console.log('')
      }
    },
    getUEContentTxt() {
      return this.editor.getContentTxt()
    },
    setDisabled() {
      if (this.UEInited) {
        this.editor.setDisabled('fullscreen')
      } else {
        try {
          this.editor.addListener('ready', () => {
            this.editor.setDisabled('fullscreen')
          })
        } catch (e) {
          console.log('')
        }
      }
    },
    setEnabled() {
      if (this.UEInited) {
        this.editor.setEnabled()
      } else {
        try {
          this.editor.addListener('ready', () => {
            this.editor.setEnabled()
          })
        } catch (e) {
          console.log('')
        }
      }
    }
  }
}
</script>

