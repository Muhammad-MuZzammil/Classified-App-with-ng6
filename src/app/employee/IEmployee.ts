import { ISkill } from "./ISkill";

export class IEmployee{
    id:number;
    fullName:string;
    email:string;
    phone?:number;
    contactPreference:string;
    skills:ISkill[];
}