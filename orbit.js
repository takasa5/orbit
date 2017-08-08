var orbitCount = 0;
var mouseX, mouseY;
var downTime, upTime;
var mouseStatus="createOrbit";
var playStatus="stop";
var pointList = [];
var orbitList = [];

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
      }else if (mouseStatus == "createPlanet") {
        $("canvas").drawEllipse({
          strokeStyle: "white",
          strokeWidth: 0.5,
          // x,yは近くの円周の5刻みの部分で
          width:20, height: 20,
          draggable: true,
          // updateDragX, Yもx, y同様     
        })
      }
  }
});

//オービットの作成
function createOrbit(size) {
  orbitList.push(orbitCount);
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
        $("#canvas").trigger("deleteEvent", [$("canvas").getLayer(layer).groups, $("canvas").getLayer(layer).name]);
      }
    },
    dragstop: function(layer) {
      var orbit = $("canvas").getLayer(layer);
      var num = parseInt(orbit.name);
      pointList[num-1] = orbit.x;
      pointList[num] = orbit.y;
    }
  });
  pointList.push(mouseX);
  pointList.push(mouseY);
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
        $("#canvas").trigger("deleteEvent", [$("canvas").getLayer(layer).groups, $("canvas").getLayer(layer).name]);
      }
    },
  })
  orbitCount++;
}

//ボタン
$("#button-planet").on('click', function() {
  mouseStatus="createPlanet";
  $("#text-status").text("create planet mode");
})
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

//リサイズ用
function sizing() {
  $("#canvas").attr({height:$("#wrap").height()});
  $("#canvas").attr({width:$("#wrap").width()});
}

//デリート
$("#canvas").on("deleteEvent", function(e, grp, nam) {
  var name = nam.replace(/[^0-9^\.]/g,"");
  var num = parseInt(name);
  var p = orbitList.indexOf(num);
  orbitList.splice(p, 1);
  $("canvas").removeLayerGroup(grp[0]).drawLayers();
})

//再生関連
$("#canvas").on("playEvent", function() {
    setInterval(function() {
      if (playStatus=="play")
        $.each(orbitList, function(index, val) {
          $("canvas").animateLayer("comet" + val, {
            rotate: '+=5', 
          }, 1000/72, "linear");
        }) 
    }, 1000/72);
    
    //window.requestAnimationFrame(revolution);
})

$("#canvas").on("stopEvent", function() {
  $.each(orbitList, function(i, val) {
    $("canvas").stopLayer("comet" + val, true);
    //console.log(Math.ceil($("canvas").getLayer("comet"+val).rotate % 360));
    console.log(orbitList);
    if (playStatus == "stop") {
      $("canvas").animateLayer("comet" + val, {
        rotate: 0
      }, 10, "linear");
      $("#button-play").attr("src", "images/button-play.png");
    }
  })
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
