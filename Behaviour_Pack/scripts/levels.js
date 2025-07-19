var lvl1 = {
    nbBlocks: 20,
    blocks: [["minecraft:grass",0.5], ["minecraft:oak_log",0.25], ["minecraft:birch_log",0.25]]
}

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

export function getLevel(){
    return lvl1;
}