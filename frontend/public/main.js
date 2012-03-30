enchant();

var game;
var player;
var score;

var frames = [ 0,1,2,3,4,5];

var SplashSprite = enchant.Class.create(Sprite, {
    initialize: function(x, y, image) {
        var game = enchant.Game.instance;
        Sprite.call(this, image.width, image.height);
        this.x = x;
        this.y = y;
        this.image = image;
        var that = this;
        game.rootScene.addChild(this);
        game.rootScene.addEventListener('enterframe', function() {
            if (that.age > 15) {
                this.removeChild(that);
                this.removeEventListener('enterframe', arguments.callee);
            }
        });
    }
});

var Player = enchant.Class.create(Group, {
    initialize: function() {
        Group.call(this);
        this.kuma = new Sprite(32, 32);
        this.kuma.image = game.assets['images/chara1.png'];
        this.addChild(this.kuma);
        this.limit = 0;
        this.require = 0;
    },
    setTimer: function() {
        var time = this.age + rand(5) * 20 + 30;
        this.addEventListener('enterframe', function() {
            if (this.age == time) {
                this.que();
                this.removeEventListener('enterframe', arguments.callee);
            }
        });

    },
    que: function() {
        if (this.require) { 
            return;
        }
        var that = this;
        this.limit = rand(5) * 10 + 30;
        this.require = randf();
        this.say = new Say(this.require);
        this.say.y = - 32;
        this.addChild(this.say);
        this.say.addEventListener('enterframe', function() {
            if (this.age == that.limit) {
                that.removeQue();
                that.sad();
            }
        });
    },
    removeQue: function() {
        this.say.clearEventListener();
        this.removeChild(this.say);
        this.require = 0;
        this.setTimer();
    },
    fun: function() {
        var fun = new Sprite(16, 16);
        fun.image = game.assets['images/icon0.gif'];
        fun.frame = 10;
        fun.x = 16;
        fun.y = -16;
        this.addChild(fun);
        time+=30;
        var lifetime = this.age + 10;
        this.addEventListener('enterframe', function() {
        	fun.y--;
            if (this.age >= lifetime) {
                this.removeChild(fun);
                this.removeEventListener('enterframe', arguments.callee);
            }
        });
    },
    sad: function() {
        this.kuma.frame = 3;
        combo=0;
        var time = this.age + 30;
        this.addEventListener('enterframe', function() {
            if (this.age >= time) {
                this.kuma.frame = 0;
                this.removeEventListener('enterframe', arguments.callee);
            }
        });
    }
});
combo=0;
var Score = enchant.Class.create(MutableText, {
    initialize: function() {
        MutableText.call(this, 0, 0, game.width/2, 'score:0');
        this._score = 0;
    },
    add: function(n) {
        combo++;
        this._score += n*combo;
        this._update();
    },
    _update: function() {
        this.text = this._score.toString();
        this.setText('score:' + this.text);
    },
    value: {
        get: function() {
            return this._score;
        },
        set: function(n) {
            this._score = n;
            this._update();
        }
    }
});

var Sushi = enchant.Class.create(Group, {
    initialize: function(f) {
        Group.call(this);
        var sara = new Sprite(32, 32);
        sara.image = game.assets['images/sara.png'];
        this.addChild(sara);
        this.food = new Sprite(32, 32);
        this.food.image = game.assets['images/sushi.gif'];
        this.food.scaleX=0.5;
        this.food.scaleY=0.5;
        this.frame = this.food.frame = f;
        this.food.x = 0;
        this.food.y = 0;
        this.addChild(this.food);
        this.addEventListener('touchend', function() {
            compair(this.frame);
            this.limit=game.frame+10;
           this.hide();
/*            this.addEventListener('enterframe',function(){
            	this.y--;
            	if(this.limit<game.frame){
		            this.hide();
            		this.y=0;
            		
            	}
            });*/
        });
    },
    change: function() {
        this.frame = this.food.frame = randf();
    },
    hide: function() {
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            this.childNodes[i].opacity = 0;
        }
    },
    appear: function() {
        for (var i = 0, l = this.childNodes.length; i < l; i++) {
            this.childNodes[i].opacity = 1;
        }
    }
});

var Say = enchant.Class.create(Group, {
    initialize: function(f) {
        Group.call(this);
        var say = new Sprite(32, 32);
        say.image = game.assets['images/say.png'];
        this.addChild(say);
        var food = new Sprite(32, 32);
        food.image = game.assets['images/sushi.gif'];
        food.frame = f;
        food.scaleX=0.5;
        food.scaleY=0.5;
        food.x = 0;
        food.y = -4;
        this.x=12;
        this.y=6;
        this.addChild(food);
    }
});

var rand = function(n) {
    return Math.floor(Math.random() * n);
};

var randf = function() {
    return frames[rand(frames.length)];
};

var compair = function(frame) {
    if (player.require == frame) {
        score.add(1);
        player.removeQue();
        player.fun();
    } else {
        player.removeQue();
        player.sad();
    }
};

window.onload = function() {
    game = new Game(320, 320);
    game.preload('images/chara1.png', 'images/icon0.gif','images/sushi.gif',
    						'images/back.png', 'images/say.png', 'images/sara.png');
    game.onload = function() {
    	var bg = new Sprite(320,320);
    	bg.image = game.assets['images/back.png'];
        game.rootScene.addChild(bg);
    	
    
        score = new Score();
        game.rootScene.addChild(score);
        player = new Player();
        player.x = 128;
        player.y = 128;
        game.rootScene.addChild(player);
        player.que();

        lane = new Group();
        lane.y = 160;
        var sushi;
        for (var i = 0; i < 11; i++) {
            sushi = new Sushi(randf());
            sushi.x = i * 32 - 32;
            lane.addChild(sushi);
        }
        

        lane.addEventListener('enterframe', function() {
            var child;
            for (var i = 0, l = this.childNodes.length; i < l; i++) {
                child = this.childNodes[i];
                if (child.x == 320) {
                    child.x = -32;
                    child.change();
                    child.appear();
                }
                child.x += 1;
            }

        });
		game.rootScene.addChild(lane);

        timeBoard = new MutableText(170,0, game.width, "Time:0.0");
        time = 30*30;
        timeBoard.addEventListener('enterframe',function(){
        	this.setText("Time:"+Math.floor(time/30)+"."+Math.floor(time/3%10));
        	time--;
        	
       		if(time==0){
        		game.end(score.value,"Score:"+score.value);
        	}
        });
		game.rootScene.addChild(timeBoard);
    };
    game.start();
};
