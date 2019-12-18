import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Banner from "./components/Banner";

const withBanners = Component => props => {
  const { searchQuery } = useSearchPage();
  const banners = searchQuery.banners;

  return <Component {...props} banners={banners} />;
};

export default withBanners(Banner);
