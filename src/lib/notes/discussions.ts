import { type Value } from "platejs";

export type DiscussionUser = {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  image?: string | null;
};

export type StoredComment = {
  id: string;
  contentRich: Value;
  discussionId: string;
  isEdited: boolean;
  userId: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  user?: DiscussionUser;
};

export type StoredDiscussion = {
  id: string;
  comments: StoredComment[];
  createdAt: Date | string;
  isResolved: boolean;
  userId: string;
  documentContent?: string;
};

export type DiscussionUsersMap = Record<string, DiscussionUser>;

export function parseStoredDiscussions(
  discussions: StoredDiscussion[],
): StoredDiscussion[] {
  return discussions;
}
