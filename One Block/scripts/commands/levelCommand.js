import { openLevelManager } from "ui/uimanager.js"
import { system, Player }  from "@minecraft/server";

export function executeLevelCommand(initiator){
    if(initiator.sourceType != "Entity")return
    if(!(initiator.sourceEntity instanceof Player))return
    system.run(()=>{
        openLevelManager(initiator.sourceEntity)
    })
}