//loading和提示
$(function () {
    showBtnByEnv();
    // initial tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // initial popover
    $('[data-toggle="popover"]').popover();

    // ajaxstart with loading shown
    $( document ).ajaxStart(function() {
        $("#spinnerLoading").removeClass("hidden");
    });
    // ajaxstop with loading hidden
    $( document ).ajaxStop(function() {
        $("#spinnerLoading").addClass("hidden");
    });

});

//导航逻辑
$(function () {
    //读取导航（根据模块权限动态生成）
    if($("#ksxAdminSidebar").length>0){
        $.ajax({
            type: "POST",
            cache : false,
            dataType: "json",
            url: "/index/admin/getAllRights",
            success: function (msg) {
                if(msg.success){
                    //生成导航
                    KSXRIGHTS = msg.bizContent;
                    createSidebar(KSXRIGHTS, adjustPosition);
                }
            }
        });
    }


    //生成导航
    function createSidebar(data, callback) {
        //https://admindev.kaoshixing.com/static/base/js/ksx-nav.json
        // https://s1.kaoshixing.com/config_file/ksx-nav.json

        $.get("https://s1.kaoshixing.com/config_file/ksx-nav.json",function(res){
            $("#ksxAdminSidebar").empty();

            var navList = res.admin;


            //模块遍历
            for (var index = 0; index < navList.length; index++) {
                var module = navList[index];
                var moduleDom = $('<ul class="sidebar-trans"></ul>');

                // 一级导航遍历
                for (var i = 0; i < module.length; i++) {
                    var navFirst = module[i];
                    var navFirstDom;

                    if(navFirst.hasOwnProperty("children")){
                        navFirstDom = $('<li class="nav-item">'+
                            '<div class="nav-item-wrap">'+
                            '<div class="nav-icon"><i class="icon '+navFirst.icon+'"></i></div>'+
                            '<div class="nav-title">'+navFirst.name+'<i class="icon icon-a_arrow_right"></i></div>'+
                            '</div>'+
                            '</li>');

                        var navSecondDom = $('<div class="nav-sub-item-wrap clearfix"></div>');

                        // 二级导航遍历
                        for (var j = 0; j < navFirst.children.length; j++) {
                            var navSecond =  navFirst.children[j];

                            // 存在子菜单
                            if(navSecond.hasOwnProperty("children")){
                                var navSecondLiDom = $('<div class="nav-sub-item">'+
                                    '<div class="title">'+navSecond.name+'</div>'+
                                    '<div class="split"></div>'+
                                    '<ul class="item-list"></ul>'+
                                    '</div>');

                                // 三级导航遍历
                                for (var k = 0; k < navSecond.children.length; k++) {
                                    var navThird = navSecond.children[k];
                                    //beta标记
                                    var betaDom = (navThird.hasOwnProperty("beta") && navThird.beta) ?
                                        '<img class="mark-icon" src="https://s6.kaoshixing.com/ksxing_static/vue/images/icon/a_nav_beta.svg" />' : '';

                                    var navThirdDom = $('<li><a href="'+window[navThird.prefix] + navThird.url+'">'+navThird.name + betaDom +'</a></li>');

                                    navThird.show = navThird.key ? data[navThird.key] : navThird.show;

                                    if(navThird.show){
                                        navSecondLiDom.find(".item-list").append(navThirdDom);
                                    }
                                }

                                // 过滤出三级导航有权限的列表
                                var navSecondFilter = navSecond.children.filter(function (nav) {
                                    return nav.show;
                                });
                                // 当存在有权限的三级导航时二级导航显示
                                navSecond.show = (navSecondFilter.length>0);

                                if(navSecond.show){
                                    navSecondDom.append(navSecondLiDom);
                                }

                            }else {
                                navSecond.show = navSecond.key ? data[navSecond.key] : navSecond.show;

                                if(navSecond.show){
                                    if(navSecondDom.find(".item-list").length==0){
                                        navSecondDom.append('<ul class="item-list"></ul>');
                                    }

                                    navSecondDom.find(".item-list").append('<li><a href="'+ window[navSecond.prefix] + navSecond.url+'">'+navSecond.name+'</a></li>');
                                }

                            }
                        }


                        // 若存在试用过期时间，插入
                        if(navFirst.hasOwnProperty("expirationDateKey")){
                            navSecondDom.append('<div class="expiration-date">试用截止时间：'+data[navFirst.expirationDateKey]+'</div>')
                        }

                        // 过滤出二级导航有权限的列表
                        var navFirstFilter = navFirst.children.filter(function (nav) {
                            return nav.show;
                        });

                        // 当存在有权限的二级导航时一级导航显示
                        navFirst.show = (navFirstFilter.length>0);

                        if(navFirst.show){
                            navFirstDom.append(navSecondDom);
                            moduleDom.append(navFirstDom);
                        }
                    }else {
                        navFirst.show = navFirst.key ? data[navFirst.key] : navFirst.show;

                        if(navFirst.show){
                            navFirstDom = $('<li class="nav-item nav-no-sub">'+
                                '<a class="nav-item-wrap" href="'+window[navFirst.prefix]+ navFirst.url + '">'+
                                '<div class="nav-icon"><i class="icon '+navFirst.icon+'"></i></div>'+
                                '<div class="nav-title">'+navFirst.name+'</div>'+
                                '</a>'+
                                '</li>');
                            moduleDom.append(navFirstDom);
                        }
                    }
                }

                $("#ksxAdminSidebar").append(moduleDom);
            }

            callback();
        });
    }

    //二级导航位置判断，调整使之完全显示
    function adjustPosition(){
        var winHeight = document.body.clientHeight;

        // 初始计算剩余高度
        $("#ksxAdminSidebar .nav-item").each(function (index, element) {
            // 二级导航面板距离视窗顶部距离，6为纠偏
            var elTop = element.getBoundingClientRect().top + 6;
            var elBottom = winHeight - elTop;
            var subNav = $(element).find(".nav-sub-item-wrap");

            if(subNav.length>0){
                var subNavHeight = $(subNav)[0].offsetHeight;

                if(elBottom<subNavHeight){
                    $(subNav).css({
                        top: 'initial',
                        bottom: 0
                    });
                }else {
                    $(subNav).css({
                        top: elTop - 70,
                        bottom: 'initial'
                    });
                }
            }
        });

        // 鼠标hover 计算是否有足够高度
        $("#ksxAdminSidebar .nav-item").hover(function () {
            var winHeight = document.body.clientHeight;

            // 二级导航面板距离视窗顶部距离，6为纠偏
            var elTop = this.getBoundingClientRect().top + 6;
            var elBottom = winHeight - elTop;
            var subNav = $(this).find(".nav-sub-item-wrap");

            if(subNav.length>0){
                var subNavHeight = $(subNav)[0].offsetHeight;

                if(elBottom<subNavHeight){
                    $(subNav).css({
                        top: 'initial',
                        bottom: 0
                    });
                }else {
                    $(subNav).css({
                        top: (elTop - 70) + 'px',
                        bottom: 'initial'
                    });
                }
            }
        }, function () {
            var subNav = $(this).find(".nav-sub-item-wrap");

            $(subNav).css({
                top: 'initial',
                bottom: 0
            });
        });
    }

    // fold sidebar
    $("#sidebar-fold").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if($(this).hasClass("icon-unfold")){
            // fold sidebar
            $(this).removeClass("icon-unfold").addClass("icon-fold").attr("title","展开导航").attr("data-original-title","展开导航");
            $(this).find(".icons8").removeClass("icons8-icon").addClass("icons8-icon-3");
            $(".viewFrameWork").removeClass("sidebar-full").addClass("sidebar-min");
            document.cookie = "ksxFoldState=fold; path = /; domain=.kaoshixing.com;";
        }else if ($(this).hasClass("icon-fold")) {
            // unfold sidebar
            $(this).removeClass("icon-fold").addClass("icon-unfold").attr("title","收起导航").attr("data-original-title","收起导航");
            $(this).find(".icons8").removeClass("icons8-icon-3").addClass("icons8-icon");
            $(".viewFrameWork").removeClass("sidebar-min").addClass("sidebar-full");
            document.cookie = "ksxFoldState=unfold; path = /; domain=.kaoshixing.com;";
        }
    });

});

//读取用户自定义LOGO
$(function () {
    if($("#companyLogo").length>0){
        var _this = $("#companyLogo");

        $.ajax({
            type: "GET",
            cache : false,
            dataType: "json",
            url: "/setting/admin/modify_get_logo",
            success: function(msg){
                if(msg.success){
                    var logo_url = msg.bizContent.logoUrl;
                    var img = '<img class="icon-logo logo-ksx" src="'+logo_url+'" />';
                    $(_this).append(img);
                    $('.linkImgDownLoad .logo').append(img);//每个页面如果有二维码链接图片下载，为下载的图片添加logo
                }
            }
        });
    }
});


// gio推送
$(function () {
    // gio 在线咨询
    $("body").on('click', '.gio-inquire-position', function () {
        //推送咨询事件
        ksxProbe.gioTrack('onlineInquire', 1, {
            'inquireFromPage_var': window.location.href,
            'inquireFromPageName_var': '管理员端',
            'inquireFromPosition_var':  $(this).attr('data-gio-position')
        });
    });

    //智齿 官网右下角图标
    $("body").on('click', '#zhichiBtnBox', function () {
        var title = $(this).find('.zc-advice-icon-btn-title').text();

        if(title=='收起'){
            //推送咨询事件
            ksxProbe.gioTrack('onlineInquire', 1, {
                'inquireFromPage_var': window.location.href,
                'inquireFromPageName_var': '管理员端',
                'inquireFromPosition_var':  '管理员端右下角咨询'
            });
        }
    });
});


// 客户使用引导
$(function () {
    // 传给后端当前访问的页面
    var _thisUrl;
    var ajaxFlag = false;
    _thisUrl =  LOCAL_URL.replace(/^https?:\/\/[^/]+/, ""); //测试 线上

    //需要发请求的页面url
    var urlArr = ['/admin/index/#/index',
        '/admin/exam_mgr_new',
        '/admin/paper_add_new',
        '/admin/paper_manual_add',
        '/admin/exam_add',
        '/admin/online_import_html',
        '/admin/file/manager'
    ];

    for (var i = 0; i <urlArr.length ; i++) {
        var ele = urlArr[i];
        if (_thisUrl.indexOf(ele) != -1){
            ajaxFlag = true;
        }
    }

    if(ajaxFlag){
        // 客户使用引导
        $.ajax({
            url: '/index/admin/use_intro_time',
            type: 'post',
            cache: false,
            async:false,
            data: {
                url: _thisUrl,
                isErrorPay: isErrorPay
            },
            dataType: 'json',
            success: function (msg) {
                if (msg.success){
                    // showIntroRights = msg.bizContent;
                    showIntroRights = {
                      isMain: 0,
                      isExamMassage: 0,
                      isExamCreate: 0,
                      isExamTest: 0,
                      isExamRelease: 0,
                      isItemBank: 0,
                      isAddItem: 0,
                      isAddPeople: 0,
                      isCourseList: 0,
                      isUpfile: 0,
                      isCustomProcess: 0
                    }
                }
            }
        });
    }

});


// 系统消息
$(function () {
    //初始化系统消息
    $.ajax({
        type:'POST',
        cache : false,
        dataType: "json",
        url: '/index/account/notification/',
        xhrFields:{
            withCredentials: true
        },
        crossDomain: true,
        success:function (msg) {
            var tool_count=msg.bizContent.unreadCount;
            var tool_html = '';

            // 未读标志
            if(tool_count>9){
                $('#stateMessage .message-count').text('9+').removeClass('hidden');
            }else if (tool_count>0) {
                $('#stateMessage .message-count').text(tool_count).removeClass('hidden');
            }else {
                $('#stateMessage .message-count').addClass('hidden');
            }

            // notifications是最新的消息，最多为5条，添加支消息框
            for (var i = 0; i <msg.bizContent.notifications.length; i++) {
                var content=msg.bizContent.notifications[i].content;
                if(msg.bizContent.notifications[i].isRead==0){//若状态为未读添加未读类
                    tool_html+='<div class="message unread" id="'+msg.bizContent.notifications[i].id+'">'+
                        '<span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span>'
                        +content+'</div>';
                }else {
                    tool_html+='<span class="message read" id="'+msg.bizContent.notifications[i].id+'">'+content+'</span><br>';
                }
            }

            // 如果所有消息中未读消息的数目不为0，则显示有未读消息的标志
            if (tool_count != 0) {
                $(".hasUnread").css("display","inline-block");
            }else {
                $(".hasUnread").hide();
            }

        }
    });


    // 若点击消息内部链接，则认为消息已读
    $("body").on('click', "#stateMessageSection .unread a", function () {
        var notification_id = $(this).parent(".unread").attr("id");
        $.ajax({
            type:'POST',
            cache : false,
            headers: { "cache-control": "no-cache" },
            dataType: "json",
            url: '/index/account/read_notification/',
            data: 'ids='+notification_id,
            success:function (msg) {}
        })
    });


    $("#stateMessage").click(function(){
        window.location.href = "/index/account/notification/";
    });
});

// 更新日志
$(function(){
    // if(!(optimization=='' || newCapabilities=='')){
    //     $("#changeLogModal").modal();
    // }

    // 更新消息已读
    $("#getChangeBtn").click(function (e) {
        e.preventDefault();

        $.ajax({
            url: '/index/admin/read_public',
            type: 'get',
            cache: false,
            dataType: 'json',
            success: function (msg) {
                $("#changeLogModal").modal('hide');
            }
        })
    });
});


//技术支持
$(function () {
    var techSupportKey; //技术支持请求回传的key参数
    var techSupportInterval;//计时支持计时id
    var techSupportExpireTime;

    $(".showTechHelpModal").click(function(e){ //点击导航 帮助-技术支持
        e.preventDefault();
        $.ajax({
            url:'/index/account/inquire_technology_support_link',
            type:'POST',
            dataType:'json',
            cache:false,
            headers:{"cache-control": "no-cache"},
            success:function(msg){
                msg.success?showTechSupportContent(msg.success,msg.bizContent.link.replace(/"/g,''),msg.bizContent.expireTime,msg.bizContent.key):showTechSupportContent(msg.success,'',-1,'');
                //该请求后端返回链接需要去除引号
                $("#techHelpModal").modal("show");
            }
        })
    });

    $(".getTechUsingLink").click(function(e){ //点击弹窗的"点击此处获取链接"
        e.preventDefault();
        $.ajax({
            url:'/index/account/get_technology_support_link',
            type:'POST',
            dataType:'json',
            cache:false,
            headers:{"cache-control": "no-cache"},
            success:function(msg){
                showTechSupportContent(msg.success,msg.bizContent.link,msg.bizContent.expireTime,msg.bizContent.key);
            }
        })
    });

    //延长1小时、减少1小时、作废链接
    $("#increaseHourBtn").click(function(e){
        e.preventDefault();
        $.ajax({
            url:'/index/account/operate_technology_support_link',
            data:'key='+techSupportKey+"&operate=1",
            type:'POST',
            dataType:'json',
            cache:false,
            headers:{"cache-control": "no-cache"},
            success:function(msg){
                techSupportExpireTime=parseInt(msg.bizContent.expireTime);
            }
        })
    });

    $("#decreaseHourBtn").click(function(e){
        e.preventDefault();
        $.ajax({
            url:'/index/account/operate_technology_support_link',
            data:'key='+techSupportKey+"&operate=-1",
            type:'POST',
            dataType:'json',
            cache:false,
            headers:{"cache-control": "no-cache"},
            success:function(msg){
                techSupportExpireTime=parseInt(msg.bizContent.expireTime);
            }
        })

    });

    $("#deleteTechLinkBtn").click(function(e){
        e.preventDefault();
        $.ajax({
            url:'/index/account/operate_technology_support_link',
            data:'key='+techSupportKey+"&operate=0",
            type:'POST',
            dataType:'json',
            cache:false,
            headers:{"cache-control": "no-cache"},
            success:function(msg){
                techSupportExpireTime=parseInt(msg.bizContent.expireTime);
            }
        })
    })

    function showTechSupportContent(linkSuccess,link,downTime,key){ //显示弹窗内容(链接、有效时间) 如果linkSuccess为true，则已经获取过链接，显示第二步的内容。否则显示第一步，通过点击获取链接
        if(linkSuccess&&downTime!=-1){
            techSupportKey=key;
            techSupportExpireTime=parseInt(downTime);
            clearInterval(techSupportInterval);
            techSupportInterval=setInterval(function(){
                techSupportExpireTime--;
                $("#techHelpModal .downTime").text(formatTime(techSupportExpireTime)+' 后到期');
                if(techSupportExpireTime<=0){ //已到期
                    clearInterval(techSupportInterval);
                    showTechSupportContent(false,'',-1,''); //显示第一步
                }
            },1000);
            $("#techHelpModal .firstStep").addClass('hidden');
            setTimeout(function(){
                $("#techHelpModal .link_input").val(link);
                $("#techHelpModal .secondStep").removeClass('hidden');
                $("#techHelpModal .btn-row").removeClass('hidden');
            },700);
        }else{
            $("#techHelpModal .firstStep").removeClass('hidden');
            $("#techHelpModal .secondStep").addClass('hidden');
            $("#techHelpModal .btn-row").addClass('hidden');
        }
    }


    //复制链接
    var techSupportClipboard = new Clipboard('.tech-help-modal .copyLinkBtn');
    techSupportClipboard.on('success', function(e) {
        alert("复制成功!");
    });
    techSupportClipboard.on('error', function(e) {
        alert("复制失败,请重试");
    });
});


// 退出登录(清空cookie,session&&sessionId)
$("#logoutBtn").click(function (e) {
    e.stopPropagation();
    e.preventDefault();

    $.ajax({
        type: "POST",
        cache : false,
        dataType: "json",
        url: "/login/account/logout",
        xhrFields:{
            withCredentials: true
        },
        crossDomain: true,
        success: function(msg){
            var jump_url = msg.bizContent.url;
            window.location.href = jump_url;
        }
    });

});



// set cookie
function setCookie(c_name,value){
    document.cookie=c_name+ "=" +escape(value);
}

// get cookie
function getCookie(c_name){
    if(document.cookie.length>0){
        var c_start=document.cookie.indexOf(c_name + "=")
        if(c_start!=-1){
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1){
                c_end=document.cookie.length
            }
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

//保存 search 条件
function setSearchCookie(cName, obj){
    var expiresTime = new Date();
    expiresTime.setTime(expiresTime.getTime() + (24 * 60 * 60 * 1000));
    var cookieStr = "";
    for(var itemName in obj){//用javascript的for/in循环遍历对象的属性
        if(obj[itemName] != ""){
            cookieStr += itemName + "=" + obj[itemName] + "&&";
        }
    }
    cookieStr = cName + "=" + escape(cookieStr) + ";" + "expires=" + expiresTime.toUTCString();
    document.cookie = cookieStr;
}

//删除 cookie
function delCookie(cName) {
    document.cookie=cName+"='';"
}

//获取 search 条件
function getSearchCookie(cName, itemName){
    if(document.cookie.length>0){
        var itemValue = "";
        var cStart=document.cookie.indexOf(cName + "=");
        if(cStart!=-1){
            cStart=cStart + cName.length+1;
            var c_end=document.cookie.indexOf(";",cStart);
            if (c_end==-1){
                c_end=document.cookie.length
            }
            itemValue = unescape(document.cookie.substring(cStart,c_end));
            var itemStart = itemValue.indexOf(itemName + "=");
            if(itemStart > -1){
                var itemEnd = itemValue.indexOf("&&",itemStart);
                itemValue = itemValue.substring(itemStart+itemName.length+1, itemEnd);
                return itemValue;
            }else {
                return "";
            }
        }
    }
    return "";
}




// 显示发布成功对话框
function showSelOk(id, url, password,trialExamLink,type,isSkipLogin,typeText) {
    $('#sendForm').removeClass('hidden');
    $(".guide-pwd").addClass('hidden');

    $("#exam_url").text(url);
    //isSkipLogin : 0是普通登录；1是免登录；2是微信免登录
    if(isSkipLogin != 0){
        $('#sendForm').addClass('hidden');
    }
    if(password){
        $("#exam_password").html(password);
        $(".guide-pwd").removeClass('hidden');
    }
    if(type == 'exam'){
        var sendUrl = '/examadmin/admin/exam_notice/' + id;
    }else {
        var sendUrl = '/course/course_notice/' + id;
    }
    var jumpUrl ='';
    createQrcode(url);

    setTimeout(function(){
        createLinkDownLoad();
    },200);

    $("#confirmOkBtn").attr("data-type", type).attr("data-id", id);
    $("#trialExamBtn").prop("disabled", false).attr("data-url", trialExamLink)
        .attr("data-id", id).attr("data-type", type);

    $("#okModal .link_title").text(typeText+"链接");
    $("#okModal .link_tip_title").text(typeText+"地址");
    $("#okModal .sendForm .tip_title").text("发送"+typeText+"通知");

    $('#okModal').modal();
}

//okmodal点击确定
$("#confirmOkBtn").click(function () {
    var type = $(this).attr("data-type");
    var id = $(this).attr("data-id");
    var jumpUrl = '', sendUrl = '';
    var ref=document.referrer;//上一页面url
    var url=document.URL;//当前页url
    var linkToOther=true;//是否要跳转到其他页面
    var isOpenUrl=false; //是否是直接复制链接而非跳转过来
    if(url.indexOf('/admin/index/#/index')!=-1||url.indexOf('/course/course_mgr')!=-1||url.indexOf('/examadmin/admin/exam_mgr_new')!=-1){ //如果当前是首页、考试列表页、课程列表页，直接跳到本页面
        linkToOther=false;
    }
    if(ref==""&&url.indexOf('/admin/index/#/index')==-1&&url.indexOf('/course/course_mgr')==-1&&url.indexOf('/examadmin/admin/exam_mgr_new')==-1){ //上一页面为空，且不是首页、考试列表页、课程列表页
        isOpenUrl=true;
    }
    //弹窗跳转逻辑优化  1.优先在哪点的回到哪 2.最差也是都回到列表页面
    if(type=='exam'){
        if(sessionStorage.getItem('ksxSaveData')){
            sessionStorage.setItem('ksxSaveData',0)
        }
        if(url.indexOf('/examadmin/admin/exam_add')!=-1){ //创建考试的情况
            var okModalRef=window.localStorage.getItem('okModalExamRef');
            if(okModalRef=='index'){
                jumpUrl = getStaticUrlPrefix + '/admin/index/#/index';
            }else{
                jumpUrl = '/examadmin/admin/exam_mgr_new';
            }
        }else {
            if(isOpenUrl) { //如果是复制链接进来的，让其跳转到列表页
                jumpUrl = '/examadmin/admin/exam_mgr_new';
            }else{
                if (linkToOther) {
                    if (ref.indexOf('index') != -1) {
                        jumpUrl = getStaticUrlPrefix + '/admin/index/#/index';
                    } else {
                        jumpUrl = '/examadmin/admin/exam_mgr_new';
                    }
                }else{
                    jumpUrl = url;
                }
            }
        }
        sendUrl = '/examadmin/admin/exam_notice/' + id;
    }else if(type == 'course'){
        if(isOpenUrl){ //如果是复制链接进来的，让其跳转到列表页
            // jumpUrl = '/course/course_mgr';
            jumpUrl = getStaticUrlPrefix + '/admin/course';
        }else {
            if (linkToOther) {
                if (ref.indexOf('index') != -1) {
                    jumpUrl = getStaticUrlPrefix + '/admin/index/#/index';
                }else {
                    jumpUrl = getStaticUrlPrefix + '/admin/course';
                }
            }else {
                jumpUrl = url;
            }
        }
        sendUrl = '/course/course_notice/' + id;
    }
    sendNotice(sendUrl,jumpUrl);
});

//okmodal点击考一下
$("#trialExamBtn").click(function () {
    var type = $(this).attr("data-type");
    var id = $(this).attr("data-id");
    var jumpUrl = $(this).attr("data-url"), sendUrl = '';

    if(type=='exam'){
        if(sessionStorage.getItem('ksxSaveData')){
            sessionStorage.setItem('ksxSaveData',0)
        }
        sendUrl = '/examadmin/admin/exam_notice/' + id;
    }else if(type == 'course'){
        sendUrl = '/course/course_notice/' + id;
    }
    sendNotice(sendUrl,jumpUrl);
});

//生成二维码
function createQrcode(examUrl) {
    //二维码生成
    $("#invite-link-qrcode").html("");
    $("#invite-link-qrcode").qrcode({
        width: 150,
        height: 150,
        text: examUrl,
        background: "#FFF"
    });
    $(".linkImgDownLoad .qr_code .code_img").html(""); //新的二维码链接图片下载，生成二维码
    $(".linkImgDownLoad .qr_code .code_img").qrcode({
        size: 150,
        text: examUrl,
        background: "#FFF"
    });
    //clear canvas before download again
    $("#small").html("");
    $("#medium").html("");
    $("#large").html("");

    $("#small").qrcode({
        width: 560,
        height: 560,
        text: examUrl,
        background: "#FFF"
    });
    var download0 = $("#small canvas")[0];
    $("a[download-size=0]").click(function() {
        if (download0.msToBlob) {//IE9+浏览器下载二维码
            var blob = download0.msToBlob();
            window.navigator.msSaveBlob(blob, $("input[name=examName]").val() + "_二维码小.png");
        }else{ //其他浏览器下载二维码
            this.href = download0.toDataURL();
            this.download = $("input[name=examName]").val() + "_二维码小.png";
        }
    });

    $("#medium").qrcode({
        width: 1050,
        height: 1050,
        text: examUrl,
        background: "#FFF"
    });
    var download1 = $("#medium canvas")[0];
    $("a[download-size=1]").click(function() {
        if (download1.msToBlob) {//IE9+浏览器
            var blob = download1.msToBlob();
            window.navigator.msSaveBlob(blob, $("input[name=examName]").val() + "_二维码中.png");
        }else{
            this.href = download1.toDataURL();
            this.download = $("input[name=examName]").val() + "_二维码中.png";
        }
    });

    $("#large").qrcode({
        width: 3500,
        height: 3500,
        text: examUrl,
        background: "#FFF"
    });
    var download2 = $("#large canvas")[0];
    $("a[download-size=2]").click(function() {
        if (download2.msToBlob) {//IE9+浏览器
            var blob = download2.msToBlob();
            window.navigator.msSaveBlob(blob, $("input[name=examName]").val() + "_二维码大.png");
        }else {
            this.href = download2.toDataURL();
            this.download = $("input[name=examName]").val() + "_二维码大.png";
        }
    });
}

//发送通知
function sendNotice(url,jumpUrl) {
    // var dataForm = $('#sendForm').serialize();
    var sendWay ='';
    var isSendNotice = $("#sendForm input:checked").length;
    if(isSendNotice == 0){
        window.location.href = jumpUrl;
    }else {
        $('#sendForm input:checked').each(function(index,ele) {
            sendWay += $(ele).prop('id')+',';
        });
        sendWay = sendWay.substring(0,sendWay.length-1);
        $.ajax({
            type: "POST",
            cache: false,
            headers: { "cache-control": "no-cache" },
            dataType: "json",
            url: url,
            data: 'sendWay=' + sendWay,
            success: function (msg) {
                if (msg.success == true) {
                    $(".sendAnimation").addClass("sendTips");
                    // 动画完成后的动作
                    var compAnimation = $(".sendAnimation").get(0);
                    compAnimation.addEventListener("animationend", animationEndFunction(jumpUrl));
                } else {
                    alert(msg.desc);
                }
            }
        });
    }
}

// 提示动画完成后
function animationEndFunction(jumpUrl) {
    $('#okModal .modal-content').hide();
    $("#animationLoading").removeClass("hidden");
    setTimeout(function(){
        window.location.href = jumpUrl;
    },1000);
}



//数组区间无交叉 //有交叉返回true；没有返回false
//demo: 如想判断[1,2],[3,4],[5,6]三个数组的数值是否有交叉，则这样调用该函数：arrCross([1,3,5],[2,4,6]);
function arrCross(minArr, maxArr) {
    //如果最小区间或最大区间有重复元素，则说明区间有交叉
    if(isRepeat(minArr) || isRepeat(maxArr)) {
        return true;
    }
    //minArr 为最小值组成的数组
    //maxArr 为最大值组成的数组
    var minSortArr = JSON.parse(JSON.stringify(minArr));
    var maxSortArr = JSON.parse(JSON.stringify(maxArr));
    minSortArr.sort(function(a,b){
        return a-b;
    });
    maxSortArr.sort(function(a,b){
        return a-b;
    });
    for(var i=0;i<minArr.length;i++) {
        //如果排序之后相同index位置的值与原对应关系不一致
        if(minSortArr.indexOf(minArr[i]) != maxSortArr.indexOf(maxArr[i])){
            return true;
        }else if(i > 0){
            //如果最小值小于前一组的最大值
            if(minSortArr[i] < maxSortArr[i-1]){
                return true;
            }
        }
    }
    return false;
}

// 验证重复元素，有重复返回true；否则返回false
function isRepeat(arr) {
    var hash = {};
    for(var i in arr) {
        if(hash[arr[i]]) {
            return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i]] = true;
    }
    return false;
}

//获取url中的参数
//param 为想要获取的参数名
function getUrlsearch(param) {
    var searchUrl = window.location.search;
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
    var r = searchUrl.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//设置下载链接图片的参数
function setLinkDownloadConfig(type,title,start_time,end_time,exam_time){
    if(type=="考试"&&exam_time!=""){
        $(".linkImgDownLoad .time .exam_time").show();
        $(".linkImgDownLoad .time .exam_time span").text(exam_time);
    }else{
        $(".linkImgDownLoad .time .exam_time").hide();
    }
    $(".linkImgDownLoad .time .start_time span").text(start_time);
    $(".linkImgDownLoad .time .end_time span").text(end_time);
    $(".linkImgDownLoad .activity_type").text(type);
    $(".linkImgDownLoad .title_content").text(title);
    $(".linkImgDownLoadBtn").attr("href","");//先清空图片数据
}

function createLinkDownLoad(){

    var shareContent = $('.linkImgDownLoad')[1]; //用来截图的div是第二个class=linkImgDownLoad的元素
    var width = shareContent.offsetWidth;
    var height = shareContent.offsetHeight;
    var canvas = document.createElement("canvas");
    var scale = 1;
    // 放大画布
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.getContext("2d").scale(scale, scale);

    //html2canvas相关参数
    var opts = {
        scale: scale,
        canvas: canvas,
        logging: false,
        width: width,
        height: height,
        useCORS: true
    };
    html2canvas(shareContent, opts).then(function (canvas) {

        var context = canvas.getContext('2d');
        if(context) {
            context.scale(2,2);
            context.mozImageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
        }
        $(".linkImgDownLoadBtn").attr("href",canvas.toDataURL());
    });
}

// 格式化时间
function formatTime(time) {
    var day = Math.floor(time/86400);
    var day_left=time-86400*day;
    var hour = Math.floor(day_left/3600);
    var hour_left=day_left-3600*hour;
    var minutes= Math.floor(hour_left/60);
    var seconds= hour_left-60*minutes;
    var time_show=(day==0?'':(day+'天:'))+(hour<10?'0'+hour:hour)+':'+(minutes<10?'0'+minutes:minutes)+
        ':'+(seconds<10?'0'+seconds:seconds);
    return time_show;
}

// 获取url中参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
}


//通过css、js在不同项目环境下控制一些按钮的显隐。 线上项目：显示'进入学员系统'按钮    钉钉项目：不显示'进入学员系统'按钮、隐藏'退出'、隐藏'添加学员'

function showBtnByEnv(){
    $.ajax({
        type: "POST",
        cache : false,
        dataType: "json",
        url: "/login/public/get_dingtalk_env",
        success: function(msg) {
            if(msg.data != 0){
                $("#enterExamineeSystem").css('display','list-item');
            }else{
                $("#logoutBtn").remove();
            }
        },
    })
}

//公用的顶部弹出消息提示
var showTopTipClock;
function showTopTip(type,text) {
    if(!type) return;
    var e = $('.pc-top-tip-box .pc-top-'+type+'-tip');
    $(e).find('.tip-text').text(text);
    $(e).removeClass('nactive');
    clearTimeout(showTopTipClock);
    setTimeout(function(){
        $(".pc-top-tip-box").stop().animate({"opacity":"1","top":"15px"},300);
        showTopTipClock = setTimeout(function(){
            $(".pc-top-tip-box").stop().animate({"opacity":"0","top":"-40px"},300);
            setTimeout(function(){
                $(e).find('.tip-text').text('');
                $(e).addClass('nactive');
            },200)
        }, 2000);
    },100)
}
