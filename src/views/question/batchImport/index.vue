
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: lj
 * @LastEditTime: 2020-03-20 10:09:53
 * @Description: 批量录入

<template>
  <div class="app-container calendar-list-container">
    <!--    <el-tabs v-model="activeName" type="border-card">-->
    <!--      <el-tab-pane label="批量录入" name="first">-->
    <div class="tab-content">
      <form id="subForm1" name="form" action="" method="post">
        <div class="batch-import-top">
          <div style="margin-right: 1px">选择课程：</div>
          <el-dropdown split-button type="primary" size="mini" style="margin-right: 20px" @command="handleCommand">
            {{ courseName }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in courseList" :key="index" :command="{id:item.id,title:item.title}">{{ item.title }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="margin-right: 1px">选择题目题型：</div>
          <el-dropdown split-button type="primary" size="mini" style="margin-right: 20px" @command="handleQuestionType">
            {{ questionTypeName }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in questionType" :key="index" :command="{id:item.value,label:item.label}">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="margin-right: 1px">题目分值：</div>
          <el-input v-model="score" placeholder="请输入题目分值" type="number" style="width: 100px" />
          <el-button id="importBtn" type="primary" size="mini" style="margin-left: auto;">录入</el-button>
        </div>
        <div id="inputArea" class="batch-cont">
          <div class="addQuestion4" />
          <div class="batch-input clearfix">
            <div class="batch-input-box">
              <div class="toolbar"><span class="title">输入区：</span>

                <div class="toolbar-right">
                  <span id="showExample" class="example" @click="changeFanLiIcon">输入范例</span>
                  <i :class="fanLiIcon" style="font-size: 12px;margin-right: 20px;" />
                  <span id="showStandard" class="standard" @click="changeGuiFanIcon">输入规范 </span>
                  <i :class="guiFanIcon" style="font-size: 12px;" />
                </div>
              </div>
              <div id="qtExample">
                <div class="modal-body input-body">
                  <div class="input-example">
                    <div class="input-example-content">
                      <div class="input-example-question">
                        <p style="color: rgb(26, 140, 254); font-size: 14px; font-weight: 500; margin-bottom: 10px; margin-left: 0px;">
                          单选题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.驾驶人有下列哪种违法行为一次记6分</span><br>
                          <span>A、使用其他车辆行驶证</span><br>
                          <span>B、饮酒后驾驶机动车</span><br>
                          <span>C、车速超过规定时速50%以上</span><br>
                          <span>D、违法占用应急车道行驶</span><br>
                          <span>答案:D
                          </span><br>
                          <span>解析:请仔细阅读交规<span
                            class="txt-red"
                          >(若无解析本行可不填)</span></span><br>

                          <span>难度:简单</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; color: rgb(29, 200, 140); font-size: 14px; font-weight: 500;">
                          多选题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.驾驶人有下列哪种违法行为一次记6分？</span><br>
                          <span>A、使用其他车辆行驶证</span><br>
                          <span>B、饮酒后驾驶机动车</span><br>
                          <span>C、车速超过规定时速50%以上</span><br>
                          <span>D、违法占用应急车道行驶</span><br>
                          <span>答案:ABCD</span><br>
                          <span>解析:请仔细阅读交规
                            <span class="txt-red">(若无解析本行可不填)</span></span><br>
                          <span>难度:中等</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; color: rgb(247, 99, 119); font-size: 14px; font-weight: 500;">
                          判断题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.国际象棋起源于英国吗？</span><br>
                          <span>答案:对</span><br>
                          <span>解析:无
                            <span class="txt-red">(若无解析本行可不填)</span></span><br>
                          <span>难度:复杂</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; color: rgb(160, 106, 210); font-size: 14px; font-weight: 500;">
                          填空题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.我国古典四大名著是（）（）（）（）</span><br>
                          <span>答案:红楼梦&amp;&amp;石头记|水浒传|三国演义|西游记
                          </span><br>
                          <span>解析:无
                            <span class="txt-red">(若无解析本行可不填)</span></span><br>
                          <span>难度:简单</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; color: rgb(201, 163, 16); font-size: 14px; font-weight: 500;">
                          问答题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.请论述全球化对国家政治产生了哪些深刻的影响？</span><br>
                          <span>答案:全球化使国家主权受到一定的制约；全球化对政府的治理提出了更高的要求。</span><br>
                          <span>解析:无
                            <span class="txt-red">(若无解析本行可不填)</span></span><br>
                          <span>难度:极难</span><br>

                        </p>
                      </div>
                    </div>
                    <div class="input-example-content-top">
                      <div class="input-example-question">
                        <p style="color: rgb(26, 140, 254); font-size: 14px; margin-bottom: 10px; margin-left: 0px; visibility: hidden;">
                          单选题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.驾驶人有下列哪种违法行为一次记6分</span><br>
                          <span>A、使用其他车辆行驶证</span><br>
                          <span>B、饮酒后驾驶机动车</span><br>
                          <span>C、车速超过规定时速50%以上</span><br>
                          <span>D、违法占用应急车道行驶</span><br>
                          <span>答案:D
                          </span><br>
                          <span>解析:请仔细阅读交规<span
                            style="visibility: hidden;"
                          >(若无解析本行可不填)</span></span><BR
                            style="visibility: hidden;"
                          />
                          <span>难度:简单</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; visibility: hidden;">多选题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.驾驶人有下列哪种违法行为一次记6分？</span><br>
                          <span>A、使用其他车辆行驶证</span><br>
                          <span>B、饮酒后驾驶机动车</span><br>
                          <span>C、车速超过规定时速50%以上</span><br>
                          <span>D、违法占用应急车道行驶</span><br>
                          <span>答案:ABCD</span><br>
                          <span>解析:请仔细阅读交规
                            <span style="visibility: hidden;">(若无解析本行可不填)</span></span><BR style="visibility: hidden;" />
                          <span>难度:中等</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; visibility: hidden;">判断题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.国际象棋起源于英国吗？</span><br>
                          <span>答案:对</span><br>
                          <span>解析:无
                            <span style="visibility: hidden;">(若无解析本行可不填)</span></span><BR style="visibility: hidden;" />
                          <span>难度:复杂</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; visibility: hidden;">填空题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.我国古典四大名著是（）（）（）（）</span><br>
                          <span>答案:红楼梦&amp;&amp;石头记|水浒传|三国演义|西游记
                          </span><br>
                          <span>解析:无
                            <span style="visibility: hidden;">(若无解析本行可不填)</span></span><BR style="visibility: hidden;" />
                          <span>难度:简单</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; visibility: hidden;">问答题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.请论述全球化对国家政治产生了哪些深刻的影响？</span><br>
                          <span>答案:全球化使国家主权受到一定的制约；全球化对政府的治理提出了更高的要求。</span><BR
                            style="visibility: hidden;"
                          />
                          <span>解析:无
                            <span style="visibility: hidden;">(若无解析本行可不填)</span></span><BR style="visibility: hidden;" />
                          <span>难度:中等</span><br>

                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    id="continueOpen"
                    class="btn btn-default"
                    type="button"
                  ><span class="icon-a_d_arrow_down" /> 继续展开
                  </button>
                  <button
                    class="btn btn-default btn-close"
                    type="button"
                    @click="changeFanLiIcon('hide')"
                  ><span class="icon-a_d_arrow_up" /> 收起
                  </button>
                </div>
              </div>
              <div id="qtStandard">
                <div class="modal-body input-body">
                  <div class="input-rule">
                    <div class="input-rule-content">
                      <p
                        class="input-common-title"
                        style="color: rgb(26, 140, 254); font-weight: 500; margin-bottom: 10px; margin-left: -10px;"
                      >
                        输入规范</p>1、所有题型标号支持1.或1、或（1）三种格式。<br>2、所有题型必须含有
                      “ <span style="color: rgb(247, 99, 119);">答案：</span>”字段，且不能为空。<br>3、所有题型
                      “ <span
                        style="color: rgb(247, 99, 119);"
                      >解析：</span>”
                      字段非必需，没有可不填。<br>4、所有题型必须含有 “ <span
                        style="color: rgb(247, 99, 119);"
                      >难度：</span>”字段，且不能为空。<br>5、所有题型
                      “ <span style="color: rgb(247, 99, 119);">试题标签：</span>”
                      字段非必需，没有可不填。示例：地域/北京、年份/2019/三月<br>6、所有题型题目中包含图片，则将图片插入到指定位置即可。<br>7、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>最少支持2个选项A,B，最多支持8个选项A,B,C,D,E,F,G,H且按照顺序使用。<br>8、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>A-H这些选项号与内容之间要用、或
                      . 分开。<br>9、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>答案中请勿加分隔符或者空格。<br>10、<span
                        style="color: rgb(247, 99, 119);"
                      >判断题</span>答案支持
                      “错误”，“正确” 或者 “错”，“对”。<br>11、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>仅支持题目中出现括号。<br>12、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>目里的多个填空答案要用
                      | 分割，单个答案不用添加。<br>13、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>的填空答案支持输入同义词，用&amp;&amp;连接多个同义词答案。<br>14、<span
                        style="color: rgb(201, 163, 16);"
                      >问答题</span>可以包含
                      “普通关键词：” 和 “
                      核心关键词：”，没有可不填。<br>15、<span
                        style="color: rgb(201, 163, 16);"
                      >问答题</span>多个关键词用、去分隔，并列关键词（或的关系）用
                      |
                      去分隔。<br></div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-default btn-close" type="button"><span
                    class="icon-a_d_arrow_up"
                  /> 收起
                  </button>
                </div>
              </div>
              <div id="qtStandard1">
                <div class="modal-body input-body">
                  <div class="input-rule">
                    <div class="input-rule-content">
                      <p
                        class="input-common-title"
                        style="color: rgb(26, 140, 254); font-weight: 500; margin-bottom: 10px; margin-left: -10px;"
                      >
                        输入规范</p>1、所有题型标号支持1.或1、或（1）三种格式。<br>2、所有题型必须含有
                      “ <span style="color: rgb(247, 99, 119);">答案：</span>”字段，且不能为空。<br>3、所有题型
                      “ <span
                        style="color: rgb(247, 99, 119);"
                      >解析：</span>”
                      字段非必需，没有可不填。<br>4、所有题型必须含有 “ <span
                        style="color: rgb(247, 99, 119);"
                      >难度：</span>”字段，且不能为空。<br>5、所有题型题目中包含图片，则将图片插入到指定位置即可。<br>6、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>最少支持2个选项A,B，最多支持8个选项A,B,C,D,E,F,G,H且按照顺序使用。<br>7、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>A-H这些选项号与内容之间要用、或
                      . 分开。<br>8、<span
                        style="color: rgb(26, 140, 254);"
                      >选择题</span>答案中请勿加分隔符或者空格。<br>9、<span
                        style="color: rgb(247, 99, 119);"
                      >判断题</span>答案支持
                      “错误”，“正确” 或者 “错”，“对”。<br>10、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>仅支持题目中出现括号。<br>11、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>目里的多个填空答案要用
                      | 分割，单个答案不用添加。<br>12、<span
                        style="color: rgb(160, 106, 210);"
                      >填空题</span>的填空答案支持输入同义词，用&amp;&amp;连接多个同义词答案。<br>13、<span
                        style="color: rgb(201, 163, 16);"
                      >问答题</span>可以包含
                      “普通关键词：” 和 “
                      核心关键词：”，没有可不填。<br>14、<span
                        style="color: rgb(201, 163, 16);"
                      >问答题</span>多个关键词用、去分隔，并列关键词（或的关系）用
                      |
                      去分隔。<br></div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-default btn-close" type="button" @click="changeGuiFanIcon('hide')"><span
                    class="icon-a_d_arrow_up"
                  /> 收起
                  </button>
                </div>
              </div>
              <div
                id="text-input"
                class="box"
                style="white-space: pre-wrap !important;"
              />
            </div>
            <div class="batch-preview-box">
              <div class="toolbar"><span class="title">检查区：</span>
                <span id="errorText" class="error-text"><span
                  id="errorCount"
                  class="count"
                />处错误，请参照例题修改</span>
                <button id="nextError" class="btn btn-s-blue">下一处</button>
              </div>
              <div class="box">
                <div id="preview" />
              </div>
            </div>
            <div class="dialog-style-button" hidden="">
              <div class="body-toolbar-right toolbar-right-operation">
                <button
                  id="importButton"
                  class="btn btn-warning btn-size"
                  type="button"
                ><span
                   id="import1"
                   style="display: inline-block;"
                 >录入</span>
                  <span id="import_questions1" style="display: none;">录入中<span
                    class="ani_dot"
                  >...</span></span></button>

              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!--      </el-tab-pane>-->
    <!--    </el-tabs>-->

  </div>
</template>

<script>
import { remote } from '@/api/admin/dict'
import { mapGetters } from 'vuex'
import 'froala-editor/css/froala_style.css'
import 'froala-editor/css/froala_editor.pkgd.css'
import load from 'load-script'
import { getCourseList } from '@/api/question/question'

export default {
  filters: {},
  data() {
    return {
      score: 0,
      questionDifficulty: [],
      questionType: [],
      fanLiIcon: 'el-icon-arrow-down',
      guiFanIcon: 'el-icon-arrow-down',
      activeName: 'first',
      courseList: [],
      courseId: 0,
      courseName: '课程名',
      questionTypeName: '练习题',
      questionTypeId: 1
    }
  },
  computed: {
    ...mapGetters(['permissions', 'access_token'])
  },
  created() {
    const that = this
    this.getCourseList()
    const CDN1 = '/batchImport/js/jquery.min.js'
    const CDN2 = '/batchImport/js/froala_editor.pkgd.min.js'
    const CDN3 = '/batchImport/js/markdown-v1.1.js'
    const CDN4 = '/batchImport/js/auto-line-number-batch.js'
    const CDN8 = '/batchImport/js/constVlaue.js'
    const CDN9 = '/batchImport/js/clipboard.min.js'
    const CDN5 = '/batchImport/js/admin-base.js'
    const CDN6 = '/batchImport/js/intro.js'
    const CDN7 = '/batchImport/js/bootstrap.min.js'
    this.loadScript([CDN1, CDN7, CDN2, CDN3, CDN4, CDN8, CDN9, CDN5, CDN6])
    remote('question_difficulty').then(function(response) {
      that.questionDifficulty = response.data.data
    })
    remote('question_type').then(function(response) {
      that.questionType = response.data.data
    })
  },
  methods: {
    handleCommand(command) {
      this.courseId = command.id
      this.courseName = command.title
    },
    handleQuestionType(command) {
      this.questionTypeId = command.id
      this.questionTypeName = command.label
    },
    getCourseList() {
      getCourseList().then(res => {
        this.courseList = res.data
      })
    },
    changeFanLiIcon(flag) {
      if (flag === 'hide') {
        this.fanLiIcon = 'el-icon-arrow-down'
      } else {
        const fanLiIcon = this.fanLiIcon
        if (fanLiIcon === 'el-icon-arrow-up') {
          this.fanLiIcon = 'el-icon-arrow-down'
        } else {
          this.fanLiIcon = 'el-icon-arrow-up'
        }
      }
    },
    changeGuiFanIcon(flag) {
      if (flag === 'hide') {
        this.guiFanIcon = 'el-icon-arrow-down'
      } else {
        const guiFanIcon = this.guiFanIcon
        if (guiFanIcon === 'el-icon-arrow-up') {
          this.guiFanIcon = 'el-icon-arrow-down'
        } else {
          this.guiFanIcon = 'el-icon-arrow-up'
        }
      }
    },
    async  loadScript(cdnArr) {
      for (let i = 0; i < cdnArr.length; i++) {
        await new Promise(function(resolve, reject) {
          load(cdnArr[i], (err) => {
            if (err) {
              this.$message.error(err.message)
              console.log('error', cdnArr[i])
              reject()
            } else {
              console.log('resolve', cdnArr[i])
              resolve()
            }
          })
        })
      }
      this.admin_importQuestionsOnline()
      this.initBatchImport()
    },
    /* eslint-disable */
    admin_importQuestionsOnline(){
      const that=this;
      const token = this.access_token
      var introjs =  introJs();
      $(document).ready( function() {

        if (window.sourceFrom != 'addQuesDialog' ){
          // 通过字段判断是否出现引导
          introjs.setOptions({
            prevLabel:"上一步",
            nextLabel:"下一步<i class='icon-a_arrow_right'></i>",
            skipLabel:"跳过",
            doneLabel:"知道了",
            steps: [{
              element: "#addQuestion1",
              intro: '<div class="intro-box">' +
                '<span class="title-tip"><span class="txt">三种录入方式</span><span class="blue"></span></span>' +
                '<p class="content-tip">批量录入：文本批量录入，支持五类题型 <br> ' +
                '手动录入：单题录入，支持七类题型 <br> ' +
                'Excel导入：大批量试题导入，支持五类题型</p>' +
                '</div>',
              position: "bottom",
              highlightClass: 'addQuestion'
            },
              {
                element: "#addQuestion2",
                intro: '<div class="intro-box file-last-box">' +
                  '<span class="title-tip"><span class="txt">试题信息设置</span><span class="blue"></span></span>' +
                  '<p class="content-tip">设置试题基础信息，确保试题信息正确性</p>' +
                  '</div>',
                position: "bottom",
                highlightClass: 'addQuestion'
              },
              {
                element: "#inputArea",
                intro: '<div class="intro-box file-last-box">' +
                  '<span class="title-tip"><span class="txt">输入区检查区</span><span class="blue"></span></span>' +
                  '<p class="content-tip">请查阅输入范例及输入规范后，在输入区录入试题，如格式有误，请根据检查区提示进行调整</p>' +
                  '</div>',
                position: "top",
                highlightClass: 'addQuestion'
              },
              {
                element: ".addQuestion4",
                intro: '<div class="intro-box file-last-box">' +
                  '<span class="title-tip"><span class="txt">输入效果实例</span><span class="blue"></span></span>' +
                  '<p class="content-tip">实际输入试题内容后的输入区及检查区显示效果</p>' +
                  '</div>' +
                  '<button class="again-btn" onclick="introjs.goToStep(1)">再看一遍</button>',
                position: "top",
                highlightClass: 'addQuestion_img'
              }]

          }).start();
        }

        // 点击查看例题
        $("#showExample").click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          var newHeight = $('.batch-input-box').height() / 2 - 40;
          // 切换icon
          changeIconClass($(this));
          // 规范icon恢复原状
          if($('#showStandard').find('.icon').hasClass('icon-a_arrow_up')){
            $('#showStandard').find('.icon').removeClass('icon-a_arrow_up');
            $('#showStandard').find('.icon').addClass('icon-a_arrow_down');
          }
          // 关闭范例
          changeDialogShow($("#qtStandard"));
          changeDialogShow($("#qtStandard1"));
          $('#qtStandard').css('height','0px');
          $('#qtStandard').removeClass('active');
          $('#qtStandard1').css('height','0px');
          $('#qtStandard1').removeClass('active');
          if ($('#qtExample').hasClass('active')){
            $('#qtExample').removeClass('active');
            changeDialogShow($("#qtExample"))
          } else {
            $('#qtExample').addClass('active');
            $("#qtExample").animate({
              height: newHeight
            });
          }
          if ($('#continueOpen').hasClass('active')){
            $('#qtExample .modal-footer').css('width','140px');
            $('#continueOpen').removeClass('active')
          }
        });

        $('#continueOpen').click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          var newHeight = $('.batch-input-box').height() / 2 - 40;
          $('.textarea-group').hide();
          newHeight = $('.batch-input-box').height() - 40;
          $("#qtExample").animate({
            height: newHeight
          });
          $('#qtExample .modal-footer').css('width','60px');
          $('#continueOpen').addClass('active')
        });

        // 点击关闭例题
        $("#qtExample .btn-close").click(function(e){
          e.stopPropagation();
          e.preventDefault();
          if($('#continueOpen').hasClass("active")){
            var newHeight = $('.batch-input-box').height() / 2 - 40;
            $("#qtExample").animate({
              height: newHeight
            });
            $('#qtExample .modal-footer').css('width','140px');
            $('#continueOpen').removeClass('active');
            $('.textarea-group').show();
          }else{
            changeIconClass($('#showExample'));
            $('.textarea-group').removeClass('active');
            $('#qtExample').removeClass('active');
            $('.textarea-group').show();
            // 动画关闭
            changeDialogShow($("#qtExample"))
          }
        });

        //点击查看规范
        $("#showStandard").click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          changeIconClass($(this));
          if($('#showExample').find('.icon').hasClass('icon-a_arrow_up')){
            $('#showExample').find('.icon').removeClass('icon-a_arrow_up');
            $('#showExample').find('.icon').addClass('icon-a_arrow_down');
          }
          var newHeight = $('.batch-input-box').height() / 2 - 40;
          changeDialogShow($("#qtExample"));
          $('#qtExample').removeClass('active');
          $('#qtExample').css('height','0px');
          if (window.labelOpen==1) {
            if ($('#qtStandard').hasClass('active')){
              $('#qtStandard').removeClass('active');
              changeDialogShow($("#qtStandard"))
            } else {
              $('#qtStandard').addClass('active');
              $("#qtStandard").animate({
                height: newHeight
              });
            }
          } else {
            if ($('#qtStandard1').hasClass('active')){
              $('#qtStandard1').removeClass('active');
              changeDialogShow($("#qtStandard1"))
            } else {
              $('#qtStandard1').addClass('active');
              $("#qtStandard1").animate({
                height: newHeight
              });
            }
          }
        });

        // 点击关闭规范
        $("#qtStandard .btn-close").click(function(e){
          e.stopPropagation();
          e.preventDefault();
          changeIconClass($('#showStandard'));
          $('.textarea-group').removeClass('active');
          $('#qtStandard').removeClass('active');
          // 动画关闭
          changeDialogShow($("#qtStandard"))
        });
        $("#qtStandard1 .btn-close").click(function(e){
          e.stopPropagation();
          e.preventDefault();
          $('.textarea-group').removeClass('active');
          $('#qtStandard1').removeClass('active');
          // 动画关闭
          changeDialogShow($("#qtStandard1"))
        });

        //导入试题
        $("#importBtn").click(function(e) {
          e.stopPropagation();
          e.preventDefault();
          var previewHtml = $('#preview').html();
          var previewText = $('#preview').text();

          if (that.courseId == 0) {
            that.$message({
              message: '请选择课程名',
              type: 'warning'
            })
            return
          }
          
          if($.trim(previewHtml) === '' || $.trim(previewText) === ''){
            alert('导入内容不能为空！');
            return false
          }

          if($('.check_error').size() > 0){
            alert('存在错误，请检查试题！');
            return false;
          }
          var text = $("#text-input .fr-view").html();
          $("#errorText , #errorTextNew").hide();
          if($("input[name=classification]").val()==''){
            alert("请选择试题分类！");
            return false;
          }else{
            var data=serializeFn();

            const dataFormat=[];
            for(let i=0;i<data.length;i++){
              let difficulty='';
              for(let j=0;j<that.questionDifficulty.length;j++){
                  if(data[i].difficult===that.questionDifficulty[j].label){
                  difficulty=that.questionDifficulty[j].value
                    break
                  }
              }

              let optionsContent=''
              if(data[i].type==='1'||data[i].type==='2'||data[i].type=="3"){
                let arr=[];
                let keys=Object.keys(data[i]);
                let count=1;
                for(let t=0;t<keys.length;t++){
                  if(/answer\d/.test(keys[t])){
                    count++;
                  }
                }
                const options=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                for(let r=1;r<count;r++){
                  const content=data[i]['answer'+r];
                  arr.push({
                    name:options[r-1],
                    content:content
                  });
                }
                optionsContent=JSON.stringify(arr)
              }else {
                optionsContent=undefined
              }

              dataFormat.push({
                 typeId:data[i].type,
                stem:data[i].question,
                answer:data[i].key,
                difficulty:difficulty,
                optionsContent:optionsContent,
                questionType :that.questionTypeId,
                parentId:0,
                score:that.score,
                courseId:that.courseId,
                analysis: data[i].analysis
              });
            }


            $("#import").hide();
            $("#import_questions").show();
            $.ajax({
              type: "POST",
              cache : false,
              headers: {
                "cache-control": "no-cache",
                'Authorization': 'Bearer '+ token
              },
              dataType: "json",
              contentType: "application/json",
              url: "/question/question/bulk",
              data: JSON.stringify(dataFormat),
              success: function(msg){

                if (msg.code !== 0) {
                  that.$message({
                    message: msg.msg,
                    type: 'warning'
                  })
                  return
                }

                that.$message.success('导入成功')
                $("#import_questions").hide();
                $("#import").show();
                // var message="成功导入 "+msg.bizContent.successCount+" 道试题，失败 "+msg.bizContent.failCount+" 道题";
                // $("#import_result").text(message);
                // if (USER_ROLE == 'sub_admin' && KSXRIGHTS.allowPaperAdd != 1){
                //   $('#conResult').hide();
                // }
                // $('#txtImport').modal();
                // // gio
                // ksxProbe.gioTrack('enterQuestionSuccess', 1, {
                //   'questionEnterMethod_var': '批量录入',
                //   'questionEnterCount_var': msg.bizContent.successCount
                // });
                //
                // $('#txtImport').on('hidden.bs.modal', function (e) {
                //   $( '#txtImport' ).off().on( 'hidden', 'hidden.bs.modal');
                //   location.reload();
                // })
              }
            });
          }
        });


        //导入试题
        $("#importButton").click(function(e) {
          e.stopPropagation();
          e.preventDefault();
          var previewHtml = $('#preview').html();
          var previewText = $('#preview').text();

          if($.trim(previewHtml) === '' || $.trim(previewText) === ''){
            alert('导入内容不能为空！');
            return false
          }

          if($('.check_error').size() > 0){
            alert('存在错误，请检查试题！');
            return false;
          }
          var text = $("#text-input .fr-view").html();
          $("#errorText , #errorTextNew").hide();
          if($("input[name=classification]").val()==''){
            alert("请选择试题分类！");
            return false;
          }else{
            var data=serializeFn();
            var dataForm=JSON.stringify(data);
            $("#import1").hide();
            $("#import_questions1").show();
            $.ajax({
              type: "POST",
              cache : false,
              headers: { "cache-control": "no-cache" },
              dataType: "json",
              contentType: "application/json",
              url: "/baseinfo/admin/upload_testqm_txt/",
              data: dataForm,
              success: function(msg){
                $("#import_questions1").hide();
                $("#import1").show();
                var message="成功导入 "+msg.bizContent.successCount+" 道试题，失败 "+msg.bizContent.failCount+" 道题";
                $("#import_result").text(message);
                if (USER_ROLE == 'sub_admin' && KSXRIGHTS.allowPaperAdd != 1){
                  $('#conResult').hide();
                }
                $('#txtImport').modal();
                // gio
                ksxProbe.gioTrack('enterQuestionSuccess', 1, {
                  'questionEnterMethod_var': '批量录入',
                  'questionEnterCount_var': msg.bizContent.successCount
                });

                $('#txtImport').on('hidden.bs.modal', function (e) {
                  $( '#txtImport' ).off().on( 'hidden', 'hidden.bs.modal');
                  location.reload();
                })

              }
            });
          }
        });

        $('#closeButton').click(function () {
          $('#txtImport').modal("hide");
          location.reload();
        });

        //点击确认关闭导入结果模态框
        $("#conResult").click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          $('div#text-input').froalaEditor('html.set', '');
          $('div#text-input').froalaEditor('destroy');
          initFroala();
          $("#preview").empty();
          $('#txtImport').modal("hide");
          window.open(getAdminUrlPrefix + '/examadmin/admin/paper_add_new');
        });

        // 重载页面，继续录入
        $("#continueAddQuestion").click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          $( '#txtImport' ).off().on( 'hidden', 'hidden.bs.modal');
          location.reload();
        });
        var errorIndex = -1;
        var topNum = 0;
        var bottomNum = 0;
        // 点击显示下一个错误
        $("#nextError").click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          var boxOffsetTop = $('.box').offset().top;
          var error=$("#preview").find(".check_error");

          //先判断滚动条是否到底部
          if(bottomNum === 1){

            topNum = 0;
            bottomNum = 0;
            errorIndex = -1
          }else{
            errorIndex++;
            if(errorIndex > error.length-1){
              errorIndex = -1;
            }
            topNum += parseInt(error.eq(errorIndex).offset().top-boxOffsetTop-10);
          }

          // 范例和规范打开 对应错题显示
          if ($('#qtExample').hasClass('active')) {
            $('.box').scrollTop(topNum + $('#qtExample').height());
          }else if($('#qtStandard').hasClass('active')){
            $('.box').scrollTop(topNum + $('#qtStandard').height());
          }else if($('#qtStandard1').hasClass('active')){
            $('.box').scrollTop(topNum + $('#qtStandard1').height());
          } else {
            $('.box').scrollTop(topNum);
          }
          // checkError();

        });
        //滚动检测
        $('.box').scroll(function(){

          if($(this).scrollTop()+$(this).height() >= $('#preview').height()){

            errorIndex = -1;
            topNum = 0;
            bottomNum = 1
          }

        });
        //导入选择分类
        $("body").on("click", "#selTypeLink", function(e) {
          // e.stopPropagation();//解决点击'试题分类'，'试题难度'下拉框不隐藏的bug
          // e.preventDefault();
          showSelType(this);
        });

        $(".body-content .cont-r .tab-content .batch-type .simulationOption div").click(function(e){
          var $this = $(this);
          var idx = $this.index();
          $(".body-content .cont-r .tab-content .batch-type .simulationOption div").removeClass('now_diff'); //移除所有选项的选中标记
          $(this).addClass('now_diff'); //为被点选项加上选中标记，在输入区被编辑后进行校验时，调用该选项的点击，对所有难度的输入错误进行再次纠正，实现难度纠错状态的保存
          e.stopPropagation();
          $this.parents(".simulationSelect").next().children().prop("selected",false);
          $this.parents(".simulationSelect").children("span").text($this.text());
          $this.parent().hide();
          var errorChidren = $('#preview').children('.check_error');
          var errChidrenDiff = $('#preview').children('.check_error_diff');
          for(var i=0;i<$(errorChidren).length;i++){
            if($(errorChidren[i]).find('.qt_difficult').hasClass('qt_error')) {
              $(errorChidren[i]).addClass('new_error');
            }
          }
          for (var i = 0; i <$(errChidrenDiff).length ; i++) {
            if( $(errChidrenDiff[i]).find('.qt_difficult').hasClass('qt_error_diff')) {
              $(errChidrenDiff[i]).addClass('new_error');
            }
          }
          var newChidren = $('#preview').children('.new_error');
          if ($this.text() == '请选择'){
            for (var i = 0; i < newChidren.length ; i++) {
              var diffBox = $(newChidren[i]).find('.qt_difficult');
              $(diffBox).addClass('qt_error');
              $(diffBox).html('<span class="title">难度：</span>');
              $('.new_error').addClass('check_error');
            }
            //判断一下是否存在错误
            if($("#preview .qt_error").length > 0){
              $('#errorText').show();
              $('#nextError').show();
            }
          } else {
            for (var i = 0; i < newChidren.length ; i++) {
              var diffBox = $(newChidren[i]).find('.qt_difficult');

              diffBox.removeClass('qt_error');
              diffBox.removeClass('qt_error_diff');
              if($(newChidren[i]).find('.qt_error').length == 0){
                $(newChidren[i]).removeClass('check_error');
              }
              if($(newChidren[i]).find('.qt_error_diff').length == 0){
                $(newChidren[i]).removeClass('check_error_diff');
              }
              $(diffBox).html('<span class="title">难度：</span>' + $this.text());
            }
            //判断一下是否存在错误
            if($("#preview .qt_error").length == 0) {
              $('#errorText').hide();
              $('#nextError').hide();
            }else {
              $("#errorCount").text($('.check_error').size());
            }
          }

          //对所有单选题进行一次判断，如难度纠正后没有其他错误，放出'录入为多选题'选项 。取消纠正后，难度变为错误时，该选项隐藏
          $(".question[data-type=1]").each(function(){
            if($(this).find(".qt_error").length!=0){
              $(this).find('.change-type').hide()
            }else{
              $(this).find('.change-type').show()
            }
          })
        });

        //选择试题类型，显示不同示例
        $("#manualInput select[name=type]").change(function(e) {
          var $this = $(this);
          // 更换试题类型时给出提示信息
          if($("#inputArea").attr("style") != "display: none;"){
            if(confirm("输入区试题内容会清空，请确认")==false){
              $this.prev().children(".title-font").text($this.prev().children(".title-font").attr("oldValue"));
              $this.val(qt_type);
              return false;
            }
          }
          $this.prev().children(".title-font").attr("oldValue",$this.prev().children(".title-font").html());
          qt_type = $(this).val();
          $("#text-input .fr-view").html("");
          $("#preview").empty();
          $("#qtExample .accordion").hide();
          $("#accordion"+qt_type).show();
        });

        $('#helpBtn').click(function (e) {
          e.stopPropagation();
          e.preventDefault();
          window.open('https://www.kancloud.cn/zhoujun123/examstar-stbq/1071627')
        });

      });

      function changeDialogShow(_this){
        _this.animate({
          height: '0px'
        });
      }

      function changeIconClass(_this){
        if (_this.find('.icon').hasClass('icon-a_arrow_down')){
          _this.find('.icon').removeClass('icon-a_arrow_down');
          _this.find('.icon').addClass('icon-a_arrow_up');
          $('.textarea-group').addClass('active');
        } else {
          _this.find('.icon').removeClass('icon-a_arrow_up');
          _this.find('.icon').addClass('icon-a_arrow_down');
          $('.textarea-group').removeClass('active');
        }
      }


//显示选择分类对话框
      function showSelType(obj){
        selTypeModal.location.href = "/baseinfo/admin/tree/tests_class?sourceFrom=1";
        $('#classDialog').show();
        // $('#typeModal').modal({
        // 	backdrop:"static",
        // 	keyboard:false
        // });
      }

//关闭选择分类对话框
      function hideSelType(obj){
        $('#classDialog').hide();
        // $('#typeModal').modal('hide');
      }

//接受选择分类数据
      function selType(id,name){
        $("input[name=classification]").val(id);
        $("#selTypeLink").text(name);
      }


//点击导入时检查试题中是否存在错误
      function checkError() {
        // 首先检查题目中有无重复项，若有重复则对整题做标记
        $("#preview").find(".question").each(function (index,element) {
          var key_t=[];
          var ans;
          var diffBox = $(this).find(".qt_error_diff").length;
          key_t[0]=$(this).find(".key_A").length;
          key_t[1]=$(this).find(".key_B").length;
          key_t[2]=$(this).find(".key_C").length;
          key_t[3]=$(this).find(".key_D").length;
          key_t[4]=$(this).find(".key_E").length;
          key_t[5]=$(this).find(".key_F").length;
          key_t[6]=$(this).find(".key_G").length;
          key_t[7]=$(this).find(".key_H").length;
          // 按照选项重复个数从大到小排序
          key_t.sort(function(a,b) {
            return b-a;
          });
          if(key_t[0]>1 || diffBox>1 ){
            $(this).addClass("check_error");
          }
          // 对按照答案对选型进行检索，若答案不在选项中，则将答案标记为错误
          if(qt_type=="1"||qt_type=="2"||qt_type=="3"){
            ans=$(this).find(".qt_answer").text().replace(/^答案[:：]/,"").replace(/\s/g,"").toUpperCase();
            if(ans.replace(/[A-Z]/g,"")!=""){
              $(this).addClass("check_error");
            }else {
              var ans_l=$.trim(ans).split("");
              for (var i = 0; i < ans_l.length; i++) {
                var key_f=$(this).find(".key_"+ans_l[i]).length;
                if(key_f==0){
                  $(this).addClass("check_error");
                  break;
                }
              }
            }
          }
          if(qt_type=="4") {
            ans=$(this).find(".qt_answer").text().replace(/^答案[:：]/,"").replace(/\s/g,"");
            if(ans != '正确' && ans != '错误' && ans != '对' && ans != '错'){
              // $(this).addClass("check_error");
              $(this).find(".qt_answer").addClass("error");
            }
          }
          if(qt_type=='5'||qt_type=='6'){
            ans=$(this).find(".qt_answer").text().replace(/^答案[:：]/,"").replace(/\s/g,"");
            if(ans==''){
              $(this).addClass("check_error");
            }
          }
        });
      }

// 组织导入试题的信息
      function serializeFn() {
        var classification = $("input[name=classification]").val();
        // var difficult=$("select[name=difficult]").val();
        var data=[];
        $("#preview").find(".question").each(function (index,element) {
          var type = $(this).attr('data-type');
          var reQuestion = $(this).find(".qt_title").html().replace(/^[\s\S]*<span class="type-box"[\s\S]*>[\s\S]+<\/span>([\s\S]*)$/,"$1");
          var question=escapeHTML(reQuestion);
          var answer1=$(this).find(".key_A").length==0 ? "" : (escapeHTML($(this).find(".key_A").html())==""?" ":escapeHTML($(this).find(".key_A").html()));
          var answer2=$(this).find(".key_B").length==0 ? "" : (escapeHTML($(this).find(".key_B").html())==""?" ":escapeHTML($(this).find(".key_B").html()))
          var answer3=$(this).find(".key_C").length==0 ? "" : (escapeHTML($(this).find(".key_C").html())==""?" ":escapeHTML($(this).find(".key_C").html()))
          var answer4=$(this).find(".key_D").length==0 ? "" : (escapeHTML($(this).find(".key_D").html())==""?" ":escapeHTML($(this).find(".key_D").html()))
          var answer5=$(this).find(".key_E").length==0 ? "" : (escapeHTML($(this).find(".key_E").html())==""?" ":escapeHTML($(this).find(".key_E").html()))
          var answer6=$(this).find(".key_F").length==0 ? "" : (escapeHTML($(this).find(".key_F").html())==""?" ":escapeHTML($(this).find(".key_F").html()))
          var answer7=$(this).find(".key_G").length==0 ? "" : (escapeHTML($(this).find(".key_G").html())==""?" ":escapeHTML($(this).find(".key_G").html()))
          var answer8=$(this).find(".key_H").length==0 ? "" : (escapeHTML($(this).find(".key_H").html())==""?" ":escapeHTML($(this).find(".key_H").html()))
          if (type == "1") {
            var key=escapeHTML($(this).find(".qt_answer").html()).replace(/&nbsp;/g,"").toUpperCase().replace(/<BR CLASS="MARKDOWN_RETURN">/g, "");
          } else if(type=="2"||type=="3"){
            var keyStr = escapeHTML($(this).find(".qt_answer").html()).replace(/&nbsp;/g,"").toUpperCase().replace(/<BR CLASS="MARKDOWN_RETURN">/g, "");
            var key = JSON.stringify(keyStr.split(''))
          }else if (type=="4") {
            var key=escapeHTML($(this).find(".qt_answer").html()).replace(/(^\s+)|(\s+$)/g,"").replace(/(正确|对)/,'true').replace(/(错误|错)/,'false');
            console.log(key, '<<<key')
          }else{
            var key=escapeHTML($(this).find(".qt_answer").html());
          }
          var comKeyWord = $(this).find(".qt_comKeyWord").length==0 ? "" : escapeHTML($(this).find(".qt_comKeyWord").html());
          var coreKeyWord = $(this).find(".qt_coreKeyWord").length==0 ? "" : escapeHTML($(this).find(".qt_coreKeyWord").html());
          var analysis=$(this).find(".qt_analysis").length==0 ? "" : escapeHTML($(this).find(".qt_analysis").html());
          var difficult=$(this).find(".qt_difficult").length==0 ? "" : escapeHTML($(this).find(".qt_difficult").html());
          if ($(this).find(".qt_difficult").length!=0){
            difficult=difficult.slice(0,2);
          }
          var label=$(this).find(".qt_label").length==0 ? "" : escapeHTML($(this).find(".qt_label").html());
          data[index]={
            "classification":classification,
            "type":type,
            "difficult":difficult,
            "question":question,
            "answer1":answer1,
            "answer2":answer2,
            "answer3":answer3,
            "answer4":answer4,
            "answer5":answer5,
            "answer6":answer6,
            "answer7":answer7,
            "answer8":answer8,
            'normal_words':comKeyWord,
            "key_words":coreKeyWord,
            "key":key,
            "analysis":analysis,
            "label":label,
            "disorder":1
          };
          // 若不存在该项则不存入

          for (let i in data[index]) {
            if(data[index][i]==""||!data[index][i]){
              delete data[index][i];
            }
          }
        });

        return data;
      }

//转义部分，换行　$markdown_return 进行两次替换
// 按照URL换码协议，＋会被转换成空格，所以要做相应处理
      function escapeHTML( text ) {
        return text.replace(/^[\s\S]*<span class="title"[\s\S]*>[\s\S]+<\/span>([\s\S]*)$/,"$1")
          .replace(/<br class="markdown_return">/g, "$markdown_return")
          .replace(/\&nbsp;/g, " ")
          .replace(/\$markdown_return/g, '<br class="markdown_return">')
      }

    },
    initBatchImport() {

      var upload_file = ''
      window.qt_type = '1'
      window.typeName = ['单选题', '多选题', '不定项', '判断题', '填空题', '问答题']
      // 题目校对页面需要展示 修改按钮
      window.proofread = false
      var nameReg = /^\n?\s*(([0-9]+\s*[.|、])|(((\()|（)[0-9]+((\))|）)))\s*(.*?)\s*(?:\n|$)/g
      var singleReg = /^\n?\s*(答案[:：])\s*(.*?)\s*(?:\n|$)/g
      var fillReg = /([\(|\（]\s*[\)|\）])/g
      window.labelOpen = '0'// 试题标签功能是否开启:1开启，0关闭
      window.sourceFrom = ''// 标记是否从弹窗点击
      // 复制考试链接

      var clipboard = new Clipboard('#copyElement')
      clipboard.on('success', function(e) {
        alert('复制成功!')
      })
      clipboard.on('error', function(e) {
        alert('复制失败,请重试')
      })

      // 如果是excel
      if (window.location.search.indexOf('upload=excel') > 0) {
        $('#excel_import').show()
        $('.tab-content').hide()
        $('#showExcel').addClass('active')
      } else {
        $('#showTabContent').addClass('active')
      }

      // 尝试新的文本编辑器
      function initFroala() {
        $('#text-input').froalaEditor({
          key: 'AODOd2HLEBFZOTGHW==',
          charCounterCount: false,
          language: 'zh_cn',
          spellcheck: false,
          toolbarInline: false,
          placeholderText: '请将所选试题复制到这里',
          //                pastePlain: true,//是否为纯文本粘贴
          pasteAllowLocalImages: true,
          imageDefaultWidth: 'auto', // 图片默认宽度
          imageDefaultAlign: 'left',
          wordAllowedStyleProps: [], // 允许从word粘贴的标签的样式
          htmlAllowedTags: ['p', 'img', 'br', 'sub', 'sup', 'div'], // 允许出现的标签
          //                imageMaxSize: 2 * 1024 * 1024,
          imageAllowedTypes: ['jpeg', 'jpg', 'png'],
          imageUploadParam: 'multipartFile',
          imageUploadParams: { code: 1 },
          imageUploadURL: '/baseinfo/upload/image'// 上传到本地服务器
        })
          .on('froalaEditor.contentChanged', function(e, editor) {
          setTimeout(function() {
            $('#preview').html('')
            var newArr = []
            var indexArr = []
            var questionArr = []
            var detail = []
            var contentText = editor.html.get().replace(/<p>/g, '\n\n').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n\n').replace(/auto;">/g, 'auto;">\n\n').split('\n')
            console.log('editor', editor)
            // 去除空格
            contentText.forEach(function(value) {
              if (value) {
                value = value.replace(/&nbsp;/g, ' ')
                value = '&nbsp;&nbsp;&nbsp;' + value
                value = value.replace(/&nbsp;/g, '\n')

                newArr.push(value)
              }
            })
            // 寻找相应的下标
            newArr.forEach(function(value, index) {
              if (value.match(nameReg)) {
                indexArr.push(index)
              }
            })
            // 截取完整小题
            indexArr.forEach(function(value, index) {
              questionArr.push(newArr.slice(indexArr[index], indexArr[index + 1]))
            })

            $('.batch-preview-box .toolbar .title').text(questionArr.length > 0 ? '检查区(共' + questionArr.length + '题)：' : '检查区：')

            // 判断题型，赋值qt_type
            questionArr.forEach(function(value) {
              var allValue = value.join(' ')
              // 匹配没有答案的情况(  答案：/【答案】)
              if (!allValue.match(/\n+\s*【\s*答案\s*】\s*/g) && !allValue.match(/\n+\s*(答案[:：])\s*/g)) {
                // 匹配到选项存在则默认为单选题先判断是否带有a.类似标志
                if (allValue.match(/\n+\s*[a-h]\s*[.|、]/ig)) {
                  getClassify(value, detail, 1)
                } else if (fillReg.test(allValue)) {
                  // 在判断是否带有（）
                  getClassify(value, detail, 5)
                } else {
                  // 否则默认为问答题
                  getClassify(value, detail, 6)
                }
              } else {
                var answerReg = /^\s*\n?【\s*答案\s*】\s*/
                var answerJude = /\n\n\n\s*【\s*答案\s*】|\n\n\n\s*答案[:：]/g
                // 针对存在多个答案的情况
                if (allValue.match(answerJude).length > 1) {
                  value.forEach(function(ele, i) {
                    if (ele.match(answerJude)) {
                      value = value.slice(0, i + 1)
                    }
                  })
                }
                value.forEach(function(val) {
                  // 处理下中文括号
                  if (answerReg.test(val)) {
                    val = val.replace(answerReg, '答案：')
                  }
                  // 只有答案两个字的情况
                  if (/^\s*\n?答案\s*\n?$/.test(val)) {
                    val = val.replace(/^\s*\n?(答案)\s*/, '答案：')
                  }

                  if (val.match(singleReg)) {
                    var m = val.match(singleReg)// 匹配答案项
                    var isAnswer = m[0].replace(/^\n?\s*(答案[:|：])\s*/, '')// 寻找答案后的字符串
                    // 有答案字段，没有正确的答案
                    if (!isAnswer) {
                      var newString = value.join(' ')
                      if (newString.match(/\n?\s*[a-h][.|、]\s*/ig)) {
                        // 有选项情况下，默认为单选题
                        getClassify(value, detail, 1)
                      } else {
                        // 填空题筛选
                        if ((newString.split('答案')[0]).match(fillReg)) {
                          getClassify(value, detail, 5)
                          return false
                        }
                        // 无选项情况下，默认为问答题（主要包括判断题与问答题的区分）
                        getClassify(value, detail, 6)
                      }
                    } else {
                      // word版多选题带,号处理
                      if (isAnswer.match(/^([a-h][,|，]){0,7}([a-h])$/ig)) {
                        isAnswer = isAnswer.replace(/,|，/g, '')
                      }
                      var isSelect = isAnswer.match(/^\s*[a-h]{1,8}\s*(?:\n|$)/i)// 单选/多选
                      var isJude = isAnswer.match(/^\s*(正确|错误|对|错)\s*(?:\n|$)/i)// 判断
                      var isSelects = [] // 该数组用于接收处理玩空字符串之后的isSelect
                      // 针对大小写选项重复
                      if (isSelect) {
                        //  数组去重
                        isSelect = (isSelect[0].split('')).filter(function(ele, i, array) {
                          return array.indexOf(ele) === i
                        })
                        // 二次处理isSelect,去除空字符串
                        isSelect.forEach(function(value1) {
                          if ($.trim(value1)) {
                            isSelects.push(value1)
                          }
                        })
                        // 排序
                        isSelects.sort()

                        // 1，2项比较是否为同一个选项(a,A)
                        if (isSelects.length === 2 && isSelects[0].toLocaleLowerCase() === isSelects[1]) {
                          isSelects = isSelects.splice(0, 1)
                        }
                      }
                      // 单选题
                      if (isSelects && isSelects.length === 1) {
                        getClassify(value, detail, 1)
                      }
                      // 多选题
                      if (isSelects && isSelects.length > 1) {
                        getClassify(value, detail, 2)
                      }
                      // 判断题
                      if (isJude) {
                        getClassify(value, detail, 4)
                      }
                      if (!isSelect && !isJude) {
                        // 填空题
                        if ((((value.join(' ').split('答案:'))[0].match(fillReg)) && (value.join(' ').split('答案:')).length > 1) ||
                          (((value.join(' ').split('答案：'))[0].match(fillReg))) && (value.join(' ').split('答案：')).length > 1) {
                          getClassify(value, detail, 5)
                        } else {
                          // 问答题
                          getClassify(value, detail, 6)
                        }
                      }
                    }
                  }
                })
              }
            })
            var html = ''
            // 没有数据时隐藏检查处错误提示
            if (detail.length === 0) {
              $('#errorCount').text('')
              $('#errorText').hide()
              $('#nextError').hide()
            }
            var ii = -1// 计数
            detail.forEach(function(value) {
              ii++

              window.qt_type = value.type
              console.log('value', value.name)
              console.log('value', (value.name).join(''))
              html = markdown.toHTML((value.name).join(''))
              console.log('html', html)
              $('div#preview').append(html)

              // 标记答案
              markAnswer(window.qt_type, ii)
              changeSize(ii)
              //  错误点及时检测
              var errorNum = $('.check_error').size()
              if (errorNum > 0) {
                $('#errorCount').text(errorNum)
                $('#errorText').show()
                if (errorNum === 1) {
                  $('#nextError').text('查看').show()
                } else {
                  $('#nextError').text('下一处').show()
                }
              } else {
                $('#errorCount').text('')
                $('#errorText').hide()
                $('#nextError').hide()
              }
            })

            // 禁止右侧多选点击，禁止默认事件
            $('.key input').click(function() {
              return false
            })
            $('.body-content .cont-r .tab-content .batch-type .simulationOption div.now_diff').click() // 纠正难度错误
          }, 1500)
        })
          .on('froalaEditor.image.beforeUpload', function(e, editor, images) {
          // Return false if you want to stop the image upload.
          //                if(images[0].size>2*1024*1024){
          //                    alert("图片过大，无法上传");
          //                    return false;
          //                }
        })
          .on('froalaEditor.image.uploaded', function(e, editor, response) {
          // 如果上传失败
          if (response.bizContent) {
            alert(response.bizContent.desc)
          }
        })
          .on('froalaEditor.image.error', function(e, editor, error, response) {
          // Image too text-large.
          if (error.code == 5) {
            alert('图片过大，无法上传')
          }
          // Invalid image type.s
          else if (error.code == 6) {
            alert('不支持该图片类型，请上传jpeg, jpg, png格式的图片')
          }
        })
          .on('froalaEditor.focus', function(e, editor) {
          // froala中有专门用于隐藏placeholder的方法--placeholder.hide()，但是尝试过不生效，因此用笨办法做隐藏显示
          if (editor.placeholder.isVisible()) {
            $('.fr-placeholder').hide()
          }
        })
          .on('froalaEditor.blur', function(e, editor) {
          if (editor.html.get() == '') {
            $('.fr-placeholder').show()
          }
        })
      }

      initFroala()
      // 行号
      $('#text-input').setTextareaCount({
        width: '0',
        bgColor: '#edf2f7',
        color: '#989A9C',
        display: 'inline-block'
      })

      $('#excel').click(function() {
        var P = $(this).parent()
        P.removeClass().addClass('import_choose excel-checked')
        P.prev().removeClass().addClass('import_choose txt')
        P.next().removeClass().addClass('import_choose word')
      })

      // 标记答案
      function markAnswer(type, ii) {
        var list = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        console.log('ii', ii)
        console.log('question', $('.question').eq(ii))
        $('.question').eq(ii).each(function(index, element) {
          console.log('element', element)
          var $that = $(this)
          var titleNum = $(this).find('.type-box .title').text()
          var answerText = $(this).find('.qt_answer').text().replace(/^\s*答案\s*[:：]/, '')
          // word版多选题带,号处理
          if (answerText.match(/^([a-h][,|，]){0,7}([a-h])$/ig)) {
            answerText = answerText.replace(/,|，/g, '')
          }
          var answer = answerText.toUpperCase()
          // 处理下只有图片的情况
          var checkTitle = $(this).find('.qt_title').text().replace($(this).find('.type-box').text(), '')

          if ($.trim(checkTitle) === '') {
            if ($(this).find('.qt_title img').size() < 1) {
              $(this).find('.qt_title').addClass('qt_error').html('题目（至少两个字)')
            }
          }
          // 检测是否按顺序排序
          var select = $(this).find('.key .title').text()
          var type = $(this).data('type')
          select = select.split('.').join('')
          console.log('type', type)

          // 处理题目中的题号带括号，替换下中文括号
          titleNum = titleNum.replace(/（/, '(')
          titleNum = titleNum.replace(/）/, ')')
          $(this).find('.type-box .title').text(titleNum)

          // 错误标记check_error
          if ($(this).find('.error,.qt_error').size() > 0) {
            $(this).addClass('check_error')
          }

          if (type == '1' || type == '2') {
            for (var k = 0, selectLen = select.length; k < selectLen; k++) {
              // 根据选项与ACSII的比较，判断是否为正常的排序及重复选项的存在
              if (!(select[k] === String.fromCharCode(65 + k))) {
                $(this).addClass('check_error')
                $(this).find('.key').addClass('qt_error')
              }
            }
            for (var i = 0, listLen = list.length; i < listLen; i++) {
              // 标记选项框
              if (answer.search(list[i]) !== -1) {
                $(this).find('.key_' + list[i] + ' .checkOrRadio').prop('checked', true)
              } else {
                $(this).find('.key_' + list[i] + ' .checkOrRadio').attr('disabled', true)
              }
            }
            // 根据选项最后一位的ASCII码 与选项对比小于即为不存选项（大写比较）
            // 单选题判断答案是否存在
            // 过滤空字符串
            var answerhandle = answer.split('').filter(function(msg) {
              return msg && msg.trim()
            })
            // 单选题判断答案是否存在
            if (answerhandle.length === 1) {
              if (select.slice(-1).charCodeAt() < answerhandle[0].toLocaleUpperCase().charCodeAt()) {
                $that.addClass('check_error')
                $that.find('.qt_answer').removeAttr('hidden').addClass('qt_error').text('答案不存在！')
              }
            }

            // 多选题判断答案是否存在
            if (answerhandle.length > 1) {
              for (var j = 0, answerLen = answerhandle.length; j < answerLen; j++) {
                if (answerhandle[j].charCodeAt() > select.slice(-1).charCodeAt()) {
                  $that.addClass('check_error')
                  $that.find('.qt_answer').removeAttr('hidden').addClass('qt_error').text('答案不存在！')
                }
              }
            }
            // 题目有错误时把单多选按钮隐藏
            if ($(this).find('.qt_error').length != 0) {
              $(this).find('.change-type').hide()
            } else {
              $(this).find('.change-type').show()
            }
          }
          if (type == '5') {
            //  填空题括号与答案对应，先进行空元素匹配，在进行重复答案匹配
            var fillReg = /([\(|\（]\s*[\)|\）])/g
            var newAnswer = []
            if ($(this).find('.qt_title').text().match(fillReg)) {
              var fillNum = $(this).find('.qt_title').text().match(fillReg).length
            }
            var answerNum = answerText.split('|')

            // 先判断长度是否相等
            if (fillNum !== answerNum.length) {
              $(this).addClass('check_error')
              // 长度不相等即为错
              $(this).find('.qt_answer').addClass('qt_error')
            } else {
              // 去除空元素
              answerNum.forEach(function(value) {
                if ($.trim(value)) {
                  newAnswer.push(value)
                }
              })
              if (fillNum !== newAnswer.length) {
                $(this).addClass('check_error')
                // 长度不相等即为错
                $(this).find('.qt_answer').addClass('qt_error')
              }
            }
          }
          if (type == '6') {
            // 问答题答案为空时标记为错误
            if (answerText.length === 0) {
              $(this).addClass('check_error')
              $(this).find('.qt_answer').addClass('qt_error')
            }
          }
        })
        // 单选多选相互转化
        $('.change-type input').click(function() {
          if ($(this).is(':checked')) {
            $(this).parent().siblings().removeClass('type-name-1').addClass('type-name-2')
            changeType($(this), '多选题', 'checkbox', 2)
          } else {
            $(this).parent().siblings().removeClass('type-name-2').addClass('type-name-1')
            changeType($(this), '单选题', 'radio', 1)
          }
        })
      }

      function changeType(tar, title, dataType, inputType) {
        tar.parent().siblings('.type-name').text(title)
        tar.parents('.qt_title').siblings('.key').find('input').attr('type', dataType)
        tar.parents('.question').attr('data-type', inputType)
      }

      // 当题号过长时改变字号
      function changeSize(ii) {
        $('.question .qt_title .title').eq(ii).each(function(index, element) {
          var $numWords = $(this).text().length
          if ($numWords == 4) {
            $(this).css({ 'font-size': '20px' })
          } else if ($numWords == 5) {
            $(this).css({ 'font-size': '16px' })
          } else if ($numWords > 5) {
            $(this).css({ 'font-size': '14px' })
          }
        })
      }

      // 试题类型以及难度选择
      $('.tab-content .batch-type .simulationSelect').click(function(e) {
        e.stopPropagation()
        $(this).children('.simulationOption').show()
        $(this).siblings('.simulationSelect').children('.simulationOption').hide()
      })
      $('body').click(function() {
        $('.simulationOption').hide()
      })

      function getClassify(value, detail, num) {
        detail.push({
          name: value,
          type: num
        })
      }
    },
    /* eslint-disable */
    goto() {
      this.$router.push({
        path: '/question/batchImport',
        query: {
          // courseId: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.question-textarea {
  width: 90%;
}
.question-input {
  width: 250px;
}

.body-addition .body-operation .body-toolbar .body-toolbar-left button {
  padding: 7px 16px;
}
.body-addition .body-operation .body-toolbar .body-toolbar-left button i {
  margin-right: 9px;
}
.viewFrameWork-body .body-wrapper {
  height: 100%; min-height: 100%;
}
.viewFrameWork-body .body-wrapper .body-content {
  background: none; height: 100%;
}
#subForm1 {
  height: 100%;
}
.tab-content {
  height: calc(100% - 40px);
}
.fr-box.fr-basic .fr-wrapper {
  background: none !important;
}
.textarea-group {
  height: calc(100% - 40px) !important; position: relative;
}
.textarea-group.active {
  height: calc(50% - 40px) !important;
}
.textarea-group .fr-wrapper {
  height: 100% !important;
}
.fr-box.fr-basic.fr-top .fr-wrapper {
  line-height: 31px; box-shadow: none !important;
}
 .nav-tabs li {
  padding: 0px;
}
 .nav-tabs li.active {
  background: rgb(255, 255, 255);
}
 .nav-tabs li a {
  padding: 15px 0px; left: 50%; width: 117px; text-align: center; font-size: 18px; margin-left: -58px; border-bottom-color: rgb(243, 243, 245); border-bottom-width: 4px; border-bottom-style: solid; display: inline-block; position: relative;
}
 .nav-tabs li.active a {
  background: rgb(255, 255, 255); border-bottom-color: rgb(74, 144, 226); border-bottom-width: 4px; border-bottom-style: solid;
}
 .nav-tabs li i {
  left: 50%; color: rgb(74, 74, 74); font-size: 20px; margin-left: 12px; display: inline-block; position: relative;
}
 .nav-tabs li i:hover {
  cursor: pointer;
}
 .nav-tabs li i.active {
  color: rgb(26, 140, 254);
}
 .tab-content .batch-type {
  background: rgb(255, 255, 255); padding: 0px; height: 60px; line-height: 60px; font-size: 12px; position: relative;
}
 .tab-content .batch-type #importBtn {
  padding: 8px 25px; margin-right: 30px;
}
 .tab-content .batch-type .intro {
  padding-right: 9px; padding-left: 20px;
}
 .tab-content .batch-type button#selTypeLink {
  padding: 8px 21px 8px 18px;
}
 .tab-content .batch-type .btn-download {
  padding: 8px 21px 8px 18px;
}
 .tab-content .batch-type .simulationSelect {
  padding: 0px 15px; border-radius: 4px; border: 1px solid rgb(26, 140, 254); border-image: none; height: 30px; line-height: 30px; vertical-align: middle; display: inline-block; position: relative; cursor: pointer;
}
 .tab-content .batch-type .simulationOption {
  background: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); border-image: none; width: 107px; text-align: center; font-size: 14px; display: none; position: absolute; z-index: 9999;
}
 .tab-content .batch-type .simulationOption div:hover {
  background: rgb(26, 140, 254); color: rgb(255, 255, 255); cursor: pointer;
}
 .tab-content .batch-type .simulationSelect em {
  color: rgb(26, 140, 254);
}
 .tab-content .batch-type .simulationOption.testType {
  left: 0px; color: rgb(74, 74, 74);
}
 .tab-content .batch-type .simulationOption.difficult {
  left: 0px; color: rgb(74, 74, 74);
}
#inputArea {
  height: calc(100% - 59px);
  /*border-top-color: rgb(196, 207, 220); border-top-width: 1px; border-top-style: solid;*/
}
.batch-input {
  color: rgb(101, 101, 119); line-height: 17px; font-size: 12px;
}
.batch-input {
  height: 100%; letter-spacing: -0.35px; font-family: MicrosoftYaHei;
}
.batch-input .toolbar .title {
  height: 100%; letter-spacing: -0.35px; font-family: MicrosoftYaHei;
}
.batch-input .toolbar .title {
  color: rgb(39, 39, 74); line-height: 40px; font-size: 18px;
}
.batch-input .toolbar {
  background: rgb(243, 243, 245); padding: 0px 20px 0px 10px;
}
.batch-input .toolbar .toolbar-right {
  height: 40px; line-height: 40px; float: right;
}
.batch-input .toolbar .example {
  height: 100%; color: rgb(26, 140, 254); font-size: 14px; font-weight: 500; display: inline-block; cursor: pointer;
}
.batch-input .toolbar .standard {
  height: 100%; color: rgb(26, 140, 254); font-size: 14px; font-weight: 500; display: inline-block; cursor: pointer;
}
.batch-input .toolbar .example {
  /*margin-right: 20px;*/
}
.b-example {
  padding: 16px 12px 25px; border: 1px dashed rgb(34, 172, 56); border-image: none; width: 100%;
}
.b-example h3 {
  color: rgb(34, 172, 56); line-height: 30px; font-size: 16px;
}
.b-example p {
  line-height: 24px;
}
.batch-input h3 {
  height: 24px; color: rgb(93, 156, 236); line-height: 24px; font-size: 16px; margin-bottom: 10px;
}
.batch-input p {
  margin: 10px 0px 0px; line-height: 26px;
}
.batch-input-box {
  width: calc(50% - 5px); height: 100%; float: left; position: relative;
}
.batch-preview-box {
  width: calc(50% - 5px); height: 100%; float: left; position: relative;
  border-top: 1px solid #dedede;
}
.batch-input-box {
  background: rgb(255, 255, 255); padding-bottom: 25px; margin-right: 10px; border-color: rgb(222, 222, 222); border-width: 1px; border-style: solid;
}
.batch-input-box .box {
  width: 100% !important; color: rgb(74, 74, 74); line-height: 40px; letter-spacing: -0.35px; overflow: auto; margin-left: 0px; border-top-color: rgb(222, 222, 222); border-right-color: currentColor; border-left-color: currentColor; border-top-width: 1px; border-right-width: medium; border-left-width: medium; border-top-style: solid; border-right-style: none; border-left-style: none;
}
.batch-input-box .textarea-wrap {
  height: auto !important;
}
.fr-box.fr-basic .fr-element {
  /*background: rgb(239, 243, 247);*/
  padding-bottom: 0px !important;
  /*z-index: auto;*/
}
#app .main-container .app-main{
  height: calc(100vh - 8px);
}
#app .main-container .app-main .app-container{
  height: 100%;
}
img.fr-dib {
  vertical-align: bottom !important; display: inline-block !important;
}
.fr-toolbar {
  display: none !important;
}
.batch-preview-box .toolbar {
  border-left-color: rgb(222, 222, 222); border-left-width: 1px; border-left-style: solid;
}
.batch-preview-box .box {
  background: rgb(255, 255, 255); width: 100%; height: calc(100% - 40px); color: rgb(74, 74, 74); line-height: 40px; letter-spacing: -0.35px; overflow: auto; border-top-color: rgb(222, 222, 222); border-right-color: #dedede; border-left-color: #dedede; border-top-width: 1px; border-right-width:  1px; border-left-width:  1px; border-top-style: solid; border-right-style: solid; border-left-style: solid;border-bottom: 1px solid #dedede;
}
.batch-preview-box .box #preview {
  text-align: left;
}
.batch-preview-box .toolbar .error-text {
  display: none;
}
.batch-preview-box .toolbar .btn-s-blue {
  display: none;
}
.fr-wrapper.show-placeholder .fr-placeholder{

}
.batch-preview-box .toolbar .count {
  background: rgb(255, 72, 72); margin: 0px 5px; border-radius: 2px; width: 20px; height: 14px; text-align: center; color: rgb(255, 255, 255); line-height: 14px; font-size: 10px; display: inline-block;
}
.batch-preview-box .toolbar .btn-s-blue {
  padding: 0px; width: 50px; height: 20px; text-align: center;
}
.batch-input-box .btn-div {
  margin: 25px 0px; text-align: center;
}
.batch-preview-box .btn-div {
  margin: 25px 0px; text-align: center;
}
.errorText {
  color: rgb(0, 0, 0); font-weight: bold; background-color: rgb(255, 204, 51);
}
.errorTextNew {
  color: rgb(0, 0, 0); font-weight: bold; background-color: rgb(125, 192, 255);
}
#errorDiv {
  width: 100%; height: 295px; overflow: auto; display: block; max-height: 295px;
}
.question .qt_error {
  padding-left: 35px;
}
.question.check_error {
  border: 1px solid rgb(255, 72, 72) !important; border-image: none !important;
}
.question .qt_error {
  border-radius: 2px; color: rgb(255, 255, 255); font-weight: bold; margin-bottom: 5px; -ms-word-break: break-all; -ms-word-wrap: break-word; background-color: rgb(255, 72, 72);
}
.question .error {
  border-radius: 2px; color: rgb(255, 255, 255); font-weight: bold; margin-bottom: 5px; -ms-word-break: break-all; -ms-word-wrap: break-word; background-color: rgb(255, 72, 72);
}
.box .question {
  border-width: 1px 0px 1px 1px; border-style: solid none solid solid; border-color: rgb(222, 222, 222) currentColor rgb(222, 222, 222) rgb(222, 222, 222); padding: 12.8px 47.7px; border-image: none; color: rgb(73, 73, 73); line-height: 22px; letter-spacing: -0.44px; font-size: 12px; margin-bottom: 10px; position: relative; background-color: rgb(255, 255, 255);
}
.question p {
  -ms-word-break: break-all; -ms-word-wrap: break-word;
}
.question .qt_title {
  margin: 0px 0px 6px;
}
.question .qt_title .title {
  left: 9px; color: rgb(93, 156, 236); line-height: 22px; letter-spacing: -0.88px; font-family: MicrosoftYaHei; font-size: 24px; position: absolute;
}
.question .key_A {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_B {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_C {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_D {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_E {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_F {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_G {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_H {
  margin: 0px 0px 5px; border-radius: 2px; border: 1px solid rgb(228, 234, 240); border-image: none;
}
.question .key_A .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_B .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_C .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_D .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_E .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_F .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_G .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question .key_H .title {
  color: rgb(93, 156, 236); margin-right: 3px;
}
.question > p .checkOrRadio {
  margin: 0px 10px;
}
.question .qt_answer {
  margin: 0px 0px 5px;
}
.question .qt_analysis {
  margin: 0px 0px 5px;
}
.question .title {
  color: rgb(173, 192, 212);
}
.import_choose {
  margin: 0px 5px; top: -2px; width: 30px; height: 30px; display: inline-block; position: relative;
}
.import_choose input {
  width: 30px; height: 30px; z-index: 1; opacity: 0;
}
.import_choose:hover .icon-tip {
  display: block;
}
.icon-tip {
  padding: 5px; border-radius: 5px; border: 1px solid rgb(204, 204, 204); border-image: none; left: 20px; top: 30px; text-align: center; line-height: 20px; display: none; position: absolute; min-width: 150px; background-color: rgb(247, 247, 247);
}
.btn-s-blue {
  margin: 0px !important; border: 1px solid rgb(93, 156, 236) !important; border-image: none !important; color: rgb(255, 255, 255) !important; font-size: 14px; background-color: rgb(93, 156, 236);
}
.errorText {
  color: rgb(0, 0, 0); font-weight: bold; background-color: rgb(255, 204, 51);
}
.errorTextNew {
  color: rgb(0, 0, 0); font-weight: bold; background-color: rgb(125, 192, 255);
}
#errorDiv {
  width: 100%; height: 295px; overflow: auto; display: block; max-height: 295px;
}
.batch-input p {
  margin: 0px; line-height: inherit;
}
.question {
  padding: 10px;
}
#errorText {
  color: rgb(255, 0, 0); margin-right: 10px;
}
@media all and (min-width:768px)
{
  #qtExample .modal-dialog {
    margin: 120px auto; width: 650px;
  }
  #qtStandard .modal-dialog {
    margin: 120px auto; width: 650px;
  }
  #qtStandard1 .modal-dialog {
    margin: 120px auto; width: 650px;
  }
  #txtImport .modal-dialog {
    margin: 200px auto; width: 550px;
  }
}
#qtExample .modal-body {
  font-size: 14px; position: relative;
}
.accordion-group h2 {
  text-align: center; color: rgb(34, 172, 56); font-size: 20px; margin-top: -10px; margin-bottom: 10px;
}
.import_row {
  height: 100px; text-align: center;
}
#conResult {
  margin: 5px 20px 10px; width: 120px;
}
#showQuestion {
  margin: 5px 20px 10px; width: 120px;
}
#continueAddQuestion {
  margin: 5px 20px 10px; width: 120px;
}
.import_choose {
  margin: 0px 5px; top: -2px; width: 30px; height: 30px; display: inline-block; position: relative;
}
.import_choose input {
  width: 30px; height: 30px; z-index: 1; opacity: 0;
}
.import_choose:hover .icon-tip {
  display: block;
}
.icon-tip {
  padding: 5px; border-radius: 5px; border: 1px solid rgb(204, 204, 204); border-image: none; left: 20px; top: 30px; text-align: center; line-height: 20px; display: none; position: absolute; min-width: 150px; background-color: rgb(247, 247, 247);
}
.bootstrap-dialog .modal-header {
  padding: 5px 0px 0px; height: 50px;
}
.bootstrap-dialog-title {
  line-height: 30px; font-size: 20px;
}
.bootstrap-dialog .modal-dialog {
  width: 550px;
}
.bootstrap-dialog-message .success ol {
  padding: 0px; height: 60px;
}
.bootstrap-dialog .bootstrap-dialog-message {
  text-align: left;
}
.bootstrap-dialog-message .success ol li {
  list-style: none; padding: 20px 6px 0px 0px; float: left;
}
.bootstrap-dialog-message .error ol li {
  padding: 10px;
}
.bootstrap-dialog-message .error {
  clear: both;
}
.bootstrap-dialog-message .title {
  padding: 5px 0px 5px 5px; border-radius: 5px; color: rgb(255, 255, 255); font-size: 16px; font-weight: bold;
}
.bootstrap-dialog-message .success-title {
  background-color: rgb(108, 205, 129);
}
.bootstrap-dialog-message .error-title {
  background-color: rgb(228, 109, 107);
}
#excel_import .download {
  padding: 0px; width: 100px; height: 34px; line-height: 34px; text-decoration: none; vertical-align: middle; position: relative;
}
#excel_import .upload {
  padding: 0px; width: 100px; height: 34px; line-height: 34px; text-decoration: none; vertical-align: middle; position: relative;
}
#word_import .download {
  padding: 0px; width: 100px; height: 34px; line-height: 34px; text-decoration: none; vertical-align: middle; position: relative;
}
#word_import .upload {
  padding: 0px; width: 100px; height: 34px; line-height: 34px; text-decoration: none; vertical-align: middle; position: relative;
}
#excel_import .upload input {
  left: 0px; top: 0px; width: 92px; height: 36px; line-height: 36px; position: absolute; z-index: 2; cursor: pointer !important; opacity: 0; -moz-opacity: 0;
}
#word_import .upload input {
  left: 0px; top: 0px; width: 92px; height: 36px; line-height: 36px; position: absolute; z-index: 2; cursor: pointer !important; opacity: 0; -moz-opacity: 0;
}
#word_import .word_import_prompt {
  text-align: center; margin-top: 120px;
}
#text-input {
  height: 100%; white-space: pre-wrap !important;
}
.btn-size {
  width: 90px; height: 34px;
}
span.title-font {
  color: rgb(26, 140, 254);
}
.message-dialog .modal-dialog {
  width: 440px;
}
.bootstrap-dialog.message-dialog .bootstrap-dialog-message {
  text-align: center;
}
.upload-form {
  text-align: center; position: relative;
}
.label-box {
  text-align: center; position: relative;
}
.upload-form .tip {
  left: -40px; width: 200px; bottom: -30px; color: rgb(153, 153, 153); position: absolute;
}
#tip {
  margin: 10px auto; width: 520px; text-align: left; color: rgb(153, 153, 153);
}
.fr-buttons {
  display: none !important;
}
.fr-arrow {
  display: none !important;
}
.fr-popup {
  border: 0px currentColor !important; border-image: none !important; box-shadow: none;
}
#preview .question {
  padding-top: 20px !important;
}
#preview :first-child.question {
  border-top-color: currentColor; border-top-width: 0px; border-top-style: none;
}
.question .qt_answer {
  line-height: 20px !important;
}
.question .qt_analysis {
  line-height: 20px !important;
}
.type-box {
  margin-bottom: 5px !important; display: block;
}
.change-type {
  float: right;
}
.change-type input {
  margin-right: 12px; cursor: pointer;
}
.type-name {
  margin: 0px; border-radius: 2px; border: 1px solid rgb(204, 204, 204); border-image: none; width: 56px; height: 22px; text-align: center; line-height: 20px; display: inline-block;
}
.type-name-1 {
  border-color: rgb(26, 140, 254); color: rgb(26, 140, 254) !important;
}
.type-name-2 {
  border-color: rgb(29, 200, 140); color: rgb(29, 200, 140) !important;
}
.type-name-3 {
  border-color: rgb(247, 99, 119); color: rgb(247, 99, 119) !important;
}
.type-name-4 {
  border-color: rgb(160, 106, 210); color: rgb(160, 106, 210) !important;
}
.type-name-5 {
  border-color: rgb(201, 163, 16); color: rgb(201, 163, 16) !important;
}
.input-body {
  padding: 0px; height: 100%; overflow: auto;
}
.input-parent-box {
  padding: 0px 30px !important; max-height: 468px; box-sizing: border-box;
}
.top-title {
  color: rgb(39, 39, 74) !important; font-size: 20px !important;
}
.input-common-title {
  color: rgb(39, 39, 74); font-size: 14px;
}
.txt-red {
  color: rgb(255, 0, 0);
}
.input-example-content-top {
  padding: 20px 30px; color: rgb(101, 101, 119); line-height: 20px; font-size: 12px; margin-bottom: 5px; box-sizing: border-box;
}
.input-rule-content {
  padding: 20px 30px; color: rgb(101, 101, 119); line-height: 20px; font-size: 12px; margin-bottom: 5px; box-sizing: border-box;
}
.input-example-content {
  padding: 20px 30px; color: rgb(101, 101, 119); line-height: 20px; font-size: 12px; margin-bottom: 5px; box-sizing: border-box;
}
.input-example-content {
  padding: 20px; color: rgba(0, 0, 0, 0); z-index: 9;
}
.input-example-content-top {
  padding: 20px; border: 1px solid hsla(0, 0%, 100%, 0.5); border-image: none; top: 0px; width: 100%; position: absolute; z-index: 999;
}
.input-com-detail {
  margin-bottom: 20px;
}
.fr-element.fr-view {
  min-height: 100% !important;
}
#helpBtn {
  background: rgba(26, 140, 254, 0.1); padding: 0px 10px; border-radius: 2px; border: 1px solid rgba(26, 140, 254, 0.2); border-image: none; height: 28px; color: rgb(26, 140, 254); line-height: 28px; font-size: 14px; margin-top: 16px; margin-right: 20px; float: right; min-width: 95px;
}
#excel_import {
  text-align: center;
}
.el-tabs--border-card{
  height: 100%;
}
.el-tabs--border-card>.el-tabs__content{
  padding-top: 0;
  height: 100%;
}
.el-tab-pane{
  height: 100%;
}
#excel_import .img-top {
  margin: 80px auto 30px;
}
#excel_import .title-excel {
  color: rgb(39, 39, 74); font-size: 24px; margin-bottom: 20px; display: block;
}
#excel_import .tip-excel p {
  text-align: left; color: rgb(101, 101, 119); font-size: 14px; margin-bottom: 0px;
}
#excel_import .tip-excel {
  margin: 0px auto; width: 526px;
}
#excel_import .btn-excel {
  margin-top: 60px;
}
.download {
  background: rgb(255, 255, 255); border-radius: 4px; border: 1px solid rgb(26, 140, 254); border-image: none; color: rgb(26, 140, 254); font-size: 14px;
}
.btn-primary:hover {
  border-color: rgb(26, 140, 254); color: rgb(255, 255, 255); background-color: rgb(26, 140, 254);
}
.download.btn-primary:hover {
  background: rgb(255, 255, 255); border-color: rgb(26, 140, 254); color: rgb(26, 140, 254);
}
#error-div .title-excel {
  color: rgb(39, 39, 74); font-size: 24px; margin-bottom: 30px; display: block;
}
#error-div {
  text-align: center; padding-top: 80px;
}
#error-div .error-top {
  height: 300px; -ms-overflow-y: auto;
}
#error-div .error-tip {
  background: rgba(255, 75, 80, 0.05); margin: 0px auto; padding: 10px; border-radius: 2px; border: 1px solid rgba(255, 75, 80, 0.2); border-image: none; width: 380px; text-align: left; color: rgb(39, 39, 74); font-size: 14px;
}
#error-div .error-tip .icon-a_error {
  color: rgb(255, 75, 80); margin-right: 6px;
}
#error-div .error-btn {
  padding: 20px; height: 74px;
}
#error-div .excelBtn {
  background: rgb(242, 242, 242); border-color: rgb(242, 242, 242); padding: 0px; border-radius: 4px; width: 100px; height: 34px; color: rgb(101, 101, 119); line-height: 34px; font-size: 14px;
}
#success-div .title-excel {
  color: rgb(39, 39, 74); font-size: 24px; margin-bottom: 30px; display: block;
}
#success-div {
  text-align: center; padding-top: 80px;
}
#success-div .success-top {
  height: 300px; -ms-overflow-y: auto;
}
#success-div .success-tip {
  background: rgba(103, 194, 58, 0.05); margin: 0px auto; padding: 10px; border-radius: 2px; border: 1px solid rgba(103, 194, 58, 0.2); border-image: none; width: 380px; text-align: left; color: rgb(39, 39, 74); font-size: 14px;
}
#success-div .success-tip .icon-a_success {
  color: rgb(103, 194, 58); margin-right: 6px;
}
#success-div ol {
  padding-left: 24px; list-style-type: none;
}
#success-div .success-btn {
  padding: 20px; height: 74px;
}
#success-div .excelAgainBtn {
  background: rgb(242, 242, 242); border-color: rgb(242, 242, 242); padding: 0px; border-radius: 4px; width: 100px; height: 34px; color: rgb(101, 101, 119); line-height: 34px; font-size: 14px;
}
#questionsList {
  background: rgb(26, 140, 254); padding: 0px; border-radius: 4px; width: 100px; height: 34px; color: rgb(255, 255, 255); line-height: 34px; font-size: 14px; margin-left: 10px;
}
#createExam {
  background: rgb(26, 140, 254); padding: 0px; border-radius: 4px; width: 100px; height: 34px; color: rgb(255, 255, 255); line-height: 34px; font-size: 14px; margin-left: 10px;
}
#selTypeModal {
  border: 0px currentColor; border-image: none;
}
#classDialog {
  padding: 10px 0px; border-radius: 4px; left: 90px; top: 48px; width: 25%; height: 310px; position: absolute; z-index: 999; box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2); background-color: rgb(255, 255, 255);
}
.setRigth .setRigthContent {
  height: 300px; padding-bottom: 0px;
}
#subForm {
  height: 300px; padding-bottom: 80px;
}
.topSelDiv {
  height: 240px;
}
#treeDemo {
  height: 240px; overflow: scroll;
}
#copyElement {
  background: rgb(26, 140, 254); padding: 0px; border-radius: 4px; width: 120px; height: 34px; color: rgb(255, 255, 255); font-size: 14px; margin-left: 14px;
}
#qtStandard {
  height: 0px; position: relative; z-index: 99; box-shadow: 0px 2px 10px 0px rgba(58,62,81,0.1); background-color: rgb(255, 255, 255);
}
#qtStandard1 {
  height: 0px; position: relative; z-index: 99; box-shadow: 0px 2px 10px 0px rgba(58,62,81,0.1); background-color: rgb(255, 255, 255);
}
#qtExample {
  height: 0px; position: relative; z-index: 99; box-shadow: 0px 2px 10px 0px rgba(58,62,81,0.1); background-color: rgb(255, 255, 255);
}
.active#qtStandard .modal-footer {
  display: block;
}
.active#qtStandard1 .modal-footer {
  display: block;
}
.active#qtExample .modal-footer {
  display: block;
}
#qtStandard1 .modal-footer {
  background: rgb(243, 243, 245); padding: 0px 10px; width: 60px; height: 24px; right: 0px; bottom: -25px; color: rgb(26, 140, 254); line-height: 24px; font-size: 12px; border-top-color: currentColor; border-top-width: 0px; border-top-style: none; display: none; position: absolute;
}
#qtExample .modal-footer {
  background: rgb(243, 243, 245); padding: 0px 10px; width: 60px; height: 24px; right: 0px; bottom: -25px; color: rgb(26, 140, 254); line-height: 24px; font-size: 12px; border-top-color: currentColor; border-top-width: 0px; border-top-style: none; display: none; position: absolute;
}
#qtStandard .modal-footer {
  background: rgb(243, 243, 245); padding: 0px 10px; width: 60px; height: 24px; right: 0px; bottom: -25px; color: rgb(26, 140, 254); line-height: 24px; font-size: 12px; border-top-color: currentColor; border-top-width: 0px; border-top-style: none; display: none; position: absolute;
}
#qtExample .modal-footer {
  width: 140px;
}
#qtStandard .btn-close {
  background: rgb(243, 243, 245); padding: 0px; border: 0px currentColor; border-image: none; color: rgb(26, 140, 254); font-size: 12px; margin-left: 0px;
}
#qtStandard1 .btn-close {
  background: rgb(243, 243, 245); padding: 0px; border: 0px currentColor; border-image: none; color: rgb(26, 140, 254); font-size: 12px; margin-left: 0px;
}
#qtExample .btn-close {
  background: rgb(243, 243, 245); padding: 0px; border: 0px currentColor; border-image: none; color: rgb(26, 140, 254); font-size: 12px; margin-left: 0px;
}
#continueOpen {
  background: rgb(243, 243, 245); padding: 0px; border: 0px currentColor; border-image: none; color: rgb(26, 140, 254); font-size: 12px; margin-right: 10px;
}
.active#continueOpen {
  display: none;
}
.dialog-style-button #importButton {
  left: 50%; top: 10px; width: 100px; height: 34px; font-size: 14px; margin-left: -50px; position: absolute;
}
.dialog-style-button {
  width: calc(50% - 5px); height: 54px; text-align: center; right: 0px; bottom: 0px; line-height: 54px; position: absolute; z-index: 999; background-color: rgb(255, 255, 255);
}
#closeButton {
  background: rgb(242, 242, 242); border-color: rgb(242, 242, 242); border-radius: 4px; width: 100px; height: 34px; color: rgb(102, 102, 102); font-size: 14px; box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.1);
}
.textarea-wrap {
  border-right-color: currentColor !important; border-right-width: 0px !important; border-right-style: none !important;
}
#addQuestion1 {
  display: inline-block;
}
#addQuestion2 {
  padding-right: 20px; display: inline-block;
}
.batch-import-top{
  display: flex;
  align-items: center;
  padding-bottom: 15px;
}
.textarea-group::after {
  content: '';
  background-image: url("/batchImport/img/srq.png");
  z-index: 0;
  background-size: 240px 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 80px;
}

.batch-preview-box::before {
  content: '';
  background-image: url("/batchImport/img/jcq.png");
  /*z-index: 99;*/
  background-size: 240px 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 80px;
}

  .el-dropdown-menu{
    max-height: 300px;
    overflow-y: scroll;
  }
.batch-import-top .el-button-group .el-button--primary:last-child{
  height: 28px;
}
</style>
