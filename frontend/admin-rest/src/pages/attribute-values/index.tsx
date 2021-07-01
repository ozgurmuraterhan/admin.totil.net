import Card from "@components/common/card";
import Layout from "@components/common/layout";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import AttributeValuesList from "@components/attribute-values/attribute-values-list";
import { ROUTES } from "@utils/routes";
import { useAttributeValuesQuery } from "@data/attribute-value/use-attribute-values.query";

export default function AttributePage() {
  const { data, isLoading: loading, error } = useAttributeValuesQuery();
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Card className="flex flex-row items-center justify-between mb-8">
        <div className="md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            Attribute Values
          </h1>
        </div>

        <div className="flex items-center ml-auto">
          <LinkButton
            href={`${ROUTES.ATTRIBUTE_VALUES}/create`}
            className="h-12 ml-4 md:ml-6"
          >
            <span className="hidden md:block">+ Add Attribute Value</span>
            <span className="md:hidden">+ Add</span>
          </LinkButton>
        </div>
      </Card>
      <AttributeValuesList attributeValues={data?.attributeValues!} />
    </>
  );
}

AttributePage.Layout = Layout;
