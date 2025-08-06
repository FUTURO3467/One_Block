import { CommandPermissionLevel }  from "@minecraft/server";
import { executeLevelCommand } from "commands/levelCommand.js"

export function registerCommands(commandRegistry){
    const levelCommand = {
      name: "one_block:level",
      description: "Shows level's informations",
      permissionLevel: CommandPermissionLevel.Any
    };
    commandRegistry.registerCommand(levelCommand, executeLevelCommand);
}