document.addEventListener('DOMContentLoaded', function (){
 
var canvas = document.querySelector('canvas');
var c = canvas.getContext("2d");
var anime = 1, gameSpeed = 5, ref = 0, rockref = 0, marioref = 0, pause = 0, t = 0, dx = 0, dy = 0, wallWidth = 30, rockWidth = 50, st = 1, gameover = 0, cprob = 0.25;
var obstacle = [], obstaclerock = [], mario = [], bullet = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.85;


//adding sound=====================================
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }
}

var mySound;
    mySound = new sound("bgmusic.mp3");
    bsound = new sound("bullet.mp3");
//==================================================

var temp ={
  x : canvas.width / 2,
  y : 0,
  height : 0,
  type : "wall"
}

var r ={
  x : canvas.width - wallWidth,
  y : randomInRange(0.1, 0.9) * canvas.height,
  height : 0,
  type : "rock",
  speed : 2 * gameSpeed,
  update : function(){
    this.x -= this.speed;
  }
}

var mar = {
  x:(1 + randomInRange(0, 0.5)) * canvas.width,
  y:canvas.height - 100,
  height:100,
  type:"mario",
  status:1,
  speed:gameSpeed,
  bullet:{
    x:this.x,
    y:this.y,
    bx:gameSpeed,
    // by:
  },
  update:function()
  {
    this.x -= this.speed;
  },
   updateBullet:function()
  {
    this.bullet.x-=this.bullet.bx;
    this.bullet.y-=this.bullet.by;
  },
}

obstacle.push(temp);
obstaclerock.push(r);
mario.push(mar);
// image of wall
var wall =  new Image();
wall.src = "obstacle.jpg";
var stone = new Image();
stone.src = "rock.png";
var hitman = new Image();
hitman.src ="monster.png"



if(!wall.complete)
{
  // checking if image is completely loaded
  setTimeout(function()
  {
    draw(temp);
  },10)
}
draw(temp);
if(!stone.complete)
{
  // checking if image is completely loaded
  setTimeout(function()
  {
    draw(r);
  },10)
}
draw(r);
if(!hitman.complete)
{
  // checking if image is completely loaded
  setTimeout(function()
  {
    draw(mar);
  },10)
}
draw(mar);
// drawing of wall
function draw(q)
{
  if(q.type == "wall")
    {
      c.beginPath();
      c.drawImage(wall,q.x,q.y,wallWidth,q.height);
      c.closePath();
    }
  else if(q.type == "rock")
  {
    c.beginPath();
    c.drawImage(stone,q.x,q.y,rockWidth,q.height);
    c.closePath();
  }
  else if(q.type == "mario")
  {
    if(q.status)
    {
      c.beginPath();
      c.drawImage(hitman, q.x, q.y, rockWidth, q.height);
      c.closePath();
    }
    c.beginPath();
    c.arc(q.bullet.c,q.bullet.d, q.bullet.radius, 0, Math.PI * 2, true);
    c.fillStyle = "red";
    c.fill(); 
    c.closePath();
  }
  
}









function trace(e)
 {  
    var posx=e.layerX-deep.x;
    var posy=e.layerY-deep.y;
    dx = deep.speed/Math.sqrt((posy/posx)*(posy/posx)+1);
    dy = deep.speed/Math.sqrt((posx/posy)*(posx/posy)+1);
    // console.log("ha");
    if(posx<0)
    {
      dx *= -1;
    }
    else{
      dx=Math.abs(dx);
    }
    if(posy<0)
    {
      dy *= -1;
    }
    else
    {
      dy=Math.abs(dy);
    }
    // console.log(dx,dy);
}


document.addEventListener('keydown', function(e) {
  // console.log(e)
  if(gameover && e.keyCode==32)
  {
    window.location.reload();
  }
  else if(gameover && e.keyCode==27)
  {
    window.close();
  }
});



var deep = 
{
  x : 100,
  y : 100,
  radius : 25,
  color : 'blue',
  speed : gameSpeed * 0.6,
  scoreinit : 0,
  score : 0,
  wallhit : 0,
  rockhit : 0,
   draw: function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  },
  update: function() {
    this.x += dx;
    this.y += dy;
  }
};

// yellow dot
var pointer = {
  x : 0,
  y : 0,
  radius : 10,
  color : "yellow",
  draw: function(){
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    c.fillStyle = this.color;
    c.fill(); 
    c.closePath();
  } 

}


function drawPointer(){
    c.beginPath();
    c.arc(pointer.x, pointer.y, 5, 0, Math.PI * 2, true);
    c.fillStyle = "yellow";
    c.fill();
    c.closePath();
}

// prints out the score on the screen
function score()
{
  c.font =  "20px Arial" ;
  c.beginPath();
  c.fillStyle = "black"; 
  c.fillText("SCORE :",27 * canvas.width / 30,canvas.height / 10)
  c.fillText(Math.ceil(deep.score),29 * canvas.width / 30,canvas.height / 10);
  c.closePath();
}
score();
     
// on moving of mouse changes the direction of velocity of deep
canvas.addEventListener('mousemove', function(e) 
{
  pointer.x = e.layerX;
  pointer.y = e.layerY;
  trace(e);

});



var bul = {
  x : undefined,
  y : undefined,
  bx : undefined,
  by : undefined,
  status : 1,
  type : "bullet",
  update : function()
  {
    this.x += this.bx;
    this.y += this.by;
  },
  draw: function()
  {
    c.beginPath();
    c.fillStyle =  "green";
    c.fillRect(this.x, this.y, 10, 10);
    c.closePath();  
  }
}


// firing of bullet      
canvas.addEventListener('click',function(e)
{
  var posx = e.layerX-deep.x;
  var posy = e.layerY-deep.y;
  bsound.play();// bullet sound
  bul.x = deep.x;
  bul.y = deep.y;
  bul.bx = (1.5 * gameSpeed) / Math.sqrt((posy / posx) * (posy / posx) + 1);
  bul.by = (1.5 * gameSpeed) / Math.sqrt((posx / posy) * (posx / posy) + 1);
  if(posx < 0)
  {
    bul.bx *= -1;
  }
  else
  {
    bul.bx = Math.abs(bul.bx);
  }
  if(posy < 0)
  {
    bul.by *= -1;
  }
  else
  {
    bul.by = Math.abs(bul.by);
  }
  bul.type = "bullet";
  bul.status = 1;
  bullet.push(bul);  
});

//starting of game===================================
function intro()
{       
  c.fillStyle= "grey";
  c.font="70px Georgia";
  c.fillText("Press Spacebar to start!", canvas.width/2-300, 200);
}

var start = true;
document.addEventListener('keydown', function(e) {
  if(!gameover && e.keyCode == 32 && start)
  {
    start = false;
    mySound.play();
    animate();
  }
});

intro();

//========================================================


function animate()
{
  if(!pause)
    {
      if(anime )
    {
      deep.score += gameSpeed * 0.1;

      //crushing between rocks======
      if(deep.rockhit && deep.wallhit)
      {
        anime = 0;
        gameover = 1;
      }

      if(deep.score - deep.scoreinit > 800)
      {
        if(deep.score < 2100)
        {
          gameSpeed += 0.7;
        }
        else
        {
          gameSpeed += Math.log(deep.score/deep.scoreinit);
        }
        cprob += 0.10;
        deep.scoreinit = deep.score;
      }
  
      requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      deep.draw();
      deep.update();

      //tracing of pointer by deep
      var distance = Math.sqrt((deep.x-pointer.x)*(deep.x-pointer.x)+(deep.y-pointer.y)*(deep.y-pointer.y));
      if(distance < deep.radius+pointer.radius)
      {
        dx = 0;
        dy = 0;
      }

      //game over when deep leaves the screen
      if(deep.x + deep.radius < 0)
      {
        anime = 0;
        gameover = 1;
      }

      drawPointer();

      for(var i = 0; i < obstacle.length; ++i)
      {
        obstacle[i].x -= gameSpeed;
        draw(obstacle[i]);
        ref = obstacle.length - 1;
        rockref = obstaclerock.length - 1;
        marioref = mario.length - 1;
        if(obstacle[ref].x < canvas.width / 2 )
        {
           create("wall");
           if(existence(0.5))
            {create("rock");}
          // creating mario randomly
            if(existence(cprob))
            {
              create("mario");
            }           
        }
        if(obstacle[0].x+wallWidth < -50 && obstacle.length > 7)
        {
          obstacle.splice(0,2);
        }       
      }
        //stopping rock on wall hit
       if(obstaclerock[rockref].x<obstacle[ref-1].x+wallWidth)
        {
          var p = obstaclerock[rockref].y>obstacle[ref-1].y&&obstaclerock[rockref].y<obstacle[ref-1].y+obstacle[ref-1].height;
          var q = obstaclerock[rockref].y+obstaclerock[rockref].height>obstacle[ref-1].y&&obstaclerock[rockref].y+obstaclerock[rockref].height<obstacle[ref-1].y+obstacle[ref-1].height;
          if(p && q)
          {
            obstaclerock[rockref].speed = gameSpeed;
          }
        }
        
      for(var i = 0; i < obstaclerock.length; ++i)
      {
          obstaclerock[i].update();
          draw(obstaclerock[i]);
         //preventing excess object generation
          if(obstaclerock[0].x + rockWidth < -50 && obstaclerock.length > 7)
          {
            obstaclerock.splice(0,2);
          }
      }
   

      for(var i = 0; i < mario.length; ++i)
      {
        mario[i].update();
        // updating bullet only when it is in range
        if(mario[i].bullet.d < canvas.height + 50)
        { 
          mario[i].updateBullet();
        }
        draw(mario[i]); 
          
        if(mario[0].x < -50 && mario.length > 7)
        {
          mario.splice(0,2);
        }
        
      }

      //accounting for bullet shot by deep
      for(var i=0;i<bullet.length;++i)
      {
        bullet[i].update();
        bullet[i].draw();
          
        if( bullet.length>3)
        {
          bullet.splice(0,2);
        }
        
      }


// preventing deep from going out from top and bottom
      if(deep.x+deep.radius > canvas.width)
      {
        deep.x=canvas.width - deep.radius;
      }
      if(deep.y - deep.radius < 0)
      {
        deep.y = deep.radius;
      }
      else if(deep.y + deep.radius > canvas.height)
      {
        deep.y=canvas.height-deep.radius;
      }

      score();
      detectCollision();

        
    }
    else
    {
      if(gameover)
      {
        clear();
        mySound.stop();
        c.fillStyle = "red";
        c.font = "100px Georgia";
        c.fillText(Math.ceil(deep.score), canvas.width / 2 - 150, 100);
        c.fillStyle = "black";
        c.font ="70px Georgia";
        c.fillText("GAME OVER", canvas.width / 2 - 250, 250);
        c.font = "40px Serif";
        c.fillText("Press Spacebar to play again", canvas.width / 2 - 250, 350);
        c.fillText("Press Escape to quit", canvas.width / 2 - 250, 400);
      }
    }
  }
    else
    {
      requestAnimationFrame(animate);
    }
   
}




function detectCollision()
{
  deep.wallhit=0;
 
  for(i = 0; i < obstacle.length; ++i)
  {
    for(var j = 0; j < 6; j += Math.PI / 3)
    {
      var m = deep.x + deep.radius * Math.cos(j);
      var n = deep.y - deep.radius * Math.sin(j);
         if(m>obstacle[i].x && m<(obstacle[i].x+wallWidth))
       {    

         if(n<=(obstacle[i].height+obstacle[i].y) && n>=obstacle[i].y)
          {
           
             if(deep.x+deep.radius>obstacle[i].x && deep.x+deep.radius<obstacle[i].x+wallWidth/2)
            {
              deep.x=obstacle[i].x-deep.radius;
            }
            else if(deep.x-deep.radius<obstacle[i].x+wallWidth && deep.x-deep.radius>obstacle[i].x+wallWidth/2)
            {
              deep.wallhit=1;
              deep.x=obstacle[i].x+deep.radius+wallWidth;
            }              
          }        
    
      }
    }
  }
    for(i=0;i<obstaclerock.length;++i)
    {
      for(var j = 0;j < 6;j += Math.PI/3)
      {
          var m = deep.x + deep.radius * Math.cos(j);
          var n = deep.y - deep.radius * Math.sin(j);

         if(m>obstaclerock[i].x && m<(obstaclerock[i].x+rockWidth))
         {        
           if(n<(obstaclerock[i].height+obstaclerock[i].y) && n>obstaclerock[i].y)
            {
              if(deep.x+deep.radius>obstaclerock[i].x )
              {
                deep.rockhit = 1;
                deep.x = obstaclerock[i].x - deep.radius;
              }
            }
            else
            {
              deep.rockhit = 0;
            }        
         }
         else
         {
          deep.rockhit = 0;
         }
      }
    }


   for(i=0;i<mario.length;++i)
   {
      for(var j = 0;j < 6;j += Math.PI/3)
      {
        var m = deep.x + deep.radius * Math.cos(j);
        var n = deep.y - deep.radius * Math.sin(j);
        if(m > mario[i].x && m < (mario[i].x + rockWidth))
        {        
          if(n < (mario[i].height + mario[i].y) && n > mario[i].y)
           {    
              if(deep.x + deep.radius > mario[i].x && mario[i].status)
              {
                deep.x = mario[i].x - deep.radius;
              }
          }        
        }
      }
    }

  for(var i = 0; i < bullet.length; ++i)
  {
    for(var j = 0; j < mario.length; ++j )
    {
      var m = bullet[i].x;
      var n = bullet[i].y;
      if(m > mario[j].x && m < (mario[j].x+rockWidth))
       {        
         if(n<(mario[j].height+mario[j].y) && n>mario[j].y)
          {
             mario[j].status=0;
             deep.score+=40;            
          }        
      }
    }
  }


}


//creates object on command===================================
function create(type) 
{
  if(type == "wall")
  {
    var a = randomInRange(canvas.height/2,canvas.height*0.75);
    var wall = {
      x : canvas.width,
      height : a,
      y : existence(0.5) * (canvas.height - a),
      type : "wall"
    }

  obstacle.push(wall);
  }

  else if(type=="rock")
  {
    var rock={
      x : canvas.width - wallWidth - 10, //so rock appears behind wall
      y : randomInRange(0.1, 0.9) * canvas.height,
      height : 100,
      type : "rock",
      speed : 2 * gameSpeed,
      update : function(){
        this.x -= this.speed;
      }
    }
    obstaclerock.push(rock);
  }

  else if (type == "mario")
  {
    var a = (1 + randomInRange(0, 0.5)) * canvas.width;
    var b = canvas.height - 100;
    var mar = {
      x : a,
      y : b,
      height : 100,
      type : "mario",
      status : 1,
      speed : gameSpeed,
      bullet : {
        c : a + rockWidth / 2,
        d : b,
        bx : gameSpeed,
        by : Math.sqrt(canvas.height) / 2.5,
        radius : 10
      },
      update:function()
      {
        this.x -= this.speed;
      },
      updateBullet:function()
      {
        this.bullet.c -= this.bullet.bx;
        this.bullet.d -= this.bullet.by;
        this.bullet.by -= 0.1;
        var dis = Math.sqrt((this.bullet.c - deep.x) * (this.bullet.c - deep.x) + (this.bullet.d - deep.y) * (this.bullet.d - deep.y))
        if(dis < deep.radius + this.bullet.radius)  //kill by bullet hit
        {
          anime = 0;
          gameover = 1;
        }
      },
   }
   mario.push(mar);
}

  }





//================buttons====================================
  
var restartBtn = document.querySelector('#restart');
restartBtn.addEventListener('click',function(e){
  
  document.location.reload();

  
})

var pauseBtn = document.querySelector('#pause');
var playBtn = document.querySelector('#play');
var instructionBtn = document.querySelector('#instruction');

pauseBtn.addEventListener('click',function(e)
{
  pause ^= 1; //toggling pause
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";

})

playBtn.addEventListener('click',function(e)
{
  pause ^= 1; //toggling pause
  pauseBtn.style.display = "inline-block";
  playBtn.style.display = "none";

})


instructionBtn.addEventListener('click',function(e){
  window.alert("DEEP a legendary programmer got struck in the clutches of his diabolical mentees. They threw him in a maze. You have to help Deep get out of dangerous maze for the better good. \n\nThe world depends on you!\n\nCONTROLS :\nYou can control Deep with the mouse and he will follow you.\nLeft click to fire Bullet. Bullet can kill creatures which will give you more points.\n\nINFORMATION\nDeep will run with a constant speed so he will not be able to move with the speed of your mouse\nBeware of the falling rocks .They can crush you !!\nDo not let Deep get outside of the screen as he would be lost without your guidance\nIn the ancient maze lies wierd creatures. Their powers can kill you\nMore you get inside the maze , more difficult the game gets");

});

// reloading if screen is resized
window.addEventListener('resize',function(e){
  document.location.reload();

})


function clear() 
{
    c.clearRect(0, 0, canvas.width, canvas.height);
}


function randomInRange(min,max)
{
  return Math.random()*(max-min)+min ;  
}


function existence(probability)
{
  if(Math.random()<probability)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

})