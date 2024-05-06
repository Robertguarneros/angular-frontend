import * as mongoose from 'mongoose';

export interface IHousing {
    _id?: string; // Optional _id field
    title: string;
    description: string;
    owner: string; // Reference to the User collection
    reviews?: string[];
    rating: string;
    coords: {
        latitude: string;
        longitude: string;
    };
    photo: string;
    address: string;
    availability: boolean;
    coffee: boolean; //true only "coffee" 
    schedule: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    verified: boolean;
    house_deactivated:boolean;
    creation_date?: Date;
    modified_date?: Date;
}