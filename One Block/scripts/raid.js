import { system, world } from "@minecraft/server";
import { getKey } from 'jsonstorage.js'
import { getMaxLevel, getMaxLevelNumber } from 'levels.js'
import { getRandomBeetween, generateDistinctRandomInt } from 'utils.js'

function canSpawn(dim){
    return (dim.id == 'minecraft:overworld' && getMaxLevelNumber(dim) >= 3 || dim.id == "minecraft:nether")
}


var raid_exists = false
var boss_bar = undefined
var enemies = []
var total_enemies_nb = 0


function updateBar(name, filled, empty){
    boss_bar.nameTag = "§6"+name+"\n"+`§r§l[§l§c${"█".repeat(filled)}§7${"░".repeat(empty)}§r§l]`;
}


world.afterEvents.entityDie.subscribe((e) => {
    if(!raid_exists)return

    const de = e.deadEntity
    var index = -1
    for(let i = 0; i<enemies.length; i++){
        if(enemies[i].id == de.id){
            index = i
        }
    }
    if (index > -1) { 
        enemies.splice(index, 1); 
        updateBar("§4"+ enemies.length +"/" +total_enemies_nb +" enemies left", enemies.length, total_enemies_nb-enemies.length)
    }
    if(enemies.length == 0){
        raid_exists = false
        boss_bar.kill()
    }
})


export function spawnRaid(dim){
    system.run(() =>{
        if(canSpawn(dim)){
            const validBlocks = getValidBlocks(dim)
            const r = getMaxLevel(dim).raid
            const choosenRaid = r[getRandomBeetween(0, r.length-1)]
            var monster_nb = 0
            var monsters = []
            choosenRaid.forEach(m => {
                const choosen = getRandomBeetween(m[1], m[2])
                monsters.push([m[0],choosen])
                monster_nb += choosen
            });
            var counter = 0
            const spawnPoses = generateDistinctRandomInt(monster_nb, validBlocks.length)
            monsters.forEach( m => {
                for(let i = 0; i < m[1]; i++){
                    const b = validBlocks[spawnPoses[counter]]
                    enemies.push(dim.spawnEntity(m[0], {x:b.x, y:b.y+1, z:b.z}))
                    counter += 1
                }
            });
            boss_bar = dim.spawnEntity("futuro:boss_bar", {x:0.5, y:2.5, z:0.5})
            raid_exists = true
            total_enemies_nb = monster_nb
            updateBar("§4" + total_enemies_nb +"/" +total_enemies_nb +" enemies left", total_enemies_nb, 0)
        }
    })
}

//Get all blocks in the dimension choosen where there is no "roof" (or block at an higher position with same x and z)
function getValidBlocks(dim){
    const island = getKey("island"+dim.id,[])
    var dict = {}
    var result = []
    island.forEach(block => {
        const key = "x:"+block.x+" z:"+block.z
        if (!(key in dict)){
            dict[key] = block
        }else{
            if(block.y > dict[key].y){
                dict[key] = block
            }
            /*const posBlocks = dict[key]
            var postAnalysis = []
            var inserted = false
            for(let i = 0; i < posBlocks.length-1; i++){
                if(posBlocks[i] > block.y && !inserted){
                    if(posBlocks[i] - posBlocks[i+1] > 2){
                        postAnalysis.push(block.y)
                        result.push(block)
                    }
                    inserted = true
                }
                postAnalysis.push(posBlocks[i])
            }
            dict[key] = postAnalysis*/
        }
    });
    Object.keys(dict).forEach(k => {
        result.push(dict[k])
    });
    return result
}



export function getRaidExists(){
    return raid_exists
}