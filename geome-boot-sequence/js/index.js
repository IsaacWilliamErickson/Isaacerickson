boot = {
  defaultTime: 200,
  timePerChar: 10,
  soundPaths: {"blip": "https://dl.dropboxusercontent.com/u/74836805/codepenassets/blip-1.wav"},
  soundCaches: {},
  soundCacheSize: 16,
  soundCacheIndex: {},
  speechAvailable: typeof speechSynthesis != "undefined",
  fallback: navigator.userAgent.toLowerCase().indexOf("firefox") > -1,//TODO check for actual functionality
  elem: document.getElementById("geome-boot")
};

if (boot.speechAvailable) {
  window.speechSynthesis.onvoiceschanged = function(e) {
    boot.actions.voiceInit();
  };
}

boot.actions = {
  voiceInit: function(id, subid, text, time) {
    if (!boot.speechAvailable) {
      return "UNAVAILABLE - USING NULL OUTPUT";
    }
    boot.voices = speechSynthesis.getVoices();
    for (var i = 0; i < boot.voices.length; i++) {
      var name = boot.voices[i].name.toUpperCase();
      if (name.indexOf("ENGLISH") > -1 && name.indexOf("MALE") == -1) {
        boot.voice = boot.voices[i];
      }
    }
    for (var i = 0; i < boot.voices.length; i++) {
      var name = boot.voices[i].name.toUpperCase();
      if (name.indexOf("ENGLISH") > -1 && name.indexOf("MALE") > -1) {
        boot.voice = boot.voices[i];
      }
    }
    return "CHECK";
  },
  say: function(id, subid, text, time) {
    if (!boot.speechAvailable) {
      return;
    }
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.volume = 1.4;
    msg.rate = 1.2;
    msg.pitch = 0.7;
    
    if (typeof boot.voice != "undefined") {
      msg.voice = boot.voice;
    }
    
    window.speechSynthesis.speak(msg);
  }
};

boot.lines = [
  {text: "GEOME BOOT", time: 1000},
  {text: "", time: 0},
  {text: "OMPUCO SYSTEMS © 2265 ALL RIGHTS", time: 200},
  {text: "…", time: 200},
  {text: "PREPARING BOOT SEQUENCE", time: 200},
  {text: "…", time: 500},
  [{text: "X Y GALVO ", time: 600}, {text: "CHECK", time: 300}],
  [{text: "Z INPUT ", time: 700}, {text: "CHECK", time: 300}],
  [{text: "VECTOR COORDINATES RENDERER ", time: 800}, {text: "CHECK", time: 300}],
  {text: "…", time: 500},
  {text: "…", time: 300},
  [{text: "HUMAN & PHYSICAL INTERFACING ", time: 1200}, {text: "CHECK", time: 300}],
  [{text: "…", time: 200}, {text: "…", time: 300}, {text: "…", time: 500}, {text: "…", time: 700}, {text: "…", time: 200}, {text: "…", time: 200}],
  {text: ">>ALL SENSORS ACTIVE & RESPONSIVE", time: 200},
  [{text: "ROBOTICS FUNCTIONS ", time: 600}, {text: "CHECK", time: 300}],
  {text: ">>SERVOS AND JOINTS ARE OPERATIONAL", time: 200},
  [{text: "SPEECH + VOICE SYNTHESIS ", time: 700}, {time: 300, actions: [boot.actions.voiceInit]}],
  ["ACTIVE: ", {text: "hello world!", actions: [boot.actions.say], time: 1500}],
  {text: ">>SUCCESS", time: 300},
  [{text: "AI ACTIVE ", time: 400}, {text: "CHECK", time: 700}],
  {text: ">>SELF AWARE CHECK : PASSED", time: 500},
  {text: ">>SPACIAL RECOGNITION IS ACTIVE", time: 300},
  {text: ">>SPEECH RECOGNITION IS ACTIVE", time: 400},
  {text: ">>PERSONALITY LIBRARIES ARE ACTIVE", time: 800},
  {text: ">>AI IS FUNCTIONAL", time: 1500},
  {text: "ALL", time: 750},
  {text: "SYSTEMS", time: 750},
  {text: "ARE", time: 750},
  [{text: "OK", time: 1250}, {text: "--->", time: 300}],
  [{text: "i am geome> ", time: 300}, "| __ |"],
  [{text: "it is verry nice to meet you!> ", time: 650}, {text: "^__^", time: 2500}],
  [">>STANDBY ", "| __ |"]
];

boot.getSound = function(name) {
  var soundCache;
  if (typeof boot.soundCaches[name] == "undefined") {
    boot.soundCaches[name] = [];
  }
  soundCache = boot.soundCaches[name];
  
  var soundCacheIndex;
  if (typeof boot.soundCacheIndex[name] == "undefined") {
    boot.soundCacheIndex[name] = 0;
  }
  soundCacheIndex = boot.soundCacheIndex[name];
  
  var audio;
  if (soundCacheIndex == -1 || soundCache.length < boot.soundCacheSize) {
    audio = new Audio(boot.soundPaths[name]);
    audio.autoplay = false;
    if (soundCacheIndex > -1) {
      soundCache[soundCacheIndex] = audio;
    }
  } else {
    audio = soundCache[soundCacheIndex];
    if (boot.fallback) {
      //DARN YOU NON-CHROME BROWSERS (or just Firefox... especially Firefox. Edge is ok.)
      audio.pause();
      audio.currentTime = 0;
    }
  }
  
  soundCacheIndex = (soundCacheIndex + 1) % boot.soundCacheSize;
  
  boot.soundCaches[name] = soundCache;
  boot.soundCacheIndex[name] = soundCacheIndex;
  
  return audio;
};

boot.addText = function(text, cb, i) {
  if (typeof i != "number") {
    i = 0;
  }
  var char = document.createElement("span");
  char.className = "char char-"+(text.charCodeAt(i));
  if (!boot.fallback) {
    char.appendChild(document.createTextNode(text.charAt(i)));
  } else {
    //Firefox is painfully slow for me...
    char.appendChild(document.createTextNode(text));
  }
  boot.elem.appendChild(char);
  boot.getSound("blip").play();
  if (boot.fallback) {
    cb();
    return;
  }
  i++;
  if (i < text.length) {
    setTimeout(function() {
      boot.addText(text, cb, i);
    }, boot.timePerChar);
  } else {
    cb();
  }
}

boot.showLine = function(line, continueon, subid) {
  if (typeof line == "undefined" || line == null) {
    return;
  }
  
  var id = 0;
  if (typeof line == "number") {
    id = line;
    line = boot.lines[id];
  } else {
    for (var i = 0; i < boot.lines.length; i++) {
      if (boot.lines[i] == line) {
        id = i;
        break;
      }
    }
  }
  
  var len = 0;
  if (Object.prototype.toString.call(line) == "[object Array]") {
    len = line.length;
  }
  if (typeof subid != "number") {
    subid = 0;
  }
  if (subid >= len) {
    subid = 0;
  }
  if (Object.prototype.toString.call(line) == "[object Array]") {
    line = line[subid];
    subid++;
  }
  
  var text = line;
  var time = boot.defaultTime;
  if (typeof line == "object") {
    text = line.text;
    if (typeof line.time != "undefined") {
      time = line.time;
    }
    if (typeof line.actions != "undefined") {
      for (var i = 0; i < line.actions.length; i++) {
        boot.showLine(line.actions[i](id, subid, text, time));
      }
    }
  }
  
  if (typeof text == "undefined") {
    id++;
    subid = 0;
    if (continueon && id < boot.lines.length) {
      setTimeout(function() {boot.showLine(id, true, subid)}, time);
    }
    return;
  }
  
  boot.addText(text, function() {
    if (subid >= len) {
      boot.elem.appendChild(document.createElement("br"));
      id++;
      subid = 0;
    }
    if (continueon && id < boot.lines.length) {
      setTimeout(function() {boot.showLine(id, true, subid)}, time);
    }
  });
};

boot.start = function() {
  boot.showLine(0, true);
};

var nl = false;
if (boot.fallback) {
  boot.showLine("WARNING: USING FALLBACK CONSOLE MODE");
  nl = true;
}
if (!boot.speechAvailable) {
  boot.showLine("WARNING: NO VOICE OUTPUT FOUND");
  nl = true;
}
if (nl) {
  boot.showLine("");
}

boot.start();