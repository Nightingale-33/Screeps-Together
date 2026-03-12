export const x = "";

declare global {
    interface CreepMemory {
        role: string,
        [key:string]:any
    }
}