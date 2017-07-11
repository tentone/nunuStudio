/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "ArUco: a minimal library for Augmented Reality applications based on OpenCv"
	http://www.uco.es/investiga/grupos/ava/node/26
*/

var AR = AR || {};

AR.Marker = function(id, corners){
	this.id = id;
	this.corners = corners;
};

AR.Detector = function(){
	this.grey = new CV.Image();
	this.thres = new CV.Image();
	this.homography = new CV.Image();
	this.binary = [];
	this.contours = [];
	this.polys = [];
	this.candidates = [];
};

AR.Detector.prototype.detect = function(image){
	CV.grayscale(image, this.grey);
	CV.adaptiveThreshold(this.grey, this.thres, 2, 7);
	
	this.contours = CV.findContours(this.thres, this.binary);

	this.candidates = this.findCandidates(this.contours, image.width * 0.20, 0.05, 10);
	this.candidates = this.clockwiseCorners(this.candidates);
	this.candidates = this.notTooNear(this.candidates, 10);

	return this.findMarkers(this.grey, this.candidates, 49);
};

AR.Detector.prototype.findCandidates = function(contours, minSize, epsilon, minLength){
	var candidates = [], len = contours.length, contour, poly, i;

	this.polys = [];
	
	for (i = 0; i < len; ++ i){
		contour = contours[i];

		if (contour.length >= minSize){
			poly = CV.approxPolyDP(contour, contour.length * epsilon);

			this.polys.push(poly);

			if ( (4 === poly.length) && ( CV.isContourConvex(poly) ) ){

				if ( CV.minEdgeLength(poly) >= minLength){
					candidates.push(poly);
				}
			}
		}
	}

	return candidates;
};

AR.Detector.prototype.clockwiseCorners = function(candidates){
	var len = candidates.length, dx1, dx2, dy1, dy2, swap, i;

	for (i = 0; i < len; ++ i){
		dx1 = candidates[i][1].x - candidates[i][0].x;
		dy1 = candidates[i][1].y - candidates[i][0].y;
		dx2 = candidates[i][2].x - candidates[i][0].x;
		dy2 = candidates[i][2].y - candidates[i][0].y;

		if ( (dx1 * dy2 - dy1 * dx2) < 0){
			swap = candidates[i][1];
			candidates[i][1] = candidates[i][3];
			candidates[i][3] = swap;
		}
	}

	return candidates;
};

AR.Detector.prototype.notTooNear = function(candidates, minDist){
	var notTooNear = [], len = candidates.length, dist, dx, dy, i, j, k;

	for (i = 0; i < len; ++ i){
	
		for (j = i + 1; j < len; ++ j){
			dist = 0;
			
			for (k = 0; k < 4; ++ k){
				dx = candidates[i][k].x - candidates[j][k].x;
				dy = candidates[i][k].y - candidates[j][k].y;
			
				dist += dx * dx + dy * dy;
			}
			
			if ( (dist / 4) < (minDist * minDist) ){
			
				if ( CV.perimeter( candidates[i] ) < CV.perimeter( candidates[j] ) ){
					candidates[i].tooNear = true;
				}else{
					candidates[j].tooNear = true;
				}
			}
		}
	}

	for (i = 0; i < len; ++ i){
		if ( !candidates[i].tooNear ){
			notTooNear.push( candidates[i] );
		}
	}

	return notTooNear;
};

AR.Detector.prototype.findMarkers = function(imageSrc, candidates, warpSize){
	var markers = [], len = candidates.length, candidate, marker, i;

	for (i = 0; i < len; ++ i){
		candidate = candidates[i];

		CV.warp(imageSrc, this.homography, candidate, warpSize);
	
		CV.threshold(this.homography, this.homography, CV.otsu(this.homography) );

		marker = this.getMarker(this.homography, candidate);
		if (marker){
			markers.push(marker);
		}
	}
	
	return markers;
};

AR.Detector.prototype.getMarker = function(imageSrc, candidate){
	var width = (imageSrc.width / 7) >>> 0,
			minZero = (width * width) >> 1,
			bits = [], rotations = [], distances = [],
			square, pair, inc, i, j;

	for (i = 0; i < 7; ++ i){
		inc = (0 === i || 6 === i)? 1: 6;
		
		for (j = 0; j < 7; j += inc){
			square = {x: j * width, y: i * width, width: width, height: width};
			if ( CV.countNonZero(imageSrc, square) > minZero){
				return null;
			}
		}
	}

	for (i = 0; i < 5; ++ i){
		bits[i] = [];

		for (j = 0; j < 5; ++ j){
			square = {x: (j + 1) * width, y: (i + 1) * width, width: width, height: width};
			
			bits[i][j] = CV.countNonZero(imageSrc, square) > minZero? 1: 0;
		}
	}

	rotations[0] = bits;
	distances[0] = this.hammingDistance( rotations[0] );
	
	pair = {first: distances[0], second: 0};
	
	for (i = 1; i < 4; ++ i){
		rotations[i] = this.rotate( rotations[i - 1] );
		distances[i] = this.hammingDistance( rotations[i] );
		
		if (distances[i] < pair.first){
			pair.first = distances[i];
			pair.second = i;
		}
	}

	if (0 !== pair.first){
		return null;
	}

	return new AR.Marker(
		this.mat2id( rotations[pair.second] ), 
		this.rotate2(candidate, 4 - pair.second) );
};

AR.Detector.prototype.hammingDistance = function(bits){
	var ids = [ [1,0,0,0,0], [1,0,1,1,1], [0,1,0,0,1], [0,1,1,1,0] ],
			dist = 0, sum, minSum, i, j, k;

	for (i = 0; i < 5; ++ i){
		minSum = Infinity;
		
		for (j = 0; j < 4; ++ j){
			sum = 0;

			for (k = 0; k < 5; ++ k){
					sum += bits[i][k] === ids[j][k]? 0: 1;
			}

			if (sum < minSum){
				minSum = sum;
			}
		}

		dist += minSum;
	}

	return dist;
};

AR.Detector.prototype.mat2id = function(bits){
	var id = 0, i;
	
	for (i = 0; i < 5; ++ i){
		id <<= 1;
		id |= bits[i][1];
		id <<= 1;
		id |= bits[i][3];
	}

	return id;
};

AR.Detector.prototype.rotate = function(src){
	var dst = [], len = src.length, i, j;
	
	for (i = 0; i < len; ++ i){
		dst[i] = [];
		for (j = 0; j < src[i].length; ++ j){
			dst[i][j] = src[src[i].length - j - 1][i];
		}
	}

	return dst;
};

AR.Detector.prototype.rotate2 = function(src, rotation){
	var dst = [], len = src.length, i;
	
	for (i = 0; i < len; ++ i){
		dst[i] = src[ (rotation + i) % len ];
	}

	return dst;
};

/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "OpenCV: Open Computer Vision Library"
	http://sourceforge.net/projects/opencvlibrary/
- "Stack Blur: Fast But Goodlooking"
	http://incubator.quasimondo.com/processing/fast_blur_deluxe.php
*/

var CV = CV || {};

CV.Image = function(width, height, data){
	this.width = width || 0;
	this.height = height || 0;
	this.data = data || [];
};

CV.grayscale = function(imageSrc, imageDst){
	var src = imageSrc.data, dst = imageDst.data, len = src.length,
			i = 0, j = 0;

	for (; i < len; i += 4){
		dst[j ++] =
			(src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114 + 0.5) & 0xff;
	}
	
	imageDst.width = imageSrc.width;
	imageDst.height = imageSrc.height;
	
	return imageDst;
};

CV.threshold = function(imageSrc, imageDst, threshold){
	var src = imageSrc.data, dst = imageDst.data,
			len = src.length, tab = [], i;

	for (i = 0; i < 256; ++ i){
		tab[i] = i <= threshold? 0: 255;
	}

	for (i = 0; i < len; ++ i){
		dst[i] = tab[ src[i] ];
	}

	imageDst.width = imageSrc.width;
	imageDst.height = imageSrc.height;

	return imageDst;
};

CV.adaptiveThreshold = function(imageSrc, imageDst, kernelSize, threshold){
	var src = imageSrc.data, dst = imageDst.data, len = src.length, tab = [], i;

	CV.stackBoxBlur(imageSrc, imageDst, kernelSize);

	for (i = 0; i < 768; ++ i){
		tab[i] = (i - 255 <= -threshold)? 255: 0;
	}

	for (i = 0; i < len; ++ i){
		dst[i] = tab[ src[i] - dst[i] + 255 ];
	}

	imageDst.width = imageSrc.width;
	imageDst.height = imageSrc.height;
	
	return imageDst;
};

CV.otsu = function(imageSrc){
	var src = imageSrc.data, len = src.length, hist = [],
			threshold = 0, sum = 0, sumB = 0, wB = 0, wF = 0, max = 0,
			mu, between, i;

	for (i = 0; i < 256; ++ i){
		hist[i] = 0;
	}
	
	for (i = 0; i < len; ++ i){
		hist[ src[i] ] ++;
	}

	for (i = 0; i < 256; ++ i){
		sum += hist[i] * i;
	}

	for (i = 0; i < 256; ++ i){
		wB += hist[i];
		if (0 !== wB){
		
			wF = len - wB;
			if (0 === wF){
				break;
			}

			sumB += hist[i] * i;
			
			mu = (sumB / wB) - ( (sum - sumB) / wF );

			between = wB * wF * mu * mu;
			
			if (between > max){
				max = between;
				threshold = i;
			}
		}
	}

	return threshold;
};

CV.stackBoxBlurMult =
	[1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265];

CV.stackBoxBlurShift =
	[0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13];

CV.BlurStack = function(){
	this.color = 0;
	this.next = null;
};

CV.stackBoxBlur = function(imageSrc, imageDst, kernelSize){
	var src = imageSrc.data, dst = imageDst.data,
			height = imageSrc.height, width = imageSrc.width,
			heightMinus1 = height - 1, widthMinus1 = width - 1,
			size = kernelSize + kernelSize + 1, radius = kernelSize + 1,
			mult = CV.stackBoxBlurMult[kernelSize],
			shift = CV.stackBoxBlurShift[kernelSize],
			stack, stackStart, color, sum, pos, start, p, x, y, i;

	stack = stackStart = new CV.BlurStack();
	for (i = 1; i < size; ++ i){
		stack = stack.next = new CV.BlurStack();
	}
	stack.next = stackStart;

	pos = 0;

	for (y = 0; y < height; ++ y){
		start = pos;
		
		color = src[pos];
		sum = radius * color;
		
		stack = stackStart;
		for (i = 0; i < radius; ++ i){
			stack.color = color;
			stack = stack.next;
		}
		for (i = 1; i < radius; ++ i){
			stack.color = src[pos + i];
			sum += stack.color;
			stack = stack.next;
		}
	
		stack = stackStart;
		for (x = 0; x < width; ++ x){
			dst[pos ++] = (sum * mult) >>> shift;
			
			p = x + radius;
			p = start + (p < widthMinus1? p: widthMinus1);
			sum -= stack.color - src[p];
			
			stack.color = src[p];
			stack = stack.next;
		}
	}

	for (x = 0; x < width; ++ x){
		pos = x;
		start = pos + width;
		
		color = dst[pos];
		sum = radius * color;
		
		stack = stackStart;
		for (i = 0; i < radius; ++ i){
			stack.color = color;
			stack = stack.next;
		}
		for (i = 1; i < radius; ++ i){
			stack.color = dst[start];
			sum += stack.color;
			stack = stack.next;
			
			start += width;
		}
		
		stack = stackStart;
		for (y = 0; y < height; ++ y){
			dst[pos] = (sum * mult) >>> shift;
			
			p = y + radius;
			p = x + ( (p < heightMinus1? p: heightMinus1) * width );
			sum -= stack.color - dst[p];
			
			stack.color = dst[p];
			stack = stack.next;
			
			pos += width;
		}
	}

	return imageDst;
};

CV.gaussianBlur = function(imageSrc, imageDst, imageMean, kernelSize){
	var kernel = CV.gaussianKernel(kernelSize);

	imageDst.width = imageSrc.width;
	imageDst.height = imageSrc.height;
	
	imageMean.width = imageSrc.width;
	imageMean.height = imageSrc.height;

	CV.gaussianBlurFilter(imageSrc, imageMean, kernel, true);
	CV.gaussianBlurFilter(imageMean, imageDst, kernel, false);

	return imageDst;
};

CV.gaussianBlurFilter = function(imageSrc, imageDst, kernel, horizontal){
	var src = imageSrc.data, dst = imageDst.data,
			height = imageSrc.height, width = imageSrc.width,
			pos = 0, limit = kernel.length >> 1,
			cur, value, i, j, k;
			
	for (i = 0; i < height; ++ i){
		
		for (j = 0; j < width; ++ j){
			value = 0.0;
		
			for (k = -limit; k <= limit; ++ k){

				if (horizontal){
					cur = pos + k;
					if (j + k < 0){
						cur = pos;
					}
					else if (j + k >= width){
						cur = pos;
					}
				}else{
					cur = pos + (k * width);
					if (i + k < 0){
						cur = pos;
					}
					else if (i + k >= height){
						cur = pos;
					}
				}

				value += kernel[limit + k] * src[cur];
			}
		
			dst[pos ++] = horizontal? value: (value + 0.5) & 0xff;
		}
	}

	return imageDst;
};

CV.gaussianKernel = function(kernelSize){
	var tab =
		[ [1],
			[0.25, 0.5, 0.25],
			[0.0625, 0.25, 0.375, 0.25, 0.0625],
			[0.03125, 0.109375, 0.21875, 0.28125, 0.21875, 0.109375, 0.03125] ],
		kernel = [], center, sigma, scale2X, sum, x, i;

	if ( (kernelSize <= 7) && (kernelSize % 2 === 1) ){
		kernel = tab[kernelSize >> 1];
	}else{
		center = (kernelSize - 1.0) * 0.5;
		sigma = 0.8 + (0.3 * (center - 1.0) );
		scale2X = -0.5 / (sigma * sigma);
		sum = 0.0;
		for (i = 0; i < kernelSize; ++ i){
			x = i - center;
			sum += kernel[i] = Math.exp(scale2X * x * x);
		}
		sum = 1 / sum;
		for (i = 0; i < kernelSize; ++ i){
			kernel[i] *= sum;
		}  
	}

	return kernel;
};

CV.findContours = function(imageSrc, binary){
	var width = imageSrc.width, height = imageSrc.height, contours = [],
			src, deltas, pos, pix, nbd, outer, hole, i, j;
	
	src = CV.binaryBorder(imageSrc, binary);

	deltas = CV.neighborhoodDeltas(width + 2);

	pos = width + 3;
	nbd = 1;

	for (i = 0; i < height; ++ i, pos += 2){
	
		for (j = 0; j < width; ++ j, ++ pos){
			pix = src[pos];

			if (0 !== pix){
				outer = hole = false;

				if (1 === pix && 0 === src[pos - 1]){
					outer = true;
				}
				else if (pix >= 1 && 0 === src[pos + 1]){
					hole = true;
				}

				if (outer || hole){
					++ nbd;
					
					contours.push( CV.borderFollowing(src, pos, nbd, {x: j, y: i}, hole, deltas) );
				}
			}
		}
	}  

	return contours;
};

CV.borderFollowing = function(src, pos, nbd, point, hole, deltas){
	var contour = [], pos1, pos3, pos4, s, s_end, s_prev;

	contour.hole = hole;
			
	s = s_end = hole? 0: 4;
	do{
		s = (s - 1) & 7;
		pos1 = pos + deltas[s];
		if (src[pos1] !== 0){
			break;
		}
	}while(s !== s_end);
	
	if (s === s_end){
		src[pos] = -nbd;
		contour.push( {x: point.x, y: point.y} );

	}else{
		pos3 = pos;
		s_prev = s ^ 4;

		while(true){
			s_end = s;
		
			do{
				pos4 = pos3 + deltas[++ s];
			}while(src[pos4] === 0);
			
			s &= 7;
			
			if ( ( (s - 1) >>> 0) < (s_end >>> 0) ){
				src[pos3] = -nbd;
			}
			else if (src[pos3] === 1){
				src[pos3] = nbd;
			}

			contour.push( {x: point.x, y: point.y} );
			
			s_prev = s;

			point.x += CV.neighborhood[s][0];
			point.y += CV.neighborhood[s][1];

			if ( (pos4 === pos) && (pos3 === pos1) ){
				break;
			}
			
			pos3 = pos4;
			s = (s + 4) & 7;
		}
	}

	return contour;
};

CV.neighborhood = 
	[ [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1] ];

CV.neighborhoodDeltas = function(width){
	var deltas = [], len = CV.neighborhood.length, i = 0;
	
	for (; i < len; ++ i){
		deltas[i] = CV.neighborhood[i][0] + (CV.neighborhood[i][1] * width);
	}
	
	return deltas.concat(deltas);
};

CV.approxPolyDP = function(contour, epsilon){
	var slice = {start_index: 0, end_index: 0},
			right_slice = {start_index: 0, end_index: 0},
			poly = [], stack = [], len = contour.length,
			pt, start_pt, end_pt, dist, max_dist, le_eps,
			dx, dy, i, j, k;
	
	epsilon *= epsilon;
	
	k = 0;
	
	for (i = 0; i < 3; ++ i){
		max_dist = 0;
		
		k = (k + right_slice.start_index) % len;
		start_pt = contour[k];
		if (++ k === len) {k = 0;}
	
		for (j = 1; j < len; ++ j){
			pt = contour[k];
			if (++ k === len) {k = 0;}
		
			dx = pt.x - start_pt.x;
			dy = pt.y - start_pt.y;
			dist = dx * dx + dy * dy;

			if (dist > max_dist){
				max_dist = dist;
				right_slice.start_index = j;
			}
		}
	}

	if (max_dist <= epsilon){
		poly.push( {x: start_pt.x, y: start_pt.y} );

	}else{
		slice.start_index = k;
		slice.end_index = (right_slice.start_index += slice.start_index);
	
		right_slice.start_index -= right_slice.start_index >= len? len: 0;
		right_slice.end_index = slice.start_index;
		if (right_slice.end_index < right_slice.start_index){
			right_slice.end_index += len;
		}
		
		stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
		stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
	}

	while(stack.length !== 0){
		slice = stack.pop();
		
		end_pt = contour[slice.end_index % len];
		start_pt = contour[k = slice.start_index % len];
		if (++ k === len) {k = 0;}
		
		if (slice.end_index <= slice.start_index + 1){
			le_eps = true;
		
		}else{
			max_dist = 0;

			dx = end_pt.x - start_pt.x;
			dy = end_pt.y - start_pt.y;
			
			for (i = slice.start_index + 1; i < slice.end_index; ++ i){
				pt = contour[k];
				if (++ k === len) {k = 0;}
				
				dist = Math.abs( (pt.y - start_pt.y) * dx - (pt.x - start_pt.x) * dy);

				if (dist > max_dist){
					max_dist = dist;
					right_slice.start_index = i;
				}
			}
			
			le_eps = max_dist * max_dist <= epsilon * (dx * dx + dy * dy);
		}
		
		if (le_eps){
			poly.push( {x: start_pt.x, y: start_pt.y} );

		}else{
			right_slice.end_index = slice.end_index;
			slice.end_index = right_slice.start_index;

			stack.push( {start_index: right_slice.start_index, end_index: right_slice.end_index} );
			stack.push( {start_index: slice.start_index, end_index: slice.end_index} );
		}
	}
	
	return poly;
};

CV.warp = function(imageSrc, imageDst, contour, warpSize){
	var src = imageSrc.data, dst = imageDst.data,
			width = imageSrc.width, height = imageSrc.height,
			pos = 0,
			sx1, sx2, dx1, dx2, sy1, sy2, dy1, dy2, p1, p2, p3, p4,
			m, r, s, t, u, v, w, x, y, i, j;
	
	m = CV.getPerspectiveTransform(contour, warpSize - 1);

	r = m[8];
	s = m[2];
	t = m[5];
	
	for (i = 0; i < warpSize; ++ i){
		r += m[7];
		s += m[1];
		t += m[4];

		u = r;
		v = s;
		w = t;
		
		for (j = 0; j < warpSize; ++ j){
			u += m[6];
			v += m[0];
			w += m[3];

			x = v / u;
			y = w / u;

			sx1 = x >>> 0;
			sx2 = (sx1 === width - 1)? sx1: sx1 + 1;
			dx1 = x - sx1;
			dx2 = 1.0 - dx1;

			sy1 = y >>> 0;
			sy2 = (sy1 === height - 1)? sy1: sy1 + 1;
			dy1 = y - sy1;
			dy2 = 1.0 - dy1;

			p1 = p2 = sy1 * width;
			p3 = p4 = sy2 * width;

			dst[pos ++] = 
				(dy2 * (dx2 * src[p1 + sx1] + dx1 * src[p2 + sx2]) +
				 dy1 * (dx2 * src[p3 + sx1] + dx1 * src[p4 + sx2]) ) & 0xff;

		}
	}

	imageDst.width = warpSize;
	imageDst.height = warpSize;

	return imageDst;
};

CV.getPerspectiveTransform = function(src, size){
	var rq = CV.square2quad(src);
	
	rq[0] /= size;
	rq[1] /= size;
	rq[3] /= size;
	rq[4] /= size;
	rq[6] /= size;
	rq[7] /= size;
	
	return rq;
};

CV.square2quad = function(src){
	var sq = [], px, py, dx1, dx2, dy1, dy2, den;
	
	px = src[0].x - src[1].x + src[2].x - src[3].x;
	py = src[0].y - src[1].y + src[2].y - src[3].y;
	
	if (0 === px && 0 === py){
		sq[0] = src[1].x - src[0].x;
		sq[1] = src[2].x - src[1].x;
		sq[2] = src[0].x;
		sq[3] = src[1].y - src[0].y;
		sq[4] = src[2].y - src[1].y;
		sq[5] = src[0].y;
		sq[6] = 0;
		sq[7] = 0;
		sq[8] = 1;

	}else{
		dx1 = src[1].x - src[2].x;
		dx2 = src[3].x - src[2].x;
		dy1 = src[1].y - src[2].y;
		dy2 = src[3].y - src[2].y;
		den = dx1 * dy2 - dx2 * dy1;
	
		sq[6] = (px * dy2 - dx2 * py) / den;
		sq[7] = (dx1 * py - px * dy1) / den;
		sq[8] = 1;
		sq[0] = src[1].x - src[0].x + sq[6] * src[1].x;
		sq[1] = src[3].x - src[0].x + sq[7] * src[3].x;
		sq[2] = src[0].x;
		sq[3] = src[1].y - src[0].y + sq[6] * src[1].y;
		sq[4] = src[3].y - src[0].y + sq[7] * src[3].y;
		sq[5] = src[0].y;
	}

	return sq;
};

CV.isContourConvex = function(contour){
	var orientation = 0, convex = true,
			len = contour.length, i = 0, j = 0,
			cur_pt, prev_pt, dxdy0, dydx0, dx0, dy0, dx, dy;

	prev_pt = contour[len - 1];
	cur_pt = contour[0];

	dx0 = cur_pt.x - prev_pt.x;
	dy0 = cur_pt.y - prev_pt.y;

	for (; i < len; ++ i){
		if (++ j === len) {j = 0;}

		prev_pt = cur_pt;
		cur_pt = contour[j];

		dx = cur_pt.x - prev_pt.x;
		dy = cur_pt.y - prev_pt.y;
		dxdy0 = dx * dy0;
		dydx0 = dy * dx0;

		orientation |= dydx0 > dxdy0? 1: (dydx0 < dxdy0? 2: 3);

		if (3 === orientation){
				convex = false;
				break;
		}

		dx0 = dx;
		dy0 = dy;
	}

	return convex;
};

CV.perimeter = function(poly){
	var len = poly.length, i = 0, j = len - 1,
			p = 0.0, dx, dy;

	for (; i < len; j = i ++){
		dx = poly[i].x - poly[j].x;
		dy = poly[i].y - poly[j].y;
		
		p += Math.sqrt(dx * dx + dy * dy) ;
	}

	return p;
};

CV.minEdgeLength = function(poly){
	var len = poly.length, i = 0, j = len - 1, 
			min = Infinity, d, dx, dy;

	for (; i < len; j = i ++){
		dx = poly[i].x - poly[j].x;
		dy = poly[i].y - poly[j].y;

		d = dx * dx + dy * dy;

		if (d < min){
			min = d;
		}
	}
	
	return Math.sqrt(min);
};

CV.countNonZero = function(imageSrc, square){
	var src = imageSrc.data, height = square.height, width = square.width,
			pos = square.x + (square.y * imageSrc.width),
			span = imageSrc.width - width,
			nz = 0, i, j;
	
	for (i = 0; i < height; ++ i){

		for (j = 0; j < width; ++ j){
		
			if ( 0 !== src[pos ++] ){
				++ nz;
			}
		}
		
		pos += span;
	}

	return nz;
};

CV.binaryBorder = function(imageSrc, dst){
	var src = imageSrc.data, height = imageSrc.height, width = imageSrc.width,
			posSrc = 0, posDst = 0, i, j;

	for (j = -2; j < width; ++ j){
		dst[posDst ++] = 0;
	}

	for (i = 0; i < height; ++ i){
		dst[posDst ++] = 0;
		
		for (j = 0; j < width; ++ j){
			dst[posDst ++] = (0 === src[posSrc ++]? 0: 1);
		}
		
		dst[posDst ++] = 0;
	}

	for (j = -2; j < width; ++ j){
		dst[posDst ++] = 0;
	}
	
	return dst;
};

/*
Copyright (c) 2012 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "Iterative Pose Estimation using Coplanar Feature Points"
	Denis Oberkampf, Daniel F. DeMenthon, Larry S. Davis
	http://www.cfar.umd.edu/~daniel/daniel_papersfordownload/CoplanarPts.pdf
*/

var POS = POS || {};

POS.Posit = function(modelSize, focalLength){
	this.objectPoints = this.buildModel(modelSize);
	this.focalLength = focalLength;

	this.objectVectors = [];
	this.objectNormal = [];
	this.objectMatrix = [[],[],[]];
	
	this.init();
};

POS.Posit.prototype.buildModel = function(modelSize){
	var half = modelSize / 2.0;
	
	return [
		[-half,  half, 0.0],
		[ half,  half, 0.0],
		[ half, -half, 0.0],
		[-half, -half, 0.0] ];
};

POS.Posit.prototype.init = function(){
	var np = this.objectPoints.length,
			vectors = [], n = [], len = 0.0, row = 2, i;
	
	for (i = 0; i < np; ++ i){
		this.objectVectors[i] = [this.objectPoints[i][0] - this.objectPoints[0][0],
														 this.objectPoints[i][1] - this.objectPoints[0][1],
														 this.objectPoints[i][2] - this.objectPoints[0][2]];
														 
		vectors[i] = [this.objectVectors[i][0],
									this.objectVectors[i][1],
									this.objectVectors[i][2]];
	}

	while(0.0 === len){
		n[0] = this.objectVectors[1][1] * this.objectVectors[row][2] -
					 this.objectVectors[1][2] * this.objectVectors[row][1];
		n[1] = this.objectVectors[1][2] * this.objectVectors[row][0] -
					 this.objectVectors[1][0] * this.objectVectors[row][2];
		n[2] = this.objectVectors[1][0] * this.objectVectors[row][1] -
					 this.objectVectors[1][1] * this.objectVectors[row][0];
		
		len = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
		
		++ row;
	}

	for (i = 0; i < 3; ++ i){
		this.objectNormal[i] = n[i] / len;
	}

	POS.pseudoInverse(vectors, np, this.objectMatrix);
};

POS.Posit.prototype.pose = function(imagePoints){
	var posRotation1 = [[],[],[]], posRotation2 = [[],[],[]], posTranslation = [],
			rotation1 = [[],[],[]], rotation2 = [[],[],[]], translation1 = [], translation2 = [],
			error1, error2, valid1, valid2, i, j;

	this.pos(imagePoints, posRotation1, posRotation2, posTranslation);

	valid1 = this.isValid(posRotation1, posTranslation);
	if (valid1){
		error1 = this.iterate(imagePoints, posRotation1, posTranslation, rotation1, translation1);
	}else{
		error1 = {euclidean: -1.0, pixels: -1, maximum: -1.0};
	}
	
	valid2 = this.isValid(posRotation2, posTranslation);
	if (valid2){
		error2 = this.iterate(imagePoints, posRotation2, posTranslation, rotation2, translation2);
	}else{
		error2 = {euclidean: -1.0, pixels: -1, maximum: -1.0};
	}

	for (i = 0; i < 3; ++ i){
		for (j = 0; j < 3; ++ j){
			if (valid1){
				translation1[i] -= rotation1[i][j] * this.objectPoints[0][j];
			}
			if (valid2){
				translation2[i] -= rotation2[i][j] * this.objectPoints[0][j];
			}
		}
	}

	return error1.euclidean < error2.euclidean?
		new POS.Pose(error1.pixels, rotation1, translation1, error2.pixels, rotation2, translation2):
		new POS.Pose(error2.pixels, rotation2, translation2, error1.pixels, rotation1, translation1);
};

POS.Posit.prototype.pos = function(imagePoints, rotation1, rotation2, translation){
	var np = this.objectPoints.length, imageVectors = [],
			i0 = [], j0 = [], ivec = [], jvec = [], row1 = [], row2 = [], row3 = [],
			i0i0, j0j0, i0j0, delta, q, lambda, mu, scale, i, j;

	for (i = 0; i < np; ++ i){
		imageVectors[i] = [imagePoints[i].x - imagePoints[0].x,
											 imagePoints[i].y - imagePoints[0].y];
	}

	//i0 and j0
	for (i = 0; i < 3; ++ i){
		i0[i] = 0.0;
		j0[i] = 0.0;
		for (j = 0; j < np; ++ j){
			i0[i] += this.objectMatrix[i][j] * imageVectors[j][0];
			j0[i] += this.objectMatrix[i][j] * imageVectors[j][1];
		}
	}

	i0i0 = i0[0] * i0[0] + i0[1] * i0[1] + i0[2] * i0[2];
	j0j0 = j0[0] * j0[0] + j0[1] * j0[1] + j0[2] * j0[2];
	i0j0 = i0[0] * j0[0] + i0[1] * j0[1] + i0[2] * j0[2];

	//Lambda and mu
	delta = (j0j0 - i0i0) * (j0j0 - i0i0) + 4.0 * (i0j0 * i0j0);
	
	if (j0j0 - i0i0 >= 0.0){
		q = (j0j0 - i0i0 + Math.sqrt(delta) ) / 2.0;
	}else{
		q = (j0j0 - i0i0 - Math.sqrt(delta) ) / 2.0;
	}
	
	if (q >= 0.0){
		lambda = Math.sqrt(q);
		if (0.0 === lambda){
			mu = 0.0;
		}else{
			mu = -i0j0 / lambda;
		}
	}else{
		lambda = Math.sqrt( -(i0j0 * i0j0) / q);
		if (0.0 === lambda){
			mu = Math.sqrt(i0i0 - j0j0);
		}else{
			mu = -i0j0 / lambda;
		}
	}

	//First rotation
	for (i = 0; i < 3; ++ i){
		ivec[i] = i0[i] + lambda * this.objectNormal[i];
		jvec[i] = j0[i] + mu * this.objectNormal[i];
	}
	
	scale = Math.sqrt(ivec[0] * ivec[0] + ivec[1] * ivec[1] + ivec[2] * ivec[2]);
	
	for (i = 0; i < 3; ++ i){
		row1[i] = ivec[i] / scale;
		row2[i] = jvec[i] / scale;
	}
	
	row3[0] = row1[1] * row2[2] - row1[2] * row2[1];
	row3[1] = row1[2] * row2[0] - row1[0] * row2[2];
	row3[2] = row1[0] * row2[1] - row1[1] * row2[0];

	for (i = 0; i < 3; ++ i){
		rotation1[0][i] = row1[i];
		rotation1[1][i] = row2[i];
		rotation1[2][i] = row3[i];
	}

	//Second rotation
	for (i = 0; i < 3; ++ i){
		ivec[i] = i0[i] - lambda * this.objectNormal[i];
		jvec[i] = j0[i] - mu * this.objectNormal[i];
	}
	
	for (i = 0; i < 3; ++ i){
		row1[i] = ivec[i] / scale;
		row2[i] = jvec[i] / scale;
	}
	
	row3[0] = row1[1] * row2[2] - row1[2] * row2[1];
	row3[1] = row1[2] * row2[0] - row1[0] * row2[2];
	row3[2] = row1[0] * row2[1] - row1[1] * row2[0];
	
	for (i = 0; i < 3; ++ i){
		rotation2[0][i] = row1[i];
		rotation2[1][i] = row2[i];
		rotation2[2][i] = row3[i];
	}

	//Translation
	translation[0] = imagePoints[0].x / scale;
	translation[1] = imagePoints[0].y / scale;
	translation[2] = this.focalLength / scale;
};

POS.Posit.prototype.isValid = function(rotation, translation){
	var np = this.objectPoints.length, zmin = Infinity, i = 0, zi;

	for (; i < np; ++ i){
		zi = translation[2] +
			(rotation[2][0] * this.objectVectors[i][0] +
			 rotation[2][1] * this.objectVectors[i][1] +
			 rotation[2][2] * this.objectVectors[i][2]);
		if (zi < zmin){
			zmin = zi;
		}
	}

	return zmin >= 0.0;
};

POS.Posit.prototype.iterate = function(imagePoints, posRotation, posTranslation, rotation, translation){
	var np = this.objectPoints.length,
			oldSopImagePoints = [], sopImagePoints = [],
			rotation1 = [[],[],[]], rotation2 = [[],[],[]],
			translation1 = [], translation2 = [],
			converged = false, iteration = 0,
			oldImageDifference, imageDifference, factor,
			error, error1, error2, delta, i, j;

	for (i = 0; i < np; ++ i){
		oldSopImagePoints[i] = {x: imagePoints[i].x,
														y: imagePoints[i].y};
	}
	
	for (i = 0; i < 3; ++ i){
		for (j = 0; j < 3; ++ j){
			rotation[i][j] = posRotation[i][j];
		}
		translation[i] = posTranslation[i];
	}

	for (i = 0; i < np; ++ i){
		factor = 0.0;
		for (j = 0; j < 3; ++ j){
			factor += this.objectVectors[i][j] * rotation[2][j] / translation[2];
		}
		sopImagePoints[i] = {x: (1.0 + factor) * imagePoints[i].x,
												 y: (1.0 + factor) * imagePoints[i].y};
	}

	imageDifference = 0.0;
	
	for (i = 0; i < np; ++ i){
		imageDifference += Math.abs(sopImagePoints[i].x - oldSopImagePoints[i].x);
		imageDifference += Math.abs(sopImagePoints[i].y - oldSopImagePoints[i].y);
	}

	for (i = 0; i < 3; ++ i){
		translation1[i] = translation[i] -
			(rotation[i][0] * this.objectPoints[0][0] +
			 rotation[i][1] * this.objectPoints[0][1] +
			 rotation[i][2] * this.objectPoints[0][2]);
	}
	
	error = error1 = this.error(imagePoints, rotation, translation1);

	//Convergence
	converged = (0.0 === error1.pixels) || (imageDifference < 0.01);
	
	while( iteration ++ < 100 && !converged ){
	
		for (i = 0; i < np; ++ i){
			oldSopImagePoints[i].x = sopImagePoints[i].x;
			oldSopImagePoints[i].y = sopImagePoints[i].y;
		}

		this.pos(sopImagePoints, rotation1, rotation2, translation);

		for (i = 0; i < 3; ++ i){
			translation1[i] = translation[i] -
				(rotation1[i][0] * this.objectPoints[0][0] +
				 rotation1[i][1] * this.objectPoints[0][1] +
				 rotation1[i][2] * this.objectPoints[0][2]);
				
			translation2[i] = translation[i] -
				(rotation2[i][0] * this.objectPoints[0][0] +
				 rotation2[i][1] * this.objectPoints[0][1] +
				 rotation2[i][2] * this.objectPoints[0][2]);
		}

		error1 = this.error(imagePoints, rotation1, translation1);
		error2 = this.error(imagePoints, rotation2, translation2);

		if ( (error1.euclidean >= 0.0) && (error2.euclidean >= 0.0) ){
			if (error2.euclidean < error1.euclidean){
				error = error2;
				for (i = 0; i < 3; ++ i){
					for (j = 0; j < 3; ++ j){
						rotation[i][j] = rotation2[i][j];
					}
				}
			}else{
				error = error1;
				for (i = 0; i < 3; ++ i){
					for (j = 0; j < 3; ++ j){
						rotation[i][j] = rotation1[i][j];
					}
				}
			}
		}

		if ( (error1.euclidean < 0.0) && (error2.euclidean >= 0.0) ){
			error = error2;
			for (i = 0; i < 3; ++ i){
				for (j = 0; j < 3; ++ j){
					rotation[i][j] = rotation2[i][j];
				}
			}
		}
		
		if ( (error2.euclidean < 0.0) && (error1.euclidean >= 0.0) ){
			error = error1;
			for (i = 0; i < 3; ++ i){
				for (j = 0; j < 3; ++ j){
					rotation[i][j] = rotation1[i][j];
				}
			}
		}

		for (i = 0; i < np; ++ i){
			factor = 0.0;
			for (j = 0; j < 3; ++ j){
				factor += this.objectVectors[i][j] * rotation[2][j] / translation[2];
			}
			sopImagePoints[i].x = (1.0 + factor) * imagePoints[i].x;
			sopImagePoints[i].y = (1.0 + factor) * imagePoints[i].y;
		}

		oldImageDifference = imageDifference;
		imageDifference = 0.0;
		
		for (i = 0; i < np; ++ i){
			imageDifference += Math.abs(sopImagePoints[i].x - oldSopImagePoints[i].x);
			imageDifference += Math.abs(sopImagePoints[i].y - oldSopImagePoints[i].y);
		}

		delta = Math.abs(imageDifference - oldImageDifference);

		converged = (0.0 === error.pixels) || (delta < 0.01);
	}
	
	return error;
};

POS.Posit.prototype.error = function(imagePoints, rotation, translation){
	var np = this.objectPoints.length,
			move = [], projection = [], errorvec = [],
			euclidean = 0.0, pixels = 0.0, maximum = 0.0,
			i, j, k;

	if ( !this.isValid(rotation, translation) ){
		return {euclidean: -1.0, pixels: -1, maximum: -1.0};
	}
	
	for (i = 0; i < np; ++ i){
		move[i] = [];
		for (j = 0; j < 3; ++ j){
			move[i][j] = translation[j];
		}
	}
	
	for (i = 0; i < np; ++ i){
		for (j = 0; j < 3; ++ j){
			for (k = 0; k < 3; ++ k){
				move[i][j] += rotation[j][k] * this.objectPoints[i][k];
			}
		}
	}

	for (i = 0; i < np; ++ i){
		projection[i] = [];
		for (j = 0; j < 2; ++ j){
			projection[i][j] = this.focalLength * move[i][j] / move[i][2];
		}
	}
	
	for (i = 0; i < np; ++ i){
		errorvec[i] = [projection[i][0] - imagePoints[i].x,
									 projection[i][1] - imagePoints[i].y];
	}

	for (i = 0; i < np; ++ i){
		euclidean += Math.sqrt(errorvec[i][0] * errorvec[i][0] +
													 errorvec[i][1] * errorvec[i][1]);
											 
		pixels += Math.abs( Math.round(projection[i][0]) - Math.round(imagePoints[i].x) ) +
							Math.abs( Math.round(projection[i][1]) - Math.round(imagePoints[i].y) );
							
		if (Math.abs(errorvec[i][0]) > maximum){
			maximum = Math.abs(errorvec[i][0]);
		}
		if (Math.abs(errorvec[i][1]) > maximum){
			maximum = Math.abs(errorvec[i][1]);
		}
	}

	return {euclidean: euclidean / np, pixels: pixels, maximum: maximum};
};

POS.pseudoInverse = function(a, n, b){
	var w = [], v = [[],[],[]], s = [[],[],[]],
			wmax = 0.0, cn = 0,
			i, j, k;

	SVD.svdcmp(a, n, 3, w, v);

	for (i = 0; i < 3; ++ i){
		if (w[i] > wmax){
			wmax = w[i];
		}
	}

	wmax *= 0.01;

	for (i = 0; i < 3; ++ i){
		if (w[i] < wmax){
			w[i] = 0.0;
		}
	}

	for (j = 0; j < 3; ++ j){
		if (0.0 === w[j]){
			++ cn;
			for (k = j; k < 2; ++ k){
				for (i = 0; i < n; ++ i){
					a[i][k] = a[i][k + 1];
				}
				for (i = 0; i < 3; ++ i){
					v[i][k] = v[i][k + 1];
				}
			}
		}
	}

	for (j = 0; j < 2; ++ j){
		if (0.0 === w[j]){
			w[j] = w[j + 1];
		}
	}

	for (i = 0; i < 3; ++ i){
		for (j = 0; j < 3 - cn; ++ j){
			s[i][j] = v[i][j] / w[j];
		}
	}
	
	for (i = 0; i < 3; ++ i){
		for (j = 0; j < n; ++ j){
			b[i][j] = 0.0;
			for (k = 0; k < 3 - cn; ++ k){
				b[i][j] += s[i][k] * a[j][k];
			}
		}
	}
};

POS.Pose = function(error1, rotation1, translation1, error2, rotation2, translation2){
	this.bestError = error1;
	this.bestRotation = rotation1;
	this.bestTranslation = translation1;
	this.alternativeError = error2;
	this.alternativeRotation = rotation2;
	this.alternativeTranslation = translation2;
};

/*
Copyright (c) 2012 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "3D Pose Estimation"
	Andrew Kirillow
	http://www.aforgenet.com/articles/posit/
*/

var POS = POS || {};

POS.Posit = function(modelSize, focalLength){
	this.model = this.buildModel(modelSize);
	this.focalLength = focalLength;

	this.init();
};

POS.Posit.prototype.buildModel = function(modelSize){
	var half = modelSize / 2.0;
	
	return [
		new Vec3(-half,  half, 0.0),
		new Vec3( half,  half, 0.0),
		new Vec3( half, -half, 0.0),
		new Vec3(-half, -half, 0.0) ];
};

POS.Posit.prototype.init = function(){
	var d = new Vec3(), v = new Mat3(), u;
	
	this.modelVectors = Mat3.fromRows(
			Vec3.sub(this.model[1], this.model[0]),
			Vec3.sub(this.model[2], this.model[0]),
			Vec3.sub(this.model[3], this.model[0]) );

	u = Mat3.clone(this.modelVectors);

	SVD.svdcmp(u.m, 3, 3, d.v, v.m);

	this.modelPseudoInverse = Mat3.mult(
		Mat3.mult(v, Mat3.fromDiagonal( Vec3.inverse(d) ) ), Mat3.transpose(u) );
	
	this.modelNormal = v.column( d.minIndex() );
};

POS.Posit.prototype.pose = function(points){
	var eps = new Vec3(1.0, 1.0, 1.0),
			rotation1 = new Mat3(), rotation2 = new Mat3(),
			translation1 = new Vec3(), translation2 = new Vec3(),
			error1, error2;

	this.pos(points, eps, rotation1, rotation2, translation1, translation2);

	error1 = this.iterate(points, rotation1, translation1);
	error2 = this.iterate(points, rotation2, translation2);

	return error1 < error2?
		new POS.Pose(error1, rotation1.m, translation1.v, error2, rotation2.m, translation2.v):
		new POS.Pose(error2, rotation2.m, translation2.v, error1, rotation1.m, translation1.v);
};

POS.Posit.prototype.pos = function(points, eps, rotation1, rotation2, translation1, translation2){
	var xi = new Vec3(points[1].x, points[2].x, points[3].x),
			yi = new Vec3(points[1].y, points[2].y, points[3].y),
			xs = Vec3.addScalar( Vec3.mult(xi, eps), -points[0].x),
			ys = Vec3.addScalar( Vec3.mult(yi, eps), -points[0].y),
			i0 = Mat3.multVector(this.modelPseudoInverse, xs),
			j0 = Mat3.multVector(this.modelPseudoInverse, ys),
			s = j0.square() - i0.square(),
			ij = Vec3.dot(i0, j0),
			r = 0.0, theta = 0.0,
			i, j, k, inorm, jnorm, scale, temp, lambda, mu;

	if (0.0 === s){
		r = Math.sqrt( Math.abs(2.0 * ij) );
		theta = (-Math.PI / 2.0) * (ij < 0.0? -1: (ij > 0.0? 1.0: 0.0) );
	}else{
		r = Math.sqrt( Math.sqrt(s * s + 4.0 * ij * ij) );
		theta = Math.atan(-2.0 * ij / s);
		if (s < 0.0){
			theta += Math.PI;
		}
		theta /= 2.0;
	}

	lambda = r * Math.cos(theta);
	mu = r * Math.sin(theta);

	//First possible rotation/translation
	i = Vec3.add(i0, Vec3.multScalar(this.modelNormal, lambda) );
	j = Vec3.add(j0, Vec3.multScalar(this.modelNormal, mu) );
	inorm = i.normalize();
	jnorm = j.normalize();
	k = Vec3.cross(i, j);
	rotation1.copy( Mat3.fromRows(i, j, k) );
	
	scale = (inorm + jnorm) / 2.0;
	temp = Mat3.multVector(rotation1, this.model[0]);
	translation1.v = [
		points[0].x / scale - temp.v[0],
		points[0].y / scale - temp.v[1],
		this.focalLength / scale];

	//Second possible rotation/translation
	i = Vec3.sub(i0, Vec3.multScalar(this.modelNormal, lambda) );
	j = Vec3.sub(j0, Vec3.multScalar(this.modelNormal, mu) );
	inorm = i.normalize();
	jnorm = j.normalize();
	k = Vec3.cross(i, j);
	rotation2.copy( Mat3.fromRows(i, j, k) );
	
	scale = (inorm + jnorm) / 2.0;
	temp = Mat3.multVector(rotation2, this.model[0]);
	translation2.v = [
		points[0].x / scale - temp.v[0],
		points[0].y / scale - temp.v[1],
		this.focalLength / scale];
};

POS.Posit.prototype.iterate = function(points, rotation, translation){
	var prevError = Infinity,
			rotation1 = new Mat3(), rotation2 = new Mat3(),
			translation1 = new Vec3(), translation2 = new Vec3(),
			i = 0, eps, error, error1, error2;

	for (; i < 100; ++ i){
		eps = Vec3.addScalar( Vec3.multScalar( 
			Mat3.multVector( this.modelVectors, rotation.row(2) ), 1.0 / translation.v[2]), 1.0);

		this.pos(points, eps, rotation1, rotation2, translation1, translation2);

		error1 = this.getError(points, rotation1, translation1);
		error2 = this.getError(points, rotation2, translation2);

		if (error1 < error2){
			rotation.copy(rotation1);
			translation.copy(translation1);
			error = error1;
		}else{
			rotation.copy(rotation2);
			translation.copy(translation2);
			error = error2;
		}

		if ( (error <= 2.0) || (error > prevError) ){
			break;
		}

		prevError = error;
	}

	return error;
};

POS.Posit.prototype.getError = function(points, rotation, translation){
	var v1 = Vec3.add( Mat3.multVector(rotation, this.model[0]), translation),
		v2 = Vec3.add( Mat3.multVector(rotation, this.model[1]), translation),
		v3 = Vec3.add( Mat3.multVector(rotation, this.model[2]), translation),
		v4 = Vec3.add( Mat3.multVector(rotation, this.model[3]), translation),
		modeled, ia1, ia2, ia3, ia4, ma1, ma2, ma3, ma4;

	v1 = v1.v; v2 = v2.v; v3 = v3.v; v4 = v4.v;
	
	v1[0] *= this.focalLength / v1[2];
	v1[1] *= this.focalLength / v1[2];
	v2[0] *= this.focalLength / v2[2];
	v2[1] *= this.focalLength / v2[2];
	v3[0] *= this.focalLength / v3[2];
	v3[1] *= this.focalLength / v3[2];
	v4[0] *= this.focalLength / v4[2];
	v4[1] *= this.focalLength / v4[2];
	
	modeled = [
		{x: v1[0], y: v1[1]},
		{x: v2[0], y: v2[1]},
		{x: v3[0], y: v3[1]},
		{x: v4[0], y: v4[1]}
	];

	ia1 = this.angle( points[0], points[1], points[3] );
	ia2 = this.angle( points[1], points[2], points[0] );
	ia3 = this.angle( points[2], points[3], points[1] );
	ia4 = this.angle( points[3], points[0], points[2] );

	ma1 = this.angle( modeled[0], modeled[1], modeled[3] );
	ma2 = this.angle( modeled[1], modeled[2], modeled[0] );
	ma3 = this.angle( modeled[2], modeled[3], modeled[1] );
	ma4 = this.angle( modeled[3], modeled[0], modeled[2] );

	return ( Math.abs(ia1 - ma1) +
					 Math.abs(ia2 - ma2) +
					 Math.abs(ia3 - ma3) +
					 Math.abs(ia4 - ma4) ) / 4.0;
};

POS.Posit.prototype.angle = function(a, b, c){
	var x1 = b.x - a.x, y1 = b.y - a.y,
			x2 = c.x - a.x, y2 = c.y - a.y;
	
	return Math.acos( (x1 * x2 + y1 * y2) / 
		(Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2) ) ) * 180.0 / Math.PI;
};

POS.Pose = function(error1, rotation1, translation1, error2, rotation2, translation2){
	this.bestError = error1;
	this.bestRotation = rotation1;
	this.bestTranslation = translation1;
	this.alternativeError = error2;
	this.alternativeRotation = rotation2;
	this.alternativeTranslation = translation2;
};

var Vec3 = function(x, y, z){
	this.v = [x || 0.0, y || 0.0, z || 0.0];
};

Vec3.prototype.copy = function(a){
	var v = this.v;

	a = a.v;

	v[0] = a[0];
	v[1] = a[1];
	v[2] = a[2];

	return this;
};

Vec3.add = function(a, b){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v; b = b.v;

	v[0] = a[0] + b[0];
	v[1] = a[1] + b[1];
	v[2] = a[2] + b[2];
	
	return vector;
};

Vec3.sub = function(a, b){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v; b = b.v;

	v[0] = a[0] - b[0];
	v[1] = a[1] - b[1];
	v[2] = a[2] - b[2];
	
	return vector;
};

Vec3.mult = function(a, b){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v; b = b.v;

	v[0] = a[0] * b[0];
	v[1] = a[1] * b[1];
	v[2] = a[2] * b[2];
	
	return vector;
};

Vec3.addScalar = function(a, b){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v;

	v[0] = a[0] + b;
	v[1] = a[1] + b;
	v[2] = a[2] + b;
	
	return vector;
};

Vec3.multScalar = function(a, b){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v;

	v[0] = a[0] * b;
	v[1] = a[1] * b;
	v[2] = a[2] * b;
	
	return vector;
};

Vec3.dot = function(a, b){
	a = a.v; b = b.v;

	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

Vec3.cross = function(a, b){
	a = a.v; b = b.v;

 return new Vec3(
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0]);
};

Vec3.prototype.normalize = function(){
	var v = this.v,
			len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
			
	if (len > 0.0){
		v[0] /= len;
		v[1] /= len;
		v[2] /= len;
	}

	return len;
};

Vec3.inverse = function(a){
	var vector = new Vec3(), v = vector.v;
	
	a = a.v;
	
	if (a[0] !== 0.0){
		v[0] = 1.0 / a[0];
	}
	if (a[1] !== 0.0){
		v[1] = 1.0 / a[1];
	}
	if (a[2] !== 0.0){
		v[2] = 1.0 / a[2];
	}
	
	return vector;
};

Vec3.prototype.square = function(){
	var v = this.v;

	return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
};

Vec3.prototype.minIndex = function(){
	var v = this.v;

	return v[0] < v[1]? (v[0] < v[2]? 0: 2): (v[1] < v[2]? 1: 2);
};

var Mat3 = function(){
	this.m = [ [0.0, 0.0, 0.0],
						 [0.0, 0.0, 0.0],
						 [0.0, 0.0, 0.0] ];
};

Mat3.clone = function(a){
	var matrix = new Mat3(), m = matrix.m;
	
	a = a.m;

	m[0][0] = a[0][0];
	m[0][1] = a[0][1];
	m[0][2] = a[0][2];
	m[1][0] = a[1][0];
	m[1][1] = a[1][1];
	m[1][2] = a[1][2];
	m[2][0] = a[2][0];
	m[2][1] = a[2][1];
	m[2][2] = a[2][2];
	
	return matrix;
};

Mat3.prototype.copy = function(a){
	var m = this.m;

	a = a.m;

	m[0][0] = a[0][0];
	m[0][1] = a[0][1];
	m[0][2] = a[0][2];
	m[1][0] = a[1][0];
	m[1][1] = a[1][1];
	m[1][2] = a[1][2];
	m[2][0] = a[2][0];
	m[2][1] = a[2][1];
	m[2][2] = a[2][2];

	return this;
};

Mat3.fromRows = function(a, b, c){
	var matrix = new Mat3(), m = matrix.m;
	
	a = a.v; b = b.v; c = c.v;
	
	m[0][0] = a[0];
	m[0][1] = a[1];
	m[0][2] = a[2];
	m[1][0] = b[0];
	m[1][1] = b[1];
	m[1][2] = b[2];
	m[2][0] = c[0];
	m[2][1] = c[1];
	m[2][2] = c[2];

	return matrix;
};

Mat3.fromDiagonal = function(a){
	var matrix = new Mat3(), m = matrix.m;
	
	a = a.v;
	
	m[0][0] = a[0];
	m[1][1] = a[1];
	m[2][2] = a[2];
	
	return matrix;
};

Mat3.transpose = function(a){
	var matrix = new Mat3(), m = matrix.m;
	
	a = a.m;
	
	m[0][0] = a[0][0];
	m[0][1] = a[1][0];
	m[0][2] = a[2][0];
	m[1][0] = a[0][1];
	m[1][1] = a[1][1];
	m[1][2] = a[2][1];
	m[2][0] = a[0][2];
	m[2][1] = a[1][2];
	m[2][2] = a[2][2];
						
	return matrix;
};

Mat3.mult = function(a, b){
	var matrix = new Mat3(), m = matrix.m;
	
	a = a.m; b = b.m;

	m[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
	m[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
	m[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];
	m[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0];
	m[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1];
	m[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2];
	m[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0];
	m[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1];
	m[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2];

	return matrix;
};

Mat3.multVector = function(m, a){
	m = m.m; a = a.v;
	
	return new Vec3(
		m[0][0] * a[0] + m[0][1] * a[1] + m[0][2] * a[2],
		m[1][0] * a[0] + m[1][1] * a[1] + m[1][2] * a[2],
		m[2][0] * a[0] + m[2][1] * a[1] + m[2][2] * a[2]);
};

Mat3.prototype.column = function(index){
	var m = this.m;
	
	return new Vec3( m[0][index], m[1][index], m[2][index] );
};

Mat3.prototype.row = function(index){
	var m = this.m;
	
	return new Vec3( m[index][0], m[index][1], m[index][2] );
};

/*
Copyright (c) 2012 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "Numerical Recipes in C - Second Edition"
	http://www.nr.com/
*/

var SVD = SVD || {};

SVD.svdcmp = function(a, m, n, w, v){
	var flag, i, its, j, jj, k, l, nm,
			anorm = 0.0, c, f, g = 0.0, h, s, scale = 0.0, x, y, z, rv1 = [];
			
	//Householder reduction to bidiagonal form
	for (i = 0; i < n; ++ i){
		l = i + 1;
		rv1[i] = scale * g;
		g = s = scale = 0.0;
		if (i < m){
			for (k = i; k < m; ++ k){
				scale += Math.abs( a[k][i] );
			}
			if (0.0 !== scale){
				for (k = i; k < m; ++ k){
					a[k][i] /= scale;
					s += a[k][i] * a[k][i];
				}
				f = a[i][i];
				g = -SVD.sign( Math.sqrt(s), f );
				h = f * g - s;
				a[i][i] = f - g;
				for (j = l; j < n; ++ j){
					for (s = 0.0, k = i; k < m; ++ k){
						s += a[k][i] * a[k][j];
					}
					f = s / h;
					for (k = i; k < m; ++ k){
						a[k][j] += f * a[k][i];
					}
				}
				for (k = i; k < m; ++ k){
					a[k][i] *= scale;
				}
			}
		}
		w[i] = scale * g;
		g = s = scale = 0.0;
		if ( (i < m) && (i !== n - 1) ){
			for (k = l; k < n; ++ k){
				scale += Math.abs( a[i][k] );
			}
			if (0.0 !== scale){
				for (k = l; k < n; ++ k){
					a[i][k] /= scale;
					s += a[i][k] * a[i][k];
				}
				f = a[i][l];
				g = -SVD.sign( Math.sqrt(s), f );
				h = f * g - s;
				a[i][l] = f - g;
				for (k = l; k < n; ++ k){
					rv1[k] = a[i][k] / h;
				}
				for (j = l; j < m; ++ j){
					for (s = 0.0, k = l; k < n; ++ k){
						s += a[j][k] * a[i][k];
					}
					for (k = l; k < n; ++ k){
						a[j][k] += s * rv1[k];
					}
				}
				for (k = l; k < n; ++ k){
					a[i][k] *= scale;
				}
			}
		}
		anorm = Math.max(anorm, ( Math.abs( w[i] ) + Math.abs( rv1[i] ) ) );
	}

	//Acumulation of right-hand transformation
	for (i = n - 1; i >= 0; -- i){
		if (i < n - 1){
			if (0.0 !== g){
				for (j = l; j < n; ++ j){
					v[j][i] = ( a[i][j] / a[i][l] ) / g;
				}
				for (j = l; j < n; ++ j){
					for (s = 0.0, k = l; k < n; ++ k){
						s += a[i][k] * v[k][j];
					}
					for (k = l; k < n; ++ k){
						v[k][j] += s * v[k][i];
					}
				}
			}
			for (j = l; j < n; ++ j){
				v[i][j] = v[j][i] = 0.0;
			}
		}
		v[i][i] = 1.0;
		g = rv1[i];
		l = i;
	}

	//Acumulation of left-hand transformation
	for (i = Math.min(n, m) - 1; i >= 0; -- i){
		l = i + 1;
		g = w[i];
		for (j = l; j < n; ++ j){
			a[i][j] = 0.0;
		}
		if (0.0 !== g){
			g = 1.0 / g;
			for (j = l; j < n; ++ j){
				for (s = 0.0, k = l; k < m; ++ k){
					s += a[k][i] * a[k][j];
				}
				f = (s / a[i][i]) * g;
				for (k = i; k < m; ++ k){
					a[k][j] += f * a[k][i];
				}
			}
			for (j = i; j < m; ++ j){
				a[j][i] *= g;
			}
		}else{
				for (j = i; j < m; ++ j){
					a[j][i] = 0.0;
				}
		}
		++ a[i][i];
	}

	//Diagonalization of the bidiagonal form
	for (k = n - 1; k >= 0; -- k){
		for (its = 1; its <= 30; ++ its){
			flag = true;
			for (l = k; l >= 0; -- l){
				nm = l - 1;
				if ( Math.abs( rv1[l] ) + anorm === anorm ){
					flag = false;
					break;
				}
				if ( Math.abs( w[nm] ) + anorm === anorm ){
					break;
				}
			}
			if (flag){
				c = 0.0;
				s = 1.0;
				for (i = l; i <= k; ++ i){
					f = s * rv1[i];
					if ( Math.abs(f) + anorm === anorm ){
						break;
					}
					g = w[i];
					h = SVD.pythag(f, g);
					w[i] = h;
					h = 1.0 / h;
					c = g * h;
					s = -f * h;
					for (j = 1; j <= m; ++ j){
						y = a[j][nm];
						z = a[j][i];
						a[j][nm] = y * c + z * s;
						a[j][i] = z * c - y * s;
					}
				}
			}

			//Convergence
			z = w[k];
			if (l === k){
				if (z < 0.0){
					w[k] = -z;
					for (j = 0; j < n; ++ j){
						v[j][k] = -v[j][k];
					}
				}
				break;
			}

			if (30 === its){
				return false;
			}

			//Shift from bottom 2-by-2 minor
			x = w[l];
			nm = k - 1;
			y = w[nm];
			g = rv1[nm];
			h = rv1[k];
			f = ( (y - z) * (y + z) + (g - h) * (g + h) ) / (2.0 * h * y);
			g = SVD.pythag( f, 1.0 );
			f = ( (x - z) * (x + z) + h * ( (y / (f + SVD.sign(g, f) ) ) - h) ) / x;

			//Next QR transformation
			c = s = 1.0;
			for (j = l; j <= nm; ++ j){
				i = j + 1;
				g = rv1[i];
				y = w[i];
				h = s * g;
				g = c * g;
				z = SVD.pythag(f, h);
				rv1[j] = z;
				c = f / z;
				s = h / z;
				f = x * c + g * s;
				g = g * c - x * s;
				h = y * s;
				y *= c;
				for (jj = 0; jj < n; ++ jj){
					x = v[jj][j];
					z = v[jj][i];
					v[jj][j] = x * c + z * s;
					v[jj][i] = z * c - x * s;
				}
				z = SVD.pythag(f, h);
				w[j] = z;
				if (0.0 !== z){
					z = 1.0 / z;
					c = f * z;
					s = h * z;
				}
				f = c * g + s * y;
				x = c * y - s * g;
				for (jj = 0; jj < m; ++ jj){
					y = a[jj][j];
					z = a[jj][i];
					a[jj][j] = y * c + z * s;
					a[jj][i] = z * c - y * s;
				}
			}
			rv1[l] = 0.0;
			rv1[k] = f;
			w[k] = x;
		}
	}

	return true;
};

SVD.pythag = function(a, b){
	var at = Math.abs(a), bt = Math.abs(b), ct;

	if (at > bt){
		ct = bt / at;
		return at * Math.sqrt(1.0 + ct * ct);
	}
		
	if (0.0 === bt){
		return 0.0;
	}

	ct = at / bt;
	return bt * Math.sqrt(1.0 + ct * ct);
};

SVD.sign = function(a, b){
	return b >= 0.0? Math.abs(a): -Math.abs(a);
};
