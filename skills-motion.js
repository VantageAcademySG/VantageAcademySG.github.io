// Four distinct, articulated basketball demonstrations, drawn locally.
(()=>{
const canvas=document.querySelector('#skill-animation'),ctx=canvas.getContext('2d'),phase=document.querySelector('#animation-phase');if(!ctx)return;
const W=900,H=390,C={navy:'#0e293a',line:'#5288a1',skin:'#d69c76',cream:'#fff9e9',orange:'#f47708',blue:'#77bce2'};
let mode=0,time=0,last=0,visible=false,lastPhase='';const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function line(points,color,width=3,dash=[]){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash(dash);points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.setLineDash([]);}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.fillStyle=color;ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function ball(x,y,r=13,rotation=0){ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ellipse(0,0,r,r,C.orange);ctx.strokeStyle='#ffa552';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();line([[-r,0],[r,0]],'#873900',1.3);ctx.beginPath();ctx.ellipse(0,0,r*.42,r,0,0,Math.PI*2);ctx.strokeStyle='#873900';ctx.stroke();ctx.restore();}
function text(t,x,y,size=14,color=C.cream,align='left'){ctx.fillStyle=color;ctx.font=`600 ${size}px "DM Sans", Arial`;ctx.textAlign=align;ctx.fillText(t,x,y);ctx.textAlign='left';}
function arrow(x1,y1,x2,y2,color=C.blue){line([[x1,y1],[x2,y2]],color,2,[6,7]);const a=Math.atan2(y2-y1,x2-x1);line([[x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4)],[x2,y2],[x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4)]],color,2);}
function floor(){ctx.clearRect(0,0,W,H);const g=ctx.createLinearGradient(0,270,0,365);g.addColorStop(0,'#295568');g.addColorStop(1,'#163e53');ctx.fillStyle=g;ctx.fillRect(0,300,W,90);line([[45,300],[855,300]],'#7bb2ca',2);line([[90,350],[810,350]],'#3a6b82',1);ctx.globalAlpha=.35;line([[130,300],[55,370]],C.line,1);line([[770,300],[850,370]],C.line,1);ctx.globalAlpha=1;}
function shoe(x,y,flip=false,active=false){ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.fillStyle=active?C.orange:C.cream;ctx.beginPath();ctx.moveTo(-8,-7);ctx.lineTo(5,-7);ctx.lineTo(16,-1);ctx.quadraticCurveTo(22,6,13,6);ctx.lineTo(-10,6);ctx.closePath();ctx.fill();line([[-9,6],[16,6]],C.navy,2);ctx.restore();}
function player({x=350,y=297,bend=0,lean=0,leftFoot=null,rightFoot=null,leftArm=null,rightArm=null,jersey=C.blue,jump=0}){
 const hip=[x+lean,y-72-jump-bend],neck=[x+lean,y-145-jump-bend],lsh=[neck[0]-20,neck[1]+12],rsh=[neck[0]+20,neck[1]+12];
 const lf=leftFoot||[x-28,y-jump],rf=rightFoot||[x+30,y-jump];const lk=[(hip[0]+lf[0])/2-11,(hip[1]+lf[1])/2],rk=[(hip[0]+rf[0])/2+8,(hip[1]+rf[1])/2];
 ellipse(x,y+7,48,7,'#06182255');line([[hip[0]-12,hip[1]+8],lk,lf],C.skin,12);line([[hip[0]+12,hip[1]+8],rk,rf],C.skin,12);shoe(...lf,true);shoe(...rf);
 const la=leftArm||[[lsh[0]-15,lsh[1]+34],[lsh[0]-4,lsh[1]+64]],ra=rightArm||[[rsh[0]+15,rsh[1]+34],[rsh[0]+5,rsh[1]+64]];
 line([lsh,...la],C.skin,11);line([rsh,...ra],C.skin,11);ellipse(...la[1],7,7,C.skin);ellipse(...ra[1],7,7,C.skin);
 ctx.fillStyle=jersey;ctx.beginPath();ctx.moveTo(lsh[0],lsh[1]-4);ctx.lineTo(rsh[0],rsh[1]-4);ctx.lineTo(hip[0]+20,hip[1]);ctx.lineTo(hip[0]-20,hip[1]);ctx.closePath();ctx.fill();
 ctx.fillStyle=C.navy;ctx.fillRect(hip[0]-21,hip[1]-1,42,26);line([[hip[0],hip[1]+7],[hip[0],hip[1]+26]],'#7297ad',2);text('7',neck[0],neck[1]+49,23,C.navy,'center');line([[neck[0],neck[1]-4],[neck[0],neck[1]+5]],C.skin,10);ellipse(neck[0],neck[1]-22,15,19,C.skin);ctx.fillStyle='#12212a';ctx.beginPath();ctx.arc(neck[0],neck[1]-28,15,Math.PI,Math.PI*2);ctx.lineTo(neck[0]+14,neck[1]-21);ctx.lineTo(neck[0]-14,neck[1]-29);ctx.closePath();ctx.fill();
 return {neck,lsh,rsh,hip};
}
function hoop(){line([[753,80],[753,300]],'#6594ac',7);ctx.fillStyle='#e9f2f714';ctx.fillRect(690,62,91,58);ctx.strokeStyle=C.blue;ctx.lineWidth=3;ctx.strokeRect(690,62,91,58);ctx.strokeRect(710,83,38,29);line([[722,113],[680,113]],C.orange,4);line([[684,116],[691,147],[710,147],[719,116]],'#d5e8f2',2);for(let x=688;x<717;x+=7)line([[x,117],[x+3,146]],'#a8cad9',1);line([[687,131],[715,131]],'#a8cad9',1);}
function caption(value){if(value!==lastPhase){phase.textContent=value;lastPhase=value;}}
function dribble(t){floor();const cycle=t%4,u=cycle/4,side=Math.cos(t*Math.PI/2)>=0?1:-1,b=Math.abs(Math.sin(t*Math.PI*2));const bx=450+56*Math.cos(t*Math.PI/2),by=235+50*b;const hand=[450+47*Math.cos(t*Math.PI/2),222+10*b];player({x:450,bend:6,lean:side*5,leftArm:side<0?[[409,205],hand]:[[408,197],[418,225]],rightArm:side>0?[[490,203],hand]:[[492,192],[481,214]]});ellipse(bx,301,12*(1-b*.5),3,'#081e2b60');ball(bx,by,13,t*2);text('Keep a balanced stance',120,115,16,C.blue);text('Push the ball down. Receive the bounce.',120,139,12,'#a6c4d3');arrow(530,242,530,281,C.orange);caption(side>0?'RIGHT-HAND CONTROL':'CROSSOVER → LEFT-HAND CONTROL');}
function shooting(t){floor();hoop();const u=(t%5)/5;const lift=u<.18?0:u<.32?(u-.18)/.14:u<.65?1:Math.max(0,1-(u-.65)/.18);const jump=Math.sin(Math.min(1,Math.max(0,(u-.18)/.6))*Math.PI)*13;
 const hand=[350-10*lift,192-83*lift-jump];player({x:310,jump,bend:-(1-lift)*8,leftArm:[[295,174-29*lift-jump],[hand[0]-9,hand[1]+8]],rightArm:[[348,174-27*lift-jump],hand],jersey:C.blue});
 let bx=hand[0]+3,by=hand[1]-13;
 if(u>=.32&&u<.76){const f=(u-.32)/.44;bx=343+(701-343)*f;by=96+17*f-70*4*f*(1-f);caption('RELEASE → SMOOTH ARC');}
 else if(u>=.76&&u<.91){const f=(u-.76)/.15;bx=701;by=114+171*f*f;caption('FOLLOW THROUGH → LAND BALANCED');}
 else if(u>=.91){bx=701;by=282;caption('RESET FOR THE NEXT REP');}
 else caption(u<.18?'BALANCED GATHER':'EXTEND → RELEASE');ball(bx,by,12,t*2);text('Balance • rhythm • follow-through',65,65,15,C.blue);}
function footwork(t){floor();const u=(t%6)/6;let step;if(u<.2)step=0;else if(u<.5)step=(u-.2)/.3;else if(u<.75)step=1;else step=1-(u-.75)/.25;const px=430,py=296;const moving=[490+55*Math.sin(step*Math.PI*.75),296-40*Math.sin(step*Math.PI)];const torso=461+20*step;
 ellipse(px,py+5,23,10,'#f4770833');ctx.strokeStyle=C.orange;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(px,py+5,23,10,0,0,Math.PI*2);ctx.stroke();player({x:torso,leftFoot:[px,py],rightFoot:moving,lean:-5,bend:5,leftArm:[[435+20*step,197],[470+20*step,201]],rightArm:[[494+20*step,192],[478+20*step,211]]});ball(475+20*step,204,12,step);text('PIVOT FOOT',px-35,330,10,C.orange);arrow(550,279,579,254);text('One foot stays planted.',115,105,17,C.blue);text('The other steps into space.',115,130,13,'#a6c4d3');caption(u<.2?'CONTROLLED STOP':u<.5?'PLANT → PIVOT':u<.75?'STEP INTO SPACE':'RESET WITH BALANCE');}
function marker(x,y,label,color,defender=false){ellipse(x+3,y+5,19,19,'#06182250');ellipse(x,y,18,18,color);ctx.strokeStyle=defender?'#ffffff88':'#d5e8f2';ctx.lineWidth=2;ctx.stroke();text(label,x,y+5,12,defender?C.cream:C.navy,'center');}
function gameIQ(t){ctx.clearRect(0,0,W,H);ctx.fillStyle='#123b50';ctx.fillRect(75,42,750,286);ctx.strokeStyle='#6ca9ca';ctx.lineWidth=2;ctx.strokeRect(75,42,750,286);line([[450,42],[450,328]],C.line,2);ctx.beginPath();ctx.arc(450,185,48,0,Math.PI*2);ctx.stroke();ctx.strokeRect(695,113,130,145);ctx.beginPath();ctx.arc(695,185,70,Math.PI/2,Math.PI*1.5);ctx.stroke();line([[805,168],[805,202]],C.orange,3);
 const u=(t%7)/7,cut=Math.min(1,Math.max(0,(u-.13)/.3)),rx=590+cut*85,ry=263-cut*124;const dx=535+Math.sin(u*Math.PI*2)*17,dy=179;
 const afterPass=Math.max(0,(u-.72)/.28);marker(388+afterPass*90,177+afterPass*80,'1',C.blue);marker(rx,ry,'2',C.blue);marker(580,84,'3',C.blue);marker(dx,dy,'D','#668291',true);marker(699,184,'D','#668291',true);
 if(u<.17){ctx.strokeStyle='#f4770877';ctx.lineWidth=2;ctx.beginPath();ctx.arc(388,177,35+Math.sin(u*20)*4,-.8,.8);ctx.stroke();caption('SCAN → READ THE DEFENDER');}
 else if(u<.43){arrow(590,260,670,145);caption('TEAMMATE CUTS INTO OPEN SPACE');}
 else caption(u<.72?'PASS TO THE OPEN TEAMMATE':'MOVE AFTER THE PASS');
 let bx=414,by=177;if(u>=.43&&u<.72){const p=(u-.43)/.29;bx=414+(rx-414)*p;by=177+(ry-177)*p;arrow(424,177,rx-23,ry,C.orange);}else if(u>=.72){bx=rx;by=ry-23;const move=(u-.72)/.28;arrow(390,205,461,251);}
 ball(bx,by,10,t);text('BLUE = TEAMMATES',102,66,10,C.blue);text('GREY = DEFENDERS',102,85,10,'#a6c4d3');}
const draws=[dribble,shooting,footwork,gameIQ],labels=['Animated player dribbling the ball with a right-to-left crossover','Animated player gathering, releasing a shot toward the hoop, and following through','Animated player planting a pivot foot and stepping into space while holding the ball','Animated teammates reading a defender, cutting into space, passing and moving'];
function draw(){draws[mode](time);}
function frame(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(visible&&!reducedMotion.matches&&!document.documentElement.classList.contains('motion-paused')){time+=dt;draw();}requestAnimationFrame(frame);}
addEventListener('skill-change',e=>{mode=Number(e.detail);time=mode===1?1.9:mode===3?3.3:.6;canvas.setAttribute('aria-label',labels[mode]);draw();});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.05}).observe(canvas);reducedMotion.addEventListener('change',draw);draw();requestAnimationFrame(frame);
})();
