import { createConnection, getConnectionManager } from "typeorm"

const promise = (function(){
    const manager = getConnectionManager()
    if(!manager.has('default')){
        return createConnection()
    }else{
        const current = manager.get('default')
        if(current.isConnected){
            return current;
        }else{
            return manager.has('default')
        }
    }
})()

export const getDatabaseConnection =  function(){
    return promise;
}