const entityHeights = {
  "minecraft:zombie": 1.95,
  "minecraft:zombie_villager": 1.95,
  "minecraft:husk": 1.95,
  "minecraft:stray": 1.99,
  "minecraft:skeleton": 1.99,
  "minecraft:bogged": 1.99,           
  "minecraft:creeper": 1.7,
  "minecraft:spider": 0.9,
  "minecraft:cave_spider": 0.5,
  "minecraft:enderman": 2.9,
  "minecraft:witch": 1.95,
  "minecraft:evoker": 1.95,
  "minecraft:vindicator": 1.95,
  "minecraft:illager": 1.95,
  "minecraft:ravager": 2.2,
  "minecraft:wither_skeleton": 2.4,
  "minecraft:wither": 3.5,
  "minecraft:ghast": 4.0,
  "minecraft:blaze": 1.8,
  "minecraft:endermite": 0.3,
  "minecraft:phantom": 0.5,
  "minecraft:elder_guardian": 1.9975,
  "minecraft:guardian": 0.85,
  "minecraft:drowned": 1.95,
  "minecraft:hoglin": 1.4,
  "minecraft:piglin": 1.95,
  "minecraft:piglin_brute": 1.95,
  "minecraft:warden": 2.9,
  "minecraft:breeze": 0.8
};



export function getEntityHeight(id){
    if(!(id in entityHeights)){
        return 2.0
    }
    return entityHeights[id]
}