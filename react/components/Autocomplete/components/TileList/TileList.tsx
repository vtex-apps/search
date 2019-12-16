import * as React from "react";
import { ExtensionPoint } from "vtex.render-runtime";
import styles from "./styles";
import { Product } from "../../../../models/product";
import { CustomListItem } from "../CustomListItem/CustomListItem";
import { ProductLayout } from "../..";
import { Spinner } from "vtex.styleguide";
import ProductSummary from "vtex.product-summary/ProductSummaryCustom";
import { FormattedMessage } from "react-intl";

interface TileListProps {
  term: string;
  title: string | JSX.Element;
  products: Product[];
  showTitle: boolean;
  shelfProductCount: number;
  totalProducts: number;
  layout: ProductLayout;
  isLoading: boolean;
}

export class TileList extends React.Component<TileListProps> {
  render() {
    if (this.props.products.length === 0 && !this.props.isLoading) {
      return null;
    }

    const unseenProductsCount = Math.max(
      this.props.totalProducts - this.props.shelfProductCount,
      0,
    );

    return (
      <section className={styles.tileList}>
        {this.props.showTitle ? (
          <h1 className={`${styles.tileListTitle} c-on-base`}>
            {this.props.title}
          </h1>
        ) : null}
        {this.props.isLoading ? (
          <div className={styles.tileListSpinner}>
            <Spinner />
          </div>
        ) : (
          <>
            <ul
              className={styles.tileListList}
              style={{
                flexDirection:
                  this.props.layout === ProductLayout.Horizontal
                    ? "column"
                    : "row",
              }}
            >
              {this.props.products.map(product => {
                const productSummary = ProductSummary.mapCatalogProductToProductSummary(
                  product.toSummary(),
                );

                return (
                  <li key={product.productId} className={styles.tileListItem}>
                    {this.props.layout === ProductLayout.Horizontal ? (
                      <CustomListItem product={productSummary} />
                    ) : (
                      <ExtensionPoint
                        id="product-summary"
                        product={productSummary}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <footer>
              {unseenProductsCount > 0 ? (
                <a
                  className={styles.tileListSeeMore}
                  href={`/search?_query=${this.props.term}`}
                >
                  <FormattedMessage
                    id="store/seeMore"
                    values={{ count: unseenProductsCount }}
                  />
                </a>
              ) : null}
            </footer>
          </>
        )}
      </section>
    );
  }
}
