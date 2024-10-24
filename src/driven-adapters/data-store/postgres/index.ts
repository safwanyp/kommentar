import type { Config } from "../../../app/driven-ports/config.js";
import type { DataStore } from "../../../app/driven-ports/data-store.js";
import type { SecretStore } from "../../../app/driven-ports/secret-store.js";
import { migrate } from "./migrate.js";
import { getPgPool } from "./pool.js";
import {
  deleteCommentByIdQuery,
  getAllCommentsByHostIdQuery,
  saveCommentByHostIdQuery,
  updateCommentByIdQuery,
} from "./queries.js";

type GetDataStorePostgres = ({
  config,
  secretStore,
}: {
  config: Config["dataStore"];
  secretStore: SecretStore;
}) => Promise<DataStore>;

const getDataStorePostgres: GetDataStorePostgres = async ({
  config,
  secretStore,
}) => {
  const pgPool = getPgPool({ config, secretStore });

  await migrate({ pgPool });

  return {
    getAllCommentsByHostId: async ({ hostId }) => {
      try {
        const result = await pgPool.query(
          getAllCommentsByHostIdQuery({ hostId }),
        );

        return result.rows;
      } catch (error) {
        console.error("Failed to get comments by host identifier", error);
        throw error;
      }
    },
    saveCommentByHostId: async ({ hostId, content }) => {
      try {
        const result = await pgPool.query(
          saveCommentByHostIdQuery({ hostId, content }),
        );

        return result.rows[0];
      } catch (error) {
        console.error("Failed to save comment by host identifier", error);
        throw error;
      }
    },
    updateCommentById: async ({ id, content }) => {
      try {
        const result = await pgPool.query(
          updateCommentByIdQuery({ id, content }),
        );

        return result.rows[0];
      } catch (error) {
        console.error("Failed to update comment by identifier", error);
        throw error;
      }
    },
    deleteCommentById: async ({ id }) => {
      try {
        await pgPool.query(deleteCommentByIdQuery({ id }));
      } catch (error) {
        console.error("Failed to delete comment by identifier", error);
        throw error;
      }
    },
  };
};

export { getDataStorePostgres };
