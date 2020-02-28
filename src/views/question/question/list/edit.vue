<template>
  <!--<div class="app-container">-->
  <!--题目信息表单-->
  <el-dialog
    id="dialogEdit"
    width="70%"
    height="500px"
    :visible.sync="modalShow"
    :title="text"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules1" label-width="100px">
      <el-row>
        <el-col :span="24" v-if="form.typeId != 7">
          <el-form-item label="题目内容" prop="stem">
            <el-input :autosize="{ minRows: 2, maxRows: 6}" v-model="form.stem" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="题型" prop="typeId">
            <el-select v-model="form.typeId" placeholder="请选择题目类型" @change="getQuestionType">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="题目难度" prop="difficulty">
            <el-rate
              v-model="form.difficulty"
              :max="4"
              :texts="['简单', '中等', '复杂', '极难']"
              show-text
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="题目分值" prop="score">
            <el-input v-model="form.score" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-for="(item, index) in singleArray"
        v-if="form.typeId === 1 || form.typeId ===  2 || form.typeId ===  3"
        :key="index"
      >
        <el-col :span="20">
          <el-form-item :label="'选项'+ letterArray[index]">
            <el-input
              :autosize="{ minRows: 2, maxRows: 6}"
              v-model="singleArray[index]"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <button
          v-if="singleArray.length > 2 && form.typeId === 1"
          @click="optionDel(letterArray[index])"
        >-</button>
        <button
          v-if="singleArray.length > 4 && form.typeId === 2"
          @click="optionDel(letterArray[index])"
        >-</button>
        <button v-if="letterArray.length > singleArray.length" @click="optionAdd">+</button>
      </el-row>

      <el-row v-if="form.typeId !== 7">
        <el-col :span="24">
          <el-form-item label="题目答案" prop="answer">
            <!-- 非选择 -->
            <el-input
              v-if="form.typeId !== 1 && form.typeId !== 2 && form.typeId !==3 && form.typeId !== 4"
              :autosize="{ minRows: 2, maxRows: 6}"
              v-model="form.answer"
              type="textarea"
            />
            <!-- 选择题 -->
            <el-radio-group v-if="form.typeId === 1" v-model="form.answer">
              <el-radio
                v-for="(item, index) in singleArray"
                :key="index"
                :label="letterArray[index]"
              >{{ letterArray[index] }}</el-radio>
            </el-radio-group>
            <!-- 多选题 -->
            <el-checkbox-group v-if="form.typeId === 2 || form.typeId === 3" v-model="checkArray">
              <el-checkbox
                v-for="(item, index) in singleArray"
                :key="index"
                :value="index"
                :label="letterArray[index]"
              >{{ letterArray[index] }}</el-checkbox>
            </el-checkbox-group>
            <!-- 判断题 -->
            <el-radio-group v-if="form.typeId === 4" v-model="form.answer">
              <el-radio :label="'true'">正确</el-radio>
              <el-radio :label="'false'">错误</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.typeId !== 7">
        <el-col :span="24">
          <el-form-item label="题目解析" prop="analysis">
            <el-input
              :autosize="{ minRows: 2, maxRows: 6}"
              v-model="form.analysis"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="color: red">
          提示文字：1.需填空内容请用下划线____或括弧（）表示，示例：七夕节又叫____？年三十又叫____？
          <br />2.同个填空多个参考答案用竖线 “| ” 分隔，不同填空答案用 “ $” 分隔，示例：乞巧节|情人节$除夕
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ ('取消') }}</el-button>
      <el-button type="primary" v-if="text=='新增'" @click="submit">{{ ('新增') }}</el-button>
      <el-button type="primary" v-if="text=='编辑'" @click="submit">{{ ('修改') }}</el-button>
    </div>
  </el-dialog>
  <!--</div>-->
</template>
<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  getCourseList,
  getLessonList,
  getAllQuestion
} from "@/api/question/question";

export default {
  props: {
    title: String,
    showModal: Boolean,
    rowId: String,
    courseId: String,
    lessonId: String,
    year: String,
    questionType: String,
    parentId: String
  },
  data() {
    return {
      text: "",
      modalShow: false,
      courseList: [],
      lessonList: [],
      typeList: [],
      questionDifficulty: [],
      singleArray: ["", "", "", ""],
      letterArray: ["A", "B", "C", "D", "E", "F", "G"],
      checkArray: [],
      form: {
        stem: "",
        typeId: "",
        difficulty: 1,
        score: "",
        courseId: null,
        lessonId: null,
        answer: "",
        analysis: "",
        optionsContent: "",
        questionType: null,
        parentId: null
      },
      rules1: {
        stem: [
          { required: true, message: "请输入题目内容", triggle: "change" }
        ],
        typeId: [
          {
            required: true,
            type: "number",
            message: "请选择题目类型",
            triggle: "change"
          }
        ],
        courseId: [
          {
            required: true,
            type: "number",
            message: "请选择所属课程",
            triggle: "change"
          }
        ]
      },
      subjectFormStatus: ""
    };
  },
  created() {
    this.getCourseList();
    this.getQuestionType();
  },
  methods: {
    handleChange(val) {},
    optionAdd() {
      if (this.singleArray.length < this.letterArray.length) {
        this.singleArray.push("");
      }
    },
    optionDel(index) {
      this.singleArray.splice(index, 1);
    },
    handleClose() {
      this.$emit("hide-modal");
      this.$refs.form.resetFields();
      this.singleArray = ["", "", "", ""];
    },
    getCourseList() {
      getCourseList().then(res => {
        this.courseList = res.data;
      });
    },
    getLessonList() {
      getLessonList(this.form.courseId).then(res => {
        this.lessonList = res.data;
      });
    },
    getQuestionType() {
      getAllQuestion().then(res => {
        this.typeList = res.data;
      });
    },
    // 重置
    reset() {
      this.$refs.form.resetFields();
      this.singleArray = ["", "", "", ""];
    },
    // 提交
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {};
          if (
            this.form.typeId == 1 ||
            this.form.typeId == 2 ||
            this.form.typeId == 3
          ) {
            let optionsContent = [];
            for (let i = 0; i < this.singleArray.length; i++) {
              let content = {
                name: this.letterArray[i],
                content: this.singleArray[i]
              };
              optionsContent.push(content);
            }
            let jsonstr = JSON.stringify(optionsContent);
            this.form.optionsContent = jsonstr;
            let checkAnswer = [];
            if (this.form.typeId == 2 || this.form.typeId == 3) {
              for (let i = 0; i < this.checkArray.length; i++) {
                checkAnswer.push(this.checkArray[i]);
              }
              let jsonAnswer = JSON.stringify(checkAnswer);
              this.form.answer = jsonAnswer;
            }
          }
          if (this.text === "新增") {
            Object.assign(params, this.form);
            this.addObj(params);
          } else {
            Object.assign(params, this.form);
            this.putObj(params);
          }
        }
      });
    },
    addObj(params) {
      addObj(params).then(res => {
        this.$message({
          message: "新增成功",
          type: "success"
        });
        this.$emit("add-success");
        this.$refs.form.resetFields();
        this.singleArray = ["", "", "", ""];
      });
    },
    getObj(id) {
      getObj(id).then(res => {
        this.form = res.data.data;
        let json = JSON.parse(res.data.data.optionsContent);
        let type = res.data.data.typeId;
        if (type == 2) {
          if (json == null || json == "") {
            this.checkArray = [];
          } else {
            this.checkArray = JSON.parse(res.data.data.answer);
          }
        }
        if (type == 1 || type == 2 || type == 3) {
          if (json == null || json == "") {
            this.singleArray = ["", "", "", ""];
          } else {
            this.singleArray = [];
            for (let i = 0; i < json.length; i++) {
              this.singleArray.push(json[i].content);
            }
          }
        }
      });
    },
    putObj(params) {
      putObj(Object.assign(params, { id: this.id })).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.$emit("add-success");
        this.$refs.form.resetFields();
        this.singleArray = ["", "", "", ""];
      });
    }
  },
  watch: {
    title(newVal, oldVal) {
      this.text = newVal;
    },
    showModal(newVal, oldVal) {
      this.modalShow = newVal;
    },
    rowId(newVal, oldVal) {
      if (newVal.indexOf(":") != -1) {
        this.id = Number(newVal.substring(0, newVal.indexOf(":")));
      } else {
        this.id = Number(newVal);
      }
      this.getObj(this.id);
    },
    year(newVal, oldVal) {
      if (newVal) {
        this.form.year = newVal;
      }
    },
    parentId(newVal, oldVal) {
      if (newVal) {
        this.form.parentId = newVal;
      }
    },
    courseId(newVal, oldVal) {
      if (newVal) {
        this.form.courseId = newVal;
      }
    },
    lessonId(newVal, oldVal) {
      if (newVal) {
        this.form.lessonId = newVal;
      }
    },
    questionType(newVal, oldVal) {
      if (newVal) {
        this.form.questionType = newVal;
      }
    }
  }
};
</script>
