<template>
  <div class="temps">
    <div class="temps-content">
      <div class="temps-header">
        <ul class="temps-header-list">
          <li
            :key="index"
            @click="changeTab(item)"
            :class="{'active':activeClass == item.key}"
            v-for="(item,index) in classes"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="temps-items">
        <div class="temps-content-item" v-for="(tem, index) in temps" :key="index">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div class="temps-mark" @click="view(tem)">
              <mark-icon :config="tem" :sign="index"></mark-icon>
            </div>
            <div class="temps-info">
              <div class="temps-info-title">{{tem.title}}</div>
              <div class="bottom clearfix">
                <time class="time">{{ tem.createTime | datetime}}</time>
                <i class="el-icon-delete red" title="删除" @click="del(tem)"></i>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div class="temps-side"></div>
  </div>
</template>

<script>
import MarkIcon from "@/components/template/mark";
import enums from "@/common/enum";
import util from "@/common/util";
export default {
  components: { MarkIcon },
  created() {
    this.list();
  },
  data() {
    return {
      temps: [],
      classes: [
        { name: "最热", key: "hot" },
        { name: "我的", key: "my" },
        { name: "过期", key: "expired" }
      ],
      activeClass: "hot"
    };
  },
  methods: {
    changeTab(item) {
      this.activeClass = item.key;
      switch (item.key) {
        case "expired":
          this.loadExpiredList();
          break;
        case "hot":
          this.list();
          break;
      }
    },
    loadExpiredList() {
      this.$axios
        .post(this.$api.template.expiredList, {
          userId: util.getSession("userInfo").id
        })
        .then(res => {
          if (res.code == 200) {
            let temps = res.result;
            this.temps = this.compose(temps);
          } else {
          }
        });
    },
    compose(temps) {
      let _this = this;
      temps.forEach(t => {
        let conf = enums.templateConfs.filter(m => m.type == t.modelType);
        if (conf && conf.length > 0) {
          t = Object.assign(t, conf[0]);
        }
      });
      return temps;
    },
    list() {
      this.$axios.post(this.$api.template.list, { modelType: "" }).then(res => {
        if (res.code == 200) {
          let temps = res.result;
          this.temps = this.compose(temps);
        }
      });
    },
    view(item) {
      this.$router.push({
        path: "/template-detail",
        query: {
          id: item.uuid
        }
      });
    },
    del(item) {
      this.$confirm("你确定删除当前模板?", "删除").then(() => {
        this.$axios
          .post(this.$api.template.del, { id: item.uuid })
          .then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.list();
            } else {
              this.$message.error("删除模板失败");
            }
          });
      });
    }
  }
};
</script>

<style lang="scss">
.temps {
  display: flex;
  &-header {
    padding: 1.3rem 1rem;
    border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
    &-list {
      align-items: center;
      line-height: 1;
      display: flex;
      justify-content: flex-start;
      li {
        &.active {
          color: #007fff;
        }
        padding: 0 1.2rem;
        font-size: 1.16rem;
        border-right: 1px solid hsla(0, 0%, 59.2%, 0.2);
        position: relative;
        cursor: pointer;
      }
    }
  }
  &-items {
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &-content {
    min-height: 200px;
    background: #fff;
    width: 645px;
    &-item {
      width: 260px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
  }
  &-mark {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  &-info {
    padding: 14px;
    font-size: 13px;
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 15px;
      .time {
        opacity: 0.65;
        font-size: 12px;
      }
      .el-icon-delete {
        cursor: pointer;
      }
    }
  }

  &-side {
    background: #fff;
    width: 18rem;
    margin-left: 12px;
  }
}
</style>
