import * as _ from "lodash";
import { ROLE_ENERGY_BITCH, ROLE_BOB_THE_BUILDER, ACTION_NONE, ROLE } from "./Constants";

let firstNames : string[] = require("./utils/first-names.json");
let lastNames : string[] = require("./utils/names.json");

export function ManageSpawns() {    
    for(let roomName in Game.rooms)
    {
        let room = Game.rooms[roomName];
        if(room?.controller?.my)
        {
            let thisRoomsCreeps = _.filter(Game.creeps,(creep) => creep.memory.home === roomName);
            
            let workerWorkCount = _.sum(thisRoomsCreeps.filter((creep) => creep.memory.role === ROLE_ENERGY_BITCH), (creep) => creep.body.filter(bp => bp.type === WORK).length);

            let sources = room.find(FIND_SOURCES);

            //It takes 10 Work parts, 300 ticks to deplete a source
            if(workerWorkCount < sources.length * 10)
            {
                DoSpawnLogic(ROLE_ENERGY_BITCH,room,roomName,workerWorkCount > 0);
            }

            let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

            if(constructionSites.length > 0 && thisRoomsCreeps.filter((creep) => creep.memory.role === ROLE_BOB_THE_BUILDER).length < Math.ceil(constructionSites.length / 10))
            {
                DoSpawnLogic(ROLE_BOB_THE_BUILDER,room,roomName,workerWorkCount > 0);
            }
        }
        //Else not our room to worry about
    }
}

function DoSpawnLogic(role : ROLE, room : Room, roomName : string, roomFunctioning : boolean)
{
    let spawns = room.find(FIND_MY_SPAWNS);
    let minEnergy = spawns.length * SPAWN_ENERGY_CAPACITY; 

    let spawnToUse = spawns.find((spawn) => spawn.isActive() && !spawn.spawning);
    if(!spawnToUse)
    {
        return;
    }
    
    //If the spawns aren't full, don't bother
    if(room.energyAvailable < minEnergy)
    {
        return;
    }    

    //We could wait a bit
    if(roomFunctioning && room.energyAvailable < room.energyCapacityAvailable)
    {
        return;
    }

    const baseBody = [WORK,CARRY,MOVE];
    const bodyAddon = [WORK,CARRY];

    let largestBody = GetLargestBody(spawnToUse, baseBody, bodyAddon);
    if (largestBody.length == 0) {
        return null;
    }
    return SpawnCreep(spawnToUse, largestBody, {role: role, home: roomName, action: ACTION_NONE});
}

function SpawnCreep(spawn : StructureSpawn, bodyToSpawn: BodyPartConstant[], memory: CreepMemory) : string | null
{
    if(!spawn.isActive())
    {
        return null;
    }

    if(spawn.spawning)
    {
        return null;
    }

    let randomFirstName : string | undefined = undefined;
    let randomLastName : string | undefined = undefined;
    let creepName : string = "";
    while(!randomFirstName || !randomLastName || Game.creeps[creepName])
    {
        randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        creepName = `${randomFirstName}_${randomLastName}`;
        console.log(`Trying name: ${creepName} which has a creep: ${JSON.stringify(Game.creeps[creepName])}`);
    }
    
    let result = spawn.spawnCreep(bodyToSpawn,creepName, {
        memory: memory
    });

    if(result == OK)
    {
        return creepName;
    }

    return null;
}

export const defaultBodySortOrder : BodyPartConstant[] = [TOUGH,CARRY,WORK,ATTACK,RANGED_ATTACK,CLAIM,HEAL,MOVE];

function defaultBodySort(a : BodyPartConstant) : number
{
  return defaultBodySortOrder.indexOf(a);
}

export function SortBodyParts(body: BodyPartConstant[], comparisonFunction: (a : BodyPartConstant) => number = defaultBodySort): BodyPartConstant[]
{
  return _.sortBy(body,comparisonFunction);
}

function FixBodyWithMove(body : BodyPartConstant[]) : BodyPartConstant[]
{
  let perType = _.countBy(body);
  let neededAdditionalMoveParts = Math.floor(Math.max(0,
    (perType[CARRY] ?? 0) * 2 +
    (perType[WORK] ?? 0) +
    (perType[TOUGH] ?? 0) +
    (perType[CLAIM] ?? 0) +
    (perType[ATTACK] ?? 0) +
    (perType[RANGED_ATTACK] ?? 0) +
    (perType[HEAL] ?? 0)
    - (perType[MOVE] ?? 0) * 2)
    / 2);
  if(neededAdditionalMoveParts == 0)
  {
    return body;
  }
  let additionalMove = [...Array(neededAdditionalMoveParts)].map(() => MOVE);
  return body.concat(additionalMove);
}

export function GetLargestBody(spawn : StructureSpawn, baseBody: BodyPartConstant[], bodyAddition: BodyPartConstant[], maximumAddons : number = Infinity, fixMove : boolean = true, sorted: boolean = true, sortBy : (a:BodyPartConstant) => number = defaultBodySort)
{
    let bodyToSpawn = baseBody;
    let lastWorkingBody : BodyPartConstant[] = [];
    let addons = 0;
    while (spawn.spawnCreep(bodyToSpawn, "Test", { dryRun: true }) == OK && addons < maximumAddons) {
      lastWorkingBody = bodyToSpawn;
      bodyToSpawn = bodyToSpawn.concat(bodyAddition);
      if(fixMove)
      {
        bodyToSpawn = FixBodyWithMove(bodyToSpawn);
      }
      addons++;
    }
    bodyToSpawn = lastWorkingBody;
    if(sorted)
    {
      bodyToSpawn = SortBodyParts(bodyToSpawn,sortBy);
    }
    return bodyToSpawn;
}