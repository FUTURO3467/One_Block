import {getKey, setKey} from 'jsonstorage.js'
import { system, ItemStack } from "@minecraft/server";
import { computeLevelStats } from 'statsmanager.js'

//blocks component -> [id, proba]
//chest component -> [id, get_proba, min, max]
//rewards component -> [id, number]

const ovlvl1 = {
    nbBlocks: 40,
    blocks: [ ["minecraft:grass",0.5], ["minecraft:oak_log",0.25], ["minecraft:birch_log",0.23], ["minecraft:chest", 0.02]],
    chest: [["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]],
    rewards: [["minecraft:oak_sapling", 1],["minecraft:birch_sapling", 1],["minecraft:wheat_seeds", 1], ["minecraft:dirt", 64], ["minecraft:wooden_pickaxe", 1]],
    raid:[],
    stats:{attack:true, defense:false, health:false}
}

const ovlvl2 = {
    nbBlocks: 80,
    blocks: [
        ["minecraft:grass",0.08], ["minecraft:stone", 0.36], ["minecraft:coal_ore", 0.17],
        ["minecraft:granite", 0.05], ["minecraft:diorite", 0.05], ["minecraft:andesite", 0.05], ["minecraft:spruce_log", 0.20],
        ["minecraft:white_wool", 0.03], ["minecraft:chest", 0.01]
    ],
    chest: [
        ["minecraft:sand", 0.9, 1, 61], ["minecraft:flint", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31], ["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]
    ],
    rewards: [["minecraft:white_wool", 3],["minecraft:spruce_sapling", 1], ["minecraft:stone_pickaxe", 1], ["minecraft:bread", 32], ["minecraft:water_bucket",1]],
    raid:[],
    stats:{attack:true, defense:true, health:false}
}

const ovlvl3 = {
    nbBlocks: 120,
    blocks: [
        ["minecraft:grass",0.04], ["minecraft:stone", 0.28], ["minecraft:coal_ore", 0.18],
        ["minecraft:spruce_log", 0.05], ["minecraft:iron_ore", 0.14], ["minecraft:copper_ore", 0.14],["minecraft:lapis_ore", 0.15], 
        ["minecraft:white_wool", 0.01], ["minecraft:chest", 0.01]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 1, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
        ["minecraft:coal_block", 0.9, 1, 61]
    ],
    rewards: [["minecraft:iron_pickaxe", 1], ["minecraft:dirt", 64], ["minecraft:furnace", 1], ["minecraft:torch", 32], ["minecraft:water_bucket",1], ["minecraft:bread", 32]],
    raid:[[["minecraft:zombie",2,3,15],["minecraft:creeper",1,3,15], ["minecraft:skeleton",2,3,15]]],
    stats:{attack:true, defense:true, health:true}
}


const ovlvl4 = {
    nbBlocks: 150,
    blocks: [
        ["minecraft:grass",0.05], ["minecraft:stone", 0.23], ["minecraft:coal_ore", 0.26],
        ["minecraft:acacia_log", 0.06], ["minecraft:iron_ore", 0.124], ["minecraft:copper_ore", 0.05],["minecraft:lapis_ore", 0.11],  
        ["minecraft:redstone_ore",0.09], ["minecraft:white_wool", 0.01], ["minecraft:chest", 0.01], ["minecraft:diamond_ore", 0.006]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 3, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
        ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.5, 0, 5]
    ],
    rewards: [["minecraft:iron_ingot", 12], ["minecraft:diamond", 1] , ["minecraft:acacia_sapling", 1], ["minecraft:bread", 32], ["minecraft:sand", 32], ["minecraft:sugar_cane", 5], ["minecraft:water_bucket",1]],
    raid:[[["minecraft:zombie",2,3,15],["minecraft:creeper",1,3,15], ["minecraft:skeleton",2,3,15], ["minecraft:spider",2,4,15]]],
    stats:{attack:true, defense:false, health:false}
}

const ovlvl5 = {
    nbBlocks: 180,
    blocks: [
        ["minecraft:grass",0.02], ["minecraft:stone", 0.2], ["minecraft:coal_ore", 0.2],
        ["minecraft:iron_ore", 0.154], ["minecraft:copper_ore", 0.07],["minecraft:lapis_ore", 0.12],  
        ["minecraft:redstone_ore",0.11], ["minecraft:chest", 0.01], ["minecraft:diamond_ore", 0.016],
        ["minecraft:acacia_log", 0.08], ["minecraft:gold_ore", 0.03]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 3, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
        ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.7, 0, 5]

    ],

    rewards: [["minecraft:diamond_pickaxe", 1], ["minecraft:diamond",3],["minecraft:iron_ingot",32], ["minecraft:water_bucket",1], ["minecraft:cow_spawn_egg", 2]],
    raid:[[["minecraft:zombie",2,3,15],["minecraft:creeper",1,3,15], ["minecraft:skeleton",2,3,15], ["minecraft:spider",1,3,15], ["minecraft:cave_spider",2,3,20], ["minecraft:enderman",0,2,20]]],
    stats:{attack:true, defense:true, health:false}
}


const ovlvl6 = {
    nbBlocks: 220,
    blocks: [
        ["minecraft:grass",0.02], ["minecraft:deepslate", 0.2], ["minecraft:deepslate_coal_ore", 0.2],
        ["minecraft:deepslate_iron_ore", 0.16], ["minecraft:deepslate_gold_ore", 0.08],["minecraft:deepslate_lapis_ore", 0.10],  
        ["minecraft:deepslate_redstone_ore",0.11], ["minecraft:chest", 0.01], ["minecraft:deepslate_diamond_ore", 0.02],
        ["minecraft:cherry_log", 0.08], ["minecraft:obsidian", 0.01], ["minecraft:deepslate_emerald_ore", 0.01]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.75, 0, 8]

    ],

    rewards: [["minecraft:cherry_sapling", 1], ["minecraft:diamond",3],["minecraft:iron_ingot",32], ["minecraft:water_bucket",1], ["minecraft:villager_spawn_egg", 2],
            ["minecraft:flint_and_steel",1], ["minecraft:obsidian",14]],
    raid:[[["minecraft:zombie",1,3,15],["minecraft:creeper",1,3,15], ["minecraft:skeleton",1,3,15], ["minecraft:spider",1,3,15], ["minecraft:cave_spider",2,4,20], ["minecraft:enderman",2,4,20]]],
    stats:{attack:true, defense:true, health:true}
}





const overworldLevels = [ovlvl1, ovlvl2, ovlvl3, ovlvl4, ovlvl5, ovlvl6]




const ntlvl1 = {
    nbBlocks: 250,
    blocks: [
        ["minecraft:netherrack", 0.21], ["minecraft:quartz_ore", 0.21],
        ["minecraft:soul_sand", 0.14], ["minecraft:nether_gold_ore", 0.1],["minecraft:soul_soil", 0.1],  
        ["minecraft:crimson_nylium",0.11], ["minecraft:chest", 0.01],
        ["minecraft:crimson_stem", 0.114], ["minecraft:ancient_debris", 0.006]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:ancient_debris",0.65,0,4], ["minecraft:diamond", 0.75, 1, 15]

    ],

    rewards: [["minecraft:crimson_fungus", 1], ["minecraft:ancient_debris",4],["minecraft:crimson_nylium",32], ["minecraft:lava_bucket",1], ["minecraft:piglin_spawn_egg", 4]],
    raid:[[["minecraft:zombie_pigman",2,3,20],["minecraft:wither_skeleton",1,3,25], ["minecraft:enderman",2,5,25]]],
    stats:{attack:true, defense:false, health:false}

}

const ntlvl2 = {
    nbBlocks: 300,
    blocks: [
        ["minecraft:magma",0.04], ["minecraft:netherrack", 0.21], ["minecraft:quartz_ore", 0.21],
        ["minecraft:soul_sand", 0.14], ["minecraft:nether_gold_ore", 0.08],["minecraft:soul_soil", 0.1],  
        ["minecraft:crimson_nylium",0.1], ["minecraft:chest", 0.01],
        ["minecraft:crimson_stem", 0.1], ["minecraft:ancient_debris", 0.01]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:ancient_debris",0.5,1,5], ["minecraft:diamond", 0.8, 1, 15]

    ],

    rewards: [["minecraft:ancient_debris",4],["minecraft:crimson_nylium",32], ["minecraft:lava_bucket",1],["minecraft:mob_spawner", 1], ["minecraft:magma_cube_spawn_egg", 1]],
    raid:[[["minecraft:zombie_pigman",2,3,20],["minecraft:wither_skeleton",2,4,25], ["minecraft:enderman",2,5,25], ["minecraft:blaze",1,3,25]]],
    stats:{attack:true, defense:true, health:false}

}

const ntlvl3 = {
    nbBlocks: 350,
    blocks: [
        ["minecraft:magma",0.04], ["minecraft:netherrack", 0.2], ["minecraft:quartz_ore", 0.2],
        ["minecraft:soul_sand", 0.14], ["minecraft:nether_gold_ore", 0.08],["minecraft:soul_soil", 0.1],  
        ["minecraft:warped_nylium",0.1], ["minecraft:chest", 0.01], ["minecraft:glowstone", 0.04],
        ["minecraft:warped_stem", 0.074], ["minecraft:ancient_debris", 0.016]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:ancient_debris",0.65,1,6], ["minecraft:diamond", 0.6, 2, 15]

    ],

    rewards: [["minecraft:ancient_debris",4],["minecraft:warped_nylium",32], ["minecraft:lava_bucket",1],["minecraft:mob_spawner", 1], ["minecraft:blaze_spawn_egg", 1]],
    raid:[[["minecraft:zombie_pigman",2,3,20],["minecraft:wither_skeleton",2,4,25], ["minecraft:enderman",2,5,25], ["minecraft:ghast",1,3,25], ["minecraft:blaze",0,2,25]]],
    stats:{attack:true, defense:true, health:true}

}

const ntlvl4 = {
    nbBlocks: 400,
    blocks: [
        ["minecraft:magma",0.04], ["minecraft:netherrack", 0.2], ["minecraft:quartz_ore", 0.2],
        ["minecraft:soul_sand", 0.14], ["minecraft:nether_gold_ore", 0.08],["minecraft:soul_soil", 0.1],  
        ["minecraft:warped_nylium",0.1], ["minecraft:chest", 0.01], ["minecraft:glowstone", 0.04],
        ["minecraft:warped_stem", 0.07], ["minecraft:ancient_debris", 0.02]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:ancient_debris",0.65,1,6], ["minecraft:diamond", 0.6, 2, 15]

    ],

    rewards: [["minecraft:ancient_debris",4],["minecraft:warped_nylium",32], ["minecraft:lava_bucket",1],["minecraft:mob_spawner", 1], ["minecraft:wither_skeleton_spawn_egg", 1]],
    raid:[[["minecraft:zombie_pigman",2,3,20],["minecraft:wither_skeleton",2,5,25], ["minecraft:enderman",2,5,25], ["minecraft:ghast",1,2,25], ["minecraft:blaze",1,2,25]]],
    stats:{attack:true, defense:false, health:false}

}

const netherLevels = [ntlvl1, ntlvl2, ntlvl3, ntlvl4]


function getLevelsFromDimension(dim){
    if(dim.id == "minecraft:overworld"){
        return overworldLevels
    }else if(dim.id == "minecraft:nether"){
        return netherLevels
    }
}

export function pickRandom(dim){
    const lvl = getLevel(dim)
    const b = lvl.blocks;
    var proba = 0.0;
    var picked = Math.random()
    var res = []
    b.forEach(element => {
        proba += element[1]
        if (picked <= proba && res == ""){
            res.push(element[0])
            if(proba > 0.1){
                res.push(1)
            }else if(proba > 0.05){
                res.push(2)
            }else{
                res.push(3)
            }
        }
    });
    return res
    

}

export function getLevelChest(dim){
    return getLevel(dim).chest
}

export function getLevelMaxBlock(dim){
    return getLevel(dim).nbBlocks
}

export function getLevelNumber(dim){
    return getKey("level"+dim.id, 1)
}


export function getLevel(dim){
    return getLevelsFromDimension(dim)[getLevelNumber(dim)-1];
}

export function getMaxLevelNumber(dim){
    return getKey("maxlevel"+dim.id, 1)
}
export function getMaxLevel(dim){
    return getLevelsFromDimension(dim)[getMaxLevelNumber(dim)-1];
}




function createRewardChest(dimension, blockPos){
    const inv = dimension.getBlock(blockPos).getComponent("minecraft:inventory")
    const inventoryContainer = inv.container
    const chestloots = getLevel(dimension).rewards
    var i = 0
    chestloots.forEach(element => {
        const itm = new ItemStack(element[0], element[1])
        inventoryContainer.setItem(i, itm);
        i+= 1
      });
}

export function setLevel(dim, number, resetBlockNumber){
    setKey("level"+dim.id, number)
    if(resetBlockNumber){
        setKey("lvlblocks"+dim.id, 0)
    }
}

export function upgradeLevel(dimension, blockPos){
    if (getLevelNumber(dimension) <= getLevelsFromDimension(dimension).length){
        var returnValue = 0
        system.run(() => {
            const statsReward = getLevel(dimension).stats
            const newLevel = getKey("level"+dimension.id, 1)+1
            dimension.setBlockType(blockPos, "minecraft:chest")
            createRewardChest(dimension, blockPos)
            if(newLevel != getLevelsFromDimension(dimension).length+1){
                setLevel(dimension, newLevel, true)
                setKey("maxlevel"+dimension.id, newLevel, true)
            }else{
                returnValue = getLevelMaxBlock(dimension)+1
                setKey("lvlblocks"+dimension.id, returnValue)
            }
            computeLevelStats(statsReward, dimension)
            dimension.getPlayers().forEach(p => {
                p.runCommand("playsound beacon.power @s")
                p.sendMessage({translate: "message.futuro.lvlup_1", with: [newLevel+""]})
                p.sendMessage({translate: "message.futuro.lvlup_2"})
                if(statsReward.attack){
                    p.sendMessage({rawtext: [{text:"§4+1"},{translate: "message.futuro.attack_point"}]})
                }
                if(statsReward.health){
                    p.sendMessage({rawtext: [{text:"§c+4"},{translate: "message.futuro.health_points"}]})
                }
                if(statsReward.defense){
                    p.sendMessage({rawtext: [{text:"§a+1"},{translate: "message.futuro.defense_point"}]})
                }
            });
        });
        return returnValue
    }
}

