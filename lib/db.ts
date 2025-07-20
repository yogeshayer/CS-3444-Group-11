import { AstraDB } from "@datastax/astra-db-ts";

export const db = new AstraDB({
  region: "us-east1",
  databaseId: "7f2d284c-d12d-44e9-bd1a-4fd23bb89799",
  applicationToken: "AstraCS:fBcNpLyyHjuJJBMWAahMkTrc:c2505efed17efd73ad33695c01ed8a158917373e6f6900c24b77c8a3a90112be",
});
