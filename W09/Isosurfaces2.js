function Isosurfaces( volume, isovalue )
{
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial();

    var smin = volume.min_value;
    var smax = volume.max_value;
    isovalue = KVS.Clamp( isovalue, smin, smax );

    var lut = new KVS.MarchingCubesTable();
    var cell_index = 0;
    var counter = 0;
    for ( var z = 0; z < volume.resolution.z - 1; z++ )
    {
        for ( var y = 0; y < volume.resolution.y - 1; y++ )
        {
            for ( var x = 0; x < volume.resolution.x - 1; x++ )
            {
                var indices = cell_node_indices( cell_index++ );
                var index = table_index( indices );
                if ( index == 0 ) { continue; }
                if ( index == 255 ) { continue; }

                for ( var j = 0; lut.edgeID[index][j] != -1; j += 3 )
                {
                    var eid0 = lut.edgeID[index][j];
                    var eid1 = lut.edgeID[index][j+2];
                    var eid2 = lut.edgeID[index][j + 1];

                    var vid0 = lut.vertexID[eid0][0];
                    var vid1 = lut.vertexID[eid0][1];
                    var vid2 = lut.vertexID[eid1][0];
                    var vid3 = lut.vertexID[eid1][1];
                    var vid4 = lut.vertexID[eid2][0];
                    var vid5 = lut.vertexID[eid2][1];

                    var id0 = indices[index_of(eid0)[0]];
                    var id1 = indices[index_of(eid0)[1]];
                    var id2 = indices[index_of(eid1)[0]];
                    var id3 = indices[index_of(eid1)[1]];
                    var id4 = indices[index_of(eid2)[0]];
                    var id5 = indices[index_of(eid2)[1]];

                    var v0 = new THREE.Vector3( x + vid0[0], y + vid0[1], z + vid0[2] );
                    var v1 = new THREE.Vector3( x + vid1[0], y + vid1[1], z + vid1[2] );
                    var v2 = new THREE.Vector3( x + vid2[0], y + vid2[1], z + vid2[2] );
                    var v3 = new THREE.Vector3( x + vid3[0], y + vid3[1], z + vid3[2] );
                    var v4 = new THREE.Vector3( x + vid4[0], y + vid4[1], z + vid4[2] );
                    var v5 = new THREE.Vector3( x + vid5[0], y + vid5[1], z + vid5[2] );
                    
                    var v01 = interpolated_vertex( v0, v1, id0, id1, isovalue );
                    var v23 = interpolated_vertex( v2, v3, id2, id3, isovalue );
                    var v45 = interpolated_vertex( v4, v5, id4, id5, isovalue );

                    geometry.vertices.push( v01 );
                    geometry.vertices.push( v23 );
                    geometry.vertices.push( v45 );

                    var id0 = counter++;
                    var id1 = counter++;
                    var id2 = counter++;
                    geometry.faces.push( new THREE.Face3( id0, id1, id2 ) );
                }
            }
            cell_index++;
        }
        cell_index += volume.resolution.x;
    }

    geometry.computeVertexNormals();

    //material.color = new THREE.Color( "white" );
    var S = isovalue / 255.0; // [0,1]
    var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
    var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
    var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
    
    material.color = new THREE.Color( R, G, B );
     

    return new THREE.Mesh( geometry, material );


    function cell_node_indices( cell_index )
    {
        var lines = volume.resolution.x;
        var slices = volume.resolution.x * volume.resolution.y;

        var id0 = cell_index;
        var id1 = id0 + 1;
        var id2 = id1 + lines;
        var id3 = id0 + lines;
        var id4 = id0 + slices;
        var id5 = id1 + slices;
        var id6 = id2 + slices;
        var id7 = id3 + slices;

        return [ id0, id1, id2, id3, id4, id5, id6, id7 ];
    }

    function table_index( indices )
    {
        var s0 = volume.values[ indices[0] ][0];
        var s1 = volume.values[ indices[1] ][0];
        var s2 = volume.values[ indices[2] ][0];
        var s3 = volume.values[ indices[3] ][0];
        var s4 = volume.values[ indices[4] ][0];
        var s5 = volume.values[ indices[5] ][0];
        var s6 = volume.values[ indices[6] ][0];
        var s7 = volume.values[ indices[7] ][0];

        var index = 0;
        if ( s0 > isovalue ) { index |=   1; }
        if ( s1 > isovalue ) { index |=   2; }
        if ( s2 > isovalue ) { index |=   4; }
        if ( s3 > isovalue ) { index |=   8; }
        if ( s4 > isovalue ) { index |=  16; }
        if ( s5 > isovalue ) { index |=  32; }
        if ( s6 > isovalue ) { index |=  64; }
        if ( s7 > isovalue ) { index |= 128; }

        return index;
    }

    function index_of(eid)
    {
        var vid = new Array()
        if (eid == 0) {
            vid.push(0);
            vid.push(1)
        }
        if (eid == 1) {
            vid.push(1);
            vid.push(2)
        }
        if (eid == 2) {
            vid.push(2);
            vid.push(3)
        }
        if (eid == 3) {
            vid.push(3);
            vid.push(0)
        }
        if (eid == 4) {
            vid.push(4);
            vid.push(5)
        }
        if (eid == 5) {
            vid.push(5);
            vid.push(6)
        }
        if (eid == 6) {
            vid.push(6);
            vid.push(7)
        }
        if (eid == 7) {
            vid.push(7);
            vid.push(4)
        }
        if (eid == 8) {
            vid.push(0);
            vid.push(4)
        }
        if (eid == 9) {
            vid.push(1);
            vid.push(5)
        }
        if (eid == 10) {
            vid.push(2);
            vid.push(6)
        }
        if (eid == 11) {
            vid.push(3);
            vid.push(7)
        }
            
        return vid;
    }

    function interpolated_vertex( v0, v1, id0, id1, s )
    {
        //return new THREE.Vector3().addVectors( v0, v1 ).divideScalar( 2 );
        
        
        var a = Math.abs(volume.values[ id0 ][0] - s);
        var b = Math.abs(volume.values[ id1 ][0] - s);
        
        var vec0 = v0.multiplyScalar(b);
        var vec1 = v1.multiplyScalar(a);
        return new THREE.Vector3().addVectors(vec0, vec1).divideScalar(a + b);
        
    }
}
