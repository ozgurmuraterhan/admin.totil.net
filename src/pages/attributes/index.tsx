import Card from "@components/common/card";
import Layout from "@components/common/layout";
import AttributeList from "@components/attribute/attribute-list";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";

export default function AttributePage() {
  const { data, isLoading: loading, error } = useAttributesQuery();
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <Card className="flex flex-row items-center justify-between mb-8">
        <div className="md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">Attributes</h1>
        </div>

        <div className="flex items-center ml-auto">
          <LinkButton href="/attributes/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Add Attribute</span>
            <span className="md:hidden">+ Add</span>
          </LinkButton>
        </div>
      </Card>
      <AttributeList attributes={data?.attributes as any} />
    </>
  );
}

AttributePage.Layout = Layout;
