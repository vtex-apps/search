import * as React from "react";
import { path } from "ramda";
import { Link } from "vtex.render-runtime";
import styles from "./styles.css";
import ProductPrice from "vtex.store-components/ProductPrice";

interface CustomListItemProps {
  product: any;
}

export class CustomListItem extends React.Component<CustomListItemProps> {
  render() {
    const product = this.props.product;
    const sku = path<any>(["sku"], product);
    const commertialOffer = path<any>(["seller", "commertialOffer"], sku);

    return (
      <div>
        <Link
          params={{
            slug: product && product.linkText,
            id: product && product.productId,
          }}
          page="store.product"
          className="no-underline"
        >
          <article
            className={`${styles.element} flex flex-row justify-start items-center pa3 bg-animate hover-bg-light-gray`}
          >
            <div className={`${styles.imageContainer} h3`}>
              <img
                className={`${styles.image} h-100 w-auto mw-none`}
                src={sku.image.imageUrl}
              />
            </div>
            <div
              className={`${styles.information} flex flex-column justify-between items-start ml4`}
            >
              <div className={styles.productNameContainer}>
                <span className={`${styles.productBrand} f5 c-on-base`}>
                  {product.productName}
                </span>
              </div>
              <div className={styles.priceContainer}>
                <ProductPrice
                  sellingPrice={commertialOffer.Price}
                  listPrice={commertialOffer.ListPrice}
                  sellingPriceContainerClass="c-on-base"
                  sellingPriceLabelClass="dib"
                  sellingPriceClass="dib t-small c-muted-2"
                  showListPrice={true}
                  showLabels={false}
                  showInstallments={false}
                />
              </div>
            </div>
          </article>
        </Link>
      </div>
    );
  }
}
