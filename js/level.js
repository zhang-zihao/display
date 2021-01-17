class Level {
  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.modelLoader = new THREE.FBXLoader();
    this.clock = new THREE.Clock();
    this.deltaTime = this.clock.getDelta();
    //changes
    //initialize grid
    this.grid = new Grid();
    //end of changes
    this.init();
  }
  init() {
    this.loadTextures();
    this.loadModels();  
  }
  loadModel(modelName, path){
    this.modelLoader.load( path, ( fbx ) =>{
      this[`${modelName}`] = fbx;
      this.loadedModels.push(fbx);
    });
  }
  loadModels(){
    //app.use('/models', THREE.static('models'));
    this.loadedModels = [];
    this.models = [
        {name: 'level', path: 'models/level.fbx'},
        {name: 'carPolice', path: 'models/car_police.fbx'},
        //changes
        //load needed models
        {name: 'carBlue', path: 'models/car_blue.fbx'},
        {name: 'carRed', path: 'models/car_red.fbx'}
        //end of changes
      ];
    this.loadedModels.push = (model) => {
      this.loadedModels[this.loadedModels.length] = model;
      if(this.loadedModels.length === this.models.length){
        this.buildScene();
      }
    };
    for(let i = 0; i < this.models.length; i += 1){
      this.loadModel(this.models[i].name, this.models[i].path);
    }
  }
  loadTextures(){
    this.textureLoader = new THREE.TextureLoader();
    const promise = Promise.all([
        this.textureLoader.load('img/tex_water.jpg'),
        //changes
        //load needed textures
        this.textureLoader.load('img/tex_car_blue.jpg'),
        this.textureLoader.load('img/tex_car_red.jpg'),
        this.textureLoader.load('img/tex_car_police.jpg')
        //end of changes
        ], (resolve, reject) => {
      resolve(promise);
    }).then(result => {
      this.textures = result;
    });
  }
  buildScene() {
    this.buildWater();
    this.addLevel();
    //changes
    //setup and build cars & place cars to appropriate lattices
    this.setupCarBlue();
    this.carblue1 = this.getCarBlue(this.grid.GridToPosition(3,-7),-90,0);
    this.carblue2 = this.getCarBlue(this.grid.GridToPosition(-4,3),0,0);
    this.setupCarRed();
    this.carred1=this.getCarRed(this.grid.GridToPosition(-3,-3),-90,0);
    this.carred2=this.getCarRed(this.grid.GridToPosition(1,-2),180,0);
    this.setupCarPolice();
    this.carpolice=this.getCarPolice(this.grid.GridToPosition(0,0),0,0);
    //end of changes
    this.setCamera();
    this.update();
  }
  addLevel(){
    scene.scene3D.add(this.level);
    this.level.scale.set(0.005,0.005,0.005);
  }
  buildWater() {
    this.waterTexture = this.textures[0]
    this.waterTexture.wrapS = THREE.RepeatWrapping;
    this.waterTexture.wrapT = THREE.RepeatWrapping;
    this.waterTexture.repeat.set(30, 30);

    const geometry = new THREE.PlaneBufferGeometry(150, 150,1,1);
    const material = new THREE.MeshBasicMaterial({ map: this.waterTexture  });
    this.floor = new THREE.Mesh(geometry, material);
    this.floor.rotation.set(THREE.Math.degToRad(-90), 0, 0);
    this.floor.position.set(0, -10, 0);
    //changes
    //build floor group for ray intersection
    this.newfloor = new THREE.Group();
    this.newfloor.add(this.floor.clone());
    scene.scene3D.add(this.newfloor);
    //end of changes

    geometry.dispose();
    material.dispose();
  }
  //changes
  //level utilities -- spawn cars
  //car blue:
  setupCarBlue(){
    //material: make & apply
    const texture = this.textures[1];
    const childmaterial = new THREE.MeshLambertMaterial({
      color: 0x353535,
      map: texture
    });
    this.carBlue.traverse( function ( child ) {
      if ( child.isMesh ) {   
        child.material = childmaterial;   
      }  
    } ); 

    //place to pre-assemble position/rotation
    this.carBlue.rotation.set(0,0,0);
    this.carBlue.scale.set(0.005,0.005,0.005);
    this.carBlue.position.set(0,0,0);
    this.carBlue.updateMatrix();

    //flip
    this.carBlue.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    //clean
    childmaterial.dispose();
  }
  getCarBlue(spawn_pos,rot_y_degree,scale){
    //build car - left half
    var carBlue_otherhalf = this.carBlue.clone();
    scene.scene3D.add(carBlue_otherhalf);
    carBlue_otherhalf.position.set( 0, 0, 0 );
    carBlue_otherhalf.scale.set(0.005,0.005,0.005);
    carBlue_otherhalf.rotation.set(0,0,0);

    //build car - right half and combine
    var car_blue_object = new THREE.Group();
    car_blue_object.add(this.carBlue.clone());
    car_blue_object.add(carBlue_otherhalf);
    car_blue_object.rotation.set(0,THREE.Math.degToRad(rot_y_degree),0);
    scene.scene3D.add(car_blue_object);

    //rescale combined car
    if(scale ==0){
      car_blue_object.scale.set(0.3,0.3,0.3);
    }
    if(scale ==1){ 
      //originally scale "level" 1 is for merged big car, later I decided 
      //to resize one of the merged small cars but kept this
      car_blue_object.scale.set(0.55,0.55,0.55);
    }

    //reposition combined car
    car_blue_object.position.set(spawn_pos.x,spawn_pos.y,spawn_pos.z);   

    return car_blue_object;
  }

  //car red:
  setupCarRed(){
    //material: make & apply
    const texture = this.textures[2];
    const childmaterial = new THREE.MeshLambertMaterial({
      color: 0x353535,
      map: texture
    });
    this.carRed.traverse( function ( child ) {
      if ( child.isMesh ) {   
        console.log( child.geometry.attributes.uv );
        child.material = childmaterial;   
      }  
    } );
  
    //place to pre-assemble position/rotation
    this.carRed.rotation.set(0,0,0);
    this.carRed.scale.set(0.005,0.005,0.005);
    this.carRed.position.set(0,0,0);
    this.carRed.updateMatrix();
    
    //flip
    this.carRed.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    //clean
    childmaterial.dispose();
  }
  getCarRed(spawn_pos,rot_y_degree,scale){
    //build car - left half
    var carRed_otherhalf = this.carRed.clone();
    scene.scene3D.add(carRed_otherhalf);
    carRed_otherhalf.position.set( 0, 0, 0 );
    carRed_otherhalf.scale.set(0.005,0.005,0.005);
    carRed_otherhalf.rotation.set(0,0,0);

    //build car - right half and combine
    var car_red_object = new THREE.Group();
    car_red_object.add(this.carRed.clone());
    car_red_object.add(carRed_otherhalf);
    car_red_object.rotation.set(0,THREE.Math.degToRad(rot_y_degree),0);
    scene.scene3D.add(car_red_object);

    //rescale combined car
    if(scale ==0){
      car_red_object.scale.set(0.3,0.3,0.3);
    }
    if(scale ==1){
      //originally scale "level" 1 is for merged big car, later I decided 
      //to resize one of the merged small cars but kept this
      car_red_object.scale.set(0.55,0.55,0.55);
    }

    //reposition combined car
    car_red_object.position.set(spawn_pos.x,spawn_pos.y,spawn_pos.z);   

    return car_red_object;
  }
  setupCarPolice(){
    //material: make & apply
    const texture = this.textures[3];
    const childmaterial = new THREE.MeshLambertMaterial({
      color: 0x353535,
      map: texture
    });
    this.carPolice.traverse( function ( child ) {
      if ( child.isMesh ) {   
        console.log( child.geometry.attributes.uv );
        child.material = childmaterial;   
      }  
    } );
  
    //place to pre-assemble position/rotation
    this.carPolice.rotation.set(0,0,0);
    this.carPolice.scale.set(0.005,0.005,0.005);
    this.carPolice.position.set(0,0,0);
    this.carPolice.updateMatrix();
    
    //flip
    this.carPolice.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    //clean
    childmaterial.dispose();
  }
  getCarPolice(spawn_pos,rot_y_degree,scale){
    //build car - left half
    var carPolice_otherhalf = this.carPolice.clone();
    scene.scene3D.add(carPolice_otherhalf);
    carPolice_otherhalf.position.set( 0, 0, 0 );
    carPolice_otherhalf.scale.set(0.005,0.005,0.005);
    carPolice_otherhalf.rotation.set(0,0,0);

    //build car - right half and combine
    var car_police_object = new THREE.Group();
    car_police_object.add(this.carPolice.clone());
    car_police_object.add(carPolice_otherhalf);
    car_police_object.rotation.set(0,THREE.Math.degToRad(rot_y_degree),0);

    //reposition combined car
    car_police_object.position.set(spawn_pos.x,spawn_pos.y,spawn_pos.z);   

    return car_police_object;
  }
  //end of changes
  setCamera() {
    scene.camera.position.set(0, 10, 10);
    scene.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  update() {
    requestAnimationFrame(this.update.bind(this));
    this.deltaTime = this.clock.getDelta();
  }
}