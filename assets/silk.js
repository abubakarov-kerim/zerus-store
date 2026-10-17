/* ============================================================
   Technic Store — живой фон «шёлк» (WebGL)
   Идея — референс Silk Aurora (21st.dev): тёмные атласные складки,
   жемчужный отлив, зерно плёнки, реакция на курсор.
   Код написан с нуля. Цвета берутся из палитры (--s0..--s3).
   Экономия: низкое разрешение, пауза вне экрана и в фоне,
   при «уменьшить движение» — один статичный кадр.
============================================================ */
(function(){
  "use strict";
  var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uLight;',
    'uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    ' return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);',
    ' for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}',
    'float silk(vec2 p,float t){',
    ' vec2 q=vec2(fbm(p*.85+vec2(0.,t*.6)),fbm(p*.85+vec2(5.2,-t*.5)));',
    ' vec2 w=p+.7*q+uMouse*.10;',
    ' float d=w.x*.55+w.y*1.1;',
    ' return sin(d*2.6+t*1.3+1.5*fbm(w*1.15-t*.3));}',
    'void main(){',
    ' vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    ' float t=uTime*.075;',
    ' float e=2./uRes.y;',
    ' float h=silk(p,t),hx=silk(p+vec2(e,0.),t),hy=silk(p+vec2(0.,e),t);',
    ' vec3 n=normalize(vec3(-(hx-h)/e*.4,-(hy-h)/e*.4,1.));',
    ' vec3 L=normalize(vec3(-.35+uMouse.x*.45,.55+uMouse.y*.35,.85));',
    ' float diff=dot(n,L)*.5+.5;',
    ' float spec=pow(max(dot(n,normalize(L+vec3(0.,0.,1.))),0.),24.);',
    ' float fold=h*.5+.5;',
    ' float band=p.y-p.x*.42+.06+.16*sin(p.x*1.4+t*1.8);',
    ' float m=smoothstep(1.05,0.,abs(band))*smoothstep(-1.15,.25,p.x);',
    ' vec3 col=mix(uC0,uC1,m*.92);',
    ' col=mix(col,uC2,m*pow(diff,1.7)*(.35+.65*fold)*.92);',
    ' col+=uC3*spec*m*(uLight>.5?.42:.78);',
    ' col=mix(col,uC3,pow(fold,9.)*m*.07);',
    ' col=mix(col,uC0,smoothstep(.5,1.35,length(p*vec2(.78,1.)))*.62);',
    ' col+=(hash(gl_FragCoord.xy+fract(uTime*.37)*91.)-.5)*(uLight>.5?.022:.034);',
    ' gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  function hex(c){
    c=(c||'').trim().replace('#','');
    if(c.length===3) c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
    var n=parseInt(c,16); if(isNaN(n)) return [0,0,0];
    return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];
  }
  function readColors(){
    var cs=getComputedStyle(document.documentElement);
    return { c:[hex(cs.getPropertyValue('--s0')),hex(cs.getPropertyValue('--s1')),hex(cs.getPropertyValue('--s2')),hex(cs.getPropertyValue('--s3'))],
             light: document.documentElement.getAttribute('data-theme')==='light' ? 1 : 0 };
  }

  function mount(canvas, opts){
    opts=opts||{};
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gl=null;
    try{ gl=canvas.getContext('webgl',{antialias:false,alpha:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power',preserveDrawingBuffer:false}); }catch(e){}
    if(!gl){ canvas.classList.add('nogl'); return null; }

    function sh(type,src){ var s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ throw new Error(gl.getShaderInfoLog(s)); } return s; }
    var prog;
    try{
      prog=gl.createProgram();
      gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));
      gl.linkProgram(prog);
      if(!gl.getProgramParameter(prog,gl.LINK_STATUS)) throw new Error('link');
    }catch(e){ canvas.classList.add('nogl'); return null; }
    gl.useProgram(prog);
    var buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(prog,'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var U={}; ['uRes','uTime','uMouse','uLight','uC0','uC1','uC2','uC3'].forEach(function(k){ U[k]=gl.getUniformLocation(prog,k); });

    var col=readColors(), from=col, to=col, mixT=1;
    var cur={c:col.c.map(function(a){return a.slice();}),light:col.light};
    var mouse=[0,0], target=[0,0], time=opts.start||14, last=0, running=false, visible=true, raf=0, scale=opts.scale||0.6;

    function resize(){
      var dpr=Math.min(window.devicePixelRatio||1,1.5);
      var w=Math.max(2,Math.round(canvas.clientWidth*dpr*scale)), h=Math.max(2,Math.round(canvas.clientHeight*dpr*scale));
      if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
      if(!running) draw();
    }
    function lerp(a,b,k){ return a+(b-a)*k; }
    function draw(){
      if(mixT<1){
        mixT=Math.min(1,mixT+0.045); var k=mixT*mixT*(3-2*mixT);
        for(var i=0;i<4;i++) for(var j=0;j<3;j++) cur.c[i][j]=lerp(from.c[i][j],to.c[i][j],k);
        cur.light = k>0.5 ? to.light : from.light;
      }
      mouse[0]=lerp(mouse[0],target[0],0.04); mouse[1]=lerp(mouse[1],target[1],0.04);
      gl.uniform2f(U.uRes,canvas.width,canvas.height);
      gl.uniform1f(U.uTime,time);
      gl.uniform2f(U.uMouse,mouse[0],mouse[1]);
      gl.uniform1f(U.uLight,cur.light);
      gl.uniform3fv(U.uC0,cur.c[0]); gl.uniform3fv(U.uC1,cur.c[1]); gl.uniform3fv(U.uC2,cur.c[2]); gl.uniform3fv(U.uC3,cur.c[3]);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }
    function loop(ts){
      raf=0; if(!running) return;
      var dt=last?Math.min((ts-last)/1000,0.05):0.016; last=ts;
      time+=dt; draw(); raf=requestAnimationFrame(loop);
    }
    function start(){ if(reduce||running||!visible||document.hidden) return; running=true; last=0; raf=requestAnimationFrame(loop); }
    function stop(){ running=false; if(raf) cancelAnimationFrame(raf); raf=0; }
    function recolor(){
      var n=readColors();
      from={c:cur.c.map(function(a){return a.slice();}),light:cur.light}; to=n; mixT=0;
      if(!running){ var steps=0; (function tick(){ draw(); if(mixT<1 && steps++<40) requestAnimationFrame(tick); })(); }
    }

    if(window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize',resize);
    if(window.IntersectionObserver) new IntersectionObserver(function(es){ visible=es[0].isIntersecting; visible?start():stop(); }).observe(canvas);
    document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });
    new MutationObserver(recolor).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-palette']});
    if(!reduce && window.matchMedia && matchMedia('(pointer:fine)').matches){
      window.addEventListener('pointermove',function(e){ target[0]=(e.clientX/window.innerWidth)*2-1; target[1]=-((e.clientY/window.innerHeight)*2-1); },{passive:true});
    }
    canvas.addEventListener('webglcontextlost',function(e){ e.preventDefault(); stop(); canvas.classList.add('nogl'); });

    resize(); draw();
    requestAnimationFrame(function(){ canvas.classList.add('on'); });
    start();
    return { stop:stop, start:start, recolor:recolor };
  }
  window.Silk={ mount:mount };
})();
