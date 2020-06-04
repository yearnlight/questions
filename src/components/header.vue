<template>
  <div class="header">
    <div class="header-content">
      <a class="logo" href="/">
        <img src="@/assets/xuanwo.png" alt="旋涡" class="logo-img">
      </a>
      <nav role="navigation" class="main-nav">
        <ul class="nav-list">
          <li class="nav-list-item">
            <ul class="menu">
              <li class="menu-item">
                <router-link tag="a" to="/index">首页</router-link>
              </li>
              <li class="menu-item">
                <router-link tag="a" to="/question">题库</router-link>
              </li>
              <li class="menu-item">
                <router-link tag="a" to="/template">模板</router-link>
              </li>
              <li class="menu-item">
                <router-link tag="a" to="/offers">招聘</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-list-item search">
            <form role="search" class="search-form">
              <el-input placeholder="搜索旋涡" suffix-icon="el-icon-search" v-model="searchValue"></el-input>
            </form>
          </li>
          <li class="nav-list-item">
            <el-button type="primary" @click="publish">发布试题</el-button>
          </li>
          <li class="nav-list-item">
            <el-dropdown @command="myOperate" v-if="userInfo && userInfo.id" trigger="click">
              <el-avatar size="small" :src="userInfo.avatar"></el-avatar>
              <el-dropdown-menu class="my-list" slot="dropdown">
                <el-dropdown-item command="home" icon="el-icon-s-home">我的主页</el-dropdown-item>
                <el-dropdown-item command="favorite" icon="el-icon-star-on">我的收藏</el-dropdown-item>
                <el-dropdown-item command="logout" divided icon="el-icon-back" @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span v-else class="login">
              <span class="btn" @click="$parent.login">登录</span>
              <span @click="$parent.register">注册</span>
            </span>
          </li>
          <li class="nav-list-item"></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import util from "@/common/util";
export default {
  data() {
    return {
      searchValue: "",
      userInfo: {},
      isLogin: false,
      loginForm: {},
      loginRules: {
        account: [{ required: true, message: "请输入账号", trigger: "change" }],
        pass: [{ required: true, message: "请输入登录密码", trigger: "change" }]
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    publish() {
      this.$router.push("/index-add");
    },
    getUserInfo() {
      let userInfo = util.getSession("userInfo");
      userInfo.avatar = userInfo.avatar || require(`@/assets/avatar/system8.png`);
      this.userInfo = userInfo;
    },
    logout() {
      this.$confirm("你确定退出旋涡题库?", "退出").then(() => {
        this.$http.postForm(this.$api.auth.logout,{token:sessionStorage.getItem("token")}).then(res => {
          if (res.code == 200) {
            sessionStorage.clear();
            this.$router.push("/index");
            this.$router.go(0);
          } else {
            this.$message.error("登出失败");
          }
        });
      });
    },
    myOperate(key) {
      switch (key) {
        case "logout":
          this.logout();
          break;
        case "home":
          this.$router.push("/my-home");
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.header {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.2s;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;
  color: #909090;
  height: 5rem;
  z-index: 250;
  &-content {
    max-width: 960px;
    margin: auto;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    height: 100%;
    .logo {
      min-width: 98px;
      margin-right: 2rem;
      img {
        width: auto;
        height: auto;
      }
    }
    .main-nav {
      height: 100%;
      flex: 1 0 auto;
      .nav-list {
        padding: 0;
        display: flex;
        align-items: center;
        position: relative;
        margin: 0;
        &-item {
          display: flex;
          color: #71777c;
          padding: 0 1.2rem;
          font-size: 1.33rem;
          margin: 0;
          height: 100%;
          &.search {
            flex: 1 1 auto;
            justify-content: flex-end;
            cursor: auto;
            .search-form {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-radius: 2px;
              .el-input {
                width: 160px;
              }
            }
          }
          .login {
            color: #007fff;
            span.btn::after {
              content: "·";
              margin: 0 0.4rem;
            }
            span {
              font-size: 1.33rem;
              cursor: pointer;
            }
          }
          .menu {
            padding: 0;
            display: flex;
            list-style: none;
            &-item {
              padding: 0 1.5rem;
              height: 5rem;
              color: #71777c;
              font-size: 1.33rem;
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              a.active {
                color: #007fff;
              }

              a {
                text-decoration: none;
                cursor: pointer;
                color: #71777c;
              }
            }
          }
        }
      }
    }
  }
}
.my-list {
  width: 13.1rem;
  .el-dropdown-menu__item {
    padding: 4px 15px !important;
    color: #71777c;
    font-size: 1.3rem;
  }
}
</style>

