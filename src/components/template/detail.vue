<template>
  <div class="tempdetail">
    <div class="tempdetail-model" id="printModel">
      <div>
        <div class="tempdetail-header">
          <div class="tempdetail-header-title">{{detail.title}}</div>
          <div
            class="tempdetail-header-desc"
          >共{{detail.subjectSet && detail.subjectSet.length}}题 作者：{{detail.author}}</div>
        </div>
        <div class="tempdetail-content" id="printer-span">
          <div class="topic" v-for="(t,index) in detail.subjectSet" :key="index">
            <div class="topic-title">
              <div class="" v-if="t.title.split('\n').length == 1">
                <p v-for="(p,pindex) in t.title.split('\n')" :key="pindex">
                  {{pindex == 0 ? `${index + 1}. `:''}}{{p}}
                  <span
                    class="answer"
                    v-if="t.problemType == 1 && isShowAnswer && pindex == t.title.split('\n').length - 1"
                  >( {{detail.answerSet[index].correctOptionGroup.join(" ")}} )</span>
                </p>
              </div>
              <div class="" v-else>
                <p>{{`${index + 1}. `}}</p>
                <p v-for="(p,pindex) in t.title.split('\n')" :key="pindex">
                  {{p}}
                  <span
                    class="answer"
                    v-if="t.problemType == 1 && isShowAnswer && pindex == t.title.split('\n').length - 1"
                  >( {{detail.answerSet[index].correctOptionGroup.join(" ")}} )</span>
                </p>
              </div>
            </div>
            <div class="topic-options">
              <el-radio-group v-model="detail.answerSet[index].answer" v-if="isDo">
                <div
                  v-if="t.problemType == 1"
                  class="topic-options-item"
                  v-for="(o,oindex) in t.optionGroup"
                  :key="oindex"
                >
                  <el-radio :label="o.key">
                    <span class="letter">{{o.key}}.</span>
                    <span>{{o.value}}</span>
                  </el-radio>
                </div>
              </el-radio-group>
              <div
                v-if="t.problemType == 1 && !isDo"
                class="topic-options-item"
                v-for="(o,oindex) in t.optionGroup"
                :key="oindex"
              >
                <span class="letter">{{o.key}}.</span>
                <span>{{o.value}}</span>
              </div>
              <div class="topic-options-answer" v-if="t.problemType == 2">
                <p
                  class="row"
                  v-if="detail.answerSet[index].correctOptionGroup && isShowAnswer && !isDo"
                  v-for="(c,cindex) in detail.answerSet[index].correctOptionGroup.split('\n')"
                  :key="cindex"
                >{{c}}</p>
                <el-input
                  placeholder="请填写你的答案"
                  type="textarea"
                  v-if="isDo"
                  v-model="detail.answerSet[index].answer"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tempdetail-side">
      <div class="tempdetail-side-operates">
        <div class="tempdetail-side-operates-content">
          <img src="@/assets/teaching.png">
        </div>
        <div class="tempdetail-side-operates-review">
          <div class="item" :key="lIndex" v-for="(lans,lIndex) in questionTypes">
            <span class="item-label">{{lans[0].languageTypeName}}题数</span>
            <span class="item-value">{{lans.length}}</span>
          </div>
          <div class="operate">
            <span :class="[{'disabled':isDo},'blue']" v-print="'#printModel'">打印试题</span>
            <span :class="[{'disabled':isDo},'operate-cut']">|</span>
            <span :class="[{'disabled':isDo},'green']" @click="download">下载PDF</span>
            <span :class="[{'disabled':isDo},'operate-cut']">|</span>
            <span
              :class="[{'disabled':isDo},'orange']"
              @click="viewAnswer"
            >{{isShowAnswer?"隐藏答案":"查询答案"}}</span>
          </div>
        </div>
      </div>
      <div class="tempdetail-side-info">
        <div class="tempdetail-side-info-content">
          <img src="@/assets/exams.png">
        </div>
        <div class="timing" v-if="isDo">
          <span>距离结束</span>
          <span>{{timeMsg}}</span>
        </div>
        <div class="operate">
          <span class="blue" v-if="!isDo" @click="startDo">开始答题</span>
          <span class="orange" v-if="isDo" @click="restartDo">重新开始</span>
          <span class="operate-cut" v-if="isDo">|</span>
          <span class="green" @click="endDo" v-if="isDo">提前交卷</span>
        </div>
        <div class="result">
          <!-- 只统计选择题 -->
          <div class="result-item" v-if="isDone">
            <div class="result-index"></div>
            <div class="result-correct">正确选项</div>
            <div class="result-myTitle">我的选项</div>
          </div>
          <div
            class="result-item"
            :key="rIndex"
            v-for="(rItem,rIndex) in detail.answerSet"
            v-if="rItem.problemType == 1 && isDone"
          >
            <div class="result-index">{{rIndex + 1}}</div>
            <div
              class="result-correct"
            >{{Array.isArray(rItem.correctOptionGroup)?rItem.correctOptionGroup.join(","):rItem.correctOptionGroup}}</div>
            <div
              :class="[{'red':!rItem.answer || rItem.doStatus == 'wrong','green':rItem.doStatus == 'right'},'result-my']"
            >{{rItem.answer?(Array.isArray(rItem.answer)?rItem.answer.join(","):rItem.answer):"未作答"}}</div>
          </div>
          <div class="result-collect" v-if="isDone">
            选择题一共
            <span class="blue">{{detail.answerSet.filter(a=>a.problemType == 1).length}}</span>
            道,答对
            <span
              class="green"
            >{{detail.answerSet.filter(a=>a.problemType == 1 && a.doStatus == "right").length}}</span>
            道
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Watermark from "@/common/watermark";
import filters from "@/common/filter";
import jsPDF from "jsPDF";
import html2Canvas from "html2canvas";
export default {
  data() {
    return {
      detail: {},
      isShowAnswer: false,
      isDo: false,
      isDone: false,
      maxtime: 1800,
      timer: null,
      timeMsg: ""
    };
  },
  computed: {
    questionTypes() {
      // return filters.groupByField(this.detail.subjectSet, "languageTypeName");
      return [];
    }
  },
  created() {},
  mounted() {
    this.info().then(() => {
      //   Watermark.set("XuanWoData", "printModel");
    });
  },
  methods: {
    startDo() {
      this.isDo = true;
      //开始倒计时
      this.restartDo();
    },
    endDo() {
      this.$confirm("你确定提前交卷吗?", "温馨提示").then(res => {
        this.isDo = false;
        this.isDone = true;
        this.statistics();
        clearInterval(this.timer);
      });
    },
    statistics() {
      this.detail.answerSet.forEach((item, index) => {
        //选择题
        if (this.detail.subjectSet[index].problemType == 1) {
          //多选
          if (Array.isArray(item.answer)) {
          } else {
            //单选
            if (item.answer == item.correctOptionGroup[0]) {
              this.$set(item, "doStatus", "right");
            } else {
              this.$set(item, "doStatus", "wrong");
            }
          }
        }
      });
    },
    toTiming() {
      this.isDone = false;
      this.maxtime = 1800;
      //清理上一个计时
      if (this.timer) {
        clearInterval(this.timer);
      }
      //开始倒计时
      this.timer = setInterval(this.countDown, 1000);
    },
    restartDo() {
      this.detail.answerSet.forEach(item => {
        this.$set(item, "answer", "");
      });
      this.toTiming();
    },
    countDown() {
      if (this.maxtime >= 0) {
        let minutes = Math.floor(this.maxtime / 60);
        let seconds = Math.floor(this.maxtime % 60);
        if (minutes < 10) {
          seconds = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        this.timeMsg = minutes + ":" + seconds;
        if (this.maxtime == 5 * 60) {
          this.$notify({
            title: "温馨提示",
            message: "距离答题结束还有五分钟",
            type: "warning"
          });
        }
        --this.maxtime;
      } else {
        this.endDo();
      }
    },
    download() {
      let dom = document.getElementById("printModel");
      html2Canvas(dom).then(canvas => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        //页面偏移
        let position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;
        let imgHeight = (595.28 / contentWidth) * contentHeight;

        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF("", "pt", "a4");

        //放大会清晰一点
        pdf.internal.scaleFactor = 2;
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, "JPEG", 20, 40, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(
              pageData,
              "JPEG",
              20,
              position + 40,
              imgWidth,
              imgHeight
            );
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save(
          `${this.detail.title}${this.isShowAnswer ? "(含答案)" : ""}.pdf`
        );
      });
    },
    info() {
      return this.$axios
        .post(this.$api.template.info, { id: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {
            this.detail = res.result;
          } else {
            this.$message.error("查询失败");
          }
        });
    },
    viewAnswer() {
      this.isShowAnswer = !this.isShowAnswer;
    }
  }
};
</script>

<style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 8mm; /* this affects the margin in the printer settings */
}
</style>

<style lang="scss">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tempdetail {
  display: flex;
  padding: 1.5rem 2rem;
  &-model {
    position: relative;
    padding: 20px;
    background: #fff;
    min-height: 400px;
    width: 645px;
  }

  &-header {
    &-title {
      text-align: center;
      font-weight: 600;
      font-size: 18px;
      padding: 5px;
    }
    &-desc {
      text-align: right;
      opacity: 0.45;
      font-size: 12px;
      padding-bottom: 10px;
    }
  }

  &-content {
    position: relative;
    padding: 0 20px;
    font-size: 13px;
    .el-radio {
      margin-right: 0;
    }
    .topic {
      text-align: left;
      &-title {
        font-weight: 600;
        padding: 10px 0;
        .answer {
          margin-left: 16px;
        }
      }
      &-options-answer {
        min-height: 50px;
        .row {
          white-space: pre-wrap;
        }
      }
      &-options-item {
        margin-bottom: 8px;
        .letter {
          width: 20px;
          display: inline-block;
        }
      }
    }
  }

  &-remark {
    position: fixed;
    top: 120px;
    right: 50px;
  }

  &-side {
    width: 18rem;
    margin-left: 12px;
    &-operates {
      background: #fff;
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
            padding: 10px 3px;
            &.disabled {
              pointer-events: none;
              filter: alpha(opacity=50); /*IE滤镜，透明度50%*/
              -moz-opacity: 0.5; /*Firefox私有，透明度50%*/
              opacity: 0.5; /*其他，透明度50%*/
            }
          }
          &-cut {
            cursor: default;
            opacity: 0.6;
          }
        }
      }
    }
    &-info {
      margin-top: 12px;
      background: #fff;
      &-content {
        @extend .flex-center;
        img {
          width: 80%;
        }
      }
      .timing {
        @extend .flex-center;
        font-weight: 600;
        padding: 0.5rem 1rem;
        span {
          margin-right: 5px;
        }
      }
      .operate {
        display: flex;
        justify-content: center;
        padding: 0 1rem;
        &-cut {
          cursor: default;
          opacity: 0.6;
        }
        span {
          cursor: pointer;
          padding: 10px 3px;
        }
      }
      .result {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        &-item {
          display: flex;
          flex-direction: row;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(220, 223, 230, 0.5);
        }
        &-index {
          flex: 1;
        }
        &-correct {
          flex: 2;
        }
        &-my {
          font-weight: 600;
          flex: 2;
        }
        &-myTitle {
          flex: 2;
        }
        &-collect {
          padding: 0.5rem 0;
          span {
            font-weight: 600;
            padding: 5px;
          }
        }
      }
    }
  }
}
</style>


