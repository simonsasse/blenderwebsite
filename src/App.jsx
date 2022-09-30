import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import './App.css'

function App() {
  useEffect(() => {
    let mouseX = 0;
			let mouseY = 0;
      let windowHalfX = window.innerWidth / 2;
			let windowHalfY = window.innerHeight / 2;
      document.addEventListener( 'mousemove', onDocumentMouseMove );
      window.addEventListener( 'resize', onWindowResize );


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 45;

    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer(
      { canvas, antialias: true}
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const path = "src/assets/Daylight\ Box_";
    const format = '.bmp';
    //set up skybox
    const urls = [
      path + 'Back' + format, path + 'Left' + format,
      path + 'Top' + format, path + 'Bottom' + format,
      path + 'Front' + format, path + 'Back' + format
    ];
    const textureCube = new THREE.CubeTextureLoader().load( urls);
    scene.background = textureCube;

    // mirror
    // let mirrorGeometry;

    // mirrorGeometry = new THREE.CircleGeometry( 40, 64 );
    // // const groundMirror = new Reflector( mirrorGeometry, {
    // //   clipBias: 0.003,
    // //   textureWidth: window.innerWidth * window.devicePixelRatio,
    // //   textureHeight: window.innerHeight * window.devicePixelRatio,
    // //   color: 0x777777
    // // } );
    // const groundMirror = new THREE.MeshBasicMaterial();
    // groundMirror.color = new THREE.Color( 0x777777 );
    // groundMirror.mirror = true;
    // groundMirror.position.y = -10;
    // groundMirror.position.z = -10;

    // groundMirror.rotateX( - Math.PI / 2 );
    // scene.add( groundMirror );

20
    // const loader = new THREE.CubeTextureLoader();
    // const texture = loader.load([

    // lighting
    const ambientLight = new THREE.AmbientLight(0xd178f5, 2);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    // add spotlight 
    const spotLight = new THREE.SpotLight(0xd178f5, 2);
    spotLight.castShadow  = true;
    spotLight.position.set(0, 64, 32);
    scene.add(spotLight);

    // add cube
    const geometry = new THREE.BoxGeometry(16, 16, 16);
    const material = new THREE.MeshMatcapMaterial();
    const cube = new THREE.Mesh(geometry, material);
    
    // scene.add(cube);

    // add gltf model
      let mixer;
    const loader = new GLTFLoader();
    loader.load("src/assets/evolution.gltf", function(gltf) {
      gltf.scene.scale.set(2, 2, 2);
      // gltf.position.set(0, 50, 32);
      
      scene.add( gltf.scene );

       mixer = new  THREE.AnimationMixer( gltf.scene );
      const clips = gltf.animations;
      console.log(clips);
      const clip = THREE.AnimationClip.findByName(clips, 'KeyAction.001');
      const action = mixer.clipAction( clip );
      action.play();
    }, undefined, function(error) {
      console.error(error);
    });


    scene.add(loader);
    const clock =  new THREE.Clock();

    const animate = () => {
      if(mixer){
        mixer.update(clock.getDelta());
      }
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);

      render();

  };


			function render() {

				const timer = 0.0001 * Date.now();

				camera.position.x += ( mouseX - camera.position.x ) * 1;
				camera.position.y += ( - mouseY - camera.position.y ) * 1;

				camera.lookAt( scene.position );


			}


  function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;

  }

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

  }
  animate();
  
}, []);
  // return canvas
  return (
    
    <canvas id="canvas">
    </canvas>
);
}

export default App;