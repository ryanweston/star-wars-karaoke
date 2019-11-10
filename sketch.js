let apiKey = "xcJPf1Q6T2pWR3ct5ECYn5Kz4qQGRjetVZdsLKwyd4rYTlZkgeQC5f0eQQgYtAOM";
var api = "https://orion.apiseeds.com/api/music/lyric/";
var input;
var input2;
var lyrics;
var font;
let y = 0;
var stars = [];
var speedStars;
var song;


//Preloads font for WEBGL render. Has to be opentype.
 function preload() {
  font = loadFont('https://fonts.gstatic.com/s/newscycle/v14/CSR54z1Qlv-GDxkbKVQ_dFsvWNRevA.ttf');
 }
//Class containing functions to generate stars.
  class Star {

//Assigns random starting positions within the boundary box.
   constructor() {
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.z = random(width);
      this.pz = this.z;
    }

  //Update generates movement for the stars, uses speedStars variable to adjust speed.
    update() {
      this.z = this.z - speedStars;

         if (this.z < 1) {
         	 this.z = width;
           this.x = random(-width, width);
           this.y = random(-height, height);
           this.pz = this.z;
         }
    }

  //Show function generates shapes mapped to coordinates previously generated.
     show() {
       //Styling for stars.
       fill(255);
       noStroke();

       var sx = map(this.x/this.z, 0, 1, 0, width);
       var sy = map(this.y/this.z, 0, 1, 0, height);
       //Sets radius for the stars mapped to position of depth(z) and sizing for shape to scale.
       var r = map(this.z, 0, width, 12, 0);
       ellipse(sx, sy, r, r);

      //Maps current posisition / previous position to generate values for star streak
       var px = map(this.x/this.pz, 0, 1, 0, width);
       var py = map(this.y/this.pz, 0, 1, 0, height);
       this.pz = this.z;
       //Styling for streak.
       stroke(255);
      //Uses previous coordinates generated above, and attachs them to
      //coordinates of current star position.
         line(px, py, sx, sy);
       }
  }

function setup() {
  //Uses WEBGL for adjusting perspective of text movemement
  createCanvas(windowWidth, windowHeight,WEBGL);

  star = new Star();
  //Creates an array for 1600 stars
  for (var i = 0; i < 1600; i++) {
    //New star for every iteration
    stars[i] = new Star();
}

//Loads song and measures amplitude levels.
  song = loadSound("starwars.mp3", loaded);
  amp = new p5.Amplitude();

//Creates button set for lyric API call.
  var button = select('#submit');
//Runs function when mouse pressed to load lyrics from API and store them.
  button.mousePressed(loadLyrics);
  input = select('#artist');
  input2 = select('#song');

//Sets font type to preloaded font.
  textFont(font);

}

//Runs song through function, generates button to toggle play.
function loaded() {
  var button3 = select('#sith');
  button3.mousePressed(togglePlaying);
}


//Takes user input and places in API request url
function loadLyrics() {
  //artist / song / api key
  var url = api + input.value() + "/" + input2.value() + "?apikey=" + apiKey;
  //Loads url through function to place in usable variable.
  loadJSON(url, gotData);
  //Resets counter for the lyrics position on the page when submit is pressed.
  y = 0;
}

//Loads JSON data from API call and places in variable.
function gotData(data) {
  lyrics = data;
}

function draw() {
  var vol = amp.getLevel();

  //Maps speed of stars to amplitude levels of the theme song.
  speedStars = map(vol, 0.6, 0.2, 3, 60);
  background(0);
  //stars drawn by interating through stars array from setup();
  for (var i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
}



  if (lyrics){
    //Text styles for lyrics.
      fill(250,203,64);
      textSize(20);
      textAlign(CENTER);
    //Changes perspective of the text in WEBGL canvas.
      rotateX(PI/4);
    //Incremements counter, allowing lyrics to move up page.
      y+=4;
    //Generates lyrics for the song, positions at bottom of the screen
    //uses y incrementor to move up page by dividing.
      text(lyrics.result.track.text,0, height / 2 - y / 2 );
    //console.log(y);
    }
}

//Toggles pause and play and changes content of button to reflect in GUI.
function togglePlaying() {
  if(!song.isPlaying()) {
    song.play();
    song.setVolume(0.8);
    document.getElementById("sith").innerHTML="PAUSE THEME TUNE";
  } else {
    song.pause();
    document.getElementById("sith").innerHTML="PLAY THEME TUNE";
  }
}
