export const x = "";

declare global {
    interface CreepMemory {
        role: string,
        home: string,
        [key:string]:any
    }
}