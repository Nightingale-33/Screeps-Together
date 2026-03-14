import { ManageSpawns } from "./SpawnControl";

export function loop() {
  // Your Screeps code here
  console.log(`Current game tick is ${Game.time}`);

  if(Game.time % 10 == 0)
  {
    ManageSpawns();
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep?.memory.role === "EnergyBitch")
    {

    }

  }
}