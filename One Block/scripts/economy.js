import { setKey, getKey } from 'jsonstorage.js'


export function addCoins(nb){
    setKey("coins",getKey("coins",0)+nb)
}

export function removeCoins(nb){
    setKey("coins",getKey("coins",0)-nb)
}

export function getCoins(){
    return getKey("coins",0)
}