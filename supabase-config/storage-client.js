"use strict";

import { StorageClient } from "@supabase/storage-js";

const storageClient = new StorageClient(process.env.SUPABASE_STORAGE_URL, {
  apikey: process.env.SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
});

export default storageClient;
