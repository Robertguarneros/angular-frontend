import * as mongoose from 'mongoose';

export interface Review {
    _id?: string; // Optional _id field
    title: string;
    content: string;
    stars: number;
    author?: string; // Reference to the User collection
    place_id?: string; // Reference to the Place model
    housing_id?: string; // Reference to the Housing model
    review_deactivated?: boolean;
    creation_date?: Date;
    modified_date?:Date;
}