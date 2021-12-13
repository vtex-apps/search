import React, { FC } from 'react'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'
import CustomListItem from '../CustomListItem/CustomListItem'
import { ProductLayout } from '../..'

interface TileListProps {
  term: string
  title: string | JSX.Element
  customPage?: string
  products: any[]
  showTitle: boolean
  shelfProductCount: number
  totalProducts: number
  layout: ProductLayout
  isLoading: boolean
  onProductClick: (product: string, position: number) => void
  onSeeAllClick: (term: string) => void
  HorizontalProductSummary?: React.ComponentType<{
    product: Product
    actionOnClick: () => void
  }>
}

const TileList: FC<TileListProps> = ({
  term,
  title,
  products,
  showTitle,
  totalProducts,
  layout,
  isLoading,
  onProductClick,
  onSeeAllClick,
  HorizontalProductSummary,
  customPage,
}) => {
  if (products.length === 0 && !isLoading) {
    return null
  }

  return (
    <section className={styles.tileList}>
      {showTitle ? (
        <p className={`${styles.tileListTitle} c-on-base`}>{title}</p>
      ) : null}
      {isLoading ? (
        <div className={styles.tileListSpinner}>
          <Spinner />
        </div>
      ) : (
        <>
          <ul
            className={styles.tileListList}
            style={{
              flexDirection:
                layout === ProductLayout.Horizontal ? 'column' : 'row',
            }}
          >
            {products.map((product, index: number) => {
              const productSummary: Product = ProductSummary.mapCatalogProductToProductSummary(
                product
              )

              return (
                <li key={product.productId} className={styles.tileListItem}>
                  {layout === ProductLayout.Horizontal ? (
                    HorizontalProductSummary ? (
                      <HorizontalProductSummary
                        product={productSummary}
                        actionOnClick={() => {
                          onProductClick(productSummary.productId, index)
                        }}
                      />
                    ) : (
                      <CustomListItem
                        product={productSummary}
                        onClick={() => {
                          onProductClick(productSummary.productId, index)
                        }}
                      />
                    )
                  ) : (
                    <ExtensionPoint
                      id="product-summary"
                      product={productSummary}
                      actionOnClick={() => {
                        onProductClick(productSummary.productId, index)
                      }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          <footer className={styles.tileListFooter}>
            {totalProducts > 0 ? (
              <Link
                query={`map=ft&_q=${term}`}
                params={{
                  term,
                }}
                page={customPage || 'store.search'}
                className={styles.tileListSeeMore}
                onClick={() => onSeeAllClick(term)}
              >
                <FormattedMessage
                  id="store/seeMore"
                  values={{ count: totalProducts }}
                />
              </Link>
            ) : null}
          </footer>
        </>
      )}
    </section>
  )
}

export default TileList
