import { world } from "@minecraft/server";

function load() {
    const raw = world.getDynamicProperty("globalData");
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

function save(data) {
    world.setDynamicProperty("globalData", JSON.stringify(data));
}

export function setKey(key, value) {
    
    const data = load();
    data[key] = value;
    save(data);
}

export function getKey(key, defaultValue = null) {
    const data = load();
    if (key in data){
        return data[key]
    }
    setKey(key, defaultValue)
    return defaultValue;
}

