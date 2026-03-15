declare global {
    interface CreepMemory {
        role: ROLE,
        home: string,
        action: ACTIONS,
        [key:string]:any
    }
}

export function Beep()
{
    for(let creepName in Game.creeps)
    {
        let creep = Game.creeps[creepName];

        creep?.say("beep");
    }
}