export const x = "";

declare global {
    interface CreepMemory {
        role: string,
        home: string,
        action: string,
        [key:string]:any
    }
}