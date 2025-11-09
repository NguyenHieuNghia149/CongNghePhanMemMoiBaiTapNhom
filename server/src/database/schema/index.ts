// Export all schemas
export * from './user';
export * from './token';
export * from './topic';
export * from './lesson';
export * from './problem';
export * from './submission';

// Relations
import { relations } from 'drizzle-orm';
import { users } from './user';
import { refreshTokens } from './token';
import { topics } from './topic';
import { lessons } from './lesson';
import { problems } from './problem';
import { submissions } from './submission';

export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  submissions: many(submissions),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  lessons: many(lessons),
  problems: many(problems),
}));

export const lessonsRelations = relations(lessons, ({ many, one }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  problems: many(problems),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [problems.lessonId],
    references: [lessons.id],
  }),
  topic: one(topics, {
    fields: [problems.topicId],
    references: [topics.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));
