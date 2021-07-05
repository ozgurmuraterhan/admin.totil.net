import Card from "@components/common/card";
import AttributeList from "@components/attribute/attribute-list";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ShopLayout from "@components/layouts/shop";
import { useRouter } from "next/router";
import { adminOwnerAndStaffOnly } from "@utils/auth-utils";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";
import { useShopQuery } from "@data/shop/use-shop.query";

export default function AttributePage() {
  const {
    query: { shop },
  } = useRouter();
  const { t } = useTranslation();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    shop as string
  );
  const shopId = shopData?.shop?.id!;

  const {
    data,
    isLoading: loading,
    error,
  } = useAttributesQuery(
    {
      shop_id: Number(shopId),
    },
    {
      enabled: Boolean(shopId),
    }
  );
  if (loading || fetchingShop)
    return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <Card className="flex flex-row items-center justify-between mb-8">
        <div className="md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t("common:sidebar-nav-item-attributes")}
          </h1>
        </div>

        <div className="flex items-center ms-auto">
          <LinkButton
            href={`/${shop}/attributes/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add")} {t("common:attribute")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>
      <AttributeList attributes={data?.attributes as any} />
    </>
  );
}
AttributePage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
AttributePage.Layout = ShopLayout;
export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
