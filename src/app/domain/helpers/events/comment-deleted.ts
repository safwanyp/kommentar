import type { CloudEvent } from "../../../driven-ports/event-broker.js";
import type { RandomId } from "../../../driven-ports/random-id.js";
import type { Comment } from "../../entities/comment.js";

type ToCommentDeletedEvent = ({
  deletedComment,
  subject,
  source,
  randomId,
}: {
  deletedComment: Comment;
  subject: string;
  source: string;
  randomId: RandomId;
}) => CloudEvent;

const toCommentDeletedEvent: ToCommentDeletedEvent = ({
  deletedComment,
  subject,
  source,
  randomId,
}) => {
  return {
    specversion: "1.0",
    type: "kommentar.comment.deleted",
    source,
    datacontenttype: "application/json",
    data: deletedComment,
    id: randomId.generate(),
    subject,
    time: new Date().toISOString(),
  };
};

export type { ToCommentDeletedEvent };
export { toCommentDeletedEvent };
