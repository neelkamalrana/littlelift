import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const bills = sqliteTable('bills', {
 id:text('id').primaryKey(),hasImage:integer('has_image').notNull().default(0),owner:text('owner').notNull(),name:text('name').notNull(),
 category:text('category').notNull(), cents:integer('cents').notNull(),story:text('story').notNull(),
 paypal:text('paypal').notNull(),status:text('status').notNull().default('open'),
 createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull()
});
