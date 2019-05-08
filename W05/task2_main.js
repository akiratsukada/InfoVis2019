function main()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();
    

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add(camera);
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var length = 1.0;

    var vertices = [
        new THREE.Vector3(0, 0, length),
        new THREE.Vector3(length, 0, length),
        new THREE.Vector3(length, length, length),
        new THREE.Vector3(0, length, length),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(length, 0, 0),
        new THREE.Vector3(length, length, 0),
        new THREE.Vector3(0, length, 0)
    ]

    var faces = [
        new THREE.Face3(0, 1, 2),//上面 
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(4, 5, 6),//下面
        new THREE.Face3(6, 7, 4), 
        new THREE.Face3(1, 5, 6),
        new THREE.Face3(6, 2, 1),
        new THREE.Face3(2, 6, 7),
        new THREE.Face3(7, 3, 2),
        new THREE.Face3(0, 3, 7),
        new THREE.Face3(7, 4, 0),
        new THREE.Face3(0, 1, 5),
        new THREE.Face3(5, 4, 0)
    ]

    var geometry = new THREE.Geometry();
    var i = 0;
    for (i = 0; i < vertices.length; i++){
        geometry.vertices.push(vertices[i]);
    }
    for (i = 0; i < faces.length; i++){
        geometry.faces.push(faces[i]);
    }

    geometry.computeFaceNormals();

    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.FaceColors;
    material.side = THREE.DoubleSide;
    
    for (i = 0; i < faces.length; i++) {
        geometry.faces[i].color = new THREE.Color(i*0.08, 1, 1);
    }
    
    var cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    
    var light = new THREE.PointLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add(light);
    

    document.addEventListener( 'mousedown', mouse_down_event );
    function mouse_down_event( event )
    {
        var x_win = event.clientX;
        var y_win = event.clientY;

        var vx = renderer.domElement.offsetLeft;
        var vy = renderer.domElement.offsetTop;
        var vw = renderer.domElement.width;
        var vh = renderer.domElement.height;

        var x_NDC = 2 * ( x_win - vx ) / vw - 1;
        var y_NDC = -( 2 * ( y_win - vy ) / vh - 1 );
        
        var p_NDC = new THREE.Vector3(x_NDC, y_NDC, 1);
        var p_wld = p_NDC.unproject(camera);
        
        var origin = camera.position;
        var direction = p_wld.sub(camera.position).normalize();

        var raycaster = new THREE.Raycaster( origin, direction );
        var intersects = raycaster.intersectObjects( [cube] );
        if ( intersects.length > 0 )
        {
        intersects[0].face.color.setRGB( 0, 1, 0 );
        intersects[0].object.geometry.colorsNeedUpdate = true;
        }
    }


    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}