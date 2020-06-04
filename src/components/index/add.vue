<template>
    <div class="createTest">
        <div class="left"></div>
        <div class="center">
            <el-form
                :model="testForm"
                :rules="rules"
                ref="testForm"
                label-width="120px"
                class="testForm"
            >
                <el-form-item label="试题题目" prop="title">
                    <el-input
                        maxlength="300"
                        show-word-limit
                        type="textarea"
                        v-model="testForm.title"
                        placeholder="请输入试题"
                    ></el-input>
                </el-form-item>
                <el-form-item class="question-type" label="题目类型" prop="problemType">
                    <el-radio-group v-model="testForm.problemType">
                        <el-radio :label="1">选择题</el-radio>
                        <el-radio :label="2">非选择题</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="testForm-options" v-if="testForm.problemType == 1">
                    <el-form-item
                        v-for="(selectItem,sIndex) in testForm.optionGroup"
                        :key="sIndex"
                        :label="`${selectItem.key}选项`"
                        :prop="`optionGroup.${sIndex}.value`"
                        :rules="{required: true, message: '选项不能为空',}"
                    >
                        <div>
                            <el-input v-model="selectItem.value"></el-input>
                        </div>
                        <div class="selectItem-operate">
                            <span
                                v-if="sIndex == (testForm.optionGroup.length -1) "
                                class="add blue el-icon-circle-plus-outline"
                                @click="addOption(sIndex)"
                            ></span>
                            <i
                                v-if="sIndex == (testForm.optionGroup.length -1) && sIndex != 0"
                                @click="delOption(sIndex)"
                                class="del red el-icon-circle-close"
                            ></i>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item
                    v-if="testForm.problemType == 1"
                    label="设置正确选项"
                    prop="correctOptionGroup"
                    class="correctOption"
                    :rules="{required: true, message: '正确选项不能为空',}"
                >
                    <el-select v-model="testForm.correctOptionGroup" multiple placeholder="请选择">
                        <el-option
                            v-for="item in testForm.optionGroup"
                            :key="item.key"
                            :label="item.key"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="testForm.problemType == 2"
                    :rules="{required: true, message: '正确答案不能为空',}"
                    label="正确答案"
                    prop="correctOptionGroup"
                >
                    <el-input
                        maxlength="600"
                        show-word-limit
                        type="textarea"
                        v-model="testForm.correctOptionGroup"
                        placeholder="请输入此题正确答案"
                        class="text-area"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分析答疑" prop="analysis">
                    <el-input
                        maxlength="600"
                        show-word-limit
                        type="textarea"
                        v-model="testForm.analysis"
                        placeholder="请输入此题考查知识点，考查目的"
                        class="text-area"
                    ></el-input>
                </el-form-item>
                <el-form-item label="分类标签">
                    <el-input class="" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                    <el-tree
                        ref="vuetree"
                        node-key="id"
                        :data="tree"
                        :props="defaultProps"
                        :default-expand-all="true"
                        accordion
                        @node-click="nodeClick"
                        :highlight-current="true"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                    ></el-tree>
                </el-form-item>
                <el-form-item class="operate-btns">
                    <el-button type="primary" @click="save('testForm')">{{isEdit?"修改":"立即创建"}}</el-button>
                    <el-button @click="toList">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="right"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: "",
      rules: {
        title: [{ required: true, message: "请输入试题题目" }],
        problemType: [{ required: true, message: "请选择题目类型" }],
        analysis: [{ required: true, message: "请输入分析答疑" }]
      },
      testForm: {
        optionGroup: [
          { key: "A", value: "" },
          { key: "B", value: "" },
          { key: "C", value: "" },
          { key: "D", value: "" }
        ],
        frameworkId: "",
        problemType: 1, // 1选择题 2非选择题
        correctOptionGroup: [],
        questionType: "" // 题类型
      },
      tree: [],
      isEdit: false,
      defaultProps: {
        children: "childrenTree",
        label: "name"
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.vuetree.filter(val);
    }
  },
  created() {
    this.labelTree().then(() => {
      if (this.$route.query.id) {
        this.isEdit = true;
        this.info();
      }
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    info() {
      this.$axios
        .post(this.$api.question.info, { id: this.$route.query.id })
        .then(res => {
          if (res.code == 200) {
            this.testForm = res.result;
            this.$nextTick(() => {
              this.$refs.vuetree.setCurrentKey(
                this.testForm.frameworkId || this.testForm.languageTypeId
              ); //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
            });
          }
        });
    },
    labelTree() {
      return this.$axios.post(this.$api.question.labelTree).then(res => {
        if (res.code == 200) {
          this.tree = [res.result];
        }
      });
    },
    nodeClick(data, node) {
      let level = node.level;
      if (level == 3) {
        this.testForm.frameworkId = data.id;
        this.testForm.languageTypeId = data.parentid;
      } else if (level == 2) {
        this.testForm.frameworkId = "";
        this.testForm.frameworkName = "";
        this.testForm.languageTypeId = data.id;
      }
    },
    toList() {
      this.$router.push("/index");
    },
    addOption(index) {
      this.testForm.optionGroup.push({
        key: String.fromCharCode(index + 66),
        value: ""
      });
    },
    delOption(index) {
      this.testForm.optionGroup.splice(index, 1);
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.testForm.languageTypeId) {
            this.$message.warning("请选择一种语言技术标签");
            return;
          }
          let url = this.isEdit
            ? this.$api.question.update
            : this.$api.question.add;
          if (this.testForm.uuid) {
            this.testForm.id = this.testForm.uuid;
          }
          this.$axios.post(url, this.testForm).then(res => {
            let msg = this.isEdit ? "修改" : "出题";
            if (res.code == 200) {
              this.$message.success(`${msg}成功`);
              this.toList();
            } else {
              this.$message.error(res.msg || `${msg}失败`);
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
.createTest {
  .el-input__inner {
    width: 395px;
  }
  background-color: #fff;
  padding: 16px;
  display: flex;
  .left {
    flex: 2;
  }
  .center {
    flex: 5;
    .testForm {
      .el-tree {
        height: 200px;
        border: 1px solid #eeeeee;
        overflow-y: auto;
      }
      .question-type {
        text-align: left;
        .el-radio-group {
          padding-left: 20px;
        }
      }
      .correctOption {
        .el-form-item__content {
          text-align: left;
        }
      }
      .text-area {
        textarea {
          min-height: 150px !important;
        }
      }
      &-options {
        .el-form-item__content {
          display: flex;
          align-items: center;
          .selectItem-operate {
            display: flex;
            justify-content: center;
            margin-right: -54px;
            .add {
              font-size: 16px;
              cursor: pointer;
              margin-left: 12px;
            }
            .del {
              margin-left: 10px;
              font-size: 16px;
              cursor: pointer;
            }
          }
        }
      }
      .operate-btns {
        text-align: center;
      }
    }
  }
  .right {
    flex: 2;
  }
}
</style>


