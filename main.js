import './style.css'

let container, camera, scene, renderer
let mouseX = 0, mouseY = 0
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
  
let object, planegeomerty, planematerial;
let THREE
let myObjLoader

let textureLoader

let texture 
let logotexture, logoimg
let loader
let manager
let messageDisplay 

async function startAll(e){
  messageDisplay = document.getElementById('welcome-message')
  document.removeEventListener('touchstart', startAll);
  document.removeEventListener('mousemove', startAll);
  messageDisplay.textContent = 'loading three'
  THREE = await import('three');
  messageDisplay.textContent = 'loading OBJLoader'
  const {OBJLoader} = await import('three/examples/jsm/loaders/OBJLoader');
  myObjLoader = OBJLoader
  init();
  animate();
}
const  init = () => {
  messageDisplay.textContent = 'initializing'
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 150;
  // scene
  scene = new THREE.Scene();
  // Load a texture
  messageDisplay.textContent = 'loading texture'
  logotexture = new THREE.TextureLoader().load( "./rxstnz_logo.png" );
  // Create a scene
  scene = new THREE.Scene();
  // Create a geometry
  // 	Create a box (cube) of 10 width, length, and height
  planegeomerty = new THREE.PlaneGeometry( 100, 100, 2 );
  // Create a MeshBasicMaterial with a loaded texture
  planematerial = new THREE.MeshBasicMaterial( { map: logotexture, opacity:0.6, transparent:true} );

  // Combine the geometry and material into a mesh
  logoimg = new THREE.Mesh( planegeomerty, planematerial );
  // Add the mesh to the scene
  scene.add( logoimg );

  //lights
  createLigths();
  // manager
  manager = new THREE.LoadingManager( loadModel );

  manager.onProgress = function ( item, loaded, total ) {
    messageDisplay.textContent = `item ${item }, ${loaded }, ${ total }`
    let endMsg = false
    if(loaded === total){
      endMsg = true
      messageDisplay.textContent = 'I ended up downloading more than 10 mega :P'
      setTimeout(() => {
        messageDisplay.parentNode.removeChild(messageDisplay)
      }, 5000);
      
      
    }
        
  };

  // texture

  textureLoader = new THREE.TextureLoader( manager );
  //texture = textureLoader.load( 'textures/uv_grid_opengl.jpg' );

  // model
  loader = new myObjLoader( manager );

  loader.load( './luca.obj', function ( obj ) {
    messageDisplay.textContent = 'loading object'
    object = obj;
  }, onProgress, onError );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );

}

const onError = () => {}

const onProgress = ( xhr ) => {

  if ( xhr.lengthComputable ) {

      var percentComplete = xhr.loaded / xhr.total * 100;
      messageDisplay.textContent = 'model ' + Math.round( percentComplete, 2 ) + '% downloaded'
      
  }

}

const loadModel = () => {

  object.traverse( function ( child ) {

      if ( child.isMesh ) child.material.map = texture;

  } );
  

  object.position.y = -33;
  object.position.z = 0;
  object.position.x = -50;
  
  

  object.scale.set(.5,.5,.5);

  var mS = (new THREE.Matrix4()).identity();
  //set -1 to the corresponding axis
  mS.elements[5] = -1;
  //mS.elements[5] = -1;
  //mS.elements[10] = -1;

  object.applyMatrix(mS);
  scene.add( object );

}

const createLigths = () => {
  var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .5 );
  light.position.set(0,100,0);
  scene.add( light ); 

  var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  directionalLight.position.set( 100, 350, 250 );
  directionalLight.castShadow = true;
  scene.add( directionalLight );

  var pointLight = new THREE.PointLight( 0xE1B77B, 2 );
  pointLight.position.set(0,40,0);
  camera.add( pointLight );
  scene.add( camera );

  var spotLight1 = createSpotlight( 0xffffff );
  spotLight1.position.set( 15, 100, 45 );
  var lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
  var spotLight2 = createSpotlight( 0xffffff );
  spotLight2.position.set( -50, 150, 75 );
  var lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
  var spotLight3 = createSpotlight( 0xffffff );
  spotLight3.position.set( 10, -20, 175 );
  var lightHelper3 = new THREE.SpotLightHelper( spotLight3 );
  scene.add( spotLight1 );
  scene.add( spotLight2 );
  scene.add( spotLight3 ); 
 /*  scene.add( lightHelper2 );
  scene.add( lightHelper1 );
  scene.add( lightHelper3 );  */ 
}

const createSpotlight = ( color ) => {

  var newObj = new THREE.SpotLight( color, 2 );

  newObj.castShadow = true;
  newObj.angle = 0.5;
  newObj.penumbra = 0.2;
  newObj.decay = 2;
  newObj.distance = 150;

  return newObj;

}


const onWindowResize = () => {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

const onDocumentMouseMove = ( event ) => {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

const animate = () => {

  requestAnimationFrame( animate );
  render();

}

const render = () => {

  camera.position.x += ( mouseX/2 - camera.position.x ) * .05;
  camera.position.y += ( - mouseY/2 - camera.position.y ) * .05;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}


document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('touchstart', startAll);
  document.addEventListener('mousemove', startAll);
});




