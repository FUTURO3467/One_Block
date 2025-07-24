import {getKey, setKey} from 'jsonstorage.js'
import { system, ItemStack } from "@minecraft/server";

//blocks component -> [id, proba]
//chest component -> [id, get_proba, min, max]
//rewards component -> [id, number]

const lvl1 = {
    nbBlocks: 40,
    blocks: [ ["minecraft:grass",0.5], ["minecraft:oak_log",0.25], ["minecraft:birch_log",0.23], ["minecraft:chest", 0.02]],
    chest: [["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]],
    rewards: [["minecraft:oak_sapling", 1],["minecraft:birch_sapling", 1],["minecraft:wheat_seeds", 1], ["minecraft:dirt", 64], ["minecraft:wooden_pickaxe", 1]]
}

const lvl2 = {
    nbBlocks: 80,
    blocks: [
        ["minecraft:grass",0.08], ["minecraft:stone", 0.36], ["minecraft:coal_ore", 0.17],
        ["minecraft:granite", 0.05], ["minecraft:diorite", 0.05], ["minecraft:andesite", 0.05], ["minecraft:spruce_log", 0.20],
        ["minecraft:white_wool", 0.03], ["minecraft:chest", 0.01]
    ],
    chest: [
        ["minecraft:sand", 0.9, 1, 61], ["minecraft:flint", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31], ["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]
    ],
    rewards: [["minecraft:white_wool", 3],["minecraft:spruce_sapling", 1], ["minecraft:stone_pickaxe", 1], ["minecraft:bread", 32], ["minecraft:water_bucket",1]]
}

const lvl3 = {
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
    rewards: [["minecraft:iron_pickaxe", 1], ["minecraft:dirt", 64], ["minecraft:furnace", 1], ["minecraft:torch", 32], ["minecraft:water_bucket",1], ["minecraft:bread", 32]]
}


const lvl4 = {
    nbBlocks: 150,
    blocks: [
        ["minecraft:grass",0.03], ["minecraft:stone", 0.23], ["minecraft:coal_ore", 0.23],
        ["minecraft:acacia_log", 0.06], ["minecraft:iron_ore", 0.124], ["minecraft:copper_ore", 0.1],["minecraft:lapis_ore", 0.11],  
        ["minecraft:redstone_ore",0.09], ["minecraft:white_wool", 0.01], ["minecraft:chest", 0.01], ["minecraft:diamond_ore", 0.006]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 3, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
        ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.5, 0, 5]
    ],
    rewards: [["minecraft:iron", 12], ["minecraft:diamond", 1] , ["minecraft:acacia_sapling", 1], ["minecraft:bread", 32], ["minecraft:sand", 32], ["minecraft:sugar_cane", 5], ["minecraft:water_bucket",1]]
}

const lvl5 = {
    nbBlocks: 150,
    blocks: [
        ["minecraft:grass",0.02], ["minecraft:stone", 0.2], ["minecraft:coal_ore", 0.2],
        ["minecraft:iron_ore", 0.154], ["minecraft:copper_ore", 0.07],["minecraft:lapis_ore", 0.12],  
        ["minecraft:redstone_ore",0.11], ["minecraft:chest", 0.01], ["minecraft:diamond_ore", 0.016],
        ["minecraft:acacia_log", 0.08]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 3, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
        ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.7, 0, 5]

    ],

    rewards: [["minecraft:diamond_pickaxe", 1], ["minecraft:diamond",3],["minecraft:iron",32], ["minecraft:water_bucket",1]]
}


const lvl6 = {
    nbBlocks: 150,
    blocks: [
        ["minecraft:grass",0.02], ["minecraft:deepslatestone", 0.2], ["minecraft:deepslate_coal_ore", 0.18],
        ["minecraft:deepslate_iron_ore", 0.15], ["minecraft:deepslate_gold_ore", 0.07],["minecraft:deepslate_lapis_ore", 0.12],  
        ["minecraft:deepslate_redstone_ore",0.11], ["minecraft:chest", 0.01], ["minecraft:deepslate_diamond_ore", 0.02],
        ["minecraft:cherry_log", 0.08], ["minecraft:obsidian", 0.01], ["minecraft:deepslate_emerald_ore", 0.01]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.95, 3, 61], ["minecraft:obsidian", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31],
         ["minecraft:redstone", 0.9, 1, 61], ["minecraft:lapis_lazuli",0.9,2,64], ["minecraft:diamond", 0.75, 0, 8]

    ],

    rewards: [["minecraft:cherry_sapling", 1], ["minecraft:diamond",3],["minecraft:iron",32], ["minecraft:water_bucket",1], ["minecraft:villager_spawn_egg", 2]]
}





const levels = [lvl1, lvl2, lvl3, lvl4, lvl5, lvl6]

export function pickRandom(){
    const lvl = getLevel()
    const b = lvl.blocks;
    var proba = 0.0;
    var picked = Math.random()
    var res = ""
    b.forEach(element => {
        proba += element[1]
        if (picked <= proba && res == ""){
            res = element[0]
        }
    });
    return res
    

}

export function getLevelChest(){
    return getLevel().chest
}

export function getLevelMaxBlock(){
    return getLevel().nbBlocks
}

export function getLevelNumber(){
    return getKey("level", 1)
}


export function getLevel(){
    return levels[getLevelNumber()-1];
}




function createRewardChest(dimension, blockPos){
    const inv = dimension.getBlock(blockPos).getComponent("minecraft:inventory")
    const inventoryContainer = inv.container
    const chestloots = getLevel().rewards
    var i = 0
    chestloots.forEach(element => {
        const itm = new ItemStack(element[0], element[1])
        inventoryContainer.setItem(i, itm);
        i+= 1
      });
}

export function upgradeLevel(dimension, blockPos){
    if (getLevelNumber() < levels.length){
        system.run(() => {
            dimension.setBlockType(blockPos, "minecraft:chest")
            createRewardChest(dimension, blockPos)
            setKey("level", getKey("level", 1)+1)
            setKey("lvlblocks", 0)
            dimension.getPlayers().forEach(p => {
                p.runCommand("playsound beacon.power @s")
                p.sendMessage("§eWell done! You're now level §a" + getLevelNumber())
                p.sendMessage("§eSneak while looking towards the block to see more informations")
            });
        });
    }
}

