import { FieldNode, GraphQLResolveInfo } from "graphql";
import { SearchSuggestions } from "../clients/search-resolver";

/**
 * Maps search suggestions from vtex.search-graphql to the 1.x
 * `SuggestionQueryResponseSearch` type.
 *
 * vtex.search-graphql has no `labelKey`, which the 1.x schema declares as
 * non-null. It is filled with the attribute `key`. The 1.x front end only
 * renders `labelValue`.
 */
export const toSuggestionSearches = (
  suggestions: SearchSuggestions | null | undefined,
) =>
  (suggestions?.searches ?? [])
    .filter(<T>(search: T | null): search is T => search != null)
    .map(search => ({
      term: search.term,
      count: search.count,
      attributes: search.attributes
        ? search.attributes.map(attribute => ({
            key: attribute.key,
            value: attribute.value,
            labelKey: attribute.key,
            labelValue: attribute.labelValue,
          }))
        : search.attributes,
    }));

/**
 * In 1.x the product origin is an argument of the nested `products` field
 * (`products(origin: VTEX)`), not of the query itself. This reads it from the
 * query so it can be sent to vtex.search-resolver as `productOriginVtex`.
 */
export const wantsVtexProductOrigin = (info: GraphQLResolveInfo): boolean =>
  info.fieldNodes.some(fieldNode =>
    (fieldNode.selectionSet?.selections ?? []).some(selection => {
      if (selection.kind !== "Field" || selection.name.value !== "products") {
        return false;
      }

      const originArgument = (selection as FieldNode).arguments?.find(
        argument => argument.name.value === "origin",
      );

      if (!originArgument) {
        return false;
      }

      const { value } = originArgument;

      if (value.kind === "EnumValue") {
        return value.value === "VTEX";
      }

      if (value.kind === "Variable") {
        return info.variableValues[value.name.value] === "VTEX";
      }

      return false;
    }),
  );
