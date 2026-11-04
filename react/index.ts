import SearchClient from "./utils/search-client";

export default {
  SearchClient,
  /** @deprecated Use `SearchClient`. Kept so existing imports keep working. */
  BiggyClient: SearchClient,
};
