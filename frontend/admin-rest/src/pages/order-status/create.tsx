import Layout from "@components/common/layout";
import CreateOrUpdateOrderStatusForm from "@components/order-status/order-status-form";

export default function CreateOrderStatusPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
          Create Order Status
        </h1>
      </div>
      <CreateOrUpdateOrderStatusForm />
    </>
  );
}
CreateOrderStatusPage.Layout = Layout;
