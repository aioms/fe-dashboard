import React, { FC, memo, useEffect, useMemo, useState } from "react";
import Modal from "Common/Components/Modal";
import { Loader2 } from "lucide-react";
import CreatableSelect from "react-select/creatable";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  getSuppliersThunk as onGetSupplierList,
  addProductList as onAddProductList,
  updateProductList as onUpdateProductList,
  getCategories as onGetCategoryList,
  getUnits as onGetUnitList,
} from "slices/thunk";
import { formatMoneyWithVND } from "helpers/utils";

interface Option {
  readonly label: string;
  readonly value?: string;
  readonly options?: Option[];
  readonly isDisabled?: boolean;
}

interface props {
  defaultData?: any;
  show: boolean;
  onCancel: () => void;
  onDone?: () => void;
}

const CreateProductModal: FC<props> = memo(
  ({ defaultData, show, onCancel, onDone }) => {
    const [isButtonLoading, setButtonLoading] = useState(false);
    const [category, setCategory] = useState<Option>();
    const [supplier, setSupplier] = useState<Option>();
    const [unit, setUnit] = useState<Option>();

    const [formattedMoney, setFormattedMoney] = useState<{
      sellingPrice: string | number;
      costPrice: string | number;
    }>({
      sellingPrice: 0,
      costPrice: 0,
    });

    const dispatch = useDispatch<any>();

    const selectDataList = createSelector(
      (state: any) => state.Products,
      (state) => ({
        categoryList: state.categoryList || [],
        supplierList: state.supplierList || [],
        unitList: state.unitList || [],
      })
    );

    const { categoryList, supplierList, unitList } =
      useSelector(selectDataList);

    useEffect(() => {
      dispatch(onGetCategoryList());
      dispatch(onGetSupplierList({}));
      dispatch(onGetUnitList());
    }, [dispatch]);

    const isEdit = useMemo(() => {
      return !!Object.keys(defaultData).length;
    }, [defaultData]);

    useEffect(() => {
      if (isEdit) {
        setCategory({
          label: defaultData.category,
          value: defaultData.category,
        });
        setSupplier({
          label: defaultData.supplier,
          value: defaultData.supplier,
        });
        setUnit({
          label: defaultData.unit,
          value: defaultData.unit,
        });
        setFormattedMoney({
          sellingPrice: defaultData
            ? formatMoneyWithVND(+defaultData.sellingPrice)
            : 0,
          costPrice: defaultData
            ? formatMoneyWithVND(+defaultData.costPrice)
            : 0,
        });
      } else {
        setCategory(undefined);
        setSupplier(undefined);
        setUnit(undefined);
      }
    }, [isEdit, defaultData]);

    const handleClose = () => onCancel();

    const handleCreateProduct = async (values: any) => {
      setButtonLoading(true);

      if (isEdit) {
        const dataUpdate = {
          id: defaultData.id,
          ...values,
        };
        // update
        dispatch(onUpdateProductList(dataUpdate));
      } else {
        // save new
        dispatch(onAddProductList({ ...values }));
      }

      setButtonLoading(false);

      handleClose();
      resetForm();
      onDone?.();
    };

    const resetForm = () => {
      validation.resetForm();
      setFormattedMoney({
        sellingPrice: 0,
        costPrice: 0,
      });
      setCategory(undefined);
      setSupplier(undefined);
      setUnit(undefined);
    };

    const validation: any = useFormik({
      // enableReinitialize : use this flag when initial values needs to be changed
      enableReinitialize: true,

      initialValues: {
        productName: (defaultData && defaultData.productName) || "",
        sellingPrice: (defaultData && defaultData.sellingPrice) || "",
        costPrice: (defaultData && defaultData.costPrice) || "",
        inventory: (defaultData && defaultData.inventory) || "",
        unit: (defaultData && defaultData.unit) || "",
        category: (defaultData && defaultData.category) || "",
        supplier: (defaultData && defaultData.supplier) || "",
        additionalDescription:
          (defaultData && defaultData.additionalDescription) || "",
        warehouse:
          (defaultData && defaultData.warehouse) || "KS1",
        status: (defaultData && defaultData.status) || "draft",
      },
      validationSchema: Yup.object({
        category: Yup.string().required("Vui lòng chọn nhóm hàng"),
        productName: Yup.string().required("Vui lòng nhập tên hàng"),
        inventory: Yup.string().required("Vui lòng nhập số lượng"),
        sellingPrice: Yup.string().required("Vui lòng nhập giá bán"),
        costPrice: Yup.string().required("Vui lòng nhập giá vốn"),
        unit: Yup.string().required("Vui lòng chọn đơn vị"),
        supplier: Yup.string().required("Vui lòng chọn nhà cung cấp"),
        warehouse: Yup.string().required("Vui lòng chọn cửa hàng"),
        status: Yup.string().required("Vui lòng chọn trạng thái"),
      }),

      onSubmit: handleCreateProduct,
    });

    const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numericValue = value.replace(/\D/g, ""); // Remove non-digit characters
      validation.setFieldValue(name, numericValue);

      // Update the formatted value to display in the input
      setFormattedMoney((prev) => ({
        ...prev,
        [name]: formatMoneyWithVND(+numericValue),
      }));
    };

    return (
      <React.Fragment>
        <Modal
          show={show}
          onHide={handleClose}
          modal-center="true"
          className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
          dialogClassName="w-screen lg:w-[55rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"
        >
          <form
            action="#!"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Modal.Header
              className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
              closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500"
            >
              <h5 className="text-16">
                {isEdit ? "Cập nhật" : "Tạo mới"} hàng hóa
              </h5>
            </Modal.Header>
            <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] min-h-[calc(theme('height.screen')_-_500px)] p-4 overflow-y-auto">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
                <div className="xl:col-span-12">
                  <div className="card">
                    <div className="card-body">
                      {/* <h6 className="mb-4 text-15">Thêm mới</h6> */}

                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-12">
                        <div className="xl:col-span-6">
                          <label
                            htmlFor="productNameInput"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Tên hàng hóa
                          </label>
                          <input
                            type="text"
                            id="productNameInput"
                            name="productName"
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Nhập tên hàng hóa"
                            onChange={validation.handleChange}
                            value={validation.values.productName || ""}
                          />
                          {validation.touched.productName &&
                          validation.errors.productName ? (
                            <p className="text-red-400">
                              {validation.errors.productName}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-6">
                          <label
                            htmlFor="productCodeInput"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Mã hàng hóa
                          </label>
                          <input
                            type="text"
                            id="productCodeInput"
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Mã hàng hóa"
                            value="*Mã hàng hóa sẽ được tạo tự động"
                            disabled
                          />
                          {/* <p className="mt-1 text-sm text-slate-400 dark:text-zink-200"> */}
                          {/*   Mã hàng hóa sẽ được tạo tự động */}
                          {/* </p> */}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="qualityInput"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Số lượng
                          </label>
                          <input
                            type="number"
                            id="qualityInput"
                            name="inventory"
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Nhập số lượng"
                            onChange={validation.handleChange}
                            value={validation.values.inventory || ""}
                          />
                          {validation.touched.inventory &&
                          validation.errors.inventory ? (
                            <p className="text-red-400">
                              {validation.errors.inventory}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="sellingPrice"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Giá bán
                          </label>
                          <input
                            type="text"
                            id="sellingPrice"
                            name="sellingPrice"
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Nhập giá bán"
                            onChange={handleMoneyChange}
                            value={formattedMoney.sellingPrice}
                          />
                          {validation.touched.sellingPrice &&
                          validation.errors.sellingPrice ? (
                            <p className="text-red-400">
                              {validation.errors.sellingPrice}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="costPrice"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Giá vốn
                          </label>
                          <input
                            type="text"
                            id="costPrice"
                            name="costPrice"
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            placeholder="Nhập giá vốn"
                            onChange={handleMoneyChange}
                            value={formattedMoney.costPrice}
                          />
                          {validation.touched.costPrice &&
                          validation.errors.costPrice ? (
                            <p className="text-red-400">
                              {validation.errors.costPrice}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="categorySelect"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Nhóm hàng
                          </label>
                          <CreatableSelect
                            className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            id="categorySelect"
                            name="category"
                            placeholder="Chọn"
                            isClearable={false}
                            data-choices-text-unique-true
                            data-choices
                            onChange={(newValue: any) => {
                              validation.setFieldValue(
                                "category",
                                newValue.value
                              );
                              setCategory(newValue);
                            }}
                            value={category || ""}
                            options={categoryList.map((category: string) => ({
                              label: category,
                              value: category,
                            }))}
                          />
                          {validation.touched.category &&
                          validation.errors.category ? (
                            <p className="text-red-400">
                              {validation.errors.category}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="supplierSelect"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Nhà cung cấp
                          </label>
                          <CreatableSelect
                            className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            id="supplierSelect"
                            name="supplier"
                            placeholder="Chọn"
                            isClearable={false}
                            data-choices-text-unique-true
                            data-choices
                            onChange={(newValue: any) => {
                              validation.setFieldValue(
                                "supplier",
                                newValue.value
                              );
                              setSupplier(newValue);
                            }}
                            value={supplier || ""}
                            options={supplierList.map((supplier: string) => ({
                              label: supplier,
                              value: supplier,
                            }))}
                          />
                          {validation.touched.supplier &&
                          validation.errors.supplier ? (
                            <p className="text-red-400">
                              {validation.errors.supplier}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-4">
                          <label
                            htmlFor="unitSelect"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Đơn vị
                          </label>
                          <CreatableSelect
                            className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            id="unitSelect"
                            name="unit"
                            placeholder="Chọn"
                            isClearable={false}
                            data-choices-text-unique-true
                            data-choices
                            onChange={(newValue: any) => {
                              validation.setFieldValue("unit", newValue.value);
                              setUnit(newValue);
                            }}
                            value={unit || ""}
                            options={unitList.map((unit: string) => ({
                              label: unit,
                              value: unit,
                            }))}
                          />
                          {validation.touched.unit && validation.errors.unit ? (
                            <p className="text-red-400">
                              {validation.errors.unit}
                            </p>
                          ) : null}
                        </div>
                        <div className="lg:col-span-2 xl:col-span-12">
                          <div>
                            <label
                              htmlFor="productDescription"
                              className="inline-block mb-2 text-base font-medium"
                            >
                              Mô tả thêm
                            </label>
                            <textarea
                              className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                              id="productDescription"
                              name="additionalDescription"
                              placeholder="Nhập mô tả"
                              rows={5}
                              onChange={validation.handleChange}
                              value={
                                validation.values.additionalDescription || ""
                              }
                            ></textarea>
                          </div>
                        </div>
                        <div className="xl:col-span-6">
                          <label
                            htmlFor="productStatusSelect"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Trạng thái
                          </label>
                          <select
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            data-choices
                            data-choices-search-false
                            name="status"
                            id="productStatusSelect"
                            onChange={validation.handleChange}
                            value={validation.values.status || ""}
                          >
                            <option value="draft">Nháp</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                          </select>
                          {validation.touched.status &&
                          validation.errors.status ? (
                            <p className="text-red-400">
                              {validation.errors.status}
                            </p>
                          ) : null}
                        </div>
                        <div className="xl:col-span-6">
                          <label
                            htmlFor="warehouseLocationSelect"
                            className="inline-block mb-2 text-base font-medium"
                          >
                            Cửa hàng
                          </label>
                          <select
                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                            data-choices
                            data-choices-search-false
                            name="warehouse"
                            id="warehouseLocationSelect"
                            onChange={validation.handleChange}
                            value={
                              validation.values.warehouse || "Chọn"
                            }
                          >
                            <option value="KS">Kho KS</option>
                            <option value="KH">Kho KH</option>
                          </select>
                          {validation.touched.warehouse &&
                          validation.errors.warehouse ? (
                            <p className="text-red-400">
                              {validation.errors.warehouse}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-end p-4 mt-auto border-t border-slate-200 dark:border-zink-500">
              <div className="flex justify-between">
                <button
                  type="reset"
                  className="text-red-500 mr-2 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-700 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                  onClick={onCancel}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="mr-2 flex items-center text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                >
                  {isButtonLoading ? (
                    <Loader2 className="size-4 ltr:mr-2 rtl:ml-2 animate-spin" />
                  ) : isEdit ? (
                    "Cập nhật"
                  ) : (
                    "Tạo mới"
                  )}
                </button>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      </React.Fragment>
    );
  }
);

export default CreateProductModal;
