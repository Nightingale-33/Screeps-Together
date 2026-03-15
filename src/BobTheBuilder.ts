import { ACTION_BUILD, ACTION_HARVEST, ACTION_NONE, ACTION_UPGRADE } from "./Constants";

export var roleBobTheBuilder = {
    run: function (creep:Creep) {
        if((creep.memory.action == ACTION_BUILD || creep.memory.action == ACTION_NONE) && creep.store.getUsedCapacity() == 0) {
            creep.memory.action = ACTION_HARVEST;
            creep.say ('nom nom🐸')
        }
        if(creep.memory.action != ACTION_BUILD && creep.store.getFreeCapacity () == 0) {
            creep.memory.action =  ACTION_BUILD;
            creep.say ("🔨");        
        }
        

        if(creep.memory.action == ACTION_BUILD){
            var targets = creep.room.find (FIND_CONSTRUCTION_SITES)
                .sort((siteA,siteB) => siteB.progress - siteA.progress);

            if(targets[0]) 
            {
                if(creep.build(targets[0])== ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targets[0], {visualizePathStyle : {stroke: '#0ed4d4c9'}});
                } 
            } else
            {
                creep.memory.action = ACTION_UPGRADE;
                creep.say("⚡");
            }
        }
        
        if(creep.memory.action == ACTION_HARVEST)
        {
            var sources = creep.room.find (FIND_SOURCES)
                .sort((sourceA,sourceB) => sourceB.energy - sourceA.energy);

            if (sources[0]) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)  {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }   
        }

        if(creep.memory.action == ACTION_UPGRADE)
        {
            var controller = creep.room.controller;

            if(controller)
            {
                if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(controller,{visualizePathStyle: {stroke: '#59005c'}})
                }
            }
        }
    }
}
