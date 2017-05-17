import { schema } from 'normalizr';

export const categorySchema = new schema.Entity('categories');

export const eventSchema = new schema.Entity('events', {
    categories: [categorySchema]
});

export const eventListSchema = [eventSchema];
