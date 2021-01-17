var _raycaster = new THREE.Raycaster();
var _mouse = new THREE.Vector2();
var _intersections = [];

//part of the drag controller is re-wrote from three.js's own DragControls.js
_domElement = canvas;
_camera = scene.camera;

//register all event listeners
activate();
function activate() {
  _domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  _domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  _domElement.addEventListener( 'mouseup', onDocumentMouseCancel, false );
  _domElement.addEventListener( 'mouseleave', onDocumentMouseCancel, false );
  _domElement.addEventListener( 'touchmove', onDocumentTouchMove, false );
  _domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
  _domElement.addEventListener( 'touchend', onDocumentTouchEnd, false );
}

//build pointer hand
function buildHand(_fromTarget,_toTarget)
{
  //set hand basics
  scene.hud.hand.anchor.set(0);
  scene.hud.hand.scale.set(0.5);
  scene.hud.hand.alpha = 1;

  //get client bounds
  var width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
  var widthHalf = width / 2, heightHalf = height / 2;
  
  //from object: get world - screen relative position
  var vector = new THREE.Vector3();
  var projector = new THREE.Projector();
  projector.projectVector( vector.setFromMatrixPosition( _fromTarget.matrixWorld ), scene.camera );
  vector.x = ( vector.x * widthHalf ) + widthHalf;
  vector.y = - ( vector.y * heightHalf ) + heightHalf;
  //spawn: hand
  scene.hud.hand.position.set(vector.x,vector.y,0);
  scene.hud.hand.rotation =-1;
  scene.hud.addChild(scene.hud.hand);

  //animate
  //target: get world - screen relative position
  var vector_target = new THREE.Vector3();
  projector.projectVector( vector_target.setFromMatrixPosition( _toTarget.matrixWorld ), scene.camera );
  vector_target.x = ( vector_target.x * widthHalf ) + widthHalf;
  vector_target.y = - ( vector_target.y * heightHalf ) + heightHalf;
  
  //create hand animation
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Tween.get(scene.hud.hand.position,{loop : true}).wait(250).to({x: vector_target.x,y: vector_target.y},1500).wait(500).wait(500);
  createjs.Tween.get(scene.hud.hand,{loop : true}).to({rotation : -1.25},250).wait(2000).to({alpha: 0},500);

  //reset 'dragtomerge' position (on resize)
  scene.hud.dragtomerge.anchor.set(0.5);
  scene.hud.dragtomerge.scale.set(0.75);
  scene.hud.dragtomerge.position.set(widthHalf,heightHalf-175,0);
  scene.hud.addChild(scene.hud.dragtomerge);
} 

//hide hand when player operating
function hideHand()
{
  scene.hud.hand.scale.set(0);
}

//spawn/reset: endcard
function buildEndCard()
{
  //when endcard appears, remove 'dragtomerge'
  scene.hud.removeChild(scene.hud.dragtomerge);

  //get client bounds
  var width = document.documentElement.clientWidth, height = document.documentElement.clientHeight;
  var widthHalf = width / 2, heightHalf = height / 2;

  //spawn: endcard base
  scene.hud.endcard_base.anchor.set(0.5);
  scene.hud.endcard_base.scale.set(0.75);
  scene.hud.endcard_base.position.set(widthHalf,heightHalf,0);
  scene.hud.addChild(scene.hud.endcard_base);

  //spawn: endcard ray
  scene.hud.endcard_ray.anchor.set(0.5);
  scene.hud.endcard_ray.scale.set(0.75);
  scene.hud.endcard_ray.position.set(widthHalf,heightHalf,0);
  scene.hud.addChild(scene.hud.endcard_ray);
  //animate
  createjs.Tween.get(scene.hud.endcard_ray,{loop : true}).to({rotation:12},5000);
  
  //spawn: endcard banner  
  scene.hud.endcard_banner.anchor.set(0.5);
  scene.hud.endcard_banner.scale.set(0.75);
  scene.hud.endcard_banner.position.set(widthHalf,heightHalf-175,0);
  scene.hud.addChild(scene.hud.endcard_banner);

  //spawn: endcard policecar 	
  scene.hud.car_police.anchor.set(0.5);
  scene.hud.car_police.scale.set(0.35);
  scene.hud.car_police.position.set(widthHalf,heightHalf,0);
  scene.hud.addChild(scene.hud.car_police);

  //spawn: endcard logo 
  scene.hud.logo.anchor.set(0.5,0);
  scene.hud.logo.scale.set(1);
  scene.hud.logo.position.set(widthHalf,heightHalf*0.1,0);
  scene.hud.addChild(scene.hud.logo);
	
  //clean up any tween, when resize client if tweens aren't reset, they'll overlap
  createjs.Tween.removeTweens(scene.hud.confetti_blue);
  createjs.Tween.removeTweens(scene.hud.confetti_blue.position);
  createjs.Tween.removeTweens(scene.hud.confetti_green);
  createjs.Tween.removeTweens(scene.hud.confetti_green.position);
  createjs.Tween.removeTweens(scene.hud.confetti_red);
  createjs.Tween.removeTweens(scene.hud.confetti_red.position);

  //setup confetti
  addConfetti(scene.hud.confetti_blue);
  addConfetti(scene.hud.confetti_green);
  addConfetti(scene.hud.confetti_red);
  addConfetti(scene.hud.confetti_blue2);
  addConfetti(scene.hud.confetti_green2);
  addConfetti(scene.hud.confetti_red2);
  addConfetti(scene.hud.confetti_blue3);
  addConfetti(scene.hud.confetti_green3);
  addConfetti(scene.hud.confetti_red3);
  addConfetti(scene.hud.confetti_blue4);
  addConfetti(scene.hud.confetti_green4);
  addConfetti(scene.hud.confetti_red4);

  //setup call to action button & animate
  scene.hud.cta.anchor.set(0.5);
  scene.hud.cta.scale.set(0.75);
  scene.hud.cta.position.set(widthHalf,heightHalf*1.75,0);
  scene.hud.cta.interactive = true;
  scene.hud.cta.buttonMode = true;
  scene.hud.cta.on("mouseup",ctaButton_PointerUp);
  scene.hud.cta.on("touchend",ctaButton_PointerUp);
  scene.hud.addChild(scene.hud.cta);
  createjs.Tween.get(scene.hud.cta.scale,{loop : true}).to({x:0.9,y:0.9},500).to({x:0.75,y:0.75},500);
}

//button: jump to page
function ctaButton_PointerUp()
{
  //if multiple platform targeted, here is the place to add 'know-which-platform'
  window.open("https://apps.apple.com/us/app/traffic-puzzle/id1471999779");
}

//spawn&animate: confetti
function addConfetti(confetti_source){
  confetti_source.anchor.set(0.5);
  confetti_source.scale.set(1.5);
  scene.hud.addChild(confetti_source);
  randomConfetti(confetti_source);
}

//give confetti random value on each animation loop
function randomConfetti(confetti_obj){
  confetti_obj.position.set(document.documentElement.clientWidth*Math.random(),-5,0);
  createjs.Tween.get(confetti_obj,{loop : true}).to({rotation:4},500);
  createjs.Tween.get(confetti_obj.position,{loop : false}).wait(500*Math.random()).to({y:document.documentElement.clientHeight},(1000*Math.random())+500).call(randomConfetti,[confetti_obj]);	
}

//-----event listeners-----//
//mouse: on mouse move
function onDocumentMouseMove( event ) {
  event.preventDefault();
  //get rect
  var rect = _domElement.getBoundingClientRect();
  //get mouse screen position
  _mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
  _mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
  //get mouse world position on floor
  _intersections.length = 0;
  _raycaster.setFromCamera( _mouse, _camera );
  _raycaster.intersectObjects( [scene.level.floor], true, _intersections );
  //get mouse hover position(rounded to grid)
  var vector = new THREE.Vector3().copy( _intersections[ 0 ].point );
  var _grid_x = scene.level.grid.RealPosToGrid(vector).x;
  var _grid_z = scene.level.grid.RealPosToGrid(vector).z;
  //force the car inside the floor
  if(_grid_x > 9){
	  _grid_x = 9;
  }
  if(_grid_x < -10){
	  _grid_x = -10;
  }
  if(_grid_z > 10){
	_grid_z = 10;
  }
  if(_grid_z < -9){
	_grid_z = -9;
  }
  //round to grid position
  controller_hover = scene.level.grid.GridToPosition(_grid_x,_grid_z);

  //if object is clicked on mouse down, move object based on game phase
  if(moved_object!=null)
  {
    //hide hand instruction when player is operating
    hideHand();
    //make moved object follow mouse
    moved_object.position.set(controller_hover.x,.25,controller_hover.z); 
    //object to merge: different on each game phase
    var _target_object;
    if(game_phase ==0){
      _target_object = scene.level.carblue2;
    }
    if(game_phase ==1){
      _target_object = scene.level.carred2;
    }
    if(game_phase ==2){
      _target_object = scene.level.carblue2;
	}
	
	//see if mouse position is over the target to merge
    var xdiff = controller_hover.x-_target_object.position.x;
	var zdiff = controller_hover.z-_target_object.position.z;
	//mouse over merge target: target respond (grow bigger) to remind player
    if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
      _target_object.scale.set(0.55,0.55,0.55);
	}
	//mouse not over merge target: reset target's scale
    else{
      if(game_phase ==0||game_phase==1){
        _target_object.scale.set(0.3,0.3,0.3);
      }
      if(game_phase ==2){
        _target_object.scale.set(0.55,0.55,0.55);
      }		
    }
  }
}

//mouse: on mouse down
function onDocumentMouseDown( event ) {
  event.preventDefault();
  //clean _intersections
  _intersections.length = 0;
  //object to drag: different on each game phase
  if(game_phase ==0){
    var objectsToDrag = [scene.level.carblue1];
  }
  if(game_phase ==1){
    var objectsToDrag = [scene.level.carred1];
  }
  if(game_phase ==2){
    var objectsToDrag = [scene.level.carred2];
  }
  //see if mouse click on the objectsToDrag
  _raycaster.setFromCamera( _mouse, _camera );
  _raycaster.intersectObjects( objectsToDrag, true, _intersections );
  //if objectsToDrag is clicked, prepare it in moved_object to move
  if(_intersections.length>0){
    if(_intersections[ 0 ].object.parent != null){
      moved_object = objectsToDrag[0];
    }
  }
}

//mouse: on mouse release
function onDocumentMouseCancel( event ) {
  event.preventDefault();
  //on pointer release: leave moved object where it is
  if(moved_object!=null){
    moved_object.position.set(controller_hover.x,0,controller_hover.z);
  }
  //do on release: different on each game phase
  //carblue1 -> carblue2
  if(game_phase ==0){
	//get pointer distance to target
	var xdiff = controller_hover.x-scene.level.carblue2.position.x;
	var zdiff = controller_hover.z-scene.level.carblue2.position.z;
	//if target is within merge range
    if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
      //if pointer has object on it, do on release
      if(moved_object!=null){
		//carblue2 becomes the merged car and grow bigger
        scene.level.carblue2.scale.set(0.55,0.55,0.55);
        scene.level.carblue2.position.set(scene.level.grid.GridToPosition(-3.5,2.5).x,0,scene.level.grid.GridToPosition(-3.5,2.5).z);
		//carblue1 is disposed
		scene.scene3D.remove(scene.level.carblue1);
		//game moves to the next phase
		game_phase =1;
		//display hand because target has changed and player stopped operating
        buildHand(scene.level.carred1,scene.level.carred2);
      }//if pointer has no object on it, do nothing on release
	}
	//else: target is outside merge range
    else{
      //target car: restore original scale
	  scene.level.carblue2.scale.set(0.3,0.3,0.3);
	  //check if just moved an object, don't refresh hand if hand exists
      if(moved_object!=null){
		//display hand because player stopped operating
        buildHand(scene.level.carblue1,scene.level.carblue2);
      }	
    }
  }
  //carred1 -> carred2
  else if(game_phase ==1){
    //get pointer distance to target
    var xdiff = controller_hover.x-scene.level.carred2.position.x;
	var zdiff = controller_hover.z-scene.level.carred2.position.z;
	//if target is within merge range
    if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
      //if pointer has object on it, do on release
      if(moved_object!=null){
		//carred2 becomes the merged car and grow bigger
        scene.level.carred2.scale.set(0.55,0.55,0.55);
        scene.level.carred2.position.set(scene.level.grid.GridToPosition(0.5,-2.5).x,0,scene.level.grid.GridToPosition(0.5,-2.5).z);
		scene.level.carred2.rotation.set(0,0,0);
		//carred1 is disposed
		scene.scene3D.remove(scene.level.carred1);
		//game moves to the next phase
		game_phase =2;
		//display hand because target has changed and player stopped operating
        buildHand(scene.level.carred2,scene.level.carblue2);
      }//if pointer has no object on it, do nothing on release
	}
	//else: target is outside merge range
    else{
	  //target car: restore original scale
	  scene.level.carblue2.scale.set(0.55,0.55,0.55);
	  //check if just moved an object, don't refresh hand if hand exists
      if(moved_object!=null){
		//display hand because player stopped operating
        buildHand(scene.level.carred1,scene.level.carred2);
      }
    }
  }
  //carred2 -> carblue2
  else if(game_phase == 2){
    //get pointer distance to target
    var xdiff = controller_hover.x-scene.level.carblue2.position.x;
	var zdiff = controller_hover.z-scene.level.carblue2.position.z;
	//if target is within merge range (new merge range because car is bigger now)
    if((xdiff*xdiff)<=1&&(zdiff*zdiff)<=1){
	  //if pointer has object on it, do on release
      if(moved_object!=null){
		//carpolice becomes the merged car and grow bigger
        scene.level.carpolice.scale.set(0.55,0.55,0.55);
        scene.level.carpolice.position.set(scene.level.grid.GridToPosition(-3.5,2.5).x,0,scene.level.grid.GridToPosition(-3.5,2.5).z);
		scene.level.carpolice.rotation.set(0,0,0);
		scene.scene3D.add(scene.level.carpolice);
		//carred2 and carblue2 is disposed
        scene.scene3D.remove(scene.level.carred2);
		scene.scene3D.remove(scene.level.carblue2);
		//game moves to the next phase
		game_phase =3;
		//wait 500: let player to see police car merged and then display endcard
        window.setTimeout(function() {
          buildEndCard();
        }, 500);
      }//if pointer has no object on it, do nothing on release
	}
	//else: target is outside merge range
    else{
	  //target car: restore original scale
	  scene.level.carblue2.scale.set(0.55,0.55,0.55);
	  //check if just moved an object, don't refresh hand if hand exists
      if(moved_object!=null){
		  //display hand because player stopped operating
        buildHand(scene.level.carred2,scene.level.carblue2);
      }
    }
  }
  //clean: stop moving the object
  moved_object = null;
}

//--touch: exactly the same as mouse control
function onDocumentTouchMove( event ) {
	event.preventDefault();
	//get rect
	var rect = _domElement.getBoundingClientRect();
	//get mouse screen position
	_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
	_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
	//get mouse world position on floor
	_intersections.length = 0;
	_raycaster.setFromCamera( _mouse, _camera );
	_raycaster.intersectObjects( [scene.level.floor], true, _intersections );
	//get mouse hover position(rounded to grid)
	var vector = new THREE.Vector3().copy( _intersections[ 0 ].point );
	var _grid_x = scene.level.grid.RealPosToGrid(vector).x;
	var _grid_z = scene.level.grid.RealPosToGrid(vector).z;
	//force the car inside the floor
	if(_grid_x > 9){
		_grid_x = 9;
	}
	if(_grid_x < -10){
		_grid_x = -10;
	}
	if(_grid_z > 10){
	  _grid_z = 10;
	}
	if(_grid_z < -9){
	  _grid_z = -9;
	}
	//round to grid position
	controller_hover = scene.level.grid.GridToPosition(_grid_x,_grid_z);
  
	//if object is clicked on mouse down, move object based on game phase
	if(moved_object!=null)
	{
	  //hide hand instruction when player is operating
	  hideHand();
	  //make moved object follow mouse
	  moved_object.position.set(controller_hover.x,.25,controller_hover.z); 
	  //object to merge: different on each game phase
	  var _target_object;
	  if(game_phase ==0){
		_target_object = scene.level.carblue2;
	  }
	  if(game_phase ==1){
		_target_object = scene.level.carred2;
	  }
	  if(game_phase ==2){
		_target_object = scene.level.carblue2;
	  }
	  
	  //see if mouse position is over the target to merge
	  var xdiff = controller_hover.x-_target_object.position.x;
	  var zdiff = controller_hover.z-_target_object.position.z;
	  //mouse over merge target: target respond (grow bigger) to remind player
	  if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
		_target_object.scale.set(0.55,0.55,0.55);
	  }
	  //mouse not over merge target: reset target's scale
	  else{
		if(game_phase ==0||game_phase==1){
		  _target_object.scale.set(0.3,0.3,0.3);
		}
		if(game_phase ==2){
		  _target_object.scale.set(0.55,0.55,0.55);
		}		
	  }
	}
}

function onDocumentTouchStart( event ) {
	event.preventDefault();
	//clean _intersections
	_intersections.length = 0;
	//object to drag: different on each game phase
	if(game_phase ==0){
	  var objectsToDrag = [scene.level.carblue1];
	}
	if(game_phase ==1){
	  var objectsToDrag = [scene.level.carred1];
	}
	if(game_phase ==2){
	  var objectsToDrag = [scene.level.carred2];
	}
	//see if mouse click on the objectsToDrag
	_raycaster.setFromCamera( _mouse, _camera );
	_raycaster.intersectObjects( objectsToDrag, true, _intersections );
	//if objectsToDrag is clicked, prepare it in moved_object to move
	if(_intersections.length>0){
	  if(_intersections[ 0 ].object.parent != null){
		moved_object = objectsToDrag[0];
	  }
	}
}

function onDocumentTouchEnd( event ) {
	event.preventDefault();
	//on pointer release: leave moved object where it is
	if(moved_object!=null){
	  moved_object.position.set(controller_hover.x,0,controller_hover.z);
	}
	//do on release: different on each game phase
	//carblue1 -> carblue2
	if(game_phase ==0){
	  //get pointer distance to target
	  var xdiff = controller_hover.x-scene.level.carblue2.position.x;
	  var zdiff = controller_hover.z-scene.level.carblue2.position.z;
	  //if target is within merge range
	  if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
		//if pointer has object on it, do on release
		if(moved_object!=null){
		  //carblue2 becomes the merged car and grow bigger
		  scene.level.carblue2.scale.set(0.55,0.55,0.55);
		  scene.level.carblue2.position.set(scene.level.grid.GridToPosition(-3.5,2.5).x,0,scene.level.grid.GridToPosition(-3.5,2.5).z);
		  //carblue1 is disposed
		  scene.scene3D.remove(scene.level.carblue1);
		  //game moves to the next phase
		  game_phase =1;
		  //display hand because target has changed and player stopped operating
		  buildHand(scene.level.carred1,scene.level.carred2);
		}//if pointer has no object on it, do nothing on release
	  }
	  //else: target is outside merge range
	  else{
		//target car: restore original scale
		scene.level.carblue2.scale.set(0.3,0.3,0.3);
		//check if just moved an object, don't refresh hand if hand exists
		if(moved_object!=null){
		  //display hand because player stopped operating
		  buildHand(scene.level.carblue1,scene.level.carblue2);
		}	
	  }
	}
	//carred1 -> carred2
	else if(game_phase ==1){
	  //get pointer distance to target
	  var xdiff = controller_hover.x-scene.level.carred2.position.x;
	  var zdiff = controller_hover.z-scene.level.carred2.position.z;
	  //if target is within merge range
	  if((xdiff*xdiff)<=0.25&&(zdiff*zdiff)<=0.25){
		//if pointer has object on it, do on release
		if(moved_object!=null){
		  //carred2 becomes the merged car and grow bigger
		  scene.level.carred2.scale.set(0.55,0.55,0.55);
		  scene.level.carred2.position.set(scene.level.grid.GridToPosition(0.5,-2.5).x,0,scene.level.grid.GridToPosition(0.5,-2.5).z);
		  scene.level.carred2.rotation.set(0,0,0);
		  //carred1 is disposed
		  scene.scene3D.remove(scene.level.carred1);
		  //game moves to the next phase
		  game_phase =2;
		  //display hand because target has changed and player stopped operating
		  buildHand(scene.level.carred2,scene.level.carblue2);
		}//if pointer has no object on it, do nothing on release
	  }
	  //else: target is outside merge range
	  else{
		//target car: restore original scale
		scene.level.carblue2.scale.set(0.55,0.55,0.55);
		//check if just moved an object, don't refresh hand if hand exists
		if(moved_object!=null){
		  //display hand because player stopped operating
		  buildHand(scene.level.carred1,scene.level.carred2);
		}
	  }
	}
	//carred2 -> carblue2
	else if(game_phase == 2){
	  //get pointer distance to target
	  var xdiff = controller_hover.x-scene.level.carblue2.position.x;
	  var zdiff = controller_hover.z-scene.level.carblue2.position.z;
	  //if target is within merge range (new merge range because car is bigger now)
	  if((xdiff*xdiff)<=1&&(zdiff*zdiff)<=1){
		//if pointer has object on it, do on release
		if(moved_object!=null){
		  //carpolice becomes the merged car and grow bigger
		  scene.level.carpolice.scale.set(0.55,0.55,0.55);
		  scene.level.carpolice.position.set(scene.level.grid.GridToPosition(-3.5,2.5).x,0,scene.level.grid.GridToPosition(-3.5,2.5).z);
		  scene.level.carpolice.rotation.set(0,0,0);
		  scene.scene3D.add(scene.level.carpolice);
		  //carred2 and carblue2 is disposed
		  scene.scene3D.remove(scene.level.carred2);
		  scene.scene3D.remove(scene.level.carblue2);
		  //game moves to the next phase
		  game_phase =3;
		  //wait 500: let player to see police car merged and then display endcard
		  window.setTimeout(function() {
			buildEndCard();
		  }, 500);
		}//if pointer has no object on it, do nothing on release
	  }
	  //else: target is outside merge range
	  else{
		//target car: restore original scale
		scene.level.carblue2.scale.set(0.55,0.55,0.55);
		//check if just moved an object, don't refresh hand if hand exists
		if(moved_object!=null){
			//display hand because player stopped operating
		  buildHand(scene.level.carred2,scene.level.carblue2);
		}
	  }
	}
	//clean: stop moving the object
	moved_object = null;
}