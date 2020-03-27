
 * @Date: 2020-02-15 16:57:27
 * @LastEditors: Donkey
 * @Author: lj
 * @LastEditTime: 2020-03-20 10:09:53
 * @Description: 批量录入

<template>
  <div class="app-container calendar-list-container">
    <div class="tab-content">
      <form id="subForm1" name="form" action="" method="post">
        <div id="manualInput" class="tab-pane active" role="tabpanel">
          <div class="batch-type">
            <div id="addQuestion2">
              <div style="display: inline-block;"><span class="intro">试题分类</span>
                <button id="selTypeLink" class="btn btn-default" type="button">
                  试题分类
                </button>
                <input name="classification" type="hidden" value="134369">

                <div id="classDialog" hidden="">
                  <iframe
                    id="selTypeModal"
                    name="selTypeModal"
                    width="100%"
                    height="300"
                    src="about:blank"
                  />
                </div>
              </div>
              <span class="intro">批量补充难度</span>
              <div class="simulationSelect difficult"><span class="title-font">简单</span>
                <em class="glyphicon glyphicon-triangle-bottom" />

                <div class="simulationOption difficult">
                  <div class="one">简单</div>
                  <div class="two">普通</div>
                  <div class="three">困难</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="inputArea" class="batch-cont">
          <div class="addQuestion4" />
          <div class="batch-input clearfix">
            <div class="batch-input-box">
              <div class="toolbar"><span class="title">输入区：</span>

                <div class="toolbar-right"><span
                                             id="showExample"
                                             class="example"
                                           >输入范例 <span
                                             class="icon icon-a_arrow_down"
                                             style="font-size: 12px;"
                                           /> </span>
                  <span id="showStandard" class="standard">输入规范 <span
                    class="icon icon-a_arrow_down"
                    style="font-size: 12px;"
                  /> </span>
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
                          <span>难度:普通</span><br>

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
                          <span>难度:困难</span><br>

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
                          <span>难度:普通</span><br>

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
                          <span>难度:普通</span><br>

                        </p>
                      </div>

                      <div class="input-example-question">

                        <p style="margin: 10px 0px; visibility: hidden;">判断题</p>

                        <p class="input-com-detail" style="margin-left: 10px;">
                          <span>1.国际象棋起源于英国吗？</span><br>
                          <span>答案:对</span><br>
                          <span>解析:无
                            <span style="visibility: hidden;">(若无解析本行可不填)</span></span><BR style="visibility: hidden;" />
                          <span>难度:困难</span><br>

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
                          <span>难度:普通</span><br>

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
                  <button class="btn btn-default btn-close" type="button"><span
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
  </div>
</template>

<script>
import {
  fetchList,
  addObj,
  putObj,
  delObj,
  getCourseList,
  getLessonList } from '@/api/question/question'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(type, list) {
      let result
      list.map(ele => {
        if (type === ele.value) {
          result = ele.label
        }
      })
      return result
    },
    dialogTitle(type) {
      const titleMap = {
        0: '新 增',
        1: '查 看',
        2: '编 辑',
        3: '删 除'
      }
      return titleMap[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      tableLoading: false,
      tearcherList: [],
      treeData: [],
      courseList: [],
      lessonList: [],
      questionListType: [],
      singleArray: ['', '', '', ''],
      letterArray: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      checkArray: [],
      tableOption: [
        {
          label: '题型',
          prop: 'questionTypeName',
          width: 100
        },
        {
          label: '题目内容',
          prop: 'stem'
        },
        {
          label: '题目类型',
          prop: 'questionType',
          dicUrl: 'question_type',
          dicData: [],
          width: 100
        },
        {
          label: '年份',
          prop: 'year',
          width: 60
        },
        {
          label: '参考答案',
          prop: 'answer',
          width: 120
        },
        {
          label: '难度',
          prop: 'difficulty',
          dicUrl: 'question_difficulty',
          dicData: [],
          width: 80
        },
        {
          label: '课程',
          prop: 'courseId',
          width: 120
        },
        {
          label: '课时',
          prop: 'lessonId',
          width: 120
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 160
        },
        {
          label: '分值',
          prop: 'score',
          width: 60
        }
      ],
      tableData: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchForm: {},
      dialogPvVisible: false,
      operationStatus: 0,
      labelWidth: '90px',
      form: {}, // 新增 编辑 数据源
      formLabelWidth: '90px',
      rules: {
        // 表单校验
        typeId: [{ required: true, message: '请选择题目题型', trigger: 'blur' }],
        stem: [{ required: true, message: '请输入题目内容', trigger: 'blur' }],
        questionType: [{ required: true, message: '请选择题目题型', trigger: 'blur' }],
        year: [{ required: true, message: '请输入年份', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入参考答案', trigger: 'blur' }],
        difficulty: [{ required: true, message: '请输入难度', trigger: 'blur' }],
        courseId: [{ required: true, message: '请选择所属课程', trigger: 'blur' }],
        score: [{ required: true, message: '请输入题目分值', trigger: 'blur' }]
      },
      parentId: 0,
      hasParentId: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getCourseList()
    // this.initBatchImport()
  },
  methods: {
    /* eslint-disable */
    initBatchImport() {
      var upload_file = ''
      var qt_type = '1'
      var typeName = ['单选题', '多选题', '判断题', '填空题', '问答题']
      var nameReg = /^\n?\s*(([0-9]+\s*[.|、])|(((\()|（)[0-9]+((\))|）)))\s*(.*?)\s*(?:\n|$)/g
      var singleReg = /^\n?\s*(答案[:：])\s*(.*?)\s*(?:\n|$)/g
      var fillReg = /([\(|\（]\s*[\)|\）])/g
      var labelOpen = '0'// 试题标签功能是否开启:1开启，0关闭
      var sourceFrom = ''// 标记是否从弹窗点击
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
        $('div#text-input').froalaEditor({
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
        }).on('froalaEditor.contentChanged', function(e, editor) {
          setTimeout(function() {
            $('#preview').html('')
            var newArr = []
            var indexArr = []
            var questionArr = []
            var detail = []
            var contentText = editor.html.get().replace(/<p>/g, '\n\n').replace(/<\/p>/g, '\n\n').replace(/<br>/g, '\n\n').replace(/auto;">/g, 'auto;">\n\n').split('\n')
            console.log('contentText', contentText)
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
                  getClassify(value, detail, 4)
                } else {
                  // 否则默认为问答题
                  getClassify(value, detail, 5)
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
                          getClassify(value, detail, 4)
                          return false
                        }
                        // 无选项情况下，默认为问答题（主要包括判断题与问答题的区分）
                        getClassify(value, detail, 5)
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
                        getClassify(value, detail, 3)
                      }
                      if (!isSelect && !isJude) {
                        // 填空题
                        if ((((value.join(' ').split('答案:'))[0].match(fillReg)) && (value.join(' ').split('答案:')).length > 1) ||
                          (((value.join(' ').split('答案：'))[0].match(fillReg))) && (value.join(' ').split('答案：')).length > 1) {
                          getClassify(value, detail, 4)
                        } else {
                          // 问答题
                          getClassify(value, detail, 5)
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

              qt_type = value.type
              html = markdown.toHTML((value.name).join(''))

              $('div#preview').append(html)

              // 标记答案
              markAnswer(qt_type, ii)
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
        }).on('froalaEditor.image.beforeUpload', function(e, editor, images) {
          // Return false if you want to stop the image upload.
          //                if(images[0].size>2*1024*1024){
          //                    alert("图片过大，无法上传");
          //                    return false;
          //                }
        }).on('froalaEditor.image.uploaded', function(e, editor, response) {
          // 如果上传失败
          if (response.bizContent) {
            alert(response.bizContent.desc)
          }
        }).on('froalaEditor.image.error', function(e, editor, error, response) {
          // Image too text-large.
          if (error.code == 5) {
            alert('图片过大，无法上传')
          }
          // Invalid image type.s
          else if (error.code == 6) {
            alert('不支持该图片类型，请上传jpeg, jpg, png格式的图片')
          }
        }).on('froalaEditor.focus', function(e, editor) {
          // froala中有专门用于隐藏placeholder的方法--placeholder.hide()，但是尝试过不生效，因此用笨办法做隐藏显示
          if (editor.placeholder.isVisible()) {
            $('.fr-placeholder').hide()
          }
        }).on('froalaEditor.blur', function(e, editor) {
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
        $('.question').eq(ii).each(function(index, element) {
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
          if (type == '4') {
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
          if (type == '5') {
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
      $('.body-content .cont-r .tab-content .batch-type .simulationSelect').click(function(e) {
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
    },
    getList() {
      this.tableLoading = true
      const param = { parentId: this.parentId }
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: this.page.current,
            size: this.page.size
          },
          this.searchForm,
          param
        )
      )
        .then(res => {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    /**
     * 创建方法
     * @param form
     * @returns
     */
    create(form) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.dialogPvVisible = false
          this.tableLoading = true
          if (
            this.form.typeId === 1 ||
            this.form.typeId === 2 ||
            this.form.typeId === 3
          ) {
            const optionsContent = []
            for (let i = 0; i < this.singleArray.length; i++) {
              const content = {
                name: this.letterArray[i],
                content: this.singleArray[i]
              }
              optionsContent.push(content)
            }
            const jsonstr = JSON.stringify(optionsContent)
            this.form.optionsContent = jsonstr
            const checkAnswer = []
            if (this.form.typeId === 2 || this.form.typeId === 3) {
              for (let i = 0; i < this.checkArray.length; i++) {
                checkAnswer.push(this.checkArray[i])
              }
              const jsonAnswer = JSON.stringify(checkAnswer)
              this.form.answer = jsonAnswer
            }
          }
          if (this.form.id != null) {
            putObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
              .catch(() => {
                this.tableLoading = false
              })
          } else {
            addObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
              .catch(() => {
                this.tableLoading = false
              })
          }
        } else {
          return false
        }
      })
    },
    /**
     * 课程列表
     */
    getCourseList() {
      getCourseList().then(res => {
        this.courseList = res.data
      })
    },
    /**
     * 课时列表
     */
    getLessonList(type) {
      getLessonList(this[type].courseId).then(res => {
        this.lessonList = res.data
      })
    },
    /**
     * 重置
     * @param form
     * @returns
     */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFilter() {
      this.getList()
    },
    handleEmpty() {
      this.searchForm = {}
      this.getList()
    },
    getOptionsContent(row) {
      const json = JSON.parse(row.optionsContent)
      const type = row.typeId
      if (type === 2) {
        if (json === null || json === '') {
          this.checkArray = []
        } else {
          this.checkArray = JSON.parse(row.answer)
        }
      }
      if (type === 1 || type === 2 || type === 3) {
        if (json === null || json === '') {
          this.singleArray = ['', '', '', '']
        } else {
          this.singleArray = []
          for (let i = 0; i < json.length; i++) {
            this.singleArray.push(json[i].content)
          }
        }
      }
    },
    handleView(row) {
      this.form = row
      this.getOptionsContent(row)
      this.dialogPvVisible = true
      this.operationStatus = 1
    },
    handleUpdate(row) {
      this.form = row
      this.getOptionsContent(row)
      this.dialogPvVisible = true
      this.operationStatus = 2
    },
    handleAnalysisList(row, index) {
      this.parentId = row.id
      this.hasParentId = true
      this.getList()
    },
    handleBack(row, index) {
      this.parentId = 0
      this.hasParentId = false
      this.getList()
    },
    handleDelete(row, index) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delObj(row.id)
        })
        .then(data => {
          _this.$message.success('删除成功')
          this.getList()
        })
    },
    handleClose(form) {
      this.dialogPvVisible = false
      this.form = {}
      this.$refs[form].resetFields()
    },
    handleCreate() {
      this.dialogPvVisible = true
      this.form = {
        parentId: this.parentId,
        typeId: 1,
        questionType: '1',
        difficulty: '1',
        score: 0,
        year: new Date().getFullYear() + ''
      }
    },
    optionAdd() {
      if (this.singleArray.length < this.letterArray.length) {
        this.singleArray.push('')
      }
    },
    optionDel(index) {
      this.singleArray.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
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
  height: calc(100% - 59px); border-top-color: rgb(196, 207, 220); border-top-width: 1px; border-top-style: solid;
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
  margin-right: 20px;
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
}
.batch-input-box {
  background: rgb(255, 255, 255); padding-bottom: 25px; margin-right: 10px; border-right-color: rgb(222, 222, 222); border-right-width: 1px; border-right-style: solid;
}
.batch-input-box .box {
  width: 100% !important; color: rgb(74, 74, 74); line-height: 40px; letter-spacing: -0.35px; overflow: auto; margin-left: 0px; border-top-color: rgb(222, 222, 222); border-right-color: currentColor; border-left-color: currentColor; border-top-width: 1px; border-right-width: medium; border-left-width: medium; border-top-style: solid; border-right-style: none; border-left-style: none;
}
.batch-input-box .textarea-wrap {
  height: auto !important;
}
.fr-box.fr-basic .fr-element {
  padding-bottom: 0px !important;
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
  background: rgb(255, 255, 255); width: 100%; height: calc(100% - 40px); color: rgb(74, 74, 74); line-height: 40px; letter-spacing: -0.35px; overflow: auto; border-top-color: rgb(222, 222, 222); border-right-color: currentColor; border-left-color: currentColor; border-top-width: 1px; border-right-width: medium; border-left-width: medium; border-top-style: solid; border-right-style: none; border-left-style: none;
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

</style>
