import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import ProductList from "@components/product/product-list";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useProductsQuery } from "@data/product/products.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const {
    data,
    isLoading: loading,
    error,
  } = useProductsQuery({
    limit: 20,
    page,
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
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
        </div>
      </Card>
      <ProductList products={data?.products} onPagination={handlePagination} />
    </>
  );
}
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
