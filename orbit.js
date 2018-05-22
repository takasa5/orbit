/// <reference path="p5.global-mode.d.ts" />
orbitnum = 0; planetnum = 0; holenum = 0;
orbitList = []; planetList = [], cometList = [], effectList = [], astarList=[];
mode = "createOrbit";
playmode = "stop";
myFrame = 0;
planetMode = "snare";
deleteMode = "delete-orbit";
first = 1;
astarCheck = false;


function preload() {
    if (navigator.userAgent.indexOf('iPhone') > 0) 
        muteSound = new Tone.Sampler("./audio/mute.mp3").toMaster();
    snareSound = new Tone.Sampler("./audio/snare.mp3").toMaster();
    kickSound = new Tone.Sampler("./audio/kick.mp3").toMaster();
    hhSound = new Tone.Sampler("./audio/hh.mp3").toMaster();
    hhoSound = new Tone.Sampler("./audio/hho.mp3").toMaster();
}

//最初に実行
function setup() {
    rectMode(CORNERS); 
    bgColor = color(19, 19, 70);
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        planetSize = 40;
        minusCanvas = 200;
        maxSize = 300;
        checkClick = 250;
        $("#slider").slider({
            value: 200,
            min: 80,
            max: 600,
            formatter: function(value) {
                return "radius:"+value;
            },
            tooltip_position: "bottom",
        });
        $("#slider2").slider({
            value: 100,
            min: 100,
            max: 400,
            formatter: function(value) {
                return "period:"+value;
            },
        });
        $("#button-stop").attr("height","150px");
        $("#button-play").attr("height","150px");
        $("#button-orbit").attr("height","150px");
        $("#button-planet").attr("height","150px");
        $("#button-delete").attr("height","150px");
        
    }else{
        planetSize = 20;
        minusCanvas = 100;
        maxSize = 300;
        checkClick = 250;
        $("#slider").slider({
            value: 100,
            min: 40,
            max: 400,
            formatter: function(value) {
                return "radius:"+value;
            }
        });
        $("#slider2").slider({
            value: 100,
            min: 100,
            max: 400,
            formatter: function(value) {
                return "period:"+value;
            },
            tooltip_position: "bottom",
        });
    }
    createCanvas(windowWidth + 20, windowHeight-minusCanvas).parent("addcanvas");
    background(bgColor);
    $("#button-planet").on('click', function() {
        mode="createPlanet";
        if (navigator.userAgent.indexOf('iPhone') > 0&& first == 1) {
            muteSound.triggerAttackRelease(0, "16n");
            first--;
        }
        $("#Slider").hide();
        $("#Slider2").hide();
        $("#planetRadio").show();
        $("#deleteRadio").hide();
    });
    $("#button-orbit").on('click', function() {
        mode="createOrbit";
        $("#Slider").show();
        $("#Slider2").show();
        $("#planetRadio").hide();
        $("#deleteRadio").hide();
    })
    $("#button-delete").on('click', function() {
        mode="delete";
        $("#Slider").hide();
        $("#Slider2").hide();
        $("#planetRadio").hide();
        $("#deleteRadio").show();
    })
    $("#button-play").on("click", play);
    $("#button-stop").on("click", stop);
    //options init
    $("#planetRadio").hide();
    $("#deleteRadio").hide();
}

//常に待機、loop内容
function draw() {
    //playmode
    if (playmode == "play") {
        //動いてるときにも色付け
        checkCollision();
        revolveOrbit();
        myFrame++;
    }else{
        revolveOrbit();
    }
    //mode
    if (mode == "delete") { //削除対象に色付け
        deleteMode = $(".btn.btn-danger.active input[type=radio]").val();
        paintOrbit(0.5, 255, 94, 137);
        $("#button-delete").css({"filter": "hue-rotate(180deg)"});
        $("#button-orbit").css({"filter": "hue-rotate(0deg)"});
        $("#button-planet").css({"filter": "hue-rotate(0deg)"});
    }else if (mode == "createOrbit"){//ドラッグ対象に色付け
        paintOrbit(0.2, 94, 131, 255);
        $("#button-orbit").css({"filter": "hue-rotate(180deg)"});
        $("#button-delete").css({"filter": "hue-rotate(0deg)"});
        $("#button-planet").css({"filter": "hue-rotate(0deg)"});
    }else if (mode == "createPlanet") {
        planetMode = $(".btn.btn-primary.active input[type=radio]").val();
        $("#button-planet").css({"filter": "hue-rotate(180deg)"});
        $("#button-orbit").css({"filter": "hue-rotate(0deg)"});
        $("#button-delete").css({"filter": "hue-rotate(0deg)"});
    }
    revolveAstar();
}

//音
function checkCollision() {
    cometList.forEach(function(cval, ci) {
        planetList.forEach(function(pval, pi) {
            if (pval.centerX < cval.centerX+planetSize/3 && pval.centerX > cval.centerX-planetSize/3 &&
                pval.centerY < cval.centerY+planetSize/3 && pval.centerY > cval.centerY-planetSize/3) {
                if (pval.check[cval.number] == false) {
                    pval.check[cval.number] = true;
                    pval.sound.triggerAttackRelease(0, "4n");
                    //append(effectList, {centerX: pval.centerX, centerY: pval.centerY, color: pval.color, deg: random(360)*PI/360});
                    for (i =  0; i < random(1,5); i ++) {
                        append(effectList, {centerX: pval.centerX, centerY: pval.centerY, color: pval.color, deg: random(360)*PI/180, size: 10});
                    }
                }
            }else{
                pval.check[cval.number] = false;
            }
        });
        /*
        holeList.forEach(function(hval, i) {
            if (dist(cval.centerX, cval.centerY, hval.centerX, hval.centerY) < hval.R/2) {
                var d = dist(cval.centerX, cval.centerY, hval.centerX, hval.centerY);
                Tone.Transport.bpm.value = d+10;
                if (cval.sound == null) {
                    cval.sound = new Tone.Oscillator((500-cval.period)+d).toMaster().start();
                    cval.sound.syncFrequency();
                }else{
                }
            }else{
                if (cval.sound != null) {
                    cval.sound.unsyncFrequency();
                    cval.sound.stop();
                    cval.sound = null;
                }
            }
        });*/
    });
}

//色付け
function paintOrbit(range, red, green, blue) {
    var target = [], plaTar = [];
    orbitList.forEach(function(val, i) {
        if (dist(val.centerX, val.centerY, mouseX, mouseY) < val.R/2 && dist(val.centerX, val.centerY, mouseX, mouseY) > 10) {
            append(target, val);
        }
    });
    planetList.forEach(function(val, i) {
        if (mouseX < val.centerX+planetSize/2 && mouseX > val.centerX-planetSize/2 &&
            mouseY < val.centerY+planetSize/2 && mouseY > val.centerY-planetSize/2) {
            append(plaTar, val);
        }
    });
    revolveOrbit();
    if (!(mode=="delete"&&deleteMode=="delete-planet")) {
        stroke(red, green, blue); noFill();
        target.forEach(function(val) {
            ellipse(val.centerX, val.centerY, val.R);
        })
        fill(bgColor);
        target.forEach(function(val) {
            ellipse(val.centerX + (val.R/2)*cos(myFrame/val.period*TWO_PI - PI/2), val.centerY + (val.R/2)*sin(myFrame/val.period*TWO_PI - PI/2), planetSize);
        });
    }
    if (deleteMode=="delete-planet" || mode=="createPlanet") {//範囲内に色付け！！！！！
        fill(red, green, blue); stroke(red, green, blue);
        plaTar.forEach(function(val) {
            ellipse(val.centerX, val.centerY, planetSize);
        });
    }
}

//ウインドウリサイズ時
function windowResized() {
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0) {
    }else{
        resizeCanvas(windowWidth, windowHeight-minusCanvas).parent("addcanvas");
        revolveOrbit();
    }
}

//マウスイベント
function mouseReleased() {
    clickTime = millis() - pressedTime;
    if (mouseY < windowHeight-minusCanvas && clickTime < checkClick) {
        if (astarCheck) {
            if (astarList[editTarget.number].speed == 2) {
                astarList[editTarget.number].speed = 1.5;
                editTarget.period = 200;
            }else if (astarList[editTarget.number].speed == 1.5) {
                astarList[editTarget.number].speed = 1;
                editTarget.period = 300;
            }else if (astarList[editTarget.number].speed == 1) {
                astarList[editTarget.number].speed = 0.5;
                editTarget.period = 400;
            }else if (astarList[editTarget.number].speed == 0.5) {
                astarList[editTarget.number].speed = 2;
                editTarget.period = 100;
            }
        }
        if (mode=="createOrbit") {
            var R = $("#slider").slider('getValue');
            var P = $("#slider2").slider("getValue");
            createOrbit(mouseX, mouseY, R, P);
        }else if (mode=="delete") {
            deleteObject(mouseX, mouseY);
        }else if (mode=="createPlanet") {
            createPlanet(mouseX, mouseY);
        }else if (mode=="createHole") {
            createHole(mouseX, mouseY, 300);
        }
    } else if (mouseY < windowHeight-minusCanvas) {
        if (mode=="delete" && deleteMode=="delete-planet") {
            deleteObject();
            deleteArea = {x1: 0, y1: 0, x2: 0, y2: 0};
        }
    }
}
function mousePressed() {
    pressedTime = millis();
    var place = 0; astarClick = 0;
    if (mode=="createOrbit") {
        orbitList.forEach(function(val, i) {
            if (dist(val.centerX, val.centerY, mouseX, mouseY) < val.R/2 && dist(val.centerX, val.centerY, mouseX, mouseY) > 10) {
                dragTarget = val; place++;
            }
            if (dist(val.centerX, val.centerY, mouseX, mouseY) < 10) {
                editTarget = val; astarClick++;
            }
        })
    }else if (mode=="createPlanet"){
        planetList.forEach(function(val, i) {
            if (dist(val.centerX, val.centerY, mouseX, mouseY) < planetSize/2) {
                dragTarget = val; place++;
            }
        })
    }else if (mode=="delete" && deleteMode=="delete-planet") {
        startX = mouseX;
        startY = mouseY;
    }
    if (place == 0) //一個も判定重なってなければリセット
        dragTarget = null;
    if (astarClick > 0)
        astarCheck = true;
    else
        astarCheck = false;
}
function mouseDragged() {    
    if (dragTarget != null) {
        if (mode=="createOrbit") {
            dragTarget.centerX = mouseX; dragTarget.centerY = mouseY;
            if (playmode!="play")
                revolveOrbit();
        } else if (mode=="createPlanet") {
            dragTarget.centerX = mouseX; dragTarget.centerY = mouseY;
            if (playmode!="play")
                revolveOrbit();
        }
    }
    if (astarCheck) {
        var len = dist(editTarget.centerX, editTarget.centerY, mouseX, mouseY);
        if (len > planetSize*2 && len < maxSize) {
            editTarget.R = len*2;
            revolveOrbit();
        }
    }
    
    if (mode=="delete" && deleteMode=="delete-planet") {
        deleteArea = {x1: startX, y1: startY, x2: mouseX, y2: mouseY};
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
        cometList.forEach(function(val, i) {
        if (val.sound != null) {
            val.sound.stop();
            val.sound = null;
        }
    }); 
    }
}
function stop() {
    playmode="stop";
    myFrame = 0;
    revolveOrbit();
    $("#button-play").attr("src", "images/button-play.png");
    cometList.forEach(function(val, i) {
        if (val.sound != null) {
            val.sound.stop();
            val.sound = null;
        }
    });
}

//オービット作成
function createOrbit(x, y, r, p) {
    var checkdbl = false;
    for (var i = 0; i < orbitList.length; i++) {
        if (dist(orbitList[i].centerX, orbitList[i].centerY, mouseX, mouseY) < 30) {
            checkdbl = true;
            break;
        }
    }
    if (!checkdbl) {
        orbit = {number: orbitnum, centerX: x, centerY: y, R:r, period: p};
        comet = {number: orbitnum, centerX: x, centerY: y-r/2, period: p, sound: null};
        astar = {number: orbitnum, centerX: x, centerY: y, deg: 0, speed: 2};
        orbitnum++;
        append(orbitList, orbit);
        append(cometList, comet);
        append(astarList, astar);
        strokeWeight(3);
        stroke(255); noFill();
        ellipse(x, y, r);
        fill(bgColor);
        ellipse(x, y-r/2, planetSize);
        stroke(200, 0, 0); noFill();
        ellipse(x, y, 10, 20);
        translate(x,y); rotate(PI/3); ellipse(0, 0, 10, 20); rotate(-PI/3); translate(-x,-y);
        translate(x,y); rotate(2*PI/3); ellipse(0, 0, 10, 20); rotate(2*PI/3); translate(-x,-y);
        revolveOrbit();
    }
}
//プラネット作成
function createPlanet(x, y) {
    var checkdbl = false;
    for (var i = 0; i < planetList.length; i++) {
        if (dist(planetList[i].centerX, planetList[i].centerY, mouseX, mouseY) < 5) {
            checkdbl = true;
            break;
        }
    }
    if (!checkdbl) {
    var sampler, pcolor;
    if (planetMode == "snare") {
        sampler = snareSound;
        pcolor = color(145, 255, 114);
    }else if (planetMode == "kick") {
        sampler = kickSound;
        pcolor = color(156, 99, 255);
    }else if (planetMode == "hh") {
        sampler = hhSound;
        pcolor = color(255, 251, 140);
    }else if (planetMode == "hho") {
        sampler = hhoSound;
        pcolor = color(255, 140, 140);
    }
    planet = {number: planetnum, centerX: x, centerY: y, check: new Array(256), color: pcolor, sound: sampler};
    planetnum++;
    append(planetList, planet);
    stroke(red, green, blue); strokeWeight(3); fill(red, green, blue);
    ellipse(x, y, planetSize);
    revolveOrbit();
    }
}
/*
//ブラックホール作成
function createHole(x, y, r) {
    hole = {number: holenum, centerX: x, centerY: y, R: r};
    holenum++;
    append(holeList, hole);
    stroke(0); fill(color(0, 0, 0, 90));
    ellipse(x, y, r);
    revolveOrbit();
    console.log("hole");
}*/

function deleteObject(x, y) {
    var valList = [];
    deleteMode = $(".btn.btn-danger.active input[type=radio]").val();
    if (deleteMode == "delete-orbit") {
        orbitList.forEach(function(val, i) {
        if (dist(val.centerX, val.centerY, mouseX, mouseY) < val.R/2) 
                append(valList, val);
        });
        valList.forEach(function(val, i) {// 消した時の音が消えない
            if (cometList[val.number].sound != null) {
                cometList[val.number].sound.stop();
                cometList[val.number].sound = null;
            }
            orbitList.splice(orbitList.indexOf(val), 1);
        });
    }else if (deleteMode == "delete-planet"){
        planetList.forEach(function(val, i) {
        if (val.centerX < Math.max(deleteArea.x1, deleteArea.x2) && val.centerX > Math.min(deleteArea.x1, deleteArea.x2) &&
            val.centerY < Math.max(deleteArea.y1, deleteArea.y2) && val.centerY > Math.min(deleteArea.y1, deleteArea.y2)) 
                append(valList, val);
        });
        valList.forEach(function(val, i) {
            planetList.splice(planetList.indexOf(val), 1);
        });
    }
    revolveOrbit();
}

function revolveOrbit() {
    background(bgColor);
    effectList.forEach(function(val, i) {
        /*val.color = color(red(val.color), green(val.color), blue(val.color), 100-(val.size/maxSize)*100);
        if (val.size >= maxSize)
            effectList.splice(i, 1);
        stroke(val.color); noFill();
        ellipse(val.centerX, val.centerY, val.size);
        val.size += 2;*/
        val.centerX += 5*cos(val.deg); val.centerY += 5*sin(val.deg);
        val.size -= 1;
        if (val.size <= 0)
            effectList.splice(i, 1);
        stroke(val.color); fill(val.color);
        ellipse(val.centerX, val.centerY, val.size);
    });
    
    orbitList.forEach(function(val, i) {
        stroke(255); strokeWeight(3); noFill();
        ellipse(val.centerX, val.centerY, val.R);
        
        comet = {centerX: val.centerX + (val.R/2)*cos(myFrame/val.period*TWO_PI - PI/2),
             centerY: val.centerY + (val.R/2)*sin(myFrame/val.period*TWO_PI - PI/2)};
        cometList[val.number].centerX = comet.centerX;
        cometList[val.number].centerY = comet.centerY;
        fill(bgColor);
        ellipse(comet.centerX, comet.centerY, planetSize);
        /*
        if (astarList[val.number].deg >= 359)
            astarList[val.number].deg = 0;
        else
            astarList[val.number].deg += astarList[val.number].speed;
        var rad = astarList[val.number].deg*PI/180;
        stroke(200,0,0); strokeWeight(2); noFill();
        translate(val.centerX, val.centerY); rotate(rad); ellipse(0, 0, 10, 20); rotate(-rad); translate(-val.centerX,-val.centerY);
        translate(val.centerX, val.centerY); rotate(PI/3 + rad); ellipse(0, 0, 10, 20); rotate(-PI/3-rad); translate(-val.centerX,-val.centerY);
        translate(val.centerX, val.centerY); rotate(2*PI/3 + rad); ellipse(0, 0, 10, 20); rotate(-2*PI/3-rad); translate(-val.centerX, -val.centerY);
        */
    });
    planetList.forEach(function(val, i) {
        stroke(val.color); strokeWeight(3); fill(val.color);
        ellipse(val.centerX, val.centerY, planetSize);
    });
    /*
    holeList.forEach(function(val, i) {
        stroke(0); fill(color(0, 0, 0, 90));
        ellipse(val.centerX, val.centerY, val.R);
    });*/

    if ("deleteArea" in window) {
        stroke(255, 94, 137); fill(color(255, 94, 137, 50));
        rect(deleteArea.x1, deleteArea.y1, deleteArea.x2, deleteArea.y2);    
    }
}

function revolveAstar() {
    orbitList.forEach(function(val, i) {
        if (astarList[val.number].deg >= 359)
            astarList[val.number].deg = 0;
        else
            astarList[val.number].deg += astarList[val.number].speed;
        var rad = astarList[val.number].deg*PI/180;
        stroke(200,0,0); strokeWeight(2); noFill();
        translate(val.centerX, val.centerY); rotate(rad); ellipse(0, 0, 10, 20); rotate(-rad); translate(-val.centerX,-val.centerY);
        translate(val.centerX, val.centerY); rotate(PI/3 + rad); ellipse(0, 0, 10, 20); rotate(-PI/3-rad); translate(-val.centerX,-val.centerY);
        translate(val.centerX, val.centerY); rotate(2*PI/3 + rad); ellipse(0, 0, 10, 20); rotate(-2*PI/3-rad); translate(-val.centerX, -val.centerY);
    })
}