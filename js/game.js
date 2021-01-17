const canvas = document.getElementById('canvas');
const app = new PIXI.Application({ view: canvas });
const stage = app.stage;
//changes
// const express = require('express');
// const app_express = express();
// const path = require('path');
// const router = express.Router();

// router.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));
//     //__dirname : It will resolve to your project folder.
// });

// app_express.use('/models', express.static('models')) // add this!
// app_express.use('/express', express.static('express')) // add this!
// express.static.mime.define({ 'application/octet-stream': ['fbx'] })

//StaticFileOptions options = new StaticFileOptions { ContentTypeProvider = new FileExtensionContentTypeProvider() }; ((FileExtensionContentTypeProvider)options.ContentTypeProvider).Mappings.Add( new KeyValuePair<string, string>(".glb", "model/gltf-buffer")); app.UseStaticFiles(options);
//end of changes
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
