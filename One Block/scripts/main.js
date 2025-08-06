console.warn("main.js détecté");

import { world, system, ItemStack, BlockVolume } from "@minecraft/server";
import { pickRandom, getLevelNumber, getLevelMaxBlock, upgradeLevel, getLevelChest, getMaxLevelNumber } from 'levels.js';
import { setKey, getKey } from 'jsonstorage.js'
import { registerCommands } from "commands/commandmanager.js";
import { generateDistinctRandomInt, updateTextEntities } from "utils.js";
import { spawnRaid } from "raid.js";
import { applyHpEffect } from "statsmanager.js";
import { setActionBar } from "ui/actionbar.js";
import { addCoins } from "economy.js"

var isBroken = false;
var isOn = false;
var isOnPositions = []

const blockPos = { x: 0, y: 0, z: 0 };
const onBlockPos = {x:0.5, y:1, z:0.5}
var ovworld = ""
var nthr = undefined
var textEntitiesAlive = {overworld:false, nether:false}

system.run(() => {
  ovworld = world.getDimension("overworld")
  nthr = world.getDimension("nether")
  textEntitiesAlive = {
    overworld: getKey("hasSpawnTextminecraft:overworld", false),
    nether: getKey("hasSpawnTextminecraft:nether", false)
  }
});

var raidSpawnChance = 0

system.runTimeout(() => {
  raidSpawnChance = getKey("raidSpawnChance", 0)
  system.runInterval(() => {
    const prTry = Math.random()
    if(prTry < raidSpawnChance && !getKey("raid_exists",false)){
        var dimPlayerDict = {}
        world.getPlayers().forEach((p) => {
          if(p.dimension.id in dimPlayerDict){
            dimPlayerDict[p.dimension.id] = dimPlayerDict[p.dimension.id]+1
          }else{
            dimPlayerDict[p.dimension.id] = 1
          }
        })
        var max = 0 
        var spawnDim = ovworld
        Object.keys(dimPlayerDict).forEach(k => {
          if(dimPlayerDict[k] > max){
            spawnDim = world.getDimension(k)
          }
        })
        spawnRaid(spawnDim)
        raidSpawnChance = 0
        setKey("raidSpawnChance", 0)
    }else if (!getKey("raid_exists",false)){
        raidSpawnChance += 0.01
        setKey("raidSpawnChance", raidSpawnChance)
    }
  },400)
},100)


/*world.beforeEvents.startupEvent.subscribe((init) =>{
  registerCommands(init.customCommandRegistry)
})*/

//detect first connection and configure spawnpoint + teleportation
world.afterEvents.playerSpawn.subscribe((event) => {
  applyHpEffect(event.player)
  const playerDim = event.player.dimension
  updateTextEntities(playerDim, textEntitiesAlive)
  if(!getKey("hasBegun", false)){
    system.run(() => {
      setKey("levelminecraft:overworld",1)
      setKey("maxlevelminecraft:overworld",1)
      setKey("lvlblocksminecraft:overworld",0)
      setKey("islandminecraft:overworld",[])

      setKey("levelminecraft:nether",1)
      setKey("maxlevelminecraft:nether",1)
      setKey("lvlblocksminecraft:nether",0)
      setKey("islandminecraft:nether",[])

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

system.beforeEvents.startup.subscribe((init) =>{
    registerCommands(init.customCommandRegistry)
})

world.beforeEvents.explosion.subscribe((e) => {
  const impacted = e.getImpactedBlocks()
  if(impacted.length == 0)return
  var island = getKey("island"+impacted[0].dimension,[])
  impacted.forEach(b => {
    if(b.x == blockPos.x && b.y == blockPos.y && b.z == blockPos.z){
      system.run(() =>{
        b.dimension.setBlockType({x:b.x, y:b.y, z:b.z}, "minecraft:grass")
      })
    }
    island = island.filter((bl) => {return bl.x != b.x || bl.y != b.y ||bl.z != b.z})
  });
  setKey("island"+impacted[0].dimension, island)

})


//Detect when the block is getting broken
world.beforeEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  const player = event.player
  if(block.x == 0 && block.y == 0 && block.z == 0){
    isBroken = true;
    block.dimension.getPlayers().forEach((p) => {
      const ppos = player.location;
      if(-0.28 < ppos.x && ppos.x < 1.28 && Math.round(ppos.y) == 1  && -0.28 < ppos.z && ppos.z < 1.28){
        isOn = true
        isOnPositions.push([p, {x:ppos.x, y:1, z:ppos.z}, {dimension: block.dimension}])
      }
    })
  }
  else{
    var island = getKey("island"+player.dimension.id,[])
    .filter((b) => {return  b.x != block.x || b.y != block.y ||b.z != block.z})
    setKey("island"+player.dimension.id, island)
    
  }
}); 

world.afterEvents.playerPlaceBlock.subscribe((event) => {
  const p = event.player
  const b = event.block
  var res = getKey("island"+p.dimension.id,[])
  res.push({x:b.x, y:b.y, z:b.z})
  setKey("island"+p.dimension.id, res)
})

function createChest(dim){
  const inv = dim.getBlock(blockPos).getComponent("minecraft:inventory")
  const inventoryContainer = inv.container
  const chestloots = getLevelChest(dim)
  var i = 0
  var positions = undefined
  if (chestloots.length < 12){
    positions = generateDistinctRandomInt(chestloots.length, 26)
  }

  chestloots.forEach(element => {
    const id = element[0]
    const proba = element[1]
    var amount = element[2]
    const maxamount = element[3]
    while (Math.random() < proba && amount < maxamount){
      amount++
    }
    if(amount != 0){
      const itm = new ItemStack(id, amount)
      var index = i
      if (positions != undefined){
        index = positions[i]
      }
      inventoryContainer.setItem(index, itm);
      i+= 1
    }
  });
}

//Do actions if the block is Broken
world.afterEvents.playerBreakBlock.subscribe((event) => {
  if(isBroken){
    const dim = event.player.dimension
    const re = pickRandom(dim)
    const randomElement = re[0]
    const coinsNb = re[1]
    system.run(() => {
      //Teleport drops to prevent it from disapear due to block replacement
      const entities = dim.getEntitiesAtBlockLocation(blockPos)
      entities.forEach(element => {
        if(element.hasComponent("minecraft:item") || element.typeId == "minecraft:xp_orb"){
          element.teleport(onBlockPos)
        }
      });

      //Changing Block + updating infos
      var lvlblock = getKey("lvlblocks"+dim.id,0)
      var maxlvlblock = getLevelMaxBlock(dim)
      if(getMaxLevelNumber(dim) == getLevelNumber(dim)){
        if (lvlblock == maxlvlblock){
          lvlblock = upgradeLevel(dim, blockPos)
          maxlvlblock = getLevelMaxBlock(dim)
        }else if (lvlblock >  maxlvlblock){
          setKey("totalblocks", getKey("totalblocks",0)+1)
          lvlblock = maxlvlblock
        }else{
          setKey("lvlblocks"+dim.id, lvlblock+1)
          setKey("totalblocks", getKey("totalblocks",0)+1)
        }
      }else{
        setKey("totalblocks", getKey("totalblocks",0)+1)
        lvlblock = maxlvlblock
      }

      dim.setBlockType(blockPos, randomElement)

      if(randomElement == "minecraft:chest"){
        createChest(dim)
      }
      dim.getPlayers().forEach((p) =>{
        setActionBar(coinsNb, getLevelNumber(dim), lvlblock, maxlvlblock, p)
      })
      addCoins(coinsNb)
      //To prevent the player from falling if on the block
      if(isOn){
        isOnPositions.forEach(elem => {
          elem[0].teleport(elem[1], elem[2])
        });
        isOn = false;
        isOnPositions = []
      }
      isBroken = false;
    });
  }
});

world.afterEvents.playerDimensionChange.subscribe((event) => {
  const dim = event.toDimension
  updateTextEntities(dim, textEntitiesAlive)
  const p = event.player
  system.run(() => {
    p.teleport(onBlockPos)
  })
  if(getKey("islandminecraft:nether",[]).length == 0 && dim.id == "minecraft:nether"){
    const getBaseVolume = new BlockVolume({x:-50,y:-2,z:-50}, {x:50,y:4,z:50})
    var defaultNetherIslandVolume = nthr.getBlocks(getBaseVolume, {includeTypes: ['minecraft:netherrack']}, true)
    const iter = defaultNetherIslandVolume.getBlockLocationIterator()
    var block = iter.next();
    var defaultNetherIsland = []
    while (!block.done) {
      const v  = block.value 
      if(v.x == 0 && v.y == 0 && v.z == 0){
        block = iter.next();
        continue
      }
      defaultNetherIsland.push(block.value)
      block = iter.next();
    }
    setKey("islandminecraft:nether", defaultNetherIsland)

    
  }
})