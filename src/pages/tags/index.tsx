import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TagList from "@components/tag/tag-list";
import { adminOnly } from "@utils/auth-utils";
import { useTagsQuery } from "@data/tag/use-tags.query";
import { SortOrder } from "@ts-types/generated";
import { OrderField } from "@ts-types/index";
import { ROUTES } from "@utils/routes";

export default function Tags() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading: loading,
    error,
  } = useTagsQuery({
    limit: 10,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
    text: searchTerm,
    page,
  });

  if (loading) return <Loader text={t("common:text-loading")} />;
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
          <h1 className="text-xl font-semibold text-heading">
            {t("common:sidebar-nav-item-tags")}
          </h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ms-auto">
          <Search onSearch={handleSearch} />

          <LinkButton
            href={`${ROUTES.TAGS}/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add-tag")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>

      <TagList tags={data?.tags} onPagination={handlePagination} />
    </>
  );
}
Tags.authenticate = {
  permissions: adminOnly,
};
Tags.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["form", "common", "table"])),
  },
});
