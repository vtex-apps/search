import * as React from "react";
import { Product } from "vtex.search/index";
import { Link } from "vtex.render-runtime";
import styles from "./styles.css";
import { removeBaseUrl } from "../../../../utils/string-utils";

interface CustomListItemProps {
  product: Product;
}

export class CustomListItem extends React.Component<CustomListItemProps> {
  render() {
    const product = this.props.product;

    return (
      <div>
        <Link to={removeBaseUrl(product.productUrl)} className="no-underline">
          <article
            className={`${styles.element} flex flex-row justify-start items-center pa3 bg-animate hover-bg-light-gray`}
          >
            {product.price < product.oldPrice ? (
              <p className={styles.discount}>
                -{((1 - product.price / product.oldPrice) * 100).toFixed(0)}%
              </p>
            ) : null}

            <div className={`${styles.imageContainer} h3`}>
              <img
                className={`${styles.image} h-100 w-auto mw-none`}
                src={product.primaryImageUrl}
              />
            </div>
            <div
              className={`${styles.information} flex flex-column justify-between items-start ml4`}
            >
              <div className={styles.productNameContainer}>
                <span className={`${styles.productBrand} f5 c-on-base`}>
                  {product.name}
                </span>
              </div>
              <div className={styles.priceContainer}>
                {product.price < product.oldPrice &&
                product.oldPrice !== product.price ? (
                  <span
                    className={`${styles.priceOld} pv1 normal dib ph2 strike t-small-ns t-mini c-muted-2`}
                  >{`${product.oldPriceText}`}</span>
                ) : null}
                <span
                  className={`${styles.priceNew} dib ph2 t-body t-heading-5-ns c-on-base`}
                >{`${product.priceText}`}</span>
              </div>
            </div>
          </article>
        </Link>
      </div>
    );
  }
}
