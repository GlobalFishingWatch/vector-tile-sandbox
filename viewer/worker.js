!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.geojsonvt=e()}(this,function(){"use strict";function c(t,e,n,i,o,r){var s=o-n,l=r-i;if(0!==s||0!==l){var a=((t-n)*s+(e-i)*l)/(s*s+l*l);1<a?(n=o,i=r):0<a&&(n+=s*a,i+=l*a)}return(s=t-n)*s+(l=e-i)*l}function x(t,e,n,i){var o={id:void 0===t?null:t,type:e,geometry:n,tags:i,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0};return function(t){var e=t.geometry,n=t.type;if("Point"===n||"MultiPoint"===n||"LineString"===n)r(t,e);else if("Polygon"===n||"MultiLineString"===n)for(var i=0;i<e.length;i++)r(t,e[i]);else if("MultiPolygon"===n)for(i=0;i<e.length;i++)for(var o=0;o<e[i].length;o++)r(t,e[i][o])}(o),o}function r(t,e){for(var n=0;n<e.length;n+=3)t.minX=Math.min(t.minX,e[n]),t.minY=Math.min(t.minY,e[n+1]),t.maxX=Math.max(t.maxX,e[n]),t.maxY=Math.max(t.maxY,e[n+1])}function h(t,e,n,i){if(e.geometry){var o=e.geometry.coordinates,r=e.geometry.type,s=Math.pow(n.tolerance/((1<<n.maxZoom)*n.extent),2),l=[],a=e.id;if(n.promoteId?a=e.properties[n.promoteId]:n.generateId&&(a=i||0),"Point"===r)g(o,l);else if("MultiPoint"===r)for(var u=0;u<o.length;u++)g(o[u],l);else if("LineString"===r)m(o,l,s,!1);else if("MultiLineString"===r){if(n.lineMetrics){for(u=0;u<o.length;u++)l=[],m(o[u],l,s,!1),t.push(x(a,"LineString",l,e.properties));return}p(o,l,s,!1)}else if("Polygon"===r)p(o,l,s,!0);else{if("MultiPolygon"!==r){if("GeometryCollection"===r){for(u=0;u<e.geometry.geometries.length;u++)h(t,{id:a,geometry:e.geometry.geometries[u],properties:e.properties},n,i);return}throw new Error("Input data is not a valid GeoJSON object.")}for(u=0;u<o.length;u++){var f=[];p(o[u],f,s,!0),l.push(f)}}t.push(x(a,r,l,e.properties))}}function g(t,e){e.push(d(t[0])),e.push(v(t[1])),e.push(0)}function m(t,e,n,i){for(var o,r,s=0,l=0;l<t.length;l++){var a=d(t[l][0]),u=v(t[l][1]);e.push(a),e.push(u),e.push(0),0<l&&(s+=i?(o*u-a*r)/2:Math.sqrt(Math.pow(a-o,2)+Math.pow(u-r,2))),o=a,r=u}var f=e.length-3;e[2]=1,function t(e,n,i,o){for(var r,s=o,l=i-n>>1,a=i-n,u=e[n],f=e[n+1],h=e[i],g=e[i+1],m=n+3;m<i;m+=3){var p=c(e[m],e[m+1],u,f,h,g);if(s<p)r=m,s=p;else if(p===s){var d=Math.abs(m-l);d<a&&(r=m,a=d)}}o<s&&(3<r-n&&t(e,n,r,o),e[r+2]=s,3<i-r&&t(e,r,i,o))}(e,0,f,n),e[f+2]=1,e.size=Math.abs(s),e.start=0,e.end=e.size}function p(t,e,n,i){for(var o=0;o<t.length;o++){var r=[];m(t[o],r,n,i),e.push(r)}}function d(t){return t/360+.5}function v(t){var e=Math.sin(t*Math.PI/180),n=.5-.25*Math.log((1+e)/(1-e))/Math.PI;return n<0?0:1<n?1:n}function L(t,e,n,i,o,r,s,l){if(i/=e,(n/=e)<=r&&s<i)return t;if(s<n||i<=r)return null;for(var a=[],u=0;u<t.length;u++){var f=t[u],h=f.geometry,g=f.type,m=0===o?f.minX:f.minY,p=0===o?f.maxX:f.maxY;if(n<=m&&p<i)a.push(f);else if(!(p<n||i<=m)){var d=[];if("Point"===g||"MultiPoint"===g)y(h,d,n,i,o);else if("LineString"===g)M(h,d,n,i,o,!1,l.lineMetrics);else if("MultiLineString"===g)P(h,d,n,i,o,!1);else if("Polygon"===g)P(h,d,n,i,o,!0);else if("MultiPolygon"===g)for(var c=0;c<h.length;c++){var v=[];P(h[c],v,n,i,o,!0),v.length&&d.push(v)}if(d.length){if(l.lineMetrics&&"LineString"===g){for(c=0;c<d.length;c++)a.push(x(f.id,g,d[c],f.tags));continue}"LineString"!==g&&"MultiLineString"!==g||(1===d.length?(g="LineString",d=d[0]):g="MultiLineString"),"Point"!==g&&"MultiPoint"!==g||(g=3===d.length?"Point":"MultiPoint"),a.push(x(f.id,g,d,f.tags))}}}return a.length?a:null}function y(t,e,n,i,o){for(var r=0;r<t.length;r+=3){var s=t[r+o];n<=s&&s<=i&&(e.push(t[r]),e.push(t[r+1]),e.push(t[r+2]))}}function M(t,e,n,i,o,r,s){for(var l,a,u=S(t),f=0===o?X:b,h=t.start,g=0;g<t.length-3;g+=3){var m=t[g],p=t[g+1],d=t[g+2],c=t[g+3],v=t[g+4],x=0===o?m:p,y=0===o?c:v,M=!1;s&&(l=Math.sqrt(Math.pow(m-c,2)+Math.pow(p-v,2))),x<n?n<=y&&(a=f(u,m,p,c,v,n),s&&(u.start=h+l*a)):i<=x?y<i&&(a=f(u,m,p,c,v,i),s&&(u.start=h+l*a)):Y(u,m,p,d),y<n&&n<=x&&(a=f(u,m,p,c,v,n),M=!0),i<y&&x<=i&&(a=f(u,m,p,c,v,i),M=!0),!r&&M&&(s&&(u.end=h+l*a),e.push(u),u=S(t)),s&&(h+=l)}var P=t.length-3;m=t[P],p=t[P+1],d=t[P+2],n<=(x=0===o?m:p)&&x<=i&&Y(u,m,p,d),P=u.length-3,r&&3<=P&&(u[P]!==u[0]||u[P+1]!==u[1])&&Y(u,u[0],u[1],u[2]),u.length&&e.push(u)}function S(t){var e=[];return e.size=t.size,e.start=t.start,e.end=t.end,e}function P(t,e,n,i,o,r){for(var s=0;s<t.length;s++)M(t[s],e,n,i,o,r,!1)}function Y(t,e,n,i){t.push(e),t.push(n),t.push(i)}function X(t,e,n,i,o,r){var s=(r-e)/(i-e);return t.push(r),t.push(n+(o-n)*s),t.push(1),s}function b(t,e,n,i,o,r){var s=(r-n)/(o-n);return t.push(e+(i-e)*s),t.push(r),t.push(1),s}function f(t,e){for(var n=[],i=0;i<t.length;i++){var o,r=t[i],s=r.type;if("Point"===s||"MultiPoint"===s||"LineString"===s)o=z(r.geometry,e);else if("MultiLineString"===s||"Polygon"===s){o=[];for(var l=0;l<r.geometry.length;l++)o.push(z(r.geometry[l],e))}else if("MultiPolygon"===s)for(o=[],l=0;l<r.geometry.length;l++){for(var a=[],u=0;u<r.geometry[l].length;u++)a.push(z(r.geometry[l][u],e));o.push(a)}n.push(x(r.id,s,o,r.tags))}return n}function z(t,e){var n=[];n.size=t.size,void 0!==t.start&&(n.start=t.start,n.end=t.end);for(var i=0;i<t.length;i+=3)n.push(t[i]+e,t[i+1],t[i+2]);return n}function w(t,e){if(t.transformed)return t;var n,i,o,r=1<<t.z,s=t.x,l=t.y;for(n=0;n<t.features.length;n++){var a=t.features[n],u=a.geometry,f=a.type;if(a.geometry=[],1===f)for(i=0;i<u.length;i+=2)a.geometry.push(I(u[i],u[i+1],e,r,s,l));else for(i=0;i<u.length;i++){var h=[];for(o=0;o<u[i].length;o+=2)h.push(I(u[i][o],u[i][o+1],e,r,s,l));a.geometry.push(h)}}return t.transformed=!0,t}function I(t,e,n,i,o,r){return[Math.round(n*(t*i-o)),Math.round(n*(e*i-r))]}function Z(t,e,n,i,o){for(var r=e===o.maxZoom?0:o.tolerance/((1<<e)*o.extent),s={features:[],numPoints:0,numSimplified:0,numFeatures:0,source:null,x:n,y:i,z:e,transformed:!1,minX:2,minY:1,maxX:-1,maxY:0},l=0;l<t.length;l++){s.numFeatures++,E(s,t[l],r,o);var a=t[l].minX,u=t[l].minY,f=t[l].maxX,h=t[l].maxY;a<s.minX&&(s.minX=a),u<s.minY&&(s.minY=u),f>s.maxX&&(s.maxX=f),h>s.maxY&&(s.maxY=h)}return s}function E(t,e,n,i){var o=e.geometry,r=e.type,s=[];if("Point"===r||"MultiPoint"===r)for(var l=0;l<o.length;l+=3)s.push(o[l]),s.push(o[l+1]),t.numPoints++,t.numSimplified++;else if("LineString"===r)F(s,o,t,n,!1,!1);else if("MultiLineString"===r||"Polygon"===r)for(l=0;l<o.length;l++)F(s,o[l],t,n,"Polygon"===r,0===l);else if("MultiPolygon"===r)for(var a=0;a<o.length;a++){var u=o[a];for(l=0;l<u.length;l++)F(s,u[l],t,n,!0,0===l)}if(s.length){var f=e.tags||null;if("LineString"===r&&i.lineMetrics){for(var h in f={},e.tags)f[h]=e.tags[h];f.mapbox_clip_start=o.start/o.size,f.mapbox_clip_end=o.end/o.size}var g={geometry:s,type:"Polygon"===r||"MultiPolygon"===r?3:"LineString"===r||"MultiLineString"===r?2:1,tags:f};null!==e.id&&(g.id=e.id),t.features.push(g)}}function F(t,e,n,i,o,r){var s=i*i;if(0<i&&e.size<(o?s:i))n.numPoints+=e.length/3;else{for(var l=[],a=0;a<e.length;a+=3)(0===i||e[a+2]>s)&&(n.numSimplified++,l.push(e[a]),l.push(e[a+1])),n.numPoints++;o&&function(t,e){for(var n=0,i=0,o=t.length,r=o-2;i<o;r=i,i+=2)n+=(t[i]-t[r])*(t[i+1]+t[r+1]);if(0<n===e)for(i=0,o=t.length;i<o/2;i+=2){var s=t[i],l=t[i+1];t[i]=t[o-2-i],t[i+1]=t[o-1-i],t[o-2-i]=s,t[o-1-i]=l}}(l,r),t.push(l)}}function n(t,e){var n=(e=this.options=function(t,e){for(var n in e)t[n]=e[n];return t}(Object.create(this.options),e)).debug;if(n&&console.time("preprocess data"),e.maxZoom<0||24<e.maxZoom)throw new Error("maxZoom should be in the 0-24 range");if(e.promoteId&&e.generateId)throw new Error("promoteId and generateId cannot be used together.");var i,o,r,s,l,a,u=function(t,e){var n=[];if("FeatureCollection"===t.type)for(var i=0;i<t.features.length;i++)h(n,t.features[i],e,i);else"Feature"===t.type?h(n,t,e):h(n,{geometry:t},e);return n}(t,e);this.tiles={},this.tileCoords=[],n&&(console.timeEnd("preprocess data"),console.log("index: maxZoom: %d, maxPoints: %d",e.indexMaxZoom,e.indexMaxPoints),console.time("generate tiles"),this.stats={},this.total=0),i=u,r=(o=e).buffer/o.extent,l=L(s=i,1,-1-r,r,0,-1,2,o),a=L(i,1,1-r,2+r,0,-1,2,o),(l||a)&&(s=L(i,1,-r,1+r,0,-1,2,o)||[],l&&(s=f(l,1).concat(s)),a&&(s=s.concat(f(a,-1)))),(u=s).length&&this.splitTile(u,0,0,0),n&&(u.length&&console.log("features: %d, points: %d",this.tiles[0].numFeatures,this.tiles[0].numPoints),console.timeEnd("generate tiles"),console.log("tiles generated:",this.total,JSON.stringify(this.stats)))}function j(t,e,n){return 32*((1<<t)*n+e)+t}return n.prototype.options={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,tolerance:3,extent:4096,buffer:64,lineMetrics:!1,promoteId:null,generateId:!1,debug:0},n.prototype.splitTile=function(t,e,n,i,o,r,s){for(var l=[t,e,n,i],a=this.options,u=a.debug;l.length;){i=l.pop(),n=l.pop(),e=l.pop(),t=l.pop();var f=1<<e,h=j(e,n,i),g=this.tiles[h];if(!g&&(1<u&&console.time("creation"),g=this.tiles[h]=Z(t,e,n,i,a),this.tileCoords.push({z:e,x:n,y:i}),u)){1<u&&(console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)",e,n,i,g.numFeatures,g.numPoints,g.numSimplified),console.timeEnd("creation"));var m="z"+e;this.stats[m]=(this.stats[m]||0)+1,this.total++}if(g.source=t,o){if(e===a.maxZoom||e===o)continue;var p=1<<o-e;if(n!==Math.floor(r/p)||i!==Math.floor(s/p))continue}else if(e===a.indexMaxZoom||g.numPoints<=a.indexMaxPoints)continue;if(g.source=null,0!==t.length){1<u&&console.time("clipping");var d,c,v,x,y,M,P=.5*a.buffer/a.extent,S=.5-P,Y=.5+P,X=1+P;d=c=v=x=null,y=L(t,f,n-P,n+Y,0,g.minX,g.maxX,a),M=L(t,f,n+S,n+X,0,g.minX,g.maxX,a),t=null,y&&(d=L(y,f,i-P,i+Y,1,g.minY,g.maxY,a),c=L(y,f,i+S,i+X,1,g.minY,g.maxY,a),y=null),M&&(v=L(M,f,i-P,i+Y,1,g.minY,g.maxY,a),x=L(M,f,i+S,i+X,1,g.minY,g.maxY,a),M=null),1<u&&console.timeEnd("clipping"),l.push(d||[],e+1,2*n,2*i),l.push(c||[],e+1,2*n,2*i+1),l.push(v||[],e+1,2*n+1,2*i),l.push(x||[],e+1,2*n+1,2*i+1)}}},n.prototype.getTile=function(t,e,n){var i=this.options,o=i.extent,r=i.debug;if(t<0||24<t)return null;var s=1<<t,l=j(t,e=(e%s+s)%s,n);if(this.tiles[l])return w(this.tiles[l],o);1<r&&console.log("drilling down to z%d-%d-%d",t,e,n);for(var a,u=t,f=e,h=n;!a&&0<u;)u--,f=Math.floor(f/2),h=Math.floor(h/2),a=this.tiles[j(u,f,h)];return a&&a.source?(1<r&&console.log("found parent tile z%d-%d-%d",u,f,h),1<r&&console.time("drilling down"),this.splitTile(a.source,u,f,h,t,e,n),1<r&&console.timeEnd("drilling down"),this.tiles[l]?w(this.tiles[l],o):null):null},function(t,e){return new n(t,e)}});

// console.log('hello worker')
// self.addEventListener('fetch', function(event) {
//   console.log(event.request.url)
//   if (event.request.url.match(/json$/) !== null) {
//     console.log('json lalala')
//     event.respondWith(
//       () => {
//         return fetch('./test.json')
//           .then(r => r)
//           // .then(r => r.json())
//           // .then(r => {
//           //   return  {
//           //     ...r,
//           //     'worker': 'says hello'
//           //   }
//           // })
//       }
//     )
//   }
//   // if (event.request.url.match(/pbfs$/) !== null) {
//   //   event.respondWith(fetch(event.request + 'lala'))
//   // }
//   // event.respondWith(
//   //   caches.match(event.request)
//   //     .then(function(response) {
//   //       // Cache hit - return response
//   //       if (response) {
//   //         return response;
//   //       }
//   //       return fetch(event.request);
//   //     }
//   //   )
//   // );
// });
var dataCacheName = 'weatherData-v1';

async function fetchAndModify(request) {
  const response = await fetch(request);

  // Read response body.
  const content = await response.json();
  console.log(content)
  // Modify it.
  // content.hello = 'hello from worker'

  if (content.features) {
    content.features[0].geometry.coordinates[0] = 
      content.features[0].geometry.coordinates[0].map((cs) =>
        [cs[0]+20, cs[1]+20]
      )
  }
  console.log(content)

  // return response;
  return new Response(JSON.stringify(content), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }
  )
}

const geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -80.5517578125,
              -44.93369638969467
            ],
            [
              -84.111328125,
              -49.46812406733163
            ],
            [
              -76.3330078125,
              -49.610709938074216
            ],
            [
              -80.5517578125,
              -44.93369638969467
            ]
          ]
        ]
      }
    }
  ]
}

async function readTile(request) {
  const response = await fetch(request);

  console.log('reading tile', request.url)
  console.log('reading tile', response, response.body)

  // build an initial index of tiles
  var tileIndex = geojsonvt(geojson);

  // request a particular tile
  var features = tileIndex.getTile(3, 2, 5).features;
  console.log(features)


  // const newResponse = response.clone()

  //console.log(response.body)
  // response.arrayBuffer().then(function(buffer) {
  //   // do something with buffer
  //   // console.log(buffer)
  // });

  const buffer = await response.arrayBuffer()
  console.log(buffer)
  const newResponse = new Response(buffer, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  })

  return newResponse
  // return response
}

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  if (e.request.url.match(/json$/) !== null) {
    e.respondWith(fetchAndModify(e.request));
  } else if (e.request.url.match(/pbf$/) !== null) {
    e.respondWith(readTile(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});