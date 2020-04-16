import { IOContext, InstanceOptions } from "@vtex/api";
import { GraphQLServer } from './graphql-server';

import { pathOr } from "ramda";

const extensions = {
  persistedQuery: {
    provider: 'vtex.search-graphql@0.x',
    sender: 'vtex.search@0.x',
  },
}

export class SearchGraphql extends GraphQLServer {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, options);
  }

  public productsById = async (ids: string[]) => {
    const result = await this.query(PRODUCTS_BY_ID_QUERY, { ids }, extensions, {})
    return pathOr<any[], string[]>(
      [],
      ["data", "productsByIdentifier"],
      result,
    );
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
