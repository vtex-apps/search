import { AppGraphQLClient, IOContext, InstanceOptions } from "@vtex/api";
import { pathOr } from "ramda";

export class SearchGraphQL extends AppGraphQLClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super("vtex.search-graphql", context, options);
  }

  public productsById = async (ids: string[]) => {
    try {
      const result = await this.graphql.query<any, { ids: string[] }>({
        inflight: true,
        variables: { ids },
        query: PRODUCTS_BY_ID_QUERY,
      });

      return pathOr<any[]>([], ["data", "productsByIdentifier"], result);
    } catch (err) {
      return [];
    }
  };
}

const PRODUCTS_BY_ID_QUERY = `
  query ProductsByReference($ids: [ID!]) {
    productsByIdentifier(field: id, values: $ids) {
      cacheId
      productId
      description
      productName
      productReference
      linkText
      brand
      brandId
      link
      categories
      priceRange {
        sellingPrice {
          highPrice
          lowPrice
        }
        listPrice {
          highPrice
          lowPrice
        }
      }
      specificationGroups {
        name
        specifications {
          name
          values
        }
      }
      items(filter: ALL_AVAILABLE) {
        itemId
        name
        nameComplete
        complementName
        ean
        variations {
          name
          values
        }
        referenceId {
          Key
          Value
        }
        measurementUnit
        unitMultiplier
        images {
          cacheId
          imageId
          imageLabel
          imageTag
          imageUrl
          imageText
        }
        sellers {
          sellerId
          sellerName
          commertialOffer {
            discountHighlights {
              name
            }
            teasers {
              name
              conditions {
                minimumQuantity
                parameters {
                  name
                  value
                }
              }
              effects {
                parameters {
                  name
                  value
                }
              }
            }
            Installments(criteria: MAX) {
              Value
              InterestRate
              TotalValuePlusInterestRate
              NumberOfInstallments
              Name
            }
            Price
            ListPrice
            PriceWithoutDiscount
            RewardValue
            PriceValidUntil
            AvailableQuantity
          }
        }
      }
      productClusters {
        id
        name
      }
      properties {
        name
        values
      }
    }
  }
`;
