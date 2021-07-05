import Card from "@components/common/card";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ShopLayout from "@components/layouts/shop";
import { useRouter } from "next/router";
import LinkButton from "@components/ui/link-button";
import { adminOwnerAndStaffOnly } from "@utils/auth-utils";
import { useShopQuery } from "@data/shop/use-shop.query";
import { useProductsQuery } from "@data/product/products.query";
import { SortOrder } from "@ts-types/generated";
import { OrderField } from "@ts-types/index";

export default function ProductsPage() {
  const {
    query: { shop },
  } = useRouter();
  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    shop as string
  );
  const shopId = shopData?.shop?.id!;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading: loading,
    error,
  } = useProductsQuery(
    {
      text: searchTerm,
      limit: 10,
      shop_id: Number(shopId),
      orderBy: OrderField.CreatedAt,
      sortedBy: SortOrder.Desc,
      page,
    },
    {
      enabled: Boolean(shopId),
    }
  );

  if (loading || fetchingShop)
    return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">
            {t("form:input-label-products")}
          </h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ms-auto">
          <Search onSearch={handleSearch} />

          <LinkButton
            href={`/${shop}/products/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add-product")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>
      <ProductList products={data?.products} onPagination={handlePagination} />
    </>
  );
}
ProductsPage.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};
ProductsPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
