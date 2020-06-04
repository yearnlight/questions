<template>
  <div class="index">
    <div class="index-content">
      <div class="index-header">
        <ul class="index-header-list">
          <li
            :key="index"
            @click="changeTab(item)"
            :class="{'active':activeClass == item.key}"
            v-for="(item,index) in classes"
          >{{item.name}}</li>
        </ul>
      </div>
      <div class="index-items">
        <div class="item" v-if="item.title" v-for="(item,index) in questions" :key="index">
          <div class="item-topic">
            <div class="item-topic-content" v-if="item.title.split('\n').length == 1">
              <p
                v-for="(p,pindex) in item.title.split('\n')"
                :key="pindex"
              >{{pindex == 0 ? `${index + 1}. `:''}}{{p}}</p>
            </div>
            <div class="item-topic-content" v-else>
              <p>{{`${index + 1}. `}}</p>
              <p v-for="(p,pindex) in item.title.split('\n')" :key="pindex">{{p}}</p>
            </div>
            <span class="item-topic-operate">
              <span @click="del(item)" title="删除" class="red el-icon-delete"></span>
              <span @click="edit(item)" title="修改" class="blue el-icon-edit"></span>
            </span>
          </div>
          <div class="item-option" v-if="item.problemType == 1">
            <div
              class="item-option-content"
              v-for="(op,opIndex) in item.optionGroup"
              :key="opIndex"
            >
              <div :class="[{'green':item.correctOptionGroup.includes(op.key)},'option']">
                <div class="letter">{{op.key}}.</div>
                <div>{{op.value}}</div>
              </div>
            </div>
          </div>
          <div class="item-option" v-if="item.problemType == 2">
            <div class="item-option-content">
              <p
                class="row"
                v-if="item.correctOptionGroup"
                v-for="(c,cindex) in item.correctOptionGroup.split('\n')"
                :key="cindex"
              >{{c}}</p>
            </div>
          </div>
          <div class="item-option-operate">
            <el-tag v-if="item.languageTypeName" type="primary">{{item.languageTypeName}}</el-tag>
            <el-tag v-if="item.frameworkName" type="success">{{item.frameworkName}}</el-tag>
            <div class="operate-btns">
              <el-button
                v-if="!template.temps.some(t=>t.uuid == item.uuid)"
                @click="addTemp(item)"
                type="primary"
                plain
                icon="el-icon-s-promotion"
              >添加组卷</el-button>
              <el-button
                v-if="template.temps.some(t=>t.uuid == item.uuid)"
                @click="removeItem(item)"
                type="warning"
                plain
                icon="el-icon-s-promotion"
              >移出组卷</el-button>
              <el-button
                @click="viewAnalysis(item,index)"
                type="success"
                plain
                icon="el-icon-view"
              >{{item.isAnalysis?"收起分析":"查看分析"}}</el-button>
            </div>
          </div>
          <div class="item-option-desc">
            <span>
              <span class="item-option-desc-used">使用量 {{item.used | 0}}</span>
              <span v-if="item.creator" class="item-option-desc-used">作者 {{item.creator}}</span>
            </span>
          </div>
          <div class="item-option-analysis" v-if="item.isAnalysis">
            <div class="content blue">
              <p :key="aIndex" v-for="(aItem,aIndex) in item.analysis.split('\n')">{{aItem}}</p>
            </div>
          </div>
          <el-divider content-position="right">{{item.createTime | datetime}}</el-divider>
        </div>
      </div>
    </div>
    <div class="index-side">
      <div class="index-side-temp">
        <div class="temp">
          <div class="temp-content">
            <img src="@/assets/test.png">
          </div>
          <div class="temp-review" v-if="isTemp">
            <div class="item" :key="lIndex" v-for="(lans,lIndex) in questionTypes">
              <span class="item-label">{{lans[0].languageTypeName}}题数</span>
              <span class="item-value">{{lans.length}}</span>
            </div>
            <div class="operate">
              <span @click="createTemp" class="blue">创建模板</span>
              <span class="operate-cut">|</span>
              <span class="red" @click="delTemp">移除模板</span>
            </div>
          </div>
        </div>
        <div class="temp-separate"></div>
      </div>
      <div class="index-side-user">
        <header class="index-side-user-header">🎖️出题榜</header>
        <ul class="index-side-user-list">
          <li class="author" :key="aIndex" v-for="(au,aIndex) in authors">
            <div class="author-avatar" :style="{backgroundImage:au.avatar}"></div>
            <div class="author-info">
              <div class="author-nickname">{{au.nickname}}</div>
              <div class="author-sum">{{au.sum}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="创建模板" :visible.sync="isCreateTemp" custom-class="index-create">
      <el-form ref="createForm" :rules="rules" :model="createForm" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.title" placeholder="试题模板名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="modelType">
          <el-select v-model="createForm.modelType" placeholder="请选择模板类型">
            <el-option
              v-for="(t,tindex) in tempTypes"
              :key="tindex"
              :label="t.modelTypeName"
              :value="t.modelType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答卷时限">
          <el-input type="number" min="1" v-model="createForm.limitTime" placeholder="默认30分钟">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效时间" prop="effectiveTime">
          <el-date-picker
            type="date"
            placeholder="选择有效时间，默认三天有效期"
            v-model="createForm.effectiveTime"
            style="width: 100%;"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCreateTemp = false">取 消</el-button>
        <el-button type="primary" @click="saveTemp('createForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import filters from "@/common/filter";
export default {
  data() {
    return {
      classes: [
        { name: "最热", key: "hot" },
        { name: "最新", key: "new" },
        { name: "经典", key: "classic" }
      ],
      tempTypes: [],
      activeClass: "hot",
      questions: [],
      isTemp: false, //是否展示临时模板
      template: {
        //模板
        temps: [],
        ids: []
      },
      isCreateTemp: false, //创建模板
      createForm: {
        // 创建模板入参
        ids: []
      },
      rules: {
        // 创建模板校验
        title: [
          { required: true, message: "请填写模板标题", trigger: "change" }
        ],
        modelType: [
          { required: true, message: "请选择模板类型", trigger: "change" }
        ],
        effectiveTime: [
          { required: true, message: "请填写有效时间", trigger: "change" }
        ]
      },
      authors: [
        {
          nickname: "山归有雾",
          sum: 119,
          avatar:
            "url(https://user-gold-cdn.xitu.io/2019/9/24/16d60e5236f8dde5?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1)"
        },
        {
          nickname: "起风了",
          sum: 76,
          avatar:
            "url(https://user-gold-cdn.xitu.io/2019/12/11/16ef430dc7eac77d?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1)"
        }
      ]
    };
  },
  computed: {
    questionTypes() {
      return filters.groupByField(this.template.temps, "languageTypeName");
    }
  },
  created() {
    this.list();
    this.modelTypes();
  },
  methods: {
    changeTab(item) {
      this.activeClass = item.key;
    },
    viewAnalysis(item, index) {
      this.$set(item, "isAnalysis", !item.isAnalysis);
    },
    list() {
      let params = {
        offset: 1,
        limit: 1000,
        sort: "DESC",
        order: "problemType",
        languageTypeId: "2"
      };
      this.$axios.post(this.$api.question.list, params).then(res => {
        if (res.code == 200) {
          this.questions = res.result.content.filter(
            n => n.status == "available"
          );
          //总条数
          this.record = res.result.totalElements;
        }
      });
    },
    edit(item) {
      this.$router.push({
        path: "/index-add",
        query: { id: item.uuid }
      });
    },
    del(item) {
      this.$confirm("你确定删除当前试题吗?", "删除").then(() => {
        this.$http
          .post(this.$api.question.del, { ids: [item.uuid] })
          .then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.list();
            } else {
              this.$message.error("删除失败");
            }
          });
      });
    },
    addTemp(item) {
      this.isTemp = true;
      this.template.temps.push(item);
      this.template.ids.push(item.uuid);
      this.calcMarginTop();
    },
    calcMarginTop() {
      this.$nextTick(() => {
        let tempDom = document.getElementsByClassName("index-side-temp")[0];
        let userDom = document.getElementsByClassName("index-side-user")[0];
        userDom.style.marginTop = `${tempDom.offsetHeight}px`;
      });
    },
    removeItem(item) {
      let index = this.template.ids.indexOf(item.uuid);
      if (index != -1) {
        this.template.temps.splice(index, 1);
        this.template.ids.splice(index, 1);
      }
      if (this.template.temps.length == 0) {
        this.isTemp = false;
      }
      this.calcMarginTop();
    },
    delTemp() {
      this.isTemp = false;
      this.template = {
        title: "",
        modelType: "",
        effectiveTime: "",
        ids: [],
        temps: []
      };
    },
    createTemp() {
      this.isCreateTemp = true;
      this.createForm = {
        limitTime:30,
        // 创建模板入参
        ids: []
      };
    },
    modelTypes() {
      this.$axios.post(this.$api.template.types).then(res => {
        if (res.code == 200) {
          this.tempTypes = res.result;
        }
      });
    },
    saveTemp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createForm.ids = this.template.ids;
          this.$axios
            .post(this.$api.template.add, this.createForm)
            .then(res => {
              if (res.code == 200) {
                this.$message.success("创建模板成功");
                this.isCreateTemp = false;
                this.$router.push("/template");
              } else {
                this.$message.error("创建模板失败");
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
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.index {
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
  }
  &-content {
    background: #fff;
    font-size: 13px;
    border-radius: 2px;
    width: 645px;
    .item {
      text-align: left;
      &-topic {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        &-operate {
          .red {
            cursor: pointer;
            padding: 10px;
          }
          .blue {
            cursor: pointer;
            padding: 10px;
          }
        }
      }
      &-option {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        &-content {
          .row {
            white-space: pre-wrap;
          }
          margin-bottom: 8px;
          .option {
            display: flex;
            .letter {
              width: 20px;
            }
          }
        }
        &-operate {
          margin-top: 16px;
          align-items: center;
          display: flex;
          .el-tag {
            margin-right: 8px;
          }
          .operate-btns {
            margin-left: auto;
          }
        }
        &-desc {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          opacity: 0.45;
          padding: 5px 2px;
          &-used {
            padding-right: 8px;
          }
          &-view {
            cursor: pointer;
            padding: 0 12px;
          }
        }
        &-analysis {
          margin-top: 12px;
          .content {
          }
        }
      }
      .el-divider {
        .el-divider__text {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
  &-side {
    width: 18rem;
    margin-left: 12px;
    overflow: hidden;
    &-temp {
      z-index: 1;
      position: fixed;
      width: 216px;
      background: #fff;
      .temp {
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .red {
          cursor: pointer;
          float: right;
        }
        &-content {
          min-height: 120px;
          @extend .flex-center;
          img {
            width: 80%;
          }
        }

        &-review {
          padding: 12px;
          .item {
            font-size: 13px;
            display: flex;
            padding: 0 12px 6px 12px;
            justify-content: space-between;
            &-label {
              opacity: 0.6;
            }
            &-value {
            }
          }
          .operate {
            display: flex;
            justify-content: center;
            span {
              cursor: pointer;
              padding: 10px;
            }
            &-cut {
              cursor: default;
              opacity: 0.6;
            }
          }
        }
        &-separate {
          height: 12px;
          background-color: #f4f5f5;
        }
      }
    }
    &-user {
      min-height: 400px;
      margin-top: 210px;
      background: #fff;
      &-header {
        padding: 1rem 1.3rem;
        border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
      }
      &-list {
        .author {
          padding: 1rem 1.3rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          &-avatar {
            display: inline-block;
            position: relative;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            background-color: #eee;
            flex: 0 0 auto;
            width: 3.8rem;
            height: 3.8rem;
            border-radius: 50%;
            margin-right: 0.8rem;
          }
          &-info {
          }
          &-nickname {
            font-size: 1.16rem;
            font-weight: 400;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 3px;
          }
          &-sum {
            color: #909090;
            font-size: 1rem;
            margin-bottom: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  &-create{
    .el-select{
      width:100%;
    }
  }
}
</style>

