// ==UserScript==
// @name         snh48 tickets
// @namespace    https://github.com/zwtzwx/snh48-tickets
// @version      0.2
// @description  snh48
// @author       zwtzwx
// @match        https://shop.48.cn/tickets/item/*
// @icon         https://www.google.com/s2/favicons?domain=48.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.8.2/jquery.min.js
// ==/UserScript==

$(window).load(function(){
  var loading = false;
  var loadingObj;
  // 购票
  function buy() {
    var _url = "/TOrder/add";
    var _num = $("#num").val();
    var _seattype = $("#seat_type").val();
    var _id = $("#tickets_id").val();
    var _brand_id = "2";
    var _choose_times_end = $("#choose_times_end").length == 0 ? -1 : parseInt($("#choose_times_end").val());
    if (_seattype == "" || _seattype == "0") {
      console.error("请选择座位类别");
      layer.msg("请选择座位类别");
      return;
    }
    if (_num == "") {
      console.error("请输入数量");
      layer.msg("请输入数量");
      return;
    }

    if (_choose_times_end == 0) {
      console.error("请选择“参与抽选”");
      return;
    }
    $.ajax({
      url: _url,
      type: "post",
      dataType: "json",
      data: {
        id: _id,
        num: _num,
        seattype: _seattype,
        brand_id: _brand_id,
        r: Math.random(),
        choose_times_end: _choose_times_end
      },
      success: function(result) {
        layer.close(loadingObj);
        if (result.HasError) {
            //失败操作
             layer.msg(result.Message + "<br/>错误代码:" + result.ErrorCode, {
                 icon: 2,
                 time: 5000 //2秒关闭（如果不配置，默认是3秒）
             }, function () {
                 //do something
                 if (result.ErrorCode == "161004") {
                     window.location.href = "/TOrder/Index";
                 }
            });
            console.error("提交失败")
            buy();
        } else {
            if (result.ReturnObject != "choose_tickets") {
              //成功操作
                layer.alert('购买成功，快去付款吧！', {
                    skin: 'layui-layer-molv',
                    closeBtn: 0
                })
            } else {
              layer.msg("提交成功，等待管理员抽选");
            }
        }
      },
      error: function(e) {
        layer.close(loadingObj);
        console.error("您排队失败，请刷新重试,错误代码:162001");
        layer.msg("您排队失败，请刷新重试");
      }
    });
  }
  function init() {
    var timer = setInterval(() => {
      var buyDom = $("#buy");
      var _state = buyDom.attr("data-value");
      if (_state === '0') {
        clearInterval(timer);
        buy();
      }
    }, 500);
  }
  // 插入开始抢票按钮
  function insertDom() {
    layer.alert('请登录账号，且选好票种后再点击开始抢票', {
       skin: 'layui-layer-molv',
       closeBtn: 0
    });
    var txtList = $(".i_sel");
    var parent = txtList[txtList.length - 1];
    var btn = $("<div style='background-color:#f17fb0;color:#fff;display:inline-block;padding:10px 25px;margin-top:15px'>开始抢票</div>");
    btn.on('click', function() {
      if (loading) return;
      loading = true;
      loadingObj = layer.load(2, {
        shade: [0.5, 'gray'],
        content: '抢票中...'
      });
      init();
    });
    $(parent).append(btn);
  }
  insertDom();
});