function getCoinRawMessage(coin_nb){
    if(coin_nb == 1){
        return {
            translate: "actionbar.futuro.coin_notification_singular"
        }
    }else{
        return {
            translate: "actionbar.futuro.coin_notification_plurial",
            with: [coin_nb+""]
        }
    }
}

function getBlockBreakRawMessage(lvlnumber, lvlblock, maxlvlblock){
    return {rawtext:[
        {translate:"ui.futuro.level"},
        {text:" " + lvlnumber + ' : §e'+ lvlblock + ' / ' + maxlvlblock}
    ]}
}


export function setActionBar(coin_nb, lvlnumber, lvlblock, maxlvlblock, player){
    player.onScreenDisplay.setActionBar({
        rawtext:[getCoinRawMessage(coin_nb), {text:"              §a"}, getBlockBreakRawMessage(lvlnumber, lvlblock, maxlvlblock)]
    })
}