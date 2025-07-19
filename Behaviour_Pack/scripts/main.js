console.warn("main.js détecté");

import { world, system } from "@minecraft/server";
import { pickRandom } from 'levels.js';

var isBroken = false;
var isOn = false;
var isOnpos = {x:0.5, y:1, z:0.5}

world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  if(block.x == 0 && block.y == 0 && block.z == 0){
    isBroken = true;
    const ppos = event.player.location;
    if( -0.28 < ppos.x && ppos.x < 1.28 && Math.round(ppos.y) == 1  && -0.28 < ppos.z && ppos.z < 1.28){
      isOn = true
      isOnpos.x = ppos.x
      isOnpos.z = ppos.z
    }
  }

}); 


world.afterEvents.playerBreakBlock.subscribe((event) => {
  if(isBroken){
    system.run(() => {
      const pos = { x: 0, y: 0, z: 0 };
      const randomElement = pickRandom()
      world.getDimension("overworld").setBlockType(pos, randomElement)
      if(isOn){
        event.player.teleport(isOnpos, {dimension: world.getDimension("overworld")})
        isOn = false;
      }
      isBroken = false;
    });
  }

});
