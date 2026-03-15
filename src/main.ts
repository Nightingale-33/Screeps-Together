import { roleBobTheBuilder } from "./BobTheBuilder";
import { ROLE_ENERGY_BITCH, ROLE_BOB_THE_BUILDER } from "./Constants";
import { roleEnergyBitch } from "./EnergyBitch";
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
    if(creep?.memory.role === ROLE_ENERGY_BITCH)
    {
      roleEnergyBitch.run(creep);
    }
    else if (creep?.memory.role === ROLE_BOB_THE_BUILDER)
    {
      roleBobTheBuilder.run(creep);
    }
  }
}