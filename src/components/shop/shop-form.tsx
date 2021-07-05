import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import FileInput from "@components/ui/file-input";
import TextArea from "@components/ui/text-area";
import { shopValidationSchema } from "./shop-validation-schema";
import { getFormattedImage } from "@utils/get-formatted-image";
import { useCreateShopMutation } from "@data/shop/use-shop-create.mutation";
import { useUpdateShopMutation } from "@data/shop/use-shop-update.mutation";

type FormValues = {
  name: string;
  description: string;
  cover_image: any;
  logo: any;
  balance: {
    payment_info: {
      name: string;
      email: string;
      bank: string;
      account: string;
    };
  };
  address: {
    __typename: any;
    country: string;
    city: string;
    zip: string;
    state: string;
    street_address: string;
  };
  settings: string;
};

const ShopForm = ({ initialValues }: { initialValues?: any }) => {
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
            logo: getFormattedImage(initialValues.logo),
            cover_image: getFormattedImage(initialValues.cover_image),
          },
        }
      : {}),
    resolver: yupResolver(shopValidationSchema),
  });
  const { t } = useTranslation();

  function onSubmit(values: FormValues) {
    if (initialValues) {
      const { __typename, ...restAddress } = values.address;
      updateShop({
        variables: {
          id: initialValues.id,
          input: {
            ...values,
            address: restAddress,
            balance: {
              id: initialValues.balance?.id,
              ...values.balance,
            },
          },
        },
      });
    } else {
      createShop({
        variables: {
          input: {
            ...values,
            balance: {
              ...values.balance,
            },
          },
        },
      });
    }
  }

  const coverImageInformation = (
    <span>
      {t("form:shop-cover-image-help-text")} <br />
      {t("form:cover-image-dimension-help-text")} &nbsp;
      <span className="font-bold">1170 x 435{t("common:text-px")}</span>
    </span>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:input-label-logo")}
            details={t("form:shop-logo-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:shop-cover-image-title")}
            details={coverImageInformation}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="cover_image" control={control} multiple={false} />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:shop-basic-info")}
            details={t("form:shop-basic-info-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-name")}
              {...register("name")}
              variant="outline"
              className="mb-4"
              error={t(errors.name?.message!)}
            />
            <TextArea
              label={t("form:input-label-description")}
              {...register("description")}
              variant="outline"
              className="mb-4"
              error={t(errors.description?.message!)}
            />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("form:shop-payment-info")}
            details={t("form:payment-info-helper-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-account-holder-name")}
              {...register("balance.payment_info.name")}
              variant="outline"
              className="mb-4"
              error={t(errors.balance?.payment_info?.name?.message!)}
            />
            <Input
              label={t("form:input-label-account-holder-email")}
              {...register("balance.payment_info.email")}
              variant="outline"
              className="mb-4"
              error={t(errors.balance?.payment_info?.email?.message!)}
            />
            <Input
              label={t("form:input-label-bank-name")}
              {...register("balance.payment_info.bank")}
              variant="outline"
              className="mb-4"
              error={t(errors.balance?.payment_info?.bank?.message!)}
            />
            <Input
              label={t("form:input-label-account-number")}
              {...register("balance.payment_info.account")}
              variant="outline"
              className="mb-4"
              error={t(errors.balance?.payment_info?.account?.message!)}
            />
          </Card>
        </div>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("form:shop-address")}
            details={t("form:shop-address-helper-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-country")}
              {...register("address.country")}
              variant="outline"
              className="mb-4"
              error={t(errors.address?.country?.message!)}
            />
            <Input
              label={t("form:input-label-city")}
              {...register("address.city")}
              variant="outline"
              className="mb-4"
              error={t(errors.address?.city?.message!)}
            />
            <Input
              label={t("form:input-label-state")}
              {...register("address.state")}
              variant="outline"
              className="mb-4"
              error={t(errors.address?.state?.message!)}
            />
            <Input
              label={t("form:input-label-zip")}
              {...register("address.zip")}
              variant="outline"
              className="mb-4"
              error={t(errors.address?.zip?.message!)}
            />
            <TextArea
              label={t("form:input-label-street-address")}
              {...register("address.street_address")}
              variant="outline"
              className="mb-4"
              error={t(errors.address?.street_address?.message!)}
            />
          </Card>
        </div>
        <div className="mb-4 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t("form:button-label-update")
              : t("form:button-label-save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ShopForm;
