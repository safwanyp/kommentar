import type { Comment } from "../domain/entities/comment.js";
import type { CacheStore } from "../driven-ports/cache-store.js";
import type { EventBroker } from "../driven-ports/event-broker.js";

type WheneverCommentDeletedInvalidateCachePolicy = ({
  eventBroker,
  cacheStore,
}: {
  eventBroker: EventBroker;
  cacheStore: CacheStore;
}) => void;

const wheneverCommentDeletedInvalidateCache: WheneverCommentDeletedInvalidateCachePolicy =
  ({ eventBroker, cacheStore }) => {
    eventBroker.subscribe({
      type: "kommentar.comment.deleted",
      handler: (event) => {
        const deletedComment = event.data as Comment;
        const { hostId: key } = deletedComment;

        const currentCachedComments = cacheStore.get(key) as
          | Comment[]
          | undefined;

        if (!currentCachedComments) {
          return;
        }

        const updatedCachedComments = currentCachedComments.filter(
          (comment) => comment.id !== deletedComment.id,
        );

        cacheStore.set(key, updatedCachedComments);
      },
    });
  };

export { wheneverCommentDeletedInvalidateCache };
