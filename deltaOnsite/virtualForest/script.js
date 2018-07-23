// assuming that bear can not move for 1 month after mawling
var canvas = document.getElementById('map');
var c = canvas.getContext('2d');
var cond = 0 ;
var forest;

function Forest(n) {
    this.size = n;
    this.month = 1;
    this.grid = [];
    this.nbear = 0;
    this.nlumberjack = 0;
    this.ntree = 0;
    // 0 refers to nothing is there in block
    for (var i = 0; i < n * n; i++) {
        this.grid.push({
            tree: 0,
            bear: 0,
            lumberjack: 0
        });
    }
    this.lumber = 0;
    this.mauls = 0;

    for (var i = 0; i < n * n * 0.10; i++) {
        this.add('lumberjack', 1);
    }
    for (var i = 0; i < n * n * 0.50; i++) {
        this.add('tree', 12);
    }
    for (var i = 0; i < n * n * 0.02; i++) {
        this.add('bear', 1);
    }
    this.timer = null;
    this.dateDOM = document.getElementById('date');
}

// returns date
Forest.prototype.date = function() {
    var year = Math.floor((this.month - 1) / 12);
    var month = ((this.month - 1) % 12) + 1;
    return 'Year ' + year + ', Month ' + month;
};

Forest.random = function() {
    var i = Math.floor(Math.random() * Forest.direction.length);
    return Forest.direction[i];
};

// returns object stored in the grid at x , y
Forest.prototype.get = function(x, y) {
    var n = this.size;
    // edge jumping to again starting
    return this.grid[((y + n) % n) * n + ((x + n) % n)];
};

// getting all the species of a particular type
Forest.prototype.all = function(type) {
    var all = [];
    for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
            if (this.get(x, y)[type]) {
              all.push({x: x, y: y});
            }
        }
    }
    return all;
};


// maul event removing a lumberjack
Forest.prototype.maul = function(x, y) {
    this.mauls++;
    this.get(x, y).lumberjack = 0;
    this.nlumberjack--;
    if (this.nlumberjack < 1) {
        this.add('lumberjack');
    }
    return this;
};

Forest.prototype.reproduceTree = function(x, y) {
    var block = this.get(x, y);
    var chance;
    if (block.tree < 12) {
        chance = 0;
    } else {
        chance = 0.1;
    }

    // 10% probability of sapling
    if (Math.random() < chance) {
      // selecting a direction without a tree
        var avail = Forest.direction.filter((d) => {
            return this.get(x + d.x, y + d.y).tree == 0;
        });
        if (avail.length > 0) {
            this.ntree++;
            var d = avail[Math.floor(Math.random() * avail.length)];
            this.get(x + d.x, y + d.y).tree = 1;
        }
    }
    block.tree++;
};

// move Events of Animals
Forest.prototype.moveBear = function(x, y) {
    var block = this.get(x, y);
    for (var i = 0; i < 5; i++) {
        var dir = Forest.random();
        x = x + dir.x;
        y = y + dir.y;
        var destination = this.get(x, y);
        // bear can not move over a bear or a tree
            block.bear = 0;
            destination.bear = 1;
            block = destination;
            // bear after a maul can not move for a month
            if (block.lumberjack) {
                this.maul(x, y);
                break;
            }
    }
};

Forest.prototype.moveLumberjack = function(x, y) {
    var block = this.get(x, y);
    // implementing
    for (var i = 0; i < 3; i++) {
        var dir = Forest.random();
        x = x + dir.x;
        y = y + dir.y;
        var destination = this.get(x, y);
        if (!destination.lumberjack) {
            block.lumberjack = 0;
            destination.lumberjack = 1;
            block = destination;
            if (block.bear) {
                this.maul(x, y);
                return this;
            } else if (block.tree >= 12) {
                this.lumber += 1;
                if (block.tree >= 120) this.lumber += 2;
                block.tree = 0;
                this.ntree--;
            }
        }
    }
};



Forest.prototype.add = function(type, value) {
  value = value || 1; //value can't be 0
    while (true) {
        var x = Math.floor(Math.random() * this.size);
        var y = Math.floor(Math.random() * this.size);
        var block = this.get(x, y);
        // exiting out of for loop when a block is found
        if (!block[type]) {
            block[type] = value;
            this['n' + type]++;
            return;
        }
    }
};


Forest.prototype.remove = function(type) {
  // getting all animals of a type and then removing one
    var all = this.all(type);
    // prohibiting removing when nothing is left
    if (all.length > 0) {
        var p = all[Math.floor(Math.random() * all.length)];
        this.get(p.x, p.y)[type] = 0;
        this['n' + type]--;
    }
};

Forest.prototype.newYear = function() {
  // bear removing if mauls happen
    if (this.mauls > 0) {
        this.remove('bear');
    } else {
        this.add('bear');
    }
    this.mauls = 0;

    // removing adding lumberjack at end of the year
    var difference = this.lumber - this.nlumberjack;
    if (difference < 0 && this.nlumberjack > 1) {
        this.remove('lumberjack');
    } else {
      this.add('lumberjack');
    }
    this.lumber = 0;
};

// make every thing move each month and calling of Year event changing of months
Forest.prototype.move = function() {
    for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
            var block = this.get(x, y);
            if (block.tree > 0) {
                block.tree++;
            }
            if (block.bear  ) {
                this.moveBear(x, y);
            }
            if (block.lumberjack ) {
                this.moveLumberjack(x, y);
            }
            if (block.tree) {
                this.reproduceTree(x, y);
            }
        }
    }
    if ((this.month % 12) == 0) {
        this.newYear();
    }
    this.month++;
};

// drawing on canvas and updating the date
Forest.prototype.draw = function() {
    var scale = canvas.width / this.size;
    for (var y = 0; y < this.size; y++) {
        for (var x = 0; x < this.size; x++) {
            var style = 'white';
            var block = this.get(x, y);
            if (block.lumberjack) {
                style = 'red';
            } else if (block.bear) {
                style = 'black';
            } else if (block.tree >= 120) {
                style = 'darkgreen';
            } else if (block.tree >= 12) {
                style = 'green';
            } else if (block.tree > 0) {
                style = 'lightgreen';
            }
            c.fillStyle = style;
            c.fillRect(x*scale, y *scale, scale, scale);
        }
    }
    this.dateDOM.innerHTML = this.date();
};

Forest.prototype.start = function(speed) {
  // used arrow function to prevent tle loss of scope of this
    if (this.timer == null) {
        this.timer = setInterval(()=> {
            this.move();
            this.draw();
        }, speed);
    }
};

// random directions to move in the grid
Forest.direction = [
    {x:  1, y: -1},
    {x:  1, y:  0},
    {x:  1, y:  1},
    {x:  0, y: -1},
    {x:  0, y:  1},
    {x: -1, y: -1},
    {x: -1, y: 0},
    {x: -1, y:  1},
];

Forest.prototype.stop = function() {
    clearInterval(this.timer);
    this.timer = null;
    return this;
};



var size = document.getElementById('size');
document.getElementById('submit').addEventListener('click',function(){
  if(forest) forest.stop();
  forest = new Forest(Number(size.value));
  forest.start(100);
})
