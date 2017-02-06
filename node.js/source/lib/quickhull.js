/*
	QuickHull

	@author mark lundin / http://mark-lundin.com

	This is a 3D implementation of the Quick Hull algorithm.
	It is a fast way of computing a convex hull with average complexity of O(n log(n)).
	It uses depends on three.js and is supposed to create THREE.Geometry.
 */

var quickhull = function()
{
	var faces = [], faceStack = [];
	var dcur, current, num_points, extremes, max = 0;
	var i, j;
	var v0, v1, v2, v3, N, D;

	//Temporary vectors
	var ab, ac, ax, suba, subb, normal, diff, subaA, subaB, subC;
	function reset()
	{
		ab = new THREE.Vector3(),
		ac = new THREE.Vector3(),
		ax = new THREE.Vector3(),
		suba = new THREE.Vector3(),
		subb = new THREE.Vector3(),
		normal = new THREE.Vector3(),
		diff = new THREE.Vector3(),
		subaA = new THREE.Vector3(),
		subaB = new THREE.Vector3(),
		subC = new THREE.Vector3();
	}

	function process(points)
	{
		//Iterate through all the faces and remove them
		while(faceStack.length > 0)
		{
			cull(faceStack.shift(), points);
		}
	}

	var norm = function()
	{
		var ca = new THREE.Vector3(), ba = new THREE.Vector3(), N = new THREE.Vector3();

		return function(a, b, c)
		{
			ca.subVectors(c, a);
			ba.subVectors(b, a);
			N.crossVectors(ca, ba);
			return N.normalize();
		}
	}();


	function getNormal(face, points){

		if(face.normal !== undefined) return face.normal;

		var p0 = points[face[0]],
			p1 = points[face[1]],
			p2 = points[face[2]];

		ab.subVectors(p1, p0);
		ac.subVectors(p2, p0);
		normal.crossVectors(ac, ab);
		normal.normalize();

		return face.normal = normal.clone();
	}

	function assignPoints(face, pointset, points)
	{
		// ASSIGNING POINTS TO FACE
		var p0 = points[face[0]],
			dots = [], apex,
			norm = getNormal(face, points);

		// Sory all the points by there distance from the plane
		pointset.sort(function(aItem, bItem)
		{
			dots[aItem.x/3] = dots[aItem.x/3] !== undefined ? dots[aItem.x/3] : norm.dot(suba.subVectors(aItem, p0));
			dots[bItem.x/3] = dots[bItem.x/3] !== undefined ? dots[bItem.x/3] : norm.dot(subb.subVectors(bItem, p0));
			return dots[aItem.x/3] - dots[bItem.x/3] ;
		});

		//TODO :: Must be a faster way of finding and index in this array
		var index = pointset.length;

		if(index === 1)
		{
			dots[pointset[0].x/3] = norm.dot(suba.subVectors(pointset[0], p0));
		}

		while(index-- > 0 && dots[pointset[index].x/3] > 0)

		var point;
		if(index + 1 < pointset.length && dots[pointset[index+1].x/3] > 0)
		{
			face.visiblePoints = pointset.splice(index + 1);
		}
	}

	function cull(face, points)
	{
		var i = faces.length,
			dot, visibleFace, currentFace,
			visibleFaces = [face];

		var apex = points.indexOf(face.visiblePoints.pop());

		// Iterate through all other faces...
		while(i-- > 0)
		{
			currentFace = faces[i];
			if(currentFace !== face)
			{
				// ...and check if they're pointing in the same direction
				dot = getNormal(currentFace, points).dot(diff.subVectors(points[apex], points[currentFace[0]]));
				if(dot > 0)
				{
					visibleFaces.push(currentFace);
				}
			}
		}

		var index, neighbouringIndex, vertex;

		// Determine Perimeter - Creates a bounded horizon
		// 1. Pick an edge A out of all possible edges
		// 2. Check if A is shared by any other face. a->b === b->a
		// 2.1 for each edge in each triangle, isShared = (f1.a == f2.a && f1.b == f2.b) || (f1.a == f2.b && f1.b == f2.a)
		// 3. If not shared, then add to convex horizon set, pick an end point (N) of the current edge A and choose a new edge NA connected to A. Restart from 1.
		// 4. If A is shared, it is not an horizon edge, therefore flag both faces that share this edge as candidates for culling
		// 5. If candidate geometry is a degenrate triangle (ie. the tangent space normal cannot be computed) then remove that triangle from all further processing

		var j = i = visibleFaces.length;
		var isDistinct = false,
			hasOneVisibleFace = i === 1,
			cull = [],
			perimeter = [],
			edgeIndex = 0, compareFace, nextIndex,
			a, b;

		var allPoints = [];
		var originFace = [visibleFaces[0][0], visibleFaces[0][1], visibleFaces[0][1], visibleFaces[0][2], visibleFaces[0][2], visibleFaces[0][0]];


		if(visibleFaces.length === 1)
		{
			currentFace = visibleFaces[0];

			perimeter = [currentFace[0], currentFace[1], currentFace[1], currentFace[2], currentFace[2], currentFace[0]];
			
			//Remove visible face from list of faces
			if(faceStack.indexOf(currentFace) > -1)
			{
				faceStack.splice(faceStack.indexOf(currentFace), 1);
			}


			if(currentFace.visiblePoints)
			{
				allPoints = allPoints.concat(currentFace.visiblePoints);
			}

			faces.splice(faces.indexOf(currentFace), 1);
		}
		else
		{
			//For each visible face
			while(i-- > 0)
			{
				currentFace = visibleFaces[i];

				//Remove visible face from list of faces
				if(faceStack.indexOf(currentFace) > -1)
				{
					faceStack.splice(faceStack.indexOf(currentFace), 1);
				}

				if(currentFace.visiblePoints)
				{
					allPoints = allPoints.concat(currentFace.visiblePoints);
				}
				faces.splice(faces.indexOf(currentFace), 1);

				var isSharedEdge;
				cEdgeIndex = 0;

				//Iterate through its edges
				while(cEdgeIndex < 3)
				{
					isSharedEdge = false;
					j = visibleFaces.length;
					a = currentFace[cEdgeIndex]
					b = currentFace[(cEdgeIndex+1)%3];

					//Find another visible faces
					while(j-- > 0 && !isSharedEdge)
					{
						compareFace = visibleFaces[j];
						edgeIndex = 0;

						//isSharedEdge = compareFace == currentFace;
						if(compareFace !== currentFace)
						{
							//Check all it's indices
							while(edgeIndex < 3 && !isSharedEdge)
							{ 
								nextIndex = (edgeIndex + 1);
								isSharedEdge = (compareFace[edgeIndex] === a && compareFace[nextIndex%3] === b) || (compareFace[edgeIndex] === b && compareFace[nextIndex%3] === a);
								edgeIndex++;
							}
						}
					}

					if(!isSharedEdge || hasOneVisibleFace)
					{
						perimeter.push(a);
						perimeter.push(b);
					}

					cEdgeIndex++;
				}
			}
		}

		// create new face for all pairs around edge
		i = 0;
		var l = perimeter.length/2;
		var f;

		while(i < l)
		{
			f = [perimeter[i*2+1], apex, perimeter[i*2]];
			assignPoints(f, allPoints, points);
			faces.push(f)
			if(f.visiblePoints !== undefined)faceStack.push(f);
			i++;
		}
	}

	var distSqPointSegment = function()
	{
		var ab = new THREE.Vector3(),
			ac = new THREE.Vector3(),
			bc = new THREE.Vector3();

		return function(a, b, c)
		{
				ab.subVectors(b, a);
				ac.subVectors(c, a);
				bc.subVectors(c, b);
				var e = ac.dot(ab);
				if (e < 0.0) return ac.dot(ac);
				var f = ab.dot(ab);
				if (e >= f) return bc.dot(bc);
				return ac.dot(ac) - e * e / f;

		}
	}();

	return function(geometry)
	{
		reset();

		var points = geometry.vertices,
			faces = [],
			faceStack = [],
			i = num_points = points.length,
			extremes = points.slice(0, 6),
			max = 0;

		//Find extremites
		while(i-- > 0)
		{
			if(points[i].x < extremes[0].x) extremes[0] = points[i];
			if(points[i].x > extremes[1].x) extremes[1] = points[i];

			if(points[i].y < extremes[2].y) extremes[2] = points[i];
			if(points[i].y < extremes[3].y) extremes[3] = points[i];

			if(points[i].z < extremes[4].z) extremes[4] = points[i];
			if(points[i].z < extremes[5].z) extremes[5] = points[i];
		}

		//Find the longest line between the extremeties
		j = i = 6;
		while(i-- > 0)
		{
			j = i - 1;
			while(j-- > 0)
			{
				if(max < (dcur = extremes[i].distanceToSquared(extremes[j])))
				{
					max = dcur;
					v0 = extremes[i];
					v1 = extremes[j];
				}
			}
		}

		//3. Find the most distant point to the line segment, this creates a plane
		i = 6;
		max = 0;
		while(i-- > 0)
		{
			dcur = distSqPointSegment(v0, v1, extremes[i]);
			if(max < dcur)
			{
				max = dcur;
				v2 = extremes[i];
			}
		}


		//4. Find the most distant point to the plane.
		N = norm(v0, v1, v2);
		D = N.dot(v0);

		max = 0;
		i = num_points;
		while(i-- > 0)
		{
			dcur = Math.abs(points[i].dot(N) - D);
			if(max < dcur)
			{
				max = dcur;
				v3 = points[i];
			}
		}

		var v0Index = points.indexOf(v0),
		v1Index = points.indexOf(v1),
		v2Index = points.indexOf(v2),
		v3Index = points.indexOf(v3);


		//We now have a tetrahedron as the base geometry
		var tetrahedron =
		[
			[v2Index, v1Index, v0Index],
			[v1Index, v3Index, v0Index],
			[v2Index, v3Index, v1Index],
			[v0Index, v3Index, v2Index],
		];

		subaA.subVectors(v1, v0).normalize();
		subaB.subVectors(v2, v0).normalize();
		subC.subVectors (v3, v0).normalize();
		var sign = subC.dot(new THREE.Vector3().crossVectors(subaB, subaA));

		//Reverse the winding if negative sign
		if(sign < 0)
		{
			tetrahedron[0].reverse();
			tetrahedron[1].reverse();
			tetrahedron[2].reverse();
			tetrahedron[3].reverse();
		}

		//One for each face of the pyramid
		var pointsCloned = points.slice();
		pointsCloned.splice(pointsCloned.indexOf(v0), 1);
		pointsCloned.splice(pointsCloned.indexOf(v1), 1);
		pointsCloned.splice(pointsCloned.indexOf(v2), 1);
		pointsCloned.splice(pointsCloned.indexOf(v3), 1);

		var i = tetrahedron.length;
		while(i-- > 0)
		{
			assignPoints(tetrahedron[i], pointsCloned, points);
			if(tetrahedron[i].visiblePoints !== undefined)
			{
				faceStack.push(tetrahedron[i]);
			}
			faces.push(tetrahedron[i]);
		}

		process(points);

		//Assign to our geometry object
		var ll = faces.length;
		while(ll-- > 0)
		{
			geometry.faces[ll] = new THREE.Face3(faces[ll][2], faces[ll][1], faces[ll][0], faces[ll].normal)
		}
		geometry.normalsNeedUpdate = true;
		
		return geometry;
	}
}
