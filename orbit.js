/// <reference path="p5.global-mode.d.ts" />
orbitnum = 0;
mode = "createOrbit";
playmode = "stop";
orbitList = [];
myFrame = 0;
//最初に実行
function setup() {
    createCanvas(windowWidth*0.985, windowHeight-100);
    playButton = createButton("play");
    playButton.position(windowWidth/3,windowHeight-50);
    playButton.mousePressed(play);
    stopButton = createButton("stop");
    stopButton.position(windowWidth/3 + 60, windowHeight-50);
    stopButton.mousePressed(stop);
    orbitButton = createButton("orbit");
    orbitButton.position(windowWidth/2 + 80, windowHeight-50);
    orbitButton.mousePressed(function(){mode="createOrbit";});
    deleteButton = createButton("delete");
    deleteButton.position(windowWidth/2 + 140, windowHeight-50);
    deleteButton.mousePressed(function(){mode="delete";});
    sl = createSlider(10, 400, 100, 10);
    sl.position(windowWidth/2 - 100,windowHeight-50);
    sl.style("width", "150px");
    background(19, 19, 70);
}

//常に待機、loop内容
function draw() {
    //mode
    if (mode == "delete") { //削除対象に色付け
        paintOrbit(0.5, 255, 94, 137);
    }else{//ドラッグ対象
        paintOrbit(0.2, 94, 131, 255);
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

//ウインドウリサイズ時　！オブジェクト再描画！
function windowResized() {
    resizeCanvas(windowWidth*0.985, windowHeight-100);
    playButton.position(windowWidth/3,windowHeight-50);
    stopButton.position(windowWidth/3 + 60, windowHeight-50);
    orbitButton.position(windowWidth/2 + 80, windowHeight-50);
    deleteButton.position(windowWidth/2 + 140, windowHeight-50);
    sl.position(windowWidth/2 - 100,windowHeight-50);
    revolveOrbit();
}

//マウスイベント
function mouseReleased() {
    clickTime = millis() - pressedTime;
    if (mouseY < windowHeight-100 && clickTime < 250) {
        if (mode=="createOrbit") {
            createOrbit(mouseX, mouseY, sl.value());
        }else if (mode="delete") {
            deleteOrbit(mouseX, mouseY);
        }
    }
}
function mousePressed() {
    pressedTime = millis();
    var place = 0;
    orbitList.forEach(function(val, i) {
        if (mouseX < val.centerX+val.R*0.2 && mouseX > val.centerX-val.R*0.2 &&
            mouseY < val.centerY+val.R*0.2 && mouseY > val.centerY-val.R*0.2) {
            dragTarget = val; place++;
        }
    })
    if (place == 0) 
        dragTarget = null;
}
function mouseDragged() {
    if (mode!="delete") {
        dragTarget.centerX = mouseX; dragTarget.centerY = mouseY;
        revolveOrbit();
    }
}

function play() {
    playmode="play";
    playButton.remove();
    playButton = createButton("pause");
    playButton.position(windowWidth/3, windowHeight-50);
    playButton.mousePressed(pause);
}
function pause() {
    playmode="pause";
    playButton.remove();
    playButton = createButton("play");
    playButton.position(windowWidth/3, windowHeight-50);
    playButton.mousePressed(play);
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
}

function redrawOrbit() {
    background(19, 19, 70);
    orbitList.forEach(function(val, i) {
        stroke(255); noFill();
        ellipse(val.centerX, val.centerY, val.R);
        fill(255, 255, 255);
        ellipse(val.centerX, val.centerY-val.R/2, 20);
    });
}