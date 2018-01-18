(function() {

  // Get the DOM element to attach to
  const container = document.querySelector('#container');
  const WIDTH = document.body.clientWidth;
  const HEIGHT = container.clientHeight * 2;

  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor( 0x000000, 0 );

  var camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 1, 10000 );

  const scene = new THREE.Scene();

  // Build mesh and material
  const geos = [
    new THREE.BoxGeometry( 160, 160, 160 ),
    new THREE.ConeGeometry( 70, 130, 6 ),
    new THREE.OctahedronGeometry( 90, 0 )
  ];

  const group = new THREE.Group();

  const colours = [0x06D6A0, 0xAC4EDD, 0xFF8C3E, 0x0574CE, 0x02A6D1, 0xFFD166, 0xEF476F];

  for ( var i = 0; i < 300; i ++ ) {
    var material = new THREE.MeshBasicMaterial( {
      overdraw: 0.5,
      color: colours[Math.floor(Math.random()*colours.length)],
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide
    } );
    var mesh = new THREE.Mesh( geos[Math.floor(Math.random()*geos.length)], material );
    
    var geo = new THREE.EdgesGeometry( mesh.geometry );
    var mat = new THREE.LineBasicMaterial( { color: 0x032C3F, linewidth: 3 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    mesh.add( wireframe );

    mesh.position.x = 0;
    mesh.position.y = 5900;
    mesh.position.z = -250;

    mesh.finalPosition = {};
    mesh.finalPosition.y = parseInt(Math.random() * 5900);
    mesh.finalPosition.z = parseInt(Math.random() * 250);
    mesh.finalPosition.x = parseInt(Math.random() * 500);

    if (mesh.finalPosition.y > HEIGHT + 75) {
      mesh.finalPosition.x = mesh.finalPosition.x - ((Math.random() * 1600) / 2 + 600);
    } else if (HEIGHT + 75 > mesh.finalPosition.y && mesh.finalPosition.y > HEIGHT / 2) {
      mesh.finalPosition.x = parseInt(Math.random() * 2000) - 800;
    } else {
      mesh.finalPosition.x = mesh.finalPosition.x + (Math.random() * 400) + 500;
    }
    // mesh.finalPosition.x = mesh.finalPosition.x > 250 ? mesh.finalPosition.x + (Math.random() * mesh.finalPosition.y / 3) : mesh.finalPosition.x - (Math.random() * mesh.finalPosition.y / 3);
    mesh.finalPosition.z = mesh.finalPosition.z > 250 ? mesh.finalPosition.z + (Math.random() * mesh.finalPosition.y / 3) : mesh.finalPosition.z - (Math.random() * mesh.finalPosition.y / 3);
    
    mesh.matrixAutoUpdate = true;
    mesh.updateMatrix();
    
    mesh.rotationAlpha = {};  
    mesh.rotationAlpha.x = Math.random() * 0.01;
    mesh.rotationAlpha.y = Math.random() * 0.01;
   
    group.add( mesh );
  }

  scene.add( group );
  group.position.set(250, 0, 0);
  window.g = group;

  // Add the camera to the scene.
  scene.add(camera);
  camera.position.x = 0;
  camera.position.z = 6200;
  camera.position.y = 0;
  camera.lookAt( { x: 200, y: 2600, z: 0 } );


  window.c = camera;
  window.g = group;

  // Start the renderer.
  renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(renderer.domElement);

  function onWindowResize() {
    renderer.setSize( document.body.clientWidth, container.clientHeight * 2 );
  }

  var tweens = [];
  function init() {
    group.children.forEach(function(mesh, i) {
      tweens[i] = new TWEEN.Tween( mesh.position ).to( {
        x: mesh.finalPosition.x,
        y: mesh.finalPosition.y,
        z: mesh.finalPosition.z }, 2000 )
      .easing( TWEEN.Easing.Quadratic.Out ).delay(50).start();
    });

    // window.addEventListener( 'resize', onWindowResize, false );
  }

  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function waitScroll() {
    var started = false;
    $(window).on('scroll', function() {
      if (($(window).scrollTop() > 340) && !started) {
        started = true;

        init();

        animate();  
      }
    });
  }

  function render() {   
    group.children.forEach(function(mesh, i) {
      mesh.rotation.x += mesh.rotationAlpha.x;
      mesh.rotation.y += mesh.rotationAlpha.y;
    });

    TWEEN.update();
    
    // group.rotation.y += 0.002;
    
    renderer.render( scene, camera );
  }

  waitScroll();
})();
