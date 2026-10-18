import type {PerspectiveCamera} from "three";
import {proyectar,type Punto3D} from "./mundo.ts";
export type VolumenS06={p:Punto3D;t:Punto3D};
export function verticesS06(v:VolumenS06):Punto3D[]{
 const [x,y,z]=v.p,[w,h,d]=v.t;
 return [[x-w/2,y,z-d/2],[x+w/2,y,z-d/2],[x+w/2,y+h,z-d/2],[x-w/2,y+h,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y+h,z+d/2],[x-w/2,y+h,z+d/2]];
}
export function cajaVolumenS06(c:PerspectiveCamera,v:VolumenS06){const p=verticesS06(v).map(q=>proyectar(c,q));return[Math.min(...p.map(q=>q.x)),Math.min(...p.map(q=>q.y)),Math.max(...p.map(q=>q.x)),Math.max(...p.map(q=>q.y))];}
export function carasS06(c:PerspectiveCamera,v:VolumenS06){
 const p=verticesS06(v).map(q=>proyectar(c,q));
 const faces=[c.position.z>v.p[2]?[4,5,6,7]:[0,1,2,3],c.position.x>v.p[0]?[1,5,6,2]:[0,4,7,3],[3,2,6,7]];
 return faces.map(f=>f.map(i=>`${p[i].x},${p[i].y}`).join(" "));
}
