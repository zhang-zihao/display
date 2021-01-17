class Hud extends PIXI.Container {
  constructor() {
    super();
    this.loadImages();
    this.buildHud();
  }
  loadImages(){
    this.logo = new PIXI.Sprite(PIXI.Texture.from('img/logo.png'));
    this.hand = new PIXI.Sprite(PIXI.Texture.from('img/pointer.png'));
    //changes
    this.dragtomerge = new PIXI.Sprite(PIXI.Texture.from('img/dragtomerge_text.png'));
    this.endcard_base = new PIXI.Sprite(PIXI.Texture.from('img/popup_endcard.png'));
    this.endcard_ray = new PIXI.Sprite(PIXI.Texture.from('img/shine.png'));
    this.endcard_banner = new PIXI.Sprite(PIXI.Texture.from('img/amazing_banner.png'));
    this.confetti_blue = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_blue.png'));
    this.confetti_green = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_green.png'));
    this.confetti_red = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_red.png'));
    this.confetti_blue2 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_blue.png'));
    this.confetti_green2 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_green.png'));
    this.confetti_red2 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_red.png'));
    this.confetti_blue3 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_blue.png'));
    this.confetti_green3 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_green.png'));
    this.confetti_red3 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_red.png'));
    this.confetti_blue4 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_blue.png'));
    this.confetti_green4 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_green.png'));
    this.confetti_red4 = new PIXI.Sprite(PIXI.Texture.from('img/confetti_stripe_red.png'));
    this.car_police = new PIXI.Sprite(PIXI.Texture.from('img/car_police.png'));
    this.cta = new PIXI.Sprite(PIXI.Texture.from('img/letsplay_cta.png'));
    //end of changes
  }
  buildHud() {
    //changes
    //spawn: logo
    this.logo.anchor.set(0);
    this.logo.scale.set(0.5);
    this.logo.position.set(25,25,25);
    this.addChild(this.logo);
    //end of changes
  } 
  onRotate() {
    //changes
    //resize live hud
    //first check if the game is properly initialized,
    //because onRotate() is also called by scene.js on start
    if(scene.level.carblue1!=null)
    {
      //know which hud should be live and rebuild on rotate
      if(game_phase ==0)
      {
        buildHand(scene.level.carblue1,scene.level.carblue2);
      }
      if(game_phase ==1)
      {
        buildHand(scene.level.carred1,scene.level.carred2);
      }
      if(game_phase ==2)
      {
        buildHand(scene.level.carred2,scene.level.carblue2);
      }
      if(game_phase == 3)
      {
        buildEndCard();
      }
    }
    //end of changes
  }
}
