console.warn("main.js détecté");

import { world, system, ItemStack } from "@minecraft/server";
import { pickRandom, getLevelNumber, getLevelMaxBlock, upgradeLevel, getLevelChest } from 'levels.js';
import {setKey, getKey} from 'jsonstorage.js'
import { execute } from "levelCommand.js";

var isBroken = false;
var isOn = false;
var isOnpos = {x:0.5, y:1, z:0.5}

const blockPos = { x: 0, y: 0, z: 0 };
const onBlockPos = {x:0.5, y:1, z:0.5}
var ovworld = ""

system.run(() => {
  setKey("hasBegun", false)
  ovworld = world.getDimension("overworld")
});
//detect first connection and configure spawnpoint + teleportation
world.afterEvents.playerSpawn.subscribe((event) => {
  if(!getKey("hasBegun", false)){
    system.run(() => {
      setKey("level",1)
      setKey("lvlblocks",39)
      setKey("totalblocks",0)
      setKey("hasBegun", true)
      ovworld.setBlockType(blockPos, "minecraft:grass")
    });
  }
  const player = event.player
  if(event.initialSpawn){
    system.run(() => {
      player.teleport(onBlockPos)
      player.setSpawnPoint({dimension:ovworld, x:0.5, y:1, z:0.5})
    })
  }
});


//To show the information of the special block when the player is sneaking while looking towards it
var isSneaking = false
world.afterEvents.playerButtonInput.subscribe((event) => {
  const viewedBlockPos = event.player.getBlockFromViewDirection()
  if (viewedBlockPos != undefined && event.button == "Sneak" && viewedBlockPos.block.x == blockPos.x
   && viewedBlockPos.block.y == blockPos.y && viewedBlockPos.block.z == blockPos.z && !isSneaking){
    execute(event.player)
    isSneaking = true
  }else if( event.button == "Sneak" && isSneaking){
    isSneaking = false
  }
});

//Detect when the block is getting broken
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

function createChest(){
  const inv = ovworld.getBlock(blockPos).getComponent("minecraft:inventory")
  const inventoryContainer = inv.container
  const chestloots = getLevelChest()
  var i = 0

  chestloots.forEach(element => {
    const id = element[0]
    const proba = element[1]
    var amount = element[2]
    const maxamount = element[3]
    while (Math.random() < proba && amount < maxamount){
      amount++
    }
    const itm = new ItemStack(id, amount)
    inventoryContainer.setItem(i, itm);
    i+= 1
  });
}

//Do actions if the block is Broken
world.afterEvents.playerBreakBlock.subscribe((event) => {
  if(isBroken){
    const randomElement = pickRandom()
    system.run(() => {
      //Teleport drops to prevent it from disapear due to block replacement
      const entities = ovworld.getEntitiesAtBlockLocation(blockPos)
      entities.forEach(element => {
        if(element.hasComponent("minecraft:item")){
          element.teleport(onBlockPos)
        }
      });

      //Changing Block + updating infos
      var lvlblock = getKey("lvlblocks",0)
      var maxlvlblock = getLevelMaxBlock()
      if (lvlblock >= maxlvlblock){
        upgradeLevel(ovworld, blockPos)
        lvlblock = 0
        maxlvlblock = getLevelMaxBlock()
      }else{
        setKey("lvlblocks", lvlblock+1)
        setKey("totalblocks", getKey("totalblocks",0)+1)
      }

      ovworld.setBlockType(blockPos, randomElement)

      if(randomElement == "minecraft:chest"){
        createChest()
      }
      event.player.onScreenDisplay.setActionBar('§aNiveau ' + getLevelNumber() + ' : §e'+ lvlblock + ' / ' + maxlvlblock)
      //To prevent the player from falling if on the block
      if(isOn){
        event.player.teleport(isOnpos, {dimension: ovworld})
        isOn = false;
      }
      isBroken = false;
    });
  }

});