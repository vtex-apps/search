import { useCssHandles } from "vtex.css-handles";

interface ElasticBanner {
  id: string;
  name: string;
  area: string;
  html: string;
}

enum HorizotalAlignment {
  Left = "left",
  Right = "right",
  Center = "center",
}

interface BannerProps {
  banners: ElasticBanner[];
  area: string;
  blockClass?: string;
  horizontalAlignment?: HorizotalAlignment;
}

const getAlignmentClass = (alignment: HorizotalAlignment | undefined) => {
  switch (alignment) {
    case "left":
      return "justify-start";
    case "right":
      return "justify-end";
    default:
      return "justify-center";
  }
};

const Banner = (props: BannerProps) => {
  const { area, banners, horizontalAlignment } = props;

  if (!banners) {
    return null;
  }

  const selectedBanner = banners.find(banner => banner.area === area);

  if (!selectedBanner) {
    return null;
  }

  const CSS_HANDLES = ["searchBanner"];

  const handles = useCssHandles(CSS_HANDLES);

  const className = `flex ${getAlignmentClass(horizontalAlignment)} ${
    handles.searchBanner
  }`;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: selectedBanner.html }}
    />
  );
};

export default Banner;
