import { ModalFormData, ActionFormData } from "@minecraft/server-ui";
import { getLevelNumber, getLevel, getMaxLevelNumber, setLevel } from "../levels.js";
import { formatId, capitalizeFirstLetter } from "../utils.js";
import { getAttack, getDefense, getHp } from "statsmanager.js";
import { getCoins } from "economy.js";


export function openLevelManager(player) {
    const form = new ActionFormData()
        .title("ui.futuro.level_manager")
        .button("ui.futuro.cu_level_info")
        .button("ui.futuro.change_lvl");


    const stats = form.divider().header("ui.futuro.stats")
    stats.label(
        {rawtext:
            [
                {translate: "message.futuro.attack_point"}, 
                {text: ": " + getAttack()}
            ]
        }
    )
    stats.label(
        {rawtext:
            [
                {translate: "message.futuro.defense_point"}, 
                {text: ": " + getDefense()}
            ]
        }
    )
    stats.label(
        {rawtext:
            [
                {translate: "message.futuro.health_points"}, 
                {text: ": " + getHp()}
            ]
        }
    )
    stats.label(
        {rawtext:
            [
                {translate: "message.futuro.coin"}, 
                {text: ": " + getCoins()}
            ]
        }
    )

    form.show(player).then(response => {
        if (response.canceled) return;
        const choice = response.selection;
        switch (choice){
            case 0:
                openLevelInfoMenu(player, openLevelManager)
                break;
            case 1:
                openLevelChangerMenu(player)
                break
            default:
                break
        }
    });
}

function openLevelInfoMenu(player, fromfunc){
    const menu = new ModalFormData()
    .title(
        {rawtext:[
         {text: formatId(player.dimension.id)+" "},
         {translate:"ui.futuro.level"} ,
         {text:" " + getLevelNumber(player.dimension)}
        ]})
    const lvl = getLevel(player.dimension)

    const blockSD = menu.divider().header("ui.futuro.block_possibilities")

    lvl.blocks.forEach(element => {
        blockSD.label(
            {rawtext:
                [
                    {text:"§6"},
                    {translate: capitalizeFirstLetter(formatId(element[0]))}, 
                    {text: ": §e" + (element[1]*100).toFixed(1) + " %"}
                ]
            }
        )
    });
    const chestSD = menu.divider().header("ui.futuro.chests_loots")
    lvl.chest.forEach(element => {
        chestSD.label(            
            {rawtext:
                [
                    {text:"§6"},
                    {translate: capitalizeFirstLetter(formatId(element[0]))}
                ]
            }
        )
    });
    const rewardSD = menu.divider().header("ui.futuro.level_rewards")
    lvl.rewards.forEach(element => {
        rewardSD.label(            
            {rawtext:
                [
                    {text:"§6"},
                    {translate:capitalizeFirstLetter(formatId(element[0]))}, 
                    {text: "§ex" + element[1]}
                ]
            } 
        )
    });
    menu.submitButton("<-----")
    menu.show(player).then(response => {
        if (response.canceled) return;
        fromfunc(player)
    })
}

function openLevelChangerMenu(player){
    const menu = new ModalFormData()
    .slider({translate:"ui.futuro.choose_dimension_active_level", with:[formatId(player.dimension.id)]},
     1, getMaxLevelNumber(player.dimension), {defaultValue: getLevelNumber(player.dimension)})
     menu.show(player).then(response => {
        if (response.canceled) return;
        const res = response.formValues[0]
        setLevel(player.dimension, res, false)
        
    })
}
