import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { getLevelNumber, getLevel, getMaxLevelNumber, setLevel } from "../levels.js";
import { formatId } from "../utils.js";


export function openLevelManager(player) {
    const form = new ActionFormData()
        .title("Level Manager")
        .button("See Current Level's Informations")
        .button("Change Level");

    form.show(player).then(response => {
        if (response.canceled) return;
        const choice = response.selection;
        switch (choice){
            case 0:
                openLevelInfoMenu(player, openLevelManager)
            case 1:
                openLevelChangerMenu(player)
        }
    });
}

function openLevelInfoMenu(player, fromfunc){
    const menu = new ModalFormData()
    .title(formatId(player.dimension.id) +" Level " +  getLevelNumber(player.dimension))
    const lvl = getLevel(player.dimension)

    const blockSD = menu.divider().header("§aBlock Possibilities :")

    lvl.blocks.forEach(element => {
        blockSD.label("§6"+formatId(element[0]) + ": §e" + (element[1]*100).toFixed(1) + " %")
    });
    const chestSD = menu.divider().header("§aChests Loots :")
    lvl.chest.forEach(element => {
        chestSD.label("§6"+formatId(element[0]))
    });
    const rewardSD = menu.divider().header("§aLevel Reward :")
    lvl.rewards.forEach(element => {
        rewardSD.label("§6"+formatId(element[0])+ "§ex" + element[1])
    });
    menu.submitButton("<-----")
    menu.show(player).then(response => {
        if (response.canceled) return;
        fromfunc(player)
    })
}

function openLevelChangerMenu(player){
    const menu = new ModalFormData()
    .slider("Choose " + formatId(player.dimension.id)+ " active Level",
     1, getMaxLevelNumber(player.dimension), {defaultValue: getLevelNumber(player.dimension)})
     menu.show(player).then(response => {
        if (response.canceled) return;
        const res = response.formValues()[0]
        setLevel(player.dimension, res, false)
        
    })
}