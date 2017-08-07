var orbitCount = 0;
var mouseX, mouseY;
var downTime, upTime;
//キャンバスクリック時の挙動 ドラッグと区別のためdown-up
$("#canvas").on('mousedown', function() {
  downTime = new Date().getTime();
});
$("#canvas").on('mouseup', function(e) {
  upTime = new Date().getTime();
  console.log(upTime-downTime);
  if (upTime - downTime < 250) { //クリック判定
    $('#jquery-ui-dialog').dialog('open');
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
});

//オービットの作成
function createOrbit(size) {
  orbitCount++;
  $("canvas").drawEllipse({
  strokeStyle: "white",
  strokeWidth: 1,
  x: mouseX,
  y: mouseY,
  width: size,
  height: size,
  draggable: true,
  groups: ["orbit" + orbitCount],
  dragGroups: ["orbit" + orbitCount],
  });
  $("canvas").drawEllipse({
    fillStyle: "white",
    x: mouseX,
    y: mouseY - size/2,
    width: 20,
    height: 20,
    draggable: true,
    groups: ["orbit" + orbitCount],
    dragGroups: ["orbit" + orbitCount],
  })
}

//初期設定的な？
$(function () {
  sizing();
  $(window).resize(function() {
    sizing();
  });
  $('#jquery-ui-slider').slider({
    value: 100,
    min: 30,
    max: 300,
    slide: function(event, ui) {
      $('#slider-val').val(ui.value);
    }
  });
  $('#slider-val').val(
    $('#jquery-ui-slider').slider('value')
  );
  $("#jquery-ui-dialog").dialog({
    modal: true,
    resizable: false,
    buttons: true,
    autoOpen: false,
  });
  $('#dialog-button').click(function() {
    var orbitSize = $("#slider-val").val();
    createOrbit(orbitSize);
  })
});

//リサイズ用？よくわからｎ
function sizing() {
  $("#canvas").attr({height:$("#wrap").height()});
  $("#canvas").attr({width:$("#wrap").width()});
}
