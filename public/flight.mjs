// A deliberately decoupled teaching model, not a flight or crash simulator.
export const flightGravity=9.80665;
export const flightTitle={en:'Roadster · Flip & landing',zh:'Roadster · 翻转与着陆'};
export const flightAssumptions={
 en:'Hypothetical rigid body, one pitch axis, constant I=mk² and g=9.80665 m/s². Ballistic center of mass returns to its takeoff reference height; no drag, lift or horizontal motion. A starts already spinning; B assumes an ideal external pure torque couple with no net force. Takeoff/spin-up mechanisms and actuator capability are not modeled. Contact is a separate vertical-only, no-rebound stopping model. Pitch/contact coupling, tire geometry, suspension, structure and occupant loads are omitted. Rotation is not simulated after touchdown; A’s residual spin is unresolved. Upright orientation or lower force does not establish a safe or feasible landing. No Tesla measurements/specifications; schematic not to scale.',
 zh:'假想刚体，仅一个俯仰转轴，I=mk² 恒定，g=9.80665 m/s²。质心按抛体运动回到起飞参考高度；无阻力、升力或水平运动。A 起飞时已在旋转；B 假设存在合力为零的理想外力偶。起飞、初始旋转机制与执行器能力不在模型内。接触阶段是独立的一维竖直制停模型，无反弹。不模拟俯仰与接触耦合、轮胎几何、悬架、结构或乘员载荷。接地后不再模拟旋转；A 的剩余旋转未解决。姿态回正或力较小不证明安全或可行。不是 Tesla 实测数据或规格；示意图不按比例。',
};
const catalog=new Map();
const idFor=s=>`flight-${s.massKg}-${s.airtime}-${s.radius}-${s.separation}-${s.stopTime}-${s.landingProfile}`;
for(const massKg of [1200,2000,2800])for(const airtime of [1,1.5,2])for(const radius of [.6,.9,1.2])
for(const separation of [.5,1,1.5])for(const stopTime of [.05,.15,.3,.6])for(const landingProfile of ['constant','pulse']){
 const s={massKg,airtime,radius,separation,stopTime,landingProfile};s.id=idFor(s);catalog.set(s.id,s);
}
for(const [variant,settings]of Object.entries({default:{massKg:1500,airtime:1.2,radius:.8,separation:.75,stopTime:.2,landingProfile:'constant'},alternate:{massKg:1000,airtime:1,radius:.6,separation:1,stopTime:.4,landingProfile:'pulse'}})){
 const s={...settings,id:`flight-transfer-${variant}`};catalog.set(s.id,s);
}
export function flightFormula(id){if(!catalog.has(id))throw new Error('Unknown flight scenario.');return structuredClone(catalog.get(id));}
export function flightScenario(config={},variant=null){
 if(!config||typeof config!=='object'||Array.isArray(config)||Object.keys(config).some(k=>!['massKg','airtime','radius','separation','stopTime','landingProfile'].includes(k)))throw new Error('Invalid flight settings.');
 const s={massKg:2000,airtime:1.5,radius:.9,separation:1,stopTime:.3,landingProfile:'pulse',...config};
 if(!catalog.has(idFor(s))||Object.values(s).some(v=>typeof v!=='number'&&typeof v!=='string'))throw new Error('Unsupported flight settings.');
 // Numeric strings must not alias a catalog entry through string interpolation.
 if(['massKg','airtime','radius','separation','stopTime'].some(k=>typeof s[k]!=='number'))throw new Error('Use numeric flight settings.');
 if(variant!==null&&!['default','alternate'].includes(variant))throw new Error('Unknown flight transfer.');
 return flightFormula(variant?`flight-transfer-${variant}`:idFor(s));
}
function validate(s){
 const c=catalog.get(s?.id);
 if(!c||Object.keys(c).some(k=>s[k]!==c[k]))throw new Error('Changed flight scenario.');
}
function inRange(t,end){if(!Number.isFinite(t)||t<0||t>end)throw new Error('Outside the modeled interval.');}
export function rotationAt(s,mode,t){
 validate(s);inRange(t,s.airtime);if(!['coast','controlled'].includes(mode))throw new Error('Unknown rotation.');
 const u=t/s.airtime,T=s.airtime,I=s.massKg*s.radius**2,angleBase=2*Math.PI*u;
 if(mode==='coast')return {angle:angleBase,omega:2*Math.PI/T,alpha:0,torque:0,coupleForce:0};
 const sin=u===0||u===1?0:Math.sin(angleBase),cos=Math.cos(angleBase);
 const alpha=4*Math.PI**2/T**2*sin,torque=I*alpha;
 return {angle:angleBase-sin,omega:2*Math.PI/T*(1-cos),alpha,torque,coupleForce:Math.abs(torque)/s.separation};
}
export function contactAt(s,elapsed){
 validate(s);inRange(elapsed,s.stopTime);
 const q=elapsed/s.stopTime,U=flightGravity*s.airtime/2,D=s.stopTime,angle=2*Math.PI*q;
 const sin=q===0||q===1?0:Math.sin(angle),cos=Math.cos(angle);
 const pulse=s.landingProfile==='pulse';
 const netAcceleration=U/D*(pulse?1-cos:1);
 return {netAcceleration,contactForce:s.massKg*(flightGravity+netAcceleration),
  verticalVelocity:U*(-1+q-(pulse?sin/(2*Math.PI):0)),
  height:U*D*(-q+q*q/2+(pulse?(cos-1)/(4*Math.PI**2):0))};
}
export function flightAt(s,t){
 validate(s);inRange(t,s.airtime+s.stopTime);
 if(t<=s.airtime)return {phase:'flight',height:flightGravity*t*(s.airtime-t)/2,verticalVelocity:flightGravity*(s.airtime/2-t),contactForce:0,netAcceleration:-flightGravity};
 // Clamp only floating-point subtraction at an already validated endpoint.
 return {phase:'contact',...contactAt(s,Math.min(s.stopTime,t-s.airtime))};
}
export function flightSummary(s){
 validate(s);
 const g=flightGravity,I=s.massKg*s.radius**2,U=g*s.airtime/2,weight=s.massKg*g;
 const peakTorque=I*4*Math.PI**2/s.airtime**2,omegaA=2*Math.PI/s.airtime;
 return {inertia:I,weight,launchSpeed:U,impactSpeed:U,apexHeight:g*s.airtime**2/8,
  peakTorque,peakCoupleForce:peakTorque/s.separation,peakOmegaB:4*Math.PI/s.airtime,
  touchdownOmegaA:omegaA,touchdownOmegaB:0,netAngularImpulseB:0,
  residualEnergyA:.5*I*omegaA**2,residualEnergyB:0,
  netLandingImpulse:s.massKg*U,contactImpulse:s.massKg*U+weight*s.stopTime,
  averageContactForce:weight+s.massKg*U/s.stopTime,
  peakContactForce:weight+(s.landingProfile==='pulse'?2:1)*s.massKg*U/s.stopTime,
  stoppingTravel:U*s.stopTime/2};
}
