export const extraInfo = {
  extraInfo: (product: any, _: any, __: any) => {
    const mapInfo = product.extraInfo || {};
    const extraInfo: { key: string; value: string }[] = [];

    // Transform ExtraInfo from Map[String, String] to Array[KeyValueTuple].
    for (const key of Object.keys(mapInfo)) {
      extraInfo.push({ key, value: mapInfo[key] });
    }

    return extraInfo;
  },
};
