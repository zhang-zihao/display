const canvas = document.getElementById('canvas');
const app = new PIXI.Application({ view: canvas });
const stage = app.stage;

const scene = new Scene();
stage.addChild(scene);

scene.init();
scene.onRotate();

window.addEventListener('resize', () => {
  scene.onRotate();
});

//changes
//define variables -- control 
var controller_hover = {};
let moved_object;
//define variables -- game stage 
var game_phase = 0;
//define variables -- initialize 
var gameplay_initialized = false;
//end of changes
