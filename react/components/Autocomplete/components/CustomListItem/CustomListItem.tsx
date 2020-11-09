import * as React from "react";
import { path } from "ramda";
import { Link } from "vtex.render-runtime";
import { SellingPrice, ListPrice } from "vtex.product-price";
import { ProductContextProvider } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";

import styles from "./styles.css";

interface CustomListItemProps {
  product: any;
}

const CSS_HANDLES = [
  "element",
  "imageContainer",
  "image",
  "information",
  "productNameContainer",
  "productBrand",
  "priceContainer",
];

const CustomListItem = ({ product }: CustomListItemProps) => {
  const handles = useCssHandles(CSS_HANDLES);
  const sku = path<any>(["sku"], product);
  const taxPercentage = sku?.sellers?.[0]?.commertialOffer?.taxPercentage;

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
          className={`${handles.element} flex flex-row justify-start items-center pa3 bg-animate hover-bg-light-gray relative`}
        >
          <div
            className={`${handles.imageContainer} ${styles.imageContainer} h3`}
          >
            <img
              className={`${handles.image} h-100 w-auto mw-none`}
              src={sku.image.imageUrl}
            />
          </div>
          <div
            className={`${handles.information} flex flex-column justify-between items-start ml4`}
          >
            <div className={handles.productNameContainer}>
              <span className={`${handles.productBrand} f5 c-on-base`}>
                {product.productName}
              </span>
            </div>
            <div className={handles.priceContainer}>
              <ProductContextProvider
                product={product}
                query={{
                  skuId: sku && sku.itemId,
                }}
              >
                <span className="db f7 c-muted-2">
                  <ListPrice
                    message={
                      taxPercentage ? "{listPriceWithTax}" : "{listPriceValue}"
                    }
                  />
                </span>
                <span className="dib t-small c-muted-2">
                  <SellingPrice
                    message={
                      taxPercentage
                        ? "{sellingPriceWithTax}"
                        : "{sellingPriceValue}"
                    }
                  />
                </span>
              </ProductContextProvider>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default CustomListItem;
