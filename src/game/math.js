export const clamp=(value,min,max)=>value<min?min:value>max?max:value;
export const lerp=(from,to,amount)=>from+(to-from)*amount;
export const damp=(from,to,lambda,dt)=>lerp(from,to,1-Math.exp(-lambda*dt));
export const smoothstep=(from,to,value)=>{
  const normalized=clamp((value-from)/(to-from),0,1);
  return normalized*normalized*(3-2*normalized);
};
export const wrapPI=angle=>{
  while(angle>Math.PI)angle-=Math.PI*2;
  while(angle<-Math.PI)angle+=Math.PI*2;
  return angle;
};
export const pad2=value=>String(value).padStart(2,'0');

export function mulberry32(seed){
  let state=seed>>>0;
  return()=>{
    state|=0;
    state=state+0x6D2B79F5|0;
    let value=Math.imul(state^state>>>15,1|state);
    value=value+Math.imul(value^value>>>7,61|value)^value;
    return((value^value>>>14)>>>0)/4294967296;
  };
}

export function hash2i(i,j,seed){
  let hash=(i*374761393+j*668265263+seed*1442695041)|0;
  hash=Math.imul(hash^hash>>>13,1274126177);
  hash^=hash>>>16;
  return(hash>>>0)/4294967296;
}

export class Simplex{
  constructor(random){
    this.permutation=new Uint8Array(512);
    const source=new Uint8Array(256);
    for(let index=0;index<256;index++)source[index]=index;
    for(let index=255;index>0;index--){
      const swap=(random()*(index+1))|0;
      const value=source[index];
      source[index]=source[swap];
      source[swap]=value;
    }
    for(let index=0;index<512;index++)this.permutation[index]=source[index&255];
  }
  noise(xInput,yInput){
    const permutation=this.permutation,F2=0.36602540378,G2=0.2113248654;
    const skew=(xInput+yInput)*F2;
    const i=Math.floor(xInput+skew),j=Math.floor(yInput+skew);
    const unskew=(i+j)*G2,x0=xInput-(i-unskew),y0=yInput-(j-unskew);
    const firstX=x0>y0?1:0,firstY=x0>y0?0:1;
    const x1=x0-firstX+G2,y1=y0-firstY+G2;
    const x2=x0-1+2*G2,y2=y0-1+2*G2;
    const ii=i&255,jj=j&255;
    let value=0,falloff=0.5-x0*x0-y0*y0;
    if(falloff>0){falloff*=falloff;value+=falloff*falloff*this.gradient(permutation[ii+permutation[jj]],x0,y0);}
    falloff=0.5-x1*x1-y1*y1;
    if(falloff>0){falloff*=falloff;value+=falloff*falloff*this.gradient(permutation[ii+firstX+permutation[jj+firstY]],x1,y1);}
    falloff=0.5-x2*x2-y2*y2;
    if(falloff>0){falloff*=falloff;value+=falloff*falloff*this.gradient(permutation[ii+1+permutation[jj+1]],x2,y2);}
    return 70*value;
  }
  gradient(hash,x,y){
    hash&=7;
    const first=hash<4?x:y,second=hash<4?y:x;
    return((hash&1)?-first:first)+((hash&2)?-2*second:2*second);
  }
}

export function fbm(noise,x,y,octaves){
  let amplitude=0.5,frequency=1,total=0,norm=0;
  for(let octave=0;octave<octaves;octave++){
    total+=amplitude*noise.noise(x*frequency,y*frequency);
    norm+=amplitude;
    amplitude*=0.5;
    frequency*=2.03;
  }
  return total/norm;
}