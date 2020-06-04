<template>
  <div id="app">
    <Header></Header>
    <router-view class="routerContent"></router-view>
    <el-dialog
      :close-on-click-modal="false"
      custom-class="auth"
      title="登录"
      :visible.sync="isLogin"
      label-width="0"
    >
      <el-form class="auth-form" ref="loginForm" :model="loginForm" :rules="loginRules">
        <el-form-item prop="account">
          <el-input
            size="medium"
            v-model="loginForm.account"
            placeholder="请输入登录账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="p1">
          <el-input
            size="medium"
            v-model="loginForm.p1"
            placeholder="请输入登录密码"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-button size="medium" class="login-btn" type="primary" @click="toLogin('loginForm')">登 录</el-button>
        <div class="login-extra">
          <span>
            <span>没有账号?</span>
            <span class="login-extra-register" @click="register">注册</span>
          </span>
          <span class="login-extra-forget">忘记密码</span>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      custom-class="auth"
      title="注册"
      :visible.sync="isRegister"
      label-width="0"
    >
      <el-form class="auth-form" ref="registerForm" :model="registerForm" :rules="registerRules">
        <el-form-item prop="account">
          <el-input
            size="medium"
            v-model="registerForm.account"
            placeholder="请输入用户名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            size="medium"
            v-model="registerForm.email"
            placeholder="请输入邮箱"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="verificationCode" v-if="registerForm.email">
          <el-input
            size="medium"
            v-model="registerForm.verificationCode"
            placeholder="请输入验证码"
            autocomplete="off"
          >
            <span
              slot="suffix"
              @click="getCode"
              :class="[{'orange disabled':isWait,'blue':!isWait},'el-input__icon blue getCode']"
            >{{isWait?`${waitMsg}后重试`:"获取验证码"}}</span>
          </el-input>
        </el-form-item>
        <el-form-item prop="p1">
          <el-input
            size="medium"
            v-model="registerForm.pwd"
            placeholder="请输入密码"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
        <el-button
          size="medium"
          class="login-btn"
          type="primary"
          @click="toRegister('registerForm')"
        >注 册</el-button>
        <div class="register-extra">
          <span class="register-extra-login" @click="login">已有账号登录</span>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/header";
const emailExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
export default {
  name: "app",
  components: {
    Header
  },
  data() {
    return {
      isWait: false,
      waitMsg: "",
      waittime: 60,
      timer: null,
      isLogin: false,
      loginForm: {},
      loginRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        p1: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, message: "密码长度最少6位", trigger: "blur" }
        ]
      },
      isRegister: false,
      registerForm: {},
      registerRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: emailExp,
            message: "请输入正确的邮箱格式"
          }
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度最少6位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    getCode() {
      this.$axios
        .post(this.$api.auth.getCode, { email: this.registerForm.email })
        .then(res => {
          this.isWait = true;
          this.toTiming();
        });
    },
    toTiming() {
      this.waittime = 60;
      //清理上一个计时
      if (this.timer) {
        clearInterval(this.timer);
      }
      //开始倒计时 60s
      this.timer = setInterval(this.countDown, 1000);
    },
    countDown() {
      if (this.waittime >= 0) {
        let seconds = Math.floor(this.waittime % 60);
        this.waitMsg = `${seconds}s`;
        --this.waittime;
      } else {
        this.isWait = false;
      }
    },
    login() {
      this.isRegister = false;
      this.isLogin = true;
      this.loginForm = {};
      if (this.$refs["loginForm"]) {
        this.$refs["loginForm"].clearValidate();
      }
    },
    register() {
      this.isLogin = false;
      this.isRegister = true;
      this.registerForm = {};
      if (this.$refs["registerForm"]) {
        this.$refs["registerForm"].clearValidate();
      }
    },
    toLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(this.$api.auth.login, this.loginForm).then(res => {
            if (res.code == 200) {
              let userInfo = res.result;
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              sessionStorage.setItem("token", userInfo.token);
              this.isLogin = false;
              this.$notify.success({
                title: "登录成功"
              });
              this.$router.go(0);
            } else {
              this.$notify.error({
                title: "登录失败"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    toRegister(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.registerForm.nickname = this.registerForm.account;
          this.$axios
            .post(this.$api.auth.registerAccount, this.registerForm)
            .then(res => {
              if (res.code == 200) {
                this.$notify.success({
                  title: "注册成功",
                  message: "欢迎使用旋涡题库"
                });
                this.isRegister = false;
                this.isLogin = true;
              } else {
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  font-size: 12px;
  line-height: normal;
  margin: 0;
  background: #f4f5f5;
  .el-notification {
    z-index: 2200 !important;
  }
}
#app {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica Neue,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  text-rendering: optimizeLegibility;
  color: #333333;
  height: 100%;
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
  ul {
    padding: 0;
    margin: 0;
    li {
      list-style: none;
    }
  }
  .red {
    color: #f56c6c;
  }
  .green {
    color: #67c23a;
  }
  .blue {
    color: #409eff;
  }
  .orange {
    color: #e6a23c;
  }
  .routerContent {
    margin-top: 6rem;
    position: relative;
  }
}

.auth {
  width: 26.5rem !important;
  .el-dialog__title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  &-form {
    position: relative;
    width: 26.5rem;
    max-width: 100%;
    font-size: 1.167rem;
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    .getCode {
      cursor: pointer;
      &.disabled {
        pointer-events: none;
        filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
        -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
        opacity: 0.5; /*其他，透明度50%*/
      }
    }
    .el-input {
      input {
        border-radius: 0;
      }
    }
    .login-btn {
      background-color: #007fff;
      width: 100%;
      border-radius: 0;
    }
    .login-extra {
      margin: 1rem 0 0;
      display: flex;
      justify-content: space-between;
      &-register {
        margin-left: 8px;
        color: #007fff;
        cursor: pointer;
      }
      &-forget {
        color: #007fff;
        cursor: pointer;
      }
    }
    .register-extra {
      margin: 1rem 0 0;
      display: flex;
      justify-content: space-between;
      &-login {
        color: #007fff;
        cursor: pointer;
      }
    }
  }
}
</style>
