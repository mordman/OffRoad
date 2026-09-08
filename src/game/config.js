export const WATER_Y=0;
export const START_COORDS=Object.freeze({x:-60,y:0,z:60});
export const CYCLE=21600;
export const WEATHERS=Object.freeze({
  clear:{rain:0,storm:0,wind:0.22,label:'ЯСНО'},
  rain:{rain:0.75,storm:0.15,wind:0.5,label:'ДОЖДЬ'},
  storm:{rain:1,storm:1,wind:1.05,label:'ГРОЗА'}
});