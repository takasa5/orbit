/// <reference path="p5.global-mode.d.ts" />
orbitnum = 0; planetnum = 0;
orbitList = []; planetList = [];
mode = "createOrbit";
playmode = "stop";
myFrame = 0;
//最初に実行
function setup() {
    createCanvas(windowWidth, windowHeight-100);
    background(19, 19, 70);
    $("#button-planet").on('click', function() {
    mode="createPlanet";
    })
    $("#button-orbit").on('click', function() {
    mode="createOrbit";
    })
    $("#button-delete").on('click', function() {
    mode="delete";
    })
    $("#button-play").on("click", play);
    $("#button-stop").on("click", stop);
    $("#slider").slider({
    });
}

//常に待機、loop内容
function draw() {
    //mode
    if (mode == "delete") { //削除対象に色付け
        paintOrbit(0.5, 255, 94, 137);
        $("#button-delete").css({"filter": "hue-rotate(180deg)"});
        $("#button-orbit").css({"filter": "hue-rotate(0deg)"});
        $("#button-planet").css({"filter": "hue-rotate(0deg)"});
    }else if (mode == "createOrbit"){//ドラッグ対象
        paintOrbit(0.2, 94, 131, 255);
        $("#button-orbit").css({"filter": "hue-rotate(180deg)"});
        $("#button-delete").css({"filter": "hue-rotate(0deg)"});
        $("#button-planet").css({"filter": "hue-rotate(0deg)"});
    }else if (mode == "createPlanet") {
        $("#button-planet").css({"filter": "hue-rotate(180deg)"});
        $("#button-orbit").css({"filter": "hue-rotate(0deg)"});
        $("#button-delete").css({"filter": "hue-rotate(0deg)"});
    }
    //playmode
    if (playmode == "play") {
        revolveOrbit();
        //動いてるときにも色付け
        if (mode == "delete") {
            paintOrbit(0.5, 255, 94, 137);
        }else{
            paintOrbit(0.2, 94, 131, 255);
        }
        myFrame++;
    } else {

    }

}

//色付け
function paintOrbit(range, red, green, blue) {
    var target = [];
    orbitList.forEach(function(val, i) {
        if (mouseX < val.centerX+val.R*range && mouseX > val.centerX-val.R*range &&
            mouseY < val.centerY+val.R*range && mouseY > val.centerY-val.R*range) {
            append(target, val);
        }
    });
    revolveOrbit();
    stroke(red, green, blue); noFill();
    /*if (only) {
        var onlytag = target[target.length-1];
        ellipse(onlytag.centerX, onlytag.centerY, onlytag.R);
    }else{*/
        target.forEach(function(val) {
            ellipse(val.centerX, val.centerY, val.R);
        })
    //}
    fill(255);
    /*if (only) {
        var val = target[target.length-1];
        ellipse(val.centerX + (val.R/2)*cos(myFrame/100*TWO_PI - PI/2), val.centerY + (val.R/2)*sin(myFrame/100*TWO_PI - PI/2), 20);
    }else{*/
        target.forEach(function(val) {
            ellipse(val.centerX + (val.R/2)*cos(myFrame/100*TWO_PI - PI/2), val.centerY + (val.R/2)*sin(myFrame/100*TWO_PI - PI/2), 20);
        })
    //}
}

//ウインドウリサイズ時
function windowResized() {
    resizeCanvas(windowWidth, windowHeight-100);
    revolveOrbit();
}

//マウスイベント
function mouseReleased() {
    clickTime = millis() - pressedTime;
    if (mouseY < windowHeight-100 && clickTime < 250) {
        if (mode=="createOrbit") {
            var R = $("#slider").slider('getValue');
            createOrbit(mouseX, mouseY, R);
        }else if (mode=="delete") {
            deleteOrbit(mouseX, mouseY);
        }else if (mode=="createPlanet") {
            createPlanet(mouseX, mouseY);
        }
    }
}
function mousePressed() {
    pressedTime = millis();
    var place = 0;
    if (mode=="createOrbit") {
        orbitList.forEach(function(val, i) {
            if (mouseX < val.centerX+val.R*0.2 && mouseX > val.centerX-val.R*0.2 &&
                mouseY < val.centerY+val.R*0.2 && mouseY > val.centerY-val.R*0.2) {
                dragTarget = val; place++;
            }
        })
    }else{
        planetList.forEach(function(val, i) {
            if (mouseX < val.centerX+10 && mouseX > val.centerX-10 &&
                mouseY < val.centerY+10 && mouseY > val.centerY-10) {
                dragTarget = val; place++;
            }
        })
    }
    if (place == 0) //一個も判定重なってなければリセット
        dragTarget = null;
}
function mouseDragged() {
    if (mode=="createOrbit") {
        dragTarget.centerX = mouseX; dragTarget.centerY = mouseY;
        revolveOrbit();
    } else if (mode=="createPlanet") {
        dragTarget.centerX = mouseX; dragTarget.centerY = mouseY;
        revolveOrbit();
    }
}
//再生関連
function play() {
    if ($("#button-play").attr("src") == "images/button-play.png") {
        playmode="play";
        $("#button-play").attr("src", "images/button-pause.png");
    }else{
        playmode="pause";
        $("#button-play").attr("src", "images/button-play.png");    
    }
}
function stop() {
    playmode="stop";
    myFrame = 0;
    revolveOrbit();
    playButton.remove();
    playButton = createButton("play");
    playButton.position(windowWidth/3, windowHeight-50);
    playButton.mousePressed(play);
}


function createOrbit(x, y, r) {
    orbit = {number: orbitnum, centerX: x, centerY: y, R:r};
    orbitnum++;
    append(orbitList, orbit);
    stroke(255); noFill();
    ellipse(x, y, r);
    fill(255, 255, 255);
    ellipse(x, y-r/2, 20);
    revolveOrbit();
}

function createPlanet(x, y) { //音のモードも？色とか
    planet = {number: planetnum, centerX: x, centerY: y};
    planetnum++;
    append(planetList, planet);
    stroke(0); fill(145, 255, 114);
    ellipse(x, y, 20);
    revolveOrbit();
}

function deleteOrbit(x, y) {
    var valList = [];
    orbitList.forEach(function(val, i) {
        if (x < val.centerX+val.R*0.5 && x > val.centerX-val.R*0.5 &&
            y < val.centerY+val.R*0.5 && y > val.centerY-val.R*0.5) 
                append(valList, val);
    });
    valList.forEach(function(val, i) {
        orbitList.splice(orbitList.indexOf(val), 1);
    });
    revolveOrbit();
}

function revolveOrbit() {
    background(19, 19, 70);
    orbitList.forEach(function(val, i) {
        stroke(255); noFill();
        ellipse(val.centerX, val.centerY, val.R);
        fill(255, 255, 255);
        ellipse(val.centerX + (val.R/2)*cos(myFrame/100*TWO_PI - PI/2), val.centerY + (val.R/2)*sin(myFrame/100*TWO_PI - PI/2), 20);
    });
    planetList.forEach(function(val, i) {
        stroke(0); fill(145, 255, 114);
        ellipse(val.centerX, val.centerY, 20);
    })
}
/*
function redrawOrbit() {
    background(19, 19, 70);
    orbitList.forEach(function(val, i) {
        stroke(255); noFill();
        ellipse(val.centerX, val.centerY, val.R);
        fill(255, 255, 255);
        ellipse(val.centerX, val.centerY-val.R/2, 20);
    });
}*/