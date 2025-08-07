import { system, world } from "@minecraft/server";
import { getKey, setKey } from 'jsonstorage.js'
import { getMaxLevel, getMaxLevelNumber } from 'levels.js'
import { getRandomBeetween, generateDistinctRandomInt, formatId, capitalizeFirstLetter } from 'utils.js'
import { getEntityHeight } from "entityheight.js";
import { addCoins } from "economy.js"

function canSpawn(dim){
    return (dim.id == 'minecraft:overworld' && getMaxLevelNumber(dim) >= 3 || dim.id == "minecraft:nether")
}

//Update Raids floating texts positions
system.runInterval(() => {
    if(!getKey("raid_exists",false))return
    getKey("raid_enemies", []).forEach(elem => {
        const entity = world.getEntity(elem[0])
        if(entity == undefined || !entity.isValid){
            const fltxt = world.getEntity(elem[1])
            if(fltxt == undefined)return
            if(fltxt.isValid())fltxt.kill()
            return
        }
        const pos = entity.location
        world.getEntity(elem[1]).teleport({x:pos.x, y: pos.y + getEntityHeight(entity.typeId) -0.35 , z:pos.z})
    })
},1)


//In case of bugs (Not supposed to happen)
system.runInterval(() => {
    if(!getKey("raid_exists",false))return
    var problem = true
    getKey("raid_enemies", []).forEach(elem => {
        const id = elem[0]
        if(world.getEntity(id) != undefined && world.getEntity(id).isValid){
            problem = false
        }
    });
    if(problem){
        setKey("raid_exists", false)
        getRaidBossBar().kill()
    }
},300)


function getRaidBossBar(){
    const bbar = getKey("raid_boss_bar", {id:"", dim:""})
    return world.getDimension(bbar.dim.id).getEntities().filter((e) => {return e.id == bbar.id})[0]
}

function updateBar(name, filled, empty){
    getRaidBossBar().nameTag = "§6"+name+"\n"+`§r§l[§l§c${"█".repeat(filled)}§7${"░".repeat(empty)}§r§l]`;
}


world.afterEvents.entityDie.subscribe((e) => {
    if(!getKey("raid_exists",false))return

    const de = e.deadEntity
    var index = -1
    var enemies = getKey("raid_enemies", [])
    for(let i = 0; i<enemies.length; i++){
        if(enemies[i][0] == de.id){
            index = i
            world.getEntity(enemies[i][1]).kill()
        }
    }
    if (index > -1) { 
        enemies.splice(index, 1); 
        updateBar("§4"+ enemies.length +"/" +getKey("total_enemies_nb", 0) +" enemies left", enemies.length, getKey("total_enemies_nb", 0) -enemies.length)
    }
    if(enemies.length == 0){
        setKey("raid_exists", false)
        const coin_reward = getKey("raid_rewards",0) 
        addCoins(coin_reward)
        e.dimension.getPlayers().forEach((p)=>{
            p.sendMessage({translate:"raid.futuro.success"})
            p.sendMessage({translate:"raid.futuro.coin_reward", with:[coin_reward+""]})
        })
        getRaidBossBar().kill()
    }
    setKey("raid_enemies", enemies)
})


export function spawnRaid(dim){
    system.run(() =>{
        if(canSpawn(dim)){
            const validBlocks = getValidBlocks(dim)
            const r = getMaxLevel(dim).raid
            const choosenRaid = r[getRandomBeetween(0, r.length-1)]
            var monster_nb = 0
            var monsters = []
            var moneyReward = 0
            choosenRaid.forEach(m => {
                const choosen = getRandomBeetween(m[1], m[2])
                monsters.push([m[0],choosen])
                monster_nb += choosen
                moneyReward += m[3]*choosen
            });
            if(validBlocks.length < monster_nb*2)return
            var counter = 0
            const spawnPoses = generateDistinctRandomInt(monster_nb, validBlocks.length-1)
            var enemies = []
            monsters.forEach( m => {
                for(let i = 0; i < m[1]; i++){
                    const b = validBlocks[spawnPoses[counter]]
                    var entity = dim.spawnEntity(m[0], {x:b.x, y:b.y+1, z:b.z})
                    var nameTag = dim.spawnEntity("futuro:floating_text", {x:b.x, y:b.y+getEntityHeight(m[0])+0.65, z:b.z})
                    nameTag.nameTag = "§cRaid " + capitalizeFirstLetter(formatId(m[0]))
                    enemies.push([entity.id, nameTag.id])
                    counter += 1
                }
            });
            setKey("raid_boss_bar",{id:dim.spawnEntity("futuro:boss_bar", {x:0.5, y:2.5, z:0.5}).id, dim:dim})
            setKey("raid_exists",true)
            setKey("total_enemies_nb", monster_nb)
            setKey("raid_enemies", enemies)
            setKey("raid_rewards", moneyReward)
            updateBar("§4" + monster_nb +"/" +monster_nb +" enemies left", monster_nb, 0)
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

