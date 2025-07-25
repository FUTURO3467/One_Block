import { getLevel } from "levels.js";

export function execute(player){
    const lvl = getLevel(player.dimension)
    player.sendMessage("§aBlock Possibilities :")
    lvl.blocks.forEach(element => {
        player.sendMessage("§6"+element[0] + ": §e" + (element[1]*100).toFixed(1) + " %")
    });
    player.sendMessage(" ")
    player.sendMessage("§aChests Loots : ")
    lvl.chest.forEach(element => {
        player.sendMessage("§6"+element[0])
    });
    player.sendMessage(" ")
    player.sendMessage("§aLevel Reward : ")
    lvl.rewards.forEach(element => {
        player.sendMessage("§6"+element[0]+ "§ex" + element[1])
    });

}