/// <reference path="p5.global-mode.d.ts" />
orbitnum = 0; planetnum = 0;
orbitList = []; planetList = [], cometList = [], effectList = [];
mode = "createOrbit";
playmode = "stop";
myFrame = 0;
planetMode = "snare";
first = 1;

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
            muteSound.triggerAttack();
            first--;
        }
        $("#Slider").hide();
        $("#Slider2").hide();
        $("#planetRadio").show();
    });
    $("#button-orbit").on('click', function() {
        mode="createOrbit";
        $("#Slider").show();
        $("#Slider2").show();
        $("#planetRadio").hide();
    })
    $("#button-delete").on('click', function() {
        mode="delete";
    })
    $("#button-play").on("click", play);
    $("#button-stop").on("click", stop);
    $("#planetRadio").hide();
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
        $("#button-planet").css({"filter": "hue-rotate(180deg)"});
        $("#button-orbit").css({"filter": "hue-rotate(0deg)"});
        $("#button-delete").css({"filter": "hue-rotate(0deg)"});
    }
}

//jQueryによる監視
$(function() {
    $("#planetRadio input[type=radio]").change(function() {
        planetMode = this.value;
    });
})


//音
function checkCollision() {
    cometList.forEach(function(cval, ci) {
        planetList.forEach(function(pval, pi) {
            if (pval.centerX < cval.centerX+planetSize/3 && pval.centerX > cval.centerX-planetSize/3 &&
                pval.centerY < cval.centerY+planetSize/3 && pval.centerY > cval.centerY-planetSize/3) {
                if (pval.check[cval.number] == false) {
                    pval.check[cval.number] = true;
                    pval.sound.triggerAttack();
                    append(effectList, {centerX: pval.centerX, centerY: pval.centerY, color: pval.color, size:planetSize});
                }
            }else{
                pval.check[cval.number] = false;
            }
        })
    });
}

//色付け
function paintOrbit(range, red, green, blue) {
    var target = [], plaTar = [];
    orbitList.forEach(function(val, i) {
        if (mouseX < val.centerX+val.R*range && mouseX > val.centerX-val.R*range &&
            mouseY < val.centerY+val.R*range && mouseY > val.centerY-val.R*range) {
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
    stroke(red, green, blue); noFill();
    target.forEach(function(val) {
        ellipse(val.centerX, val.centerY, val.R);
    })

    fill(255);
    target.forEach(function(val) {
        ellipse(val.centerX + (val.R/2)*cos(myFrame/val.period*TWO_PI - PI/2), val.centerY + (val.R/2)*sin(myFrame/val.period*TWO_PI - PI/2), planetSize);
    });
    if (mode=="delete") {
        fill(red, green, blue);
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
        if (mode=="createOrbit") {
            var R = $("#slider").slider('getValue');
            var P = $("#slider2").slider("getValue");
            createOrbit(mouseX, mouseY, R, P);
        }else if (mode=="delete") {
            deleteObject(mouseX, mouseY);
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
            if (mouseX < val.centerX+planetSize/2 && mouseX > val.centerX-planetSize/2 &&
                mouseY < val.centerY+planetSize/2 && mouseY > val.centerY-planetSize/2) {
                dragTarget = val; place++;
            }
        })
    }
    if (place == 0) //一個も判定重なってなければリセット
        dragTarget = null;
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
    $("#button-play").attr("src", "images/button-play.png");
}


function createOrbit(x, y, r, p) {
    var checkdbl = false;
    for (var i = 0; i < orbitList.length; i++) {
        if (x < orbitList[i].centerX + 5 && x > orbitList[i].centerX - 5 &&
            y < orbitList[i].centerY + 5 && y > orbitList[i].centerY - 5) {
            checkdbl = true;
            break;
        }
    }
    if (!checkdbl) {
        orbit = {number: orbitnum, centerX: x, centerY: y, R:r, period: p};
        comet = {number: orbitnum, centerX: x, centerY: y-r/2, period: p};
        orbitnum++;
        append(orbitList, orbit);
        append(cometList, comet);
        stroke(255); noFill();
        ellipse(x, y, r);
        fill(255, 255, 255);
        ellipse(x, y-r/2, planetSize);
        revolveOrbit();
    }
}

function createPlanet(x, y) {
    var checkdbl = false;
    for (var i = 0; i < planetList.length; i++) {
        if (x < planetList[i].centerX + 5 && x > planetList[i].centerX - 5 &&
            y < planetList[i].centerY + 5 && y > planetList[i].centerY - 5) {
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
    stroke(0); fill(red, green, blue);
    ellipse(x, y, planetSize);
    revolveOrbit();
    }
}

function deleteObject(x, y) {
    var valList = [];
    orbitList.forEach(function(val, i) {
        if (x < val.centerX+val.R*0.5 && x > val.centerX-val.R*0.5 &&
            y < val.centerY+val.R*0.5 && y > val.centerY-val.R*0.5) 
                append(valList, val);
    });
    planetList.forEach(function(val, i) {
        if (x < val.centerX+planetSize*0.5 && x > val.centerX-planetSize*0.5 &&
            y < val.centerY+planetSize*0.5 && y > val.centerY-planetSize*0.5) 
                append(valList, val);
    });
    valList.forEach(function(val, i) {
        if (orbitList.indexOf(val) >= 0)
            orbitList.splice(orbitList.indexOf(val), 1);
        if (planetList.indexOf(val) >= 0)
            planetList.splice(planetList.indexOf(val), 1);
    });
    revolveOrbit();
}

function revolveOrbit() {
    background(bgColor);
    effectList.forEach(function(val, i) {
        val.size += 2;
        val.color = lerpColor(val.color, bgColor, val.size/(maxSize*10));
        if (val.size >= maxSize)
            effectList.splice(i, 1);
        stroke(val.color); noFill();
        ellipse(val.centerX, val.centerY, val.size);
    });
    
    orbitList.forEach(function(val, i) {
        stroke(255); noFill();
        ellipse(val.centerX, val.centerY, val.R);
        fill(255, 255, 255);
        comet = {centerX: val.centerX + (val.R/2)*cos(myFrame/val.period*TWO_PI - PI/2),
             centerY: val.centerY + (val.R/2)*sin(myFrame/val.period*TWO_PI - PI/2)};
        cometList[val.number].centerX = comet.centerX;
        cometList[val.number].centerY = comet.centerY;
        ellipse(comet.centerX, comet.centerY, planetSize);
    });
    planetList.forEach(function(val, i) {
        stroke(0); fill(val.color);
        ellipse(val.centerX, val.centerY, planetSize);
    })
}
