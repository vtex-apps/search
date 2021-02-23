/* eslint-disable jsx-a11y/alt-text */
import React, { FC } from 'react'
import { Link } from 'vtex.render-runtime'
import { SellingPrice, ListPrice } from 'vtex.product-price'
import { ProductContextProvider } from 'vtex.product-context'

import styles from './styles.css'

interface CustomListItemProps {
  product: Product
  onClick: () => void
}

const CustomListItem: FC<CustomListItemProps> = ({ product, onClick }) => {
  const sku = product?.sku
  const taxPercentage = sku?.sellers?.[0]?.commertialOffer?.taxPercentage

  return (
    <div>
      <Link
        params={{
          slug: product?.linkText,
          id: product?.productId,
        }}
        page="store.product"
        className="no-underline"
        onClick={onClick}
      >
        <article
          className={`${styles.element} flex flex-row justify-start items-center pa3 bg-animate hover-bg-light-gray`}
        >
          <div className={`${styles.imageContainer} h3`}>
            <img
              className={`${styles.image} h-100 w-auto mw-none`}
              src={sku?.image?.imageUrl}
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
              <ProductContextProvider
                product={product}
                query={{
                  skuId: sku?.itemId,
                }}
              >
                <span className="db f7 c-muted-2">
                  <ListPrice
                    message={
                      taxPercentage ? '{listPriceWithTax}' : '{listPriceValue}'
                    }
                  />
                </span>
                <span className="dib t-small c-muted-2">
                  <SellingPrice
                    message={
                      taxPercentage
                        ? '{sellingPriceWithTax}'
                        : '{sellingPriceValue}'
                    }
                  />
                </span>
              </ProductContextProvider>
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}

export default CustomListItem
