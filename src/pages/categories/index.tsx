import CategoryList from "@components/category/category-list";
import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useParentCategoriesQuery } from "@data/category/use-parent-categories.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ROUTES } from "@utils/routes";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  const {
    data,
    isLoading: loading,
    error,
  } = useParentCategoriesQuery({
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
          <h1 className="text-xl font-semibold text-heading">
            {t("form:input-label-categories")}
          </h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ms-auto">
          <Search onSearch={handleSearch} />

          <LinkButton
            href={`${ROUTES.CATEGORIES}/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add-categories")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>
      <CategoryList
        categories={data?.categories}
        onPagination={handlePagination}
      />
    </>
  );
}
Categories.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["form", "common", "table"])),
  },
});
