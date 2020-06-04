<template>
  <div class="myHome">
    <div class="myHome-content">
      <div class="myHome-info">
        <div class="myHome-info-left">
          <div class="myHome-info-avatar">
            <el-avatar class="avatar" :src="info.avatar"></el-avatar>
          </div>
          <div class="myHome-info-detail">
            <div class="nickname">{{info.nickname}}</div>
            <div class="email">
              <span class="el-icon-message"></span><span class="myHome-info-detail-desc">暂无资料</span>
            </div>
            <div class="signature">
              <span class="el-icon-postcard"></span><span class="myHome-info-detail-desc">暂无资料</span>
            </div>
          </div>
        </div>
        <div class="myHome-info-operate">
          <el-button>编辑个人资料</el-button>
        </div>
      </div>
      <div class="myHome-record">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的出题" name="subject">我的出题</el-tab-pane>
          <el-tab-pane label="我的模板" name="temp">我的模板</el-tab-pane>
          <el-tab-pane label="我的做题" name="do">我的做题</el-tab-pane>
          <el-tab-pane label="积分记录" name="integral">积分记录</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="myHome-effort">
      <div class="myHome-effort-flexd">
        <div class="myHome-effort-flexd-title">个人成就</div>
        <div class="myHome-effort-flexd-content">
          <div class="item">
            <img src="@/assets/publish.png">
            出题数 {{subjects.length}}
          </div>
          <div class="item">
            <img src="@/assets/do.png">刷题数 1000
          </div>
          <div class="item">
            <img src="@/assets/paper.png">模板数 4
          </div>
          <div class="item">
            <img src="@/assets/integral.png">
            旋积分 {{integral}}
          </div>
        </div>
        <div class="myHome-effort-flexd-extra">
          <div class="myHome-effort-flexd-extra-title">个人信息</div>
          <div class="myHome-effort-flexd-extra-content">
            <div class="item">加入于 {{info.createTime | date}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/common/util";
export default {
  data() {
    return {
      info: {},
      integral: 0,
      subjects: [],
      activeName:"subject"
    };
  },
  created() {
    //获取用户信息
    this.getUserInfo();
    //获取用户积分信息
    this.getIntegral();
    //获取用户出题信息
    this.getPublishs();
  },
  methods: {
    getUserInfo() {
      this.$axios
        .post(this.$api.auth.userInfo, { id: util.getSession("userInfo").id })
        .then(res => {
          if (res.code == 200) {
            let info = res.result;
            info.avatar = info.avatar || require(`@/assets/avatar/system8.png`);
            this.info = info;
          } else {
          }
        });
    },
    getIntegral() {
      this.$axios
        .post(this.$api.integral.getIntegral, {
          userId: util.getSession("userInfo").id
        })
        .then(res => {
          if (res.code == 200) {
            this.integral = res.result.integral;
          } else {
          }
        });
    },
    getPublishs() {
      this.$axios
        .post(this.$api.question.publishs, {
          userId: util.getSession("userInfo").id
        })
        .then(res => {
          if (res.code == 200) {
            this.subjects = res.result;
          } else {
          }
        });
    }
  }
};
</script>

<style lang="scss">
.MyItem {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  color: #000;
  img {
    margin-right: 1.2rem;
    width: 18px;
    height: 18px;
  }
}
.MyTitle {
  padding: 1.333rem;
  font-size: 1.333rem;
  font-weight: 600;
  color: #31445b;
  background-color: #fff;
  border-bottom: 1px solid rgba(230, 230, 231, 0.5);
}
.myHome {
  display: flex;
  &-content {
    width: 645px;
  }
  &-info {
    display: flex;
    padding: 2.5rem;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    justify-content: space-between;
    &-left {
      display: flex;
    }
    &-avatar {
      display: inline-block;
      position: relative;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      flex: 0 0 auto;
      margin-right: 2.4rem;
      width: 7.5rem;
      height: 7.5rem;
      background-color: #f9f9f9;
      border-radius: 50%;
      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 2.6rem;
      }
    }
    &-detail {
      display: flex;
      font-size: 1.25rem;
      line-height: 1.5;
      color: #72777b;
      overflow: hidden;
      flex-direction: column;
      &-desc{
        margin-left: 1rem;
      }
      .nickname {
        margin: 0;
        padding: 0;
        font-size: 2.167rem;
        font-weight: 600;
        line-height: 1.2;
        color: #000;
      }
      .email {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        font-size: 1.25rem;
        line-height: 1.5;
        color: #72777b;
        overflow: hidden;
      }
      .signature {
        margin-top: 0.4rem;
        display: flex;
        align-items: center;
      }
    }
    &-operate {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
  &-record {
    margin-top: 1rem;
    height: 200px;
    background-color: #fff;
    padding: 0 1rem;
  }
  &-effort {
    width: 18rem;
    margin-left: 12px;
    overflow: hidden;
    &-flexd {
      z-index: 1;
      position: fixed;

      width: 216px;
      &-title {
        @extend .MyTitle;
      }
      &-content {
        padding: 1.333rem;
        background-color: #fff;
        .item {
          @extend .MyItem;
        }
      }
      &-extra {
        margin-top: 1rem;
        background-color: #fff;
        &-title {
          @extend .MyTitle;
        }
        &-content {
          padding: 1.333rem;
          .item {
            @extend .MyItem;
          }
        }
      }
    }
  }
}
</style>


