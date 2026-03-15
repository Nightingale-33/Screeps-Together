export var x = 0;

declare global {
    interface CreepMemory {
        role: string,
        home: string,
        action: string,
        [key:string]:any
    }
    function Beep() : void;
}

global.Beep = function()
{
    for(let creepName in Game.creeps)
    {
        let creep = Game.creeps[creepName];

        creep?.say("beep");
    }
}