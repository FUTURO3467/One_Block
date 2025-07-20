import {getKey, setKey} from 'jsonstorage.js'
import { system } from "@minecraft/server";


const lvl1 = {
    nbBlocks: 25,
    blocks: [["minecraft:grass",0.5], ["minecraft:oak_log",0.25], ["minecraft:birch_log",0.20], ["minecraft:chest", 0.05]],
    chest: [["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]]
}

const lvl2 = {
    nbBlocks: 50,
    blocks: [
        ["minecraft:grass",0.08], ["minecraft:oak_log",0.08], ["minecraft:birch_log",0.08], ["minecraft:stone", 0.3], ["minecraft:coal_ore", 0.13],
        ["minecraft:granite", 0.03], ["minecraft:diorite", 0.03], ["minecraft:andesite", 0.03], ["minecraft:spruce_log", 0.20],
        ["minecraft:white_wool", 0.03], ["minecraft:chest", 0.01]
    ],
    chest: [
        ["minecraft:sand", 0.9, 1, 61], ["minecraft:flint", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31], ["minecraft:oak_sapling", 0.5, 1, 61], ["minecraft:birch_sapling", 0.5, 1, 61]
    ]
}

const lvl3 = {
    nbBlocks: 90,
    blocks: [
        ["minecraft:grass",0.04], ["minecraft:oak_log",0.04], ["minecraft:birch_log",0.04], ["minecraft:stone", 0.25], ["minecraft:coal_ore", 0.15],
        ["minecraft:spruce_log", 0.05], ["minecraft:iron_ore", 0.12], ["minecraft:copper_ore", 0.14],["minecraft:lapis_ore", 0.15], 
        ["minecraft:white_wool", 0.01], ["minecraft:chest", 0.01]
    ],
    chest: [
        ["minecraft:iron_ingot", 0.9, 1, 61], ["minecraft:copper_ingot", 0.7, 1, 53], ["minecraft:torch", 0.6, 1, 31], ["minecraft:oak_sapling", 0.5, 1, 61],
        ["minecraft:birch_sapling", 0.5, 1, 61], ["minecraft:coal_block", 0.9, 1, 61]
    ]
}





const levels = [lvl1, lvl2, lvl3]

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

export function upgradeLevel(dimension){
    if (getLevelNumber() < levels.length){
        system.run(() => {
            setKey("level", getKey("level", 1)+1)
            setKey("lvlblocks", 0)
            dimension.getPlayers().forEach(p => {
                p.runCommand("playsound beacon.power @s")
                p.sendMessage("§eWell done! You're now level §a" + getLevelNumber())
                p.sendMessage("§eRun !level to see level's infos")
            });
        });
    }
}

