import { system, world } from "@minecraft/server";
import { getKey, setKey } from 'jsonstorage.js'

export function getAttack(){
    return getKey("attack_points",0)
}

function setAttack(n){
    setKey("attack_points", n)
}

export function getHp(){
    return getKey("hp",0)
}

function setHp(n){
    setKey("hp", n)
}

export function getDefense(){
    return getKey("defense_points",0)
}

function setDefense(n){
    setKey("defense_points", n)
}


world.afterEvents.entityHitEntity.subscribe((e) => {
    system.run(() =>{
        const healthComp = e.hitEntity.getComponent("health");
        if (!healthComp) return;
        if(e.damagingEntity.typeId == "minecraft:player"){
            healthComp.setCurrentValue(Math.max(healthComp.currentValue-getAttack()*0.5,0))
        }   
        if(e.hitEntity.typeId == "minecraft:player"){
            const healthComp = e.hitEntity.getComponent("health");
            
            const currentHealth = healthComp.currentValue;
            const maxHealth = healthComp.effectiveMax;
            const newHealth = Math.min(currentHealth + getDefense(), maxHealth);

            healthComp.setCurrentValue(newHealth);
        }
    })

})

export function applyHpEffect(player){
    system.run(() =>{
        player.addEffect("health_boost", 999999, { amplifier: getHp(), showParticles: false });
        const healthComp = player.getComponent("health");
        const maxHealth = healthComp.effectiveMax;

        healthComp.setCurrentValue(maxHealth);
    })
}


export function computeLevelStats(stats, dimension){
    if(stats.health){
        setHp(getHp()+1)
    }
    if(stats.defense){
        setDefense(getDefense()+1)
    }
    if(stats.attack){
        setAttack(getAttack()+1)
    }
    world.getPlayers().forEach(p => {
        applyHpEffect(p)
    })
}
