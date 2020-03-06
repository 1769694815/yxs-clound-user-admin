<!--
 * @Author: xwen
 * @Date: 2020-03-05 14:02:24
 * @LastEditTime: 2020-03-05 15:59:07
 * @LastEditors: xwen
 * @Description: 个人信息
 -->

<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <el-tabs
            v-model="switchStatus"
            type="card"
            @tab-click="switchTab"
          >
            <el-tab-pane label="信息管理" name="userManager" />
            <el-tab-pane label="密码管理" name="passwordManager" />
          </el-tabs>
          <el-form
            v-if="switchStatus === 'userManager'"
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="用户名"
              prop="username"
            >
              <el-input
                v-model="ruleForm.username"
                type="text"
                disabled=""
              />
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="phone"
            >
              <el-input
                v-model="ruleForm.phone"
                type="text"
                placeholder="验证码登录使用"
              />
            </el-form-item>
            <el-form-item
              label="头像"
            >
              <single-image
                v-model="ruleForm.avatar"
                action="/admin/sys-file/upload/1"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form
            v-if="switchStatus === 'passwordManager'"
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="原密码" prop="password">
              <el-input v-model="ruleForm.password" type="password" auto-complete="off" placeholder="请输入不小于6位数字、字母组合的密码" />
            </el-form-item>
            <el-form-item label="密码" prop="password1">
              <el-input v-model="ruleForm.password1" type="password" auto-complete="off" placeholder="请输入不小于6位数字、字母组合的密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="password2">
              <el-input v-model="ruleForm.password2" type="password" auto-complete="off" placeholder="请输入不小于6位数字、字母组合的密码" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateInfo } from '../../../api/admin/user'
import { mapState } from 'vuex'
export default {
  name: 'UserInfo',
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.ruleForm.password !== '') {
        if (value !== this.ruleForm.newpassword1) {
          callback(new Error('二次输入密码不一致！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      switchStatus: 'userManager',
      ruleForm: {
        username: '',
        password: '',
        password1: '',
        password2: '',
        avatar: '',
        phone: ''
      },
      rules: {
        password: [{
          required: true,
          min: 6,
          message: '原密码不能为空且不少于6位',
          tigger: 'change'
        }],
        newpassword1: [{
          required: false,
          min: 6,
          message: '不少于6位',
          tigger: 'change'
        }],
        newpassword2: [{
          required: false,
          validate: validatePass,
          tigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.resetForm()
  },
  methods: {
    switchTab(tab) {
      this.switchStatus = tab.name
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateInfo(this.ruleForm).then(res => {
            // DOTO: 接口报错
            console.log(res)
          })
        }
      })
    },
    resetForm(formName) {
      this.ruleForm.password = undefined
      this.ruleForm.password1 = undefined
      this.ruleForm.password2 = undefined
      this.ruleForm.username = this.userInfo.username
      this.ruleForm.phone = this.userInfo.phone
      this.ruleForm.avatar = this.userInfo.avatar
    }
  }
}
</script>
