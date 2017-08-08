var orbitCount = 0;
var mouseX, mouseY;
var downTime, upTime;
var mouseStatus="createOrbit";
var playStatus="stop";

//キャンバスクリック時の挙動 ドラッグと区別のためdown-up
$("#canvas").on('mousedown', function() {
  downTime = new Date().getTime();
});
$("#canvas").on('mouseup', function(e) {
  upTime = new Date().getTime();
  if (upTime - downTime < 250) { //クリック判定
      if (mouseStatus == "createOrbit") {
        $('#jquery-ui-dialog').dialog('open');
        mouseX = e.offsetX;
        mouseY = e.offsetY;
      }
  }
});

//オービットの作成
function createOrbit(size) {
  orbitCount++;
  var name = "orbit" + orbitCount;
  $("canvas").drawEllipse({
    strokeStyle: "white",
    strokeWidth: 1,
    x: mouseX,
    y: mouseY,
    width: size,
    height: size,
    draggable: true,
    groups: ["orbit" + orbitCount, "orbit"],
    dragGroups: ["orbit" + orbitCount],
    name : "orbit" + orbitCount,
    click: function(layer) {
      if (mouseStatus == "delete") {
        var grp = $("canvas").getLayer(layer).groups;
        $("canvas").removeLayerGroup(grp[0]).drawLayers();
        orbitCount--;
      }
    },
  });
  $("canvas").drawEllipse({
    fillStyle: "white",
    x: mouseX,
    y: mouseY,
    translateY: -size/2,
    rotate: 0,
    width: 20,
    height: 20,
    draggable: true,
    groups: ["orbit" + orbitCount, "comets", "orbit"],
    dragGroups: ["orbit" + orbitCount],
    name: "comet" + orbitCount,
    click: function(layer) {
      if (mouseStatus == "delete") {
        var grp = $("canvas").getLayer(layer).groups;
        $("canvas").removeLayerGroup(grp[0]).drawLayers();
        orbitCount--;
      }
    },
  })
}

//ボタン
$("#button-orbit").on('click', function() {
  mouseStatus="createOrbit";
  $("#text-status").text("create orbit mode");
})
$("#button-delete").on('click', function() {
  mouseStatus="delete";
  $("#text-status").text("delete mode");
})
$("#button-play").on("click", function() {
  if (playStatus == "play") {
    playStatus = "pause";
    $("#canvas").trigger("stopEvent");
    $("#button-play").attr("src", "images/button-play.png");
  }else{
    playStatus="play";
    $("#canvas").trigger("playEvent");
    $("#button-play").attr("src", "images/button-pause.png");
  }
})
/*
$(document).on("click","#button-pause", function() {
  playStatus="pause";
  $("#canvas").trigger("stopEvent");
  $("#button-pause").attr("src", "images/button-play.png");
  $("#button-pause").attr("id", "button-play");
})
*/
$("#button-stop").on("click", function() {
  playStatus="stop";
  $("#canvas").trigger("stopEvent");
})


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

//再生関連
$("#canvas").on("playEvent", function() {
    setInterval(function() {
      if (playStatus=="play")
        for (var i = 1; i <= orbitCount; i++) 
          $("canvas").animateLayer("comet" + i, {
            rotate: '+=360', 
          }, 1000, "linear");
    }, 1000);
    
    //window.requestAnimationFrame(revolution);
})

$("#canvas").on("stopEvent", function() {
  for (var i = 1; i <= orbitCount; i++) {
    $("canvas").stopLayer("comet" + i, true);
    if (playStatus == "stop") {
      $("canvas").animateLayer("comet" + i, {
        rotate: 0
      }, 10, "linear");
      $("#button-play").attr("src", "images/button-play.png");
    }
  }
})

//animation
/*
function revolution() {
  for (var i = 1; i <= orbitCount; i++) {
    $("canvas").animateLayer("comet" + i, {
      rotate: '+=360', 
    }, 400, "linear");
  }
  window.requestAnimationFrame(revolution);
}
*/
