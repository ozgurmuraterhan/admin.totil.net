import Card from "@components/common/card";
import Layout from "@components/layouts/admin";
import Search from "@components/common/search";
import OrderStatusList from "@components/order-status/order-status-list";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { ROUTES } from "@utils/routes";
import { useOrderStatusesQuery } from "@data/order-status/use-order-statuses.query";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function OrderStatusPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading: loading,
    error,
  } = useOrderStatusesQuery({
    limit: 100,
    page,
    text: searchTerm,
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
            {t("form:input-label-order-status")}
          </h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ms-auto">
          <Search onSearch={handleSearch} />

          <LinkButton
            href={`${ROUTES.ORDER_STATUS}/create`}
            className="h-12 ms-4 md:ms-6"
          >
            <span className="hidden md:block">
              + {t("form:button-label-add-order-status")}
            </span>
            <span className="md:hidden">+ {t("form:button-label-add")}</span>
          </LinkButton>
        </div>
      </Card>

      {loading ? null : (
        <OrderStatusList
          order_statuses={data?.order_statuses}
          onPagination={handlePagination}
        />
      )}
    </>
  );
}
OrderStatusPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["table", "common", "form"])),
  },
});
