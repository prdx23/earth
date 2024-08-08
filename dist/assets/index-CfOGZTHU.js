var dt=Object.defineProperty;var lt=(r,t,i)=>t in r?dt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[t]=i;var a=(r,t,i)=>lt(r,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const T={init(r,t){const i=document.createElement("canvas");return i.width=r,i.height=t,i.getContext("webgl2",{alpha:!1})},resizeToScreen(r){const t=r.canvas,i=t.clientWidth,n=t.clientHeight,e=Math.max(i,n)>2400?4096:2048;let o,s;i>=n?(o=e,s=e*n/i):(s=e,o=e*i/n),(t.width!=o||t.height!=s)&&(t.width=o,t.height=s,r.viewport(0,0,r.canvas.width,r.canvas.height))},loadShader(r,t,i){function n(c,h,m){const u=c.createShader(h);return c.shaderSource(u,m),c.compileShader(u),c.getShaderParameter(u,c.COMPILE_STATUS)||(console.error(`Shader Error: 
${c.getShaderInfoLog(u)}`),c.deleteShader(u)),u}const e=n(r,r.VERTEX_SHADER,t),o=n(r,r.FRAGMENT_SHADER,i),s=r.createProgram();return r.attachShader(s,e),r.attachShader(s,o),r.linkProgram(s),r.getProgramParameter(s,r.LINK_STATUS)||(console.error("Program Error: ",r.getProgramInfoLog(s)),r.deleteProgram(s)),s},loadAttribute(r,t,i,n,e,o,s,c=0,h=0){const m=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferData(r.ARRAY_BUFFER,n,r.STATIC_DRAW);const u=r.getAttribLocation(i,t);if(u==-1){console.warn(`Attribute Error: ${t} not found`);return}r.enableVertexAttribArray(u),r.vertexAttribPointer(u,e,o,s,c,h),r.bindBuffer(r.ARRAY_BUFFER,null)},loading:{status:!0,progress:2},updateLoading(){let r="[";for(let t=0;t<10;t++)t<this.loading.progress?r+="■":r+="-";r+="]",document.getElementById("loading-bar").innerText=r}},L=class L{constructor(t,i,n){a(this,"x");a(this,"y");a(this,"z");this.x=t,this.y=i,this.z=n}set(t,i,n){return this.x=t,this.y=i,this.z=n,this}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}static zero(){return new L(0,0,0)}static add(t,i){return new L(t.x+i.x,t.y+i.y,t.z+i.z)}static subtract(t,i){return new L(t.x-i.x,t.y-i.y,t.z-i.z)}static multiply(t,i){return new L(t.x*i.x,t.y*i.y,t.z*i.z)}static divide(t,i){return new L(t.x/i.x,t.y/i.y,t.z/i.z)}static scale(t,i){return new L(t.x*i,t.y*i,t.z*i)}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}subtract(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}scale(t){return this.x*=t,this.y*=t,this.z*=t,this}sqLen(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}normalize(){if(this.isZero())return this;const t=1/this.length();return this.x*=t,this.y*=t,this.z*=t,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){return new L(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}isZero(){return this.x==0&&this.y==0&&this.z==0}static midpoint(t,i){return L.zero().copy(t).add(L.zero().copy(i).subtract(t).scale(.5))}setTranslationFromMatrix(t){return this.x=t.matrix[12],this.y=t.matrix[13],this.z=t.matrix[14],this}};a(L,"origin",new L(0,0,0)),a(L,"up",new L(0,1,0)),a(L,"right",new L(1,0,0)),a(L,"front",new L(0,0,1));let _=L;const ft=_.zero();class M{constructor(t){a(this,"matrix");this.matrix=new Float32Array(t)}copy(t){return this.matrix[0]=t.matrix[0],this.matrix[1]=t.matrix[1],this.matrix[2]=t.matrix[2],this.matrix[3]=t.matrix[3],this.matrix[4]=t.matrix[4],this.matrix[5]=t.matrix[5],this.matrix[6]=t.matrix[6],this.matrix[7]=t.matrix[7],this.matrix[8]=t.matrix[8],this.matrix[9]=t.matrix[9],this.matrix[10]=t.matrix[10],this.matrix[11]=t.matrix[11],this.matrix[12]=t.matrix[12],this.matrix[13]=t.matrix[13],this.matrix[14]=t.matrix[14],this.matrix[15]=t.matrix[15],this}set(t,i,n,e,o,s,c,h,m,u,l,d,x,p,y,E){return this.matrix[0]=t,this.matrix[1]=i,this.matrix[2]=n,this.matrix[3]=e,this.matrix[4]=o,this.matrix[5]=s,this.matrix[6]=c,this.matrix[7]=h,this.matrix[8]=m,this.matrix[9]=u,this.matrix[10]=l,this.matrix[11]=d,this.matrix[12]=x,this.matrix[13]=p,this.matrix[14]=y,this.matrix[15]=E,this}static identity(){return new M([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}identity(){return this.matrix[0]=1,this.matrix[1]=0,this.matrix[2]=0,this.matrix[3]=0,this.matrix[4]=0,this.matrix[5]=1,this.matrix[6]=0,this.matrix[7]=0,this.matrix[8]=0,this.matrix[9]=0,this.matrix[10]=1,this.matrix[11]=0,this.matrix[12]=0,this.matrix[13]=0,this.matrix[14]=0,this.matrix[15]=1,this}translate(t,i,n){return this.__multiplyInternal(1,0,0,0,0,1,0,0,0,0,1,0,t,i,n,1)}rotateX(t){const i=Math.cos(t),n=Math.sin(t);return this.__multiplyInternal(1,0,0,0,0,i,n,0,0,-n,i,0,0,0,0,1)}rotateY(t){const i=Math.cos(t),n=Math.sin(t);return this.__multiplyInternal(i,0,-n,0,0,1,0,0,n,0,i,0,0,0,0,1)}rotateZ(t){const i=Math.cos(t),n=Math.sin(t);return this.__multiplyInternal(i,n,0,0,-n,i,0,0,0,0,1,0,0,0,0,1)}scale(t,i,n){return this.__multiplyInternal(t,0,0,0,0,i,0,0,0,0,n,0,0,0,0,1)}perspective(t,i,n,e){const o=Math.tan(Math.PI*.5-.5*t),s=1/(n-e);return this.set(o/i,0,0,0,0,o,0,0,0,0,(n+e)*s,-1,0,0,n*e*s*2,0),this}lookAt(t,i,n){const e=ft.copy(t).subtract(i).normalize(),o=n.cross(e).normalize(),s=e.cross(o).normalize();return this.__multiplyInternal(o.x,o.y,o.z,0,s.x,s.y,s.z,0,e.x,e.y,e.z,0,0,0,0,1),this}__multiplyInternal(t,i,n,e,o,s,c,h,m,u,l,d,x,p,y,E){const z=this.matrix[0],P=this.matrix[0*4+1],I=this.matrix[0*4+2],b=this.matrix[0*4+3],S=this.matrix[1*4+0],C=this.matrix[1*4+1],D=this.matrix[1*4+2],X=this.matrix[1*4+3],F=this.matrix[2*4+0],j=this.matrix[2*4+1],N=this.matrix[2*4+2],B=this.matrix[2*4+3],R=this.matrix[3*4+0],V=this.matrix[3*4+1],W=this.matrix[3*4+2],$=this.matrix[3*4+3];return this.matrix[0]=t*z+i*S+n*F+e*R,this.matrix[1]=t*P+i*C+n*j+e*V,this.matrix[2]=t*I+i*D+n*N+e*W,this.matrix[3]=t*b+i*X+n*B+e*$,this.matrix[4]=o*z+s*S+c*F+h*R,this.matrix[5]=o*P+s*C+c*j+h*V,this.matrix[6]=o*I+s*D+c*N+h*W,this.matrix[7]=o*b+s*X+c*B+h*$,this.matrix[8]=m*z+u*S+l*F+d*R,this.matrix[9]=m*P+u*C+l*j+d*V,this.matrix[10]=m*I+u*D+l*N+d*W,this.matrix[11]=m*b+u*X+l*B+d*$,this.matrix[12]=x*z+p*S+y*F+E*R,this.matrix[13]=x*P+p*C+y*j+E*V,this.matrix[14]=x*I+p*D+y*N+E*W,this.matrix[15]=x*b+p*X+y*B+E*$,this}multiply(t){return this.__multiplyInternal(t.matrix[0*4+0],t.matrix[0*4+1],t.matrix[0*4+2],t.matrix[0*4+3],t.matrix[1*4+0],t.matrix[1*4+1],t.matrix[1*4+2],t.matrix[1*4+3],t.matrix[2*4+0],t.matrix[2*4+1],t.matrix[2*4+2],t.matrix[2*4+3],t.matrix[3*4+0],t.matrix[3*4+1],t.matrix[3*4+2],t.matrix[3*4+3])}inverse(){const t=this.matrix[0],i=this.matrix[0*4+1],n=this.matrix[0*4+2],e=this.matrix[0*4+3],o=this.matrix[1*4+0],s=this.matrix[1*4+1],c=this.matrix[1*4+2],h=this.matrix[1*4+3],m=this.matrix[2*4+0],u=this.matrix[2*4+1],l=this.matrix[2*4+2],d=this.matrix[2*4+3],x=this.matrix[3*4+0],p=this.matrix[3*4+1],y=this.matrix[3*4+2],E=this.matrix[3*4+3],z=t*s-i*o,P=t*c-n*o,I=t*h-e*o,b=i*c-n*s,S=i*h-e*s,C=n*h-e*c,D=m*p-u*x,X=m*y-l*x,F=m*E-d*x,j=u*y-l*p,N=u*E-d*p,B=l*E-d*y,R=1/(z*B-P*N+I*j+b*F-S*X+C*D);return new M([(s*B-c*N+h*j)*R,(n*N-i*B-e*j)*R,(p*C-y*S+E*b)*R,(l*S-u*C-d*b)*R,(c*F-o*B-h*X)*R,(t*B-n*F+e*X)*R,(y*I-x*C-E*P)*R,(m*C-l*I+d*P)*R,(o*N-s*F+h*D)*R,(i*F-t*N-e*D)*R,(x*S-p*I+E*z)*R,(u*I-m*S-d*z)*R,(s*X-o*j-c*D)*R,(t*j-i*X+n*D)*R,(p*P-x*b-y*z)*R,(m*b-u*P+l*z)*R])}}class G{constructor(t,i,n,e){a(this,"w");a(this,"x");a(this,"y");a(this,"z");a(this,"_matrix");this.w=t,this.x=i,this.y=n,this.z=e,this._matrix=M.identity()}static identity(){return new G(1,0,0,0)}identity(){return this.w=1,this.x=0,this.y=0,this.z=0,this}static axisAngle(t,i){const n=i/2,e=Math.sin(n),o=Math.cos(n);return new G(o,e*t.x,e*t.y,e*t.z)}setAxisAngle(t,i){const n=i/2,e=Math.sin(n);return this.w=Math.cos(n),this.x=e*t.x,this.y=e*t.y,this.z=e*t.z,this}normalize(){const t=1/(this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z);return this.w*=t,this.x*=t,this.y*=t,this.z*=t,this}multiply(t){const i=this.w,n=this.x,e=this.y,o=this.z,s=t.w,c=t.x,h=t.y,m=t.z;return this.w=i*s-n*c-e*h-o*m,this.x=n*s+i*c+e*m-o*h,this.y=e*s+i*h+o*c-n*m,this.z=o*s+i*m+n*h-e*c,this}matrix(){const t=this.w,i=this.x,n=this.y,e=this.z,o=2/(t*t+i*i+n*n+e*e),s=i*o,c=n*o,h=e*o,m=t*s,u=t*c,l=t*h,d=i*s,x=i*c,p=i*h,y=n*c,E=n*h,z=e*h;return this._matrix.set(1-y-z,x+l,p-u,0,x-l,1-d-z,E+m,0,p+u,E-m,1-d-y,0,0,0,0,1),this._matrix}}const U={any:!1,up:!1,down:!1,left:!1,right:!1,zoomOut:!1,zoomIn:!1},Q={KeyW:"up",KeyA:"left",KeyS:"down",KeyD:"right",ArrowUp:"up",ArrowLeft:"left",ArrowDown:"down",ArrowRight:"right",Minus:"zoomOut",Equal:"zoomIn"},et=Object.keys(Q),g={dragging:!1,prevX:0,prevY:0,offsetX:0,offsetY:0,finalize:!1,zoom:0};function xt(){window.addEventListener("keydown",n=>{n.isComposing||n.keyCode===229||n.repeat||et.includes(n.code)&&(U[Q[n.code]]=!0,U.any=!0)}),window.addEventListener("keyup",n=>{et.includes(n.code)&&(U[Q[n.code]]=!1,U.any=!1,U.any=Object.values(U).some(e=>e))});function r(n,e){g.dragging=!0,g.prevX=n,g.prevY=e}function t(n,e){g.dragging&&(g.offsetX=g.prevX-n,g.offsetY=g.prevY-e)}function i(){g.dragging=!1,g.finalize=!0,g.offsetX=0,g.offsetY=0,g.prevX=0,g.prevY=0}window.addEventListener("mousedown",n=>{r(n.pageX,n.pageY)}),window.addEventListener("mousemove",n=>{t(n.pageX,n.pageY)}),window.addEventListener("mouseup",()=>{i()}),window.addEventListener("touchstart",n=>{r(n.touches[0].pageX,n.touches[0].pageY)}),window.addEventListener("touchmove",n=>{t(n.touches[0].pageX,n.touches[0].pageY)}),window.addEventListener("touchend",()=>{i()}),window.addEventListener("wheel",n=>{g.zoom=n.deltaY})}class _t{constructor(t,i,n,e){a(this,"position");a(this,"target");a(this,"fov");a(this,"aspect");a(this,"near");a(this,"far");a(this,"_matrix");a(this,"_lookAtMatrix");a(this,"_projectionMatrix");a(this,"_viewProjectionMatrix");this.position=_.zero(),this.target=_.zero(),this.fov=t,this.aspect=i,this.near=n,this.far=e,this._matrix=M.identity(),this._lookAtMatrix=M.identity(),this._projectionMatrix=M.identity().perspective(t,i,n,e),this._viewProjectionMatrix=M.identity()}lookAt(t){this.target.copy(t),this._lookAtMatrix.identity().lookAt(this.position,t,_.up)}updateProjectionMatrix(){this._projectionMatrix.perspective(this.fov,this.aspect,this.near,this.far)}viewProjectionMatrix(){return this._matrix.identity().translate(this.position.x,this.position.y,this.position.z).multiply(this._lookAtMatrix),this._viewProjectionMatrix.copy(this._projectionMatrix).multiply(this._matrix.inverse())}}const A=class A{constructor(){a(this,"distance");a(this,"angle");a(this,"offset");a(this,"fovDelta");a(this,"_qh");a(this,"_qv");a(this,"_matrix");this.distance=0,this.angle={x:0,y:0},this.offset={x:0,y:0},this.fovDelta=0,this._qh=G.identity(),this._qv=G.identity(),this._matrix=M.identity()}handleInput(t){if(U.any&&(U.zoomIn&&t.fov+this.fovDelta>A.zoomLimitLower&&(this.fovDelta-=.005),U.zoomOut&&t.fov+this.fovDelta<A.zoomLimitUpper&&(this.fovDelta+=.005),U.left&&(this.angle.x-=A.angleSpeed),U.right&&(this.angle.x+=A.angleSpeed),U.up&&this.angle.y>A.yLimitLower&&(this.angle.y-=A.angleSpeed),U.down&&this.angle.y<A.yLimitUpper&&(this.angle.y+=A.angleSpeed),this.updateCamera(t)),g.dragging){this.offset.x=g.offsetX*A.dragSpeed;const i=this.angle.y+g.offsetY*A.dragSpeed;i>A.yLimitLower&&i<A.yLimitUpper&&(this.offset.y=g.offsetY*A.dragSpeed),this.updateCamera(t)}if(g.zoom!=0){const i=g.zoom*1e-4;t.fov+this.fovDelta+i>A.zoomLimitLower&&t.fov+this.fovDelta+i<A.zoomLimitUpper&&(this.fovDelta+=i,g.zoom=0,this.updateCamera(t))}g.finalize&&(this.angle.x+=this.offset.x,this.angle.y+=this.offset.y,this.offset.x=0,this.offset.y=0,g.finalize=!1,this.updateCamera(t))}updateCamera(t){const i=(this.angle.x+this.offset.x)*Math.PI/180,n=(this.angle.y+this.offset.y)*Math.PI/180;this._qh.setAxisAngle(_.up,i),this._qv.setAxisAngle(_.right,n),this._matrix.identity().multiply(this._qh.matrix()).multiply(this._qv.matrix()).translate(0,0,this.distance),t.position.setTranslationFromMatrix(this._matrix),t.lookAt(t.target)}};a(A,"angleSpeed",.5),a(A,"dragSpeed",.1),a(A,"yLimitLower",-89),a(A,"yLimitUpper",89),a(A,"zoomLimitLower",-4*Math.PI/180),a(A,"zoomLimitUpper",60*Math.PI/180);let tt=A;class v{constructor(t,i,n){a(this,"v1");a(this,"v2");a(this,"v3");this.v1=t,this.v2=i,this.v3=n}flat(){return[this.v1.x,this.v1.y,this.v1.z,this.v2.x,this.v2.y,this.v2.z,this.v3.x,this.v3.y,this.v3.z]}normalize(){this.v1.normalize(),this.v2.normalize(),this.v3.normalize()}subdivide(t){if(t==0)return[this];const i=_.midpoint(this.v1,this.v2),n=_.midpoint(this.v2,this.v3),e=_.midpoint(this.v1,this.v3),o=[new v(n,this.v3,e),new v(e,this.v1,i),new v(i,this.v2,n),new v(e,i,n)];return v.subdivideAll(o,t-1)}static subdivideAll(t,i){return i==0?t:t.flatMap(n=>n.subdivide(i))}}function pt(){const r=(1+Math.sqrt(5))/2,t=1/2,i=r/2,n=new _(-i,0,-t),e=new _(+i,0,-t),o=new _(+i,0,+t),s=new _(-i,0,+t),c=new _(-t,+i,0),h=new _(+t,+i,0),m=new _(+t,-i,0),u=new _(-t,-i,0),l=new _(0,+t,-i),d=new _(0,+t,+i),x=new _(0,-t,+i),p=new _(0,-t,-i),y=[new v(c,s,d),new v(h,c,d),new v(o,h,d),new v(x,o,d),new v(s,x,d),new v(u,x,s),new v(m,x,u),new v(o,x,m),new v(e,o,m),new v(h,o,e),new v(l,h,e),new v(c,h,l),new v(n,c,l),new v(s,c,n),new v(u,s,n),new v(p,u,n),new v(m,u,p),new v(e,m,p),new v(l,e,p),new v(n,l,p)],E=[];for(const I of y)E.push(...I.flat());const z=[[200,70,120],[80,70,120],[200,70,120],[80,70,200],[160,160,220],[200,70,120],[80,70,120],[200,70,120],[76,170,100],[140,170,80],[80,70,120],[200,70,120],[80,70,120],[160,160,220],[80,70,200],[80,70,120],[200,70,120],[80,70,120],[140,170,80],[76,170,100]],P=[];for(let I=0;I<y.length;I++)P.push(...z[I%z.length]),P.push(...z[I%z.length]),P.push(...z[I%z.length]);return{points:new Float32Array(E),colors:new Uint8Array(P),triangles:y,vertexColors:P}}function Z(r=1){const t=pt(),i=v.subdivideAll(t.triangles,r),n=[];for(const s of i)s.normalize(),n.push(...s.flat());const e=[[200,70,120],[80,70,120],[80,70,200],[160,160,220],[76,170,100],[140,170,80]],o=[];for(let s=0;s<i.length;s++)o.push(...e[s%e.length]),o.push(...e[s%e.length]),o.push(...e[s%e.length]);return{points:new Float32Array(n),colors:new Uint8Array(o),triangles:i,vertexColors:o}}function it(r){return new Promise((t,i)=>{const n=new Image,e="https://cdn.glitchcomet.com/earth/";n.src=e+r,n.addEventListener("load",()=>{T.loading.progress+=2,T.updateLoading(),t(n)}),n.addEventListener("error",o=>{console.error(`Error: loading image ${r} failed`),i(o)})})}function H(r,t){return Math.floor(Math.random()*(Math.floor(t)-Math.ceil(r)+1)+Math.ceil(r))}function rt(r){return r[H(0,r.length-1)]}var vt=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;

out vec3 v_model_normal;
out vec3 v_matrix_normal;
out vec4 v_position;

uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_model_normal = a_position.xyz;
    v_matrix_normal = mat3(u_matrix) * a_position.xyz;
    v_position = u_matrix * a_position;
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}`,yt=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;

in vec3 v_model_normal;
in vec3 v_matrix_normal;
in vec4 v_position;

uniform sampler2D u_earth_texture;
uniform sampler2D u_data_texture;
uniform vec3 u_light_direction;
uniform vec3 u_camera_position;

const float gamma = 2.2;
#define PI 3.1415926535898

void main() {

    vec3 normal = normalize(v_matrix_normal);
    vec3 light_direction = normalize(u_light_direction);
    

    
    vec3 model_normal = normalize(v_model_normal);
    vec2 uv = vec2(
        (atan(model_normal.x, model_normal.z) / PI + 1.0) / 2.0,
        asin(model_normal.y) / -PI + 0.5
    );

    vec3 data = texture(u_data_texture, uv).rgb;

    
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * pow(
        max(0.0, dot(normal, -light_direction)),
        gamma
    );

    
    float specular_brightness = data.r;
    float shininess = 128.0;
    float specular_intensity = 4.0;
    vec3 view_direction = normalize(u_camera_position - v_position.xyz);
    vec3 half_dir = normalize(-light_direction + view_direction);
    float specular_light = pow(max(0.0, dot(normal, half_dir)), shininess);
    
    specular_light *= specular_intensity * ceil(diffuse_light);
    specular_light *= specular_brightness;

    
    float ambient_light = 0.0001;

    vec3 earth_surface = pow(texture(u_earth_texture, uv).rgb, vec3(gamma));
    
    
    
    
    
    earth_surface =
        (earth_surface * diffuse_light) +
        (earth_surface * specular_light) +
        (earth_surface * ambient_light);

    
    vec3 clouds = vec3(data.g);
    float is_clouds = data.g;
    vec3 earth = mix(
        earth_surface,
        (clouds * diffuse_light) + (clouds * ambient_light),
        is_clouds
    );

    float nightlights_intensity = 0.4;
    vec3 nightlights_colortone = vec3(0.6, 0.5, 0.4);
    vec3 nightlights_texture = vec3(data.b);
    nightlights_texture *= nightlights_colortone * nightlights_intensity;

    float nightlight_dropoff = pow(max(0.0, dot(normal, light_direction)), 3.0);
    vec3 nightlights = nightlight_dropoff * mix(
        nightlights_texture,
        clouds * 0.003,
        is_clouds
    );

    vec4 output_color = vec4(0.0, 0.0, 1.0, 1.0);
    output_color.rgb = earth + nightlights;

    

    
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}`;const ot=G.identity(),k=class k{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"matrix");a(this,"shader");a(this,"uniforms");this.vao=null,this.matrix=M.identity(),this.vertexCount=0,this.shader=null,this.uniforms={}}async load(t){const i=Z(5);this.vertexCount=i.triangles.length*3,this.shader=T.loadShader(t,vt,yt),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),i.points.forEach((h,m,u)=>u[m]=h*k.radius),T.loadAttribute(t,"a_position",this.shader,i.points,3,t.FLOAT,!1),t.activeTexture(t.TEXTURE0);const n=await it("earth_4k.png"),e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.activeTexture(t.TEXTURE1);const o=await it("data_4k.png"),s=t.createTexture();t.bindTexture(t.TEXTURE_2D,s),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const c=["u_time","u_view_projection_matrix","u_matrix","u_earth_texture","u_data_texture","u_light_direction","u_camera_position"];for(const h of c)this.uniforms[h]=t.getUniformLocation(this.shader,h);t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform1i(this.uniforms.u_earth_texture,0),t.uniform1i(this.uniforms.u_data_texture,1),this.matrix.identity().multiply(G.axisAngle(_.front,-k.tilt*Math.PI/180).matrix())}render(t,i,n,e,o){ot.setAxisAngle(_.up,1*i/1e3%360*Math.PI/180),this.matrix.multiply(ot.matrix()),t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform3f(this.uniforms.u_light_direction,e.x,e.y,e.z),t.uniform3f(this.uniforms.u_camera_position,o.x,o.y,o.z),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,n.matrix),t.uniformMatrix4fv(this.uniforms.u_matrix,!1,this.matrix.matrix),t.drawArrays(t.TRIANGLES,0,this.vertexCount)}};a(k,"radius",1274.2/2),a(k,"tilt",23.5),a(k,"center",_.zero()),a(k,"scalingFactor",1e4);let w=k;var wt=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;
in vec3 a_color;
out vec3 v_color;

uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_color = a_color;
    
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}`,Et=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec3 v_color;

void main() {
    fragColor = vec4(v_color, 1);
}`;class gt{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"matrix");a(this,"shader");a(this,"uniforms");this.vao=null,this.matrix=M.identity(),this.vertexCount=6*6,this.shader=null,this.uniforms={}}async load(t){this.shader=T.loadShader(t,wt,Et),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),T.loadAttribute(t,"a_position",this.shader,new Float32Array(Tt),3,t.FLOAT,!1),T.loadAttribute(t,"a_color",this.shader,new Uint8Array(At),3,t.UNSIGNED_BYTE,!0);const i=["u_time","u_view_projection_matrix","u_matrix"];for(const n of i)this.uniforms[n]=t.getUniformLocation(this.shader,n)}render(t,i,n){t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform1f(this.uniforms.u_time,i),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,n.matrix),t.uniformMatrix4fv(this.uniforms.u_matrix,!1,this.matrix.matrix),t.drawArrays(t.TRIANGLES,0,this.vertexCount)}}const Tt=[-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,-1,1,1,1,-1,1,1,1,1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1,-1,-1,-1,1,1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,-1,1,-1,-1,-1,1,1,-1,-1,1,-1,1,-1,-1,1,-1,-1,-1,1,-1,-1],At=[200,70,120,200,70,120,200,70,120,80,70,120,80,70,120,80,70,120,80,70,200,80,70,200,80,70,200,160,160,220,160,160,220,160,160,220,200,70,120,200,70,120,200,70,120,80,70,120,80,70,120,80,70,120,80,70,200,80,70,200,80,70,200,160,160,220,160,160,220,160,160,220,76,170,100,76,170,100,76,170,100,140,170,80,140,170,80,140,170,80,76,170,100,76,170,100,76,170,100,140,170,80,140,170,80,140,170,80];function zt(r,t,i,n){const e=_.zero().copy(r).subtract(i),o=e.dot(t),s=e.dot(e)-n*n;let c=o*o-s;return c<0?new _(-1,-1,0):(c=Math.sqrt(c),new _(-o-c,-o+c,0))}function Rt(r,t){const i=K.height,n=w.radius,e=n+i,o=w.center,s=r*2-1,c=t*i,h=new _(0,n+c,0),m=new _(1-s*s,s,0);m.normalize();const u=zt(h,m,o,e).y,l=64,d=u/l,x=_.zero().copy(h).add(_.scale(m,d*.5));let p=0;const y=.1*i;for(let E=0;E<l;E++){const z=_.subtract(x,o).length()-n,P=Math.exp(-z/y);p+=P*d,x.add(_.scale(m,d))}return p}function Lt(r){const t=new Float32Array(r*r);for(let i=0;i<r;i++)for(let n=0;n<r;n++)t[n*r+i]=Rt(i/r,n/r);return t}var Pt=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;

out vec4 v_position;

uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_position = u_matrix * a_position;
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}`,It=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;

in vec4 v_position;

uniform vec3 u_light_direction;
uniform vec3 u_camera_position;
uniform float earth_radius;
uniform float atmos_radius;
uniform float atmos_height;
uniform vec3 earth_center;
uniform sampler2D u_optical_depth_texture;

const float gamma = 2.2;
#define PI 3.1415926535898

vec2 sphere_intersect(in vec3 ro, in vec3 rd, in vec3 ce, float ra) {
    vec3 oc = ro - ce;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - ra*ra;
    float h = b*b - c;
    if (h<0.0) { return vec2(-1.0); }
    h = sqrt(h);
    return vec2(-b-h, -b+h);
}

float density_at_point(in vec3 point) {
    float height = distance(point, earth_center) - earth_radius;
    float scale_height = 0.10 * atmos_height;
    float density = exp(-height / scale_height);
    return density;
}

float optical_depth(in vec3 ray_origin, in vec3 ray_direction, in float ray_length) {
    int num_of_samples = 10;
    float step = ray_length / float(num_of_samples);
    vec3 current_point = ray_origin + (ray_direction * (step * 0.5));
    float total_depth = 0.0;

    for (int i = 0; i < num_of_samples; i++) {
        float density = density_at_point(current_point);
        total_depth += density * step;
        current_point += ray_direction * step;
    }

    return total_depth;
}

float lookup_optical_depth(in vec3 ray_origin, in vec3 ray_direction) {
    vec3 current = ray_origin - earth_center;
    float height = (length(current) - earth_radius) / atmos_height;
    float cos = (dot(normalize(current), ray_direction) + 1.0) / 2.0;
    return texture(u_optical_depth_texture, vec2(cos, height)).r;
}

vec3 calc_scatter_light(
    in vec3 ray_origin, in vec3 ray_direction, float ray_length,
    in vec3 light_direction
) {

    vec3 scattering_coefficient = vec3(0.00519673, 0.0121427, 0.0296453);
    int num_of_samples = 10;
    float step = ray_length / float(num_of_samples);
    vec3 current_point = ray_origin + (ray_direction * (step * 0.5));
    vec3 light = vec3(0.0);

    for (int i = 0; i < num_of_samples; i++) {

        
        
        

        
        
        

        
        
        

        float optical_depth_to_sun = lookup_optical_depth(
            current_point, -light_direction
        );

        float optical_depth_to_camera = lookup_optical_depth(
            current_point, -ray_direction
        );

        vec3 transmittance = exp(
            scattering_coefficient * -(optical_depth_to_sun + optical_depth_to_camera)
        );

        float density = density_at_point(current_point);

        light += transmittance * density * step;

        current_point += ray_direction * step;
    }

    float cos_theta = dot(-light_direction, normalize(-ray_direction));
    
    float phase = (3.0 / 4.0) * (1.0 + pow(cos_theta, 2.0));

    float sun_intensity = 1.0;

    return sun_intensity * scattering_coefficient * phase * light;
    
}

void main() {

    vec4 output_color = vec4(0.0, 0.0, 0.0, 0.0);
    vec3 light_direction = normalize(u_light_direction);
    vec3 ray_origin = v_position.xyz;
    vec3 ray_direction = normalize(v_position.xyz - u_camera_position);
    float ray_length = -1.0;

    vec2 intersect_earth = sphere_intersect(
        ray_origin, ray_direction, earth_center, earth_radius
    );

    vec2 intersect_atmos = sphere_intersect(
        ray_origin, ray_direction, earth_center, atmos_radius
    );

    if (intersect_atmos.y >= 0.0) {
        ray_length = intersect_atmos.y - intersect_atmos.x;
        if (intersect_earth.y >= 0.0) {
            ray_length = intersect_earth.x - intersect_atmos.x;
        }
        
    }

    output_color.rgb = calc_scatter_light(
        ray_origin, ray_direction, ray_length, light_direction
    );

    
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;

}`;const q=class q{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"matrix");a(this,"shader");a(this,"uniforms");this.vao=null,this.matrix=M.identity(),this.vertexCount=0,this.shader=null,this.uniforms={}}async load(t){const i=Z(5);this.vertexCount=i.triangles.length*3,this.shader=T.loadShader(t,Pt,It),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),i.points.forEach((c,h,m)=>m[h]=c*(w.radius+q.height)),T.loadAttribute(t,"a_position",this.shader,i.points,3,t.FLOAT,!1);const n=512,e=Lt(n);t.activeTexture(t.TEXTURE2);const o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,t.R32F,n,n,0,t.RED,t.FLOAT,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const s=["u_time","u_view_projection_matrix","u_matrix","u_light_direction","u_camera_position","earth_radius","atmos_height","atmos_radius","earth_center","u_optical_depth_texture"];for(const c of s)this.uniforms[c]=t.getUniformLocation(this.shader,c);t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform1f(this.uniforms.earth_radius,w.radius),t.uniform1f(this.uniforms.atmos_height,q.height),t.uniform1i(this.uniforms.u_optical_depth_texture,2),t.uniform1f(this.uniforms.atmos_radius,w.radius+q.height),t.uniform3f(this.uniforms.earth_center,w.center.x,w.center.y,w.center.z)}render(t,i,n,e){t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform3f(this.uniforms.u_light_direction,n.x,n.y,n.z),t.uniform3f(this.uniforms.u_camera_position,e.x,e.y,e.z),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,i.matrix),t.uniformMatrix4fv(this.uniforms.u_matrix,!1,this.matrix.matrix),t.drawArrays(t.TRIANGLES,0,this.vertexCount)}};a(q,"height",80);let K=q;var Mt=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;
in float a_size;
in vec3 a_color;
out vec3 v_color;

uniform mat4 u_view_projection_matrix;

void main() {
    v_color = a_color;
    gl_Position = u_view_projection_matrix * a_position;
    gl_PointSize = a_size;
}`,Ut=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec3 v_color;

void main() {

    vec4 output_color = vec4(0.0, 0.0, 0.0, 1.0);
    float color = 1.0 - (distance(gl_PointCoord, vec2(0.5, 0.5)) * 2.0);
    output_color.rgb = v_color * 0.7;
    output_color.a = color;

    
    

    
    

    fragColor = output_color;

}`;function bt(r){const t=[[155,176,255],[170,191,255],[202,215,255],[248,247,255],[255,244,234],[202,215,255],[248,247,255],[255,244,234],[202,215,255],[248,247,255],[255,244,234],[202,215,255],[248,247,255],[255,244,234],[255,210,161],[255,204,111],[255,128,112]],i=[],n=[],e=[];for(let o=0;o<r;o++){const s=new _(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1);s.normalize(),s.scale(Math.random()*.4+.6),s.scale(w.radius*18),i.push(s.x),i.push(s.y),i.push(s.z);const c=rt(t);n.push(c[0]),n.push(c[1]),n.push(c[2]);const h=rt([H(20,40),H(20,30),H(20,25)])/10;e.push(h)}return{vertices:new Float32Array(i),colors:new Uint8Array(n),sizes:new Float32Array(e)}}class St{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"shader");a(this,"uniforms");this.vao=null,this.vertexCount=6,this.shader=null,this.uniforms={}}async load(t){this.shader=T.loadShader(t,Mt,Ut),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const i=28e3;this.vertexCount=i;const n=bt(i);T.loadAttribute(t,"a_position",this.shader,n.vertices,3,t.FLOAT,!1),T.loadAttribute(t,"a_color",this.shader,n.colors,3,t.UNSIGNED_BYTE,!0),T.loadAttribute(t,"a_size",this.shader,n.sizes,1,t.FLOAT,!1);const e=["u_view_projection_matrix"];for(const o of e)this.uniforms[o]=t.getUniformLocation(this.shader,o)}render(t,i){t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,i.matrix),t.drawArrays(t.POINTS,0,this.vertexCount)}}var Ct=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;
out vec3 v_position;
uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_position = a_position.xyz;
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}`,Dt=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;
in vec3 v_position;

void main() {
    fragColor = vec4(mix(
        vec3(249.0 / 255.0, 107.0 / 255.0, 136.0 / 255.0),
        vec3(111.0 / 255.0, 176.0 / 255.0, 255.0 / 255.0),
        (v_position.y + 1.0) * 0.5
    ), 1.0);
}`;class st{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"matrix");a(this,"shader");a(this,"uniforms");this.vao=null,this.matrix=M.identity(),this.vertexCount=0,this.shader=null,this.uniforms={}}async load(t){const i=Z(1);this.vertexCount=i.triangles.length*3,this.shader=T.loadShader(t,Ct,Dt),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),T.loadAttribute(t,"a_position",this.shader,i.points,3,t.FLOAT,!1);const n=["u_view_projection_matrix","u_matrix"];for(const e of n)this.uniforms[e]=t.getUniformLocation(this.shader,e)}render(t,i){t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,i.matrix),t.uniformMatrix4fv(this.uniforms.u_matrix,!1,this.matrix.matrix),t.drawArrays(t.LINE_STRIP,0,this.vertexCount)}}async function Xt(r,t){const i=new st,n=new st;await i.load(r),await n.load(r);const e=new _t(20*Math.PI/180,1,w.radius*8,w.radius*12);e.position.set(0,3185,5516),e.lookAt(_.zero());let o=0;const s=G.identity();let c=e.viewProjectionMatrix();const m=1e3/60;let u=0,l=window.performance.now(),d=0;function x(p){T.loading.status&&requestAnimationFrame(x),u=p,d=u-l,!(d<m)&&(l=u-d%m,r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT),T.resizeToScreen(r),e.aspect=t.width/t.height,e.fov=Math.sin(w.radius*1.4/(w.radius*10))*2,t.height>t.width&&(e.fov*=t.height/t.width),e.updateProjectionMatrix(),c=e.viewProjectionMatrix(),o+=25*d/1e3%360,i.matrix.identity().multiply(s.setAxisAngle(_.front,-23.5*Math.PI/180).matrix()).multiply(s.setAxisAngle(_.up,o*Math.PI/180).matrix()).scale(w.radius,w.radius,w.radius),n.matrix.identity().copy(i.matrix).scale(.3,.3,.3),i.render(r,c),n.render(r,c))}x(0)}var Ft=`#version 300 es

precision highp float;
precision highp int;

in vec4 a_position;

out vec3 v_model_normal;
out vec3 v_matrix_normal;
out vec4 v_position;

uniform mat4 u_view_projection_matrix;
uniform mat4 u_matrix;

void main() {
    v_model_normal = a_position.xyz;
    v_matrix_normal = mat3(u_matrix) * a_position.xyz;
    v_position = u_matrix * a_position;
    gl_Position = u_view_projection_matrix * u_matrix * a_position;
}`,jt=`#version 300 es

precision highp float;
precision highp int;

out vec4 fragColor;

in vec3 v_model_normal;
in vec3 v_matrix_normal;
in vec4 v_position;

uniform sampler2D u_moon_texture;
uniform vec3 u_light_direction;

const float gamma = 2.2;
#define PI 3.1415926535898

void main() {

    vec3 normal = normalize(v_matrix_normal);
    vec3 light_direction = normalize(u_light_direction);

    
    vec3 model_normal = normalize(v_model_normal);
    vec2 uv = vec2(
        (atan(model_normal.x, model_normal.z) / PI + 1.0) / 2.0,
        asin(model_normal.y) / -PI + 0.5
    );

    
    float diffuse_intensity = 1.0;
    float diffuse_light = diffuse_intensity * pow(
        max(0.0, dot(normal, -light_direction)),
        gamma
    );

    
    float ambient_light = 0.0001;

    
    uv = vec2(uv.x + 0.25, uv.y);
    vec3 moon_surface = pow(texture(u_moon_texture, uv).rgb, vec3(gamma));
    moon_surface =
        (moon_surface * diffuse_light) +
        (moon_surface * ambient_light);

    vec4 output_color = vec4(1.0, 0.0, 0.0, 1.0);
    output_color.rgb = moon_surface;

    
    output_color.rgb = output_color.rgb / (output_color.rgb + vec3(1.0));

    
    output_color.rgb = pow(output_color.rgb, vec3(1.0 / gamma));

    fragColor = output_color;
}`;const at=G.identity(),J=G.identity(),O=class O{constructor(){a(this,"vao");a(this,"vertexCount");a(this,"matrix");a(this,"shader");a(this,"uniforms");a(this,"angle");this.vao=null,this.matrix=M.identity(),this.vertexCount=0,this.shader=null,this.uniforms={},this.angle=0}async load(t){const i=Z(3);this.vertexCount=i.triangles.length*3,this.shader=T.loadShader(t,Ft,jt),this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),i.points.forEach((s,c,h)=>h[c]=s*O.radius),T.loadAttribute(t,"a_position",this.shader,i.points,3,t.FLOAT,!1),t.activeTexture(t.TEXTURE4);const n=await it("moon_2k.png"),e=t.createTexture();t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGB,t.RGB,t.UNSIGNED_BYTE,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT);const o=["u_time","u_view_projection_matrix","u_matrix","u_light_direction","u_camera_position","u_moon_texture"];for(const s of o)this.uniforms[s]=t.getUniformLocation(this.shader,s);t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform1i(this.uniforms.u_moon_texture,4)}render(t,i,n,e,o){this.angle+=.5*i/1e3%360,at.identity().multiply(J.setAxisAngle(_.right,O.inclination*Math.PI/180)).multiply(J.setAxisAngle(_.up,this.angle*Math.PI/180)).multiply(J.setAxisAngle(_.front,O.tilt*Math.PI/180)),this.matrix.identity().multiply(at.matrix()).translate(O.distance,0,0),t.useProgram(this.shader),t.bindVertexArray(this.vao),t.uniform3f(this.uniforms.u_light_direction,e.x,e.y,e.z),t.uniform3f(this.uniforms.u_camera_position,o.x,o.y,o.z),t.uniformMatrix4fv(this.uniforms.u_view_projection_matrix,!1,n.matrix),t.uniformMatrix4fv(this.uniforms.u_matrix,!1,this.matrix.matrix),t.drawArrays(t.TRIANGLES,0,this.vertexCount)}};a(O,"radius",w.radius*.2727),a(O,"inclination",5.145),a(O,"tilt",6.68),a(O,"distance",38440/10);let nt=O,f,Y;const ct=new w,ht=new K,ut=new nt,Nt=new gt,mt=new St;async function Bt(){const r=T.init(2e3,2e3);if(!r){document.getElementById("loading-bar").innerText="error: webgl2 not available!";return}f=r,Y=f.canvas,document.getElementById("webgl-canvas").appendChild(Y),Xt(f,Y),await Ot()}async function Ot(){await ct.load(f),T.loading.progress+=2,T.updateLoading(),await ut.load(f),await ht.load(f),await Nt.load(f),await mt.load(f),xt(),T.loading.status=!1,document.getElementById("loading").style.display="none",document.getElementById("content").style.display="block",setTimeout(()=>{document.getElementById("controls").classList.add("fade-out")},5e3),f.enable(f.CULL_FACE),f.enable(f.DEPTH_TEST);const r=new _t(20*Math.PI/180,1,w.radius*3,w.radius*28),t=new tt;t.distance=w.radius*10,t.angle={x:-30,y:-24},t.updateCamera(r);let i=r.viewProjectionMatrix();const n=new _(1e3,0,w.radius+1e3),e=_.zero().subtract(n),s=1e3/60;let c=0,h=window.performance.now();const m=h;let u=0,l=0,d=0,x=0;const p=document.getElementById("fps");function y(E){requestAnimationFrame(y),c=E,u=c-h,!(u<s)&&(h=c-u%s,l=c-m,d=Math.round(1e3/(l/++x)*100)/100,p.innerHTML=`${d}fps`,f.clearColor(0,0,0,1),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT),t.angle.x=(t.angle.x-.1*u/1e3)%360,t.updateCamera(r),T.resizeToScreen(f),r.aspect=Y.width/Y.height,r.fov=Math.sin(w.radius*1.4/t.distance)*2,Y.height>Y.width&&(r.fov*=Y.height/Y.width),r.fov+=t.fovDelta,t.handleInput(r),t.angle.x=(t.angle.x-.01*u/1e3)%360,t.updateCamera(r),r.updateProjectionMatrix(),i=r.viewProjectionMatrix(),ut.render(f,u,i,e,r.position),ct.render(f,u,i,e,r.position),f.enable(f.BLEND),f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA),mt.render(f,i),f.blendFunc(f.ONE,f.ONE),ht.render(f,i,e,r.position),f.disable(f.BLEND))}y(0)}Bt();document.getElementById("controls-btn").addEventListener("click",()=>{document.getElementById("controls").classList.remove("fade-out"),setTimeout(()=>{document.getElementById("controls").classList.add("fade-out")},5e3)});document.getElementById("about-btn").addEventListener("click",()=>{document.getElementById("about").style.display="block"});document.getElementById("close-about-btn").addEventListener("click",()=>{document.getElementById("about").style.display="none"});
