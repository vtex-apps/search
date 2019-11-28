import * as React from "react";
import { ExtensionPoint } from "vtex.render-runtime";
import styles from "./styles";
import { Product } from "../../../../models/product";

interface TileListProps {
  term: string;
  title: string;
  products: Product[];
  showTitle: boolean;
  shelfProductCount: number;
  totalProducts: number;
}

export class TileList extends React.Component<TileListProps> {
  render() {
    const unseenProductsCount = Math.max(
      this.props.totalProducts - this.props.shelfProductCount,
      0,
    );

    return (
      <section className={styles.tileList}>
        {this.props.showTitle ? (
          <h1 className={styles.tileListTitle}>{this.props.title}</h1>
        ) : null}

        <ul className={styles.tileListList}>
          {this.props.products.slice(0, 3).map((product, index) => (
            <li key={index} className={styles.tileListItem}>
              <ExtensionPoint
                id="product-summary"
                product={product.toSummary()}
              />
            </li>
          ))}
        </ul>

        <footer>
          {unseenProductsCount > 0 ? (
            <a
              className={styles.tileListSeeMore}
              href={`/search?query=${this.props.term}`}
            >
              Veja mais {unseenProductsCount} produtos
            </a>
          ) : null}
        </footer>
      </section>
    );
  }
}
