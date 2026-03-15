import { BUILD_ACTION } from "./Constants"

export var roleBobTheBuilder = {
    run: function (creep:Creep) {
        if(creep.memory.action == BUILD_ACTION && creep.store [RESOURCE_ENERGY] ==0) {
            creep.memory.action = 'harvest';
            creep.say ('nom nom🐸')
        }
        if(creep.memory.action != BUILD_ACTION && creep.store.getFreeCapacity () ==0) {
            creep.memory.action =  BUILD_ACTION;
            creep.say ("🔨");        
        }
        
        if(creep.memory.action == BUILD_ACTION){
            var targets = creep.room.find (FIND_CONSTRUCTION_SITES);
                if(targets[0]) {if(creep.build(targets[0])== ERR_NOT_IN_RANGE){
                    creep.moveTo(targets[0], {visualizePathStyle : {stroke: '#0ed4d4c9'}});
                } }
        }
        else if(creep.memory.action == 'harvest')
        {
            var sources = creep.room.find (FIND_SOURCES);
            if (sources[0]) {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)  {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            }   
        }
    }
}
