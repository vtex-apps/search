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
  onProductClick: (
    position: number,
    term: string,
    productSummary: Product
  ) => void
  onSeeAllClick: (term: string) => void
  HorizontalProductSummary?: React.ComponentType<{
    product: Product
    placement: string
    actionOnClick: () => void
  }>
  searchId: string
}

const AUTOCOMPLETE_PLACEMENT = 'autocomplete'

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
  searchId
}) => {
  if (products.length === 0 && !isLoading) {
    return null
  }

  return (
    <section
      className={styles.tileList}
      data-af-onimpression={searchId ? true : undefined}
      data-af-search-id={searchId}
    >
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
                <li
                  key={product.productId}
                  className={styles.tileListItem}
                  data-af-onclick={searchId && product.productId ? true : undefined}
                  data-af-search-id={searchId}
                  data-af-product-position={index + 1}
                  data-af-product-id={product.productId}
                >
                  {layout === ProductLayout.Horizontal ? (
                    HorizontalProductSummary ? (
                      <HorizontalProductSummary
                        product={productSummary}
                        placement={AUTOCOMPLETE_PLACEMENT}
                        actionOnClick={() => {
                          onProductClick(index, term, productSummary)
                        }}
                      />
                    ) : (
                      <CustomListItem
                        product={productSummary}
                        onClick={() => {
                          onProductClick(index, term, productSummary)
                        }}
                      />
                    )
                  ) : (
                    <ExtensionPoint
                      id="product-summary"
                      product={productSummary}
                      placement={AUTOCOMPLETE_PLACEMENT}
                      actionOnClick={() => {
                        onProductClick(index, term, productSummary)
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
