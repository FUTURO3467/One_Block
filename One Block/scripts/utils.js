import { system } from "@minecraft/server";
import {setKey} from 'jsonstorage.js'



export function getRandomBeetween(min, max){
  if(min == max)return min
  return min + Math.floor(Math.random()*(max-min+1))
}


export function generateDistinctRandomInt(quantity, max){
  const set = new Set()
  while(set.size < quantity) {
    set.add(Math.floor(Math.random() * (max+1)))
  }
  let a = [];

  let fun = function (val1) {
        a.push(val1);
  };
  set.forEach(fun);
  return a
}



export function dimensionToBoolInfo(dim, data){
  if(dim.id == "minecraft:nether"){
    return data.nether
  }else if(dim.id == "minecraft:overworld"){
    return data.overworld
  }
}

export function setDimensionToBool(dim, data, value){
  if(dim.id == "minecraft:nether"){
    data.nether = value
  }else if(dim.id == "minecraft:overworld"){
    data.overworld = value
  }
}

export function updateTextEntities(dim, data){
  system.runTimeout(() => {
      if(!dimensionToBoolInfo(dim, data)){
        const armorStand = dim.spawnEntity("futuro:floating_text", {x:0.5, y:0.5, z:0.5});
        armorStand.nameTag = "§6Break This Block";
    
        setDimensionToBool(dim, data, true)
        setKey("hasSpawnText"+dim.id, true)
      }
  }, 40)
}

export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function formatId(id){
  const temp = id.split(":")
  if(temp.length < 2 ){
    return id
  }
  const name = temp[1]
  return name.replaceAll("_", " ")
}