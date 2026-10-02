import { useCallback, useEffect, useMemo, useState } from "react";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Icons

import { getReceiptReturnInfo as onGetReceiptReturnInfo, getSuppliersThunk as onGetSupplierList } from "slices/thunk";
import { toast } from "react-toastify";
import { IHttpResponse } from "types";
import { request } from "helpers/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getDate } from "helpers/date";

import { createSupplier } from "apis/supplier";

const customerReasons = ["Sản phẩm lỗi", "Đổi sản phẩm", "Lý do khác"];
const supplierReasons = ["Ngừng bán", "Lỗi sản xuất", "Lý do khác"];

export default function useReceiptReturnUpdate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [productListModal, setProductListModal] = useState(false);
  const productListModalToggle = () => setProductListModal(!productListModal);

  const receiptId = searchParams.get("id");
  const dispatch = useDispatch<any>();
  const [loadState, setLoadState] = useState<{ id: string | null; status: "loading" | "error" | "empty" | "ready" }>({
    id: null,
    status: "loading",
  });
  const loadReceipt = useCallback(async () => {
    setLoadState({ id: receiptId, status: "loading" });
    try {
      const result: { receipt?: { id?: string } } | null = await dispatch(onGetReceiptReturnInfo(receiptId)).unwrap();
      setLoadState({ id: receiptId, status: result?.receipt?.id ? "ready" : result ? "empty" : "error" });
    } catch {
      setLoadState({ id: receiptId, status: "error" });
    }
  }, [dispatch, receiptId]);

  const selectDataSupplier = createSelector(
    (state: any) => state.Supplier,
    (state) => ({
      supplierList: state.suppliers || [],
    }),
  );

  const selectDataReceipt = createSelector(
    (state: any) => state.ReceiptReturn,
    (state) => ({
      receiptInfo: state.receiptInfo || {},
      receiptItems: state.receiptItems || [],
    }),
  );

  const { supplierList } = useSelector(selectDataSupplier);
  const { receiptInfo, receiptItems } = useSelector(selectDataReceipt);

  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleCreateSupplier = async (name: string) => {
    const result = await createSupplier({ name });
    return {
      value: result.id,
      label: name,
    };
  };

  const handleLoadSupplier = async (inputValue: string, page: number) => {
    try {
      const response: IHttpResponse = await request.get(
        `/suppliers?keyword=${inputValue}&page=${page}&limit=10`,
      );

      if (
        (response.statusCode && response.statusCode !== 200) ||
        !response.success
      ) {
        throw new Error(response.message);
      }

      const { data, metadata } = response;

      return {
        results: data?.map((item: Record<string, string>) => ({
          value: item.id,
          label: item.name,
        })),
        hasMore: metadata?.hasNext,
        page: metadata?.currentPage,
      };
    } catch (error) {
      toast.error((error as Error).message);
      return {
        results: [],
        hasMore: false,
        page: 1,
      };
    }
  };

  const totalAmount = useMemo(() => {
    return rows.reduce((total, row) => total + row.quantity * row.price, 0);
  }, [rows]);

  const quantity = useMemo(() => {
    return rows.reduce((total, row) => total + row.quantity, 0);
  }, [rows]);

  const handleSubmitForm = async (values: any) => {
    if (!rows.length) {
      toast.warn("Vui lòng chọn sản phẩm");
      return;
    }

    const items = rows.map((row) => ({
      productId: row.id,
      productCode: row.productCode,
      productName: row.name,
      quantity: row.quantity,
      costPrice: row.price,
    }));

    const payload = {
      name: values.name,
      note: values.note,
      reason: customReason || selectedReason,
      status: values.status,
      type: values.type,
      returnDate: getDate(values.returnDate).format(),
      store: values.warehouse,
      supplier: values.supplier?.id,
      totalProduct: rows.length,
      totalAmount,
      totalQuantity: quantity,
      items,
    };

    try {
      const response: IHttpResponse = await request.put(
        `/receipt-return/${receiptId}`,
        payload,
      );

      if (response.statusCode !== 200) {
        toast.warn(response.message);
        return;
      }

      toast.success("Cập nhật phiếu thành công");

      setTimeout(() => {
        navigate("/receipt-return/list");
      }, 700);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const validation: any = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      returnDate: receiptInfo.returnDate ? getDate(receiptInfo.returnDate).toDate() : "",
      warehouse: receiptInfo.warehouse || "",
      supplier: receiptInfo.supplier || {},
      name: receiptInfo.name || "",
      reason: receiptInfo.reason || customerReasons[0],
      note: receiptInfo.note || "",
      status: receiptInfo.status || "",
      type: receiptInfo.type || "customer",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Vui lòng nhập lý do"),
      returnDate: Yup.string().required("Vui lòng chọn ngày trả hàng"),
      warehouse: Yup.string().required("Vui lòng chọn cửa hàng"),
    }),
    onSubmit: handleSubmitForm,
  });

  const reasons = useMemo(() => {
    return validation.values.type === "customer" ? customerReasons : supplierReasons;
  }, [validation.values.type]);

  useEffect(() => {
    dispatch(onGetSupplierList({}));
  }, [dispatch]);

  useEffect(() => {
    if (!receiptItems.length) return;

    const items = receiptItems.map((item: any) => ({
      id: item.id,
      productCode: item.productCode,
      code: item.code,
      name: item.productName,
      quantity: item.quantity,
      price: item.costPrice,
      inventory: Number(item.inventory ?? 0),
    }));

    setRows(items);
  }, [receiptItems]);

  useEffect(() => {
    if (!receiptInfo) return;

    if (reasons.includes(receiptInfo.reason)) {
      setSelectedReason(receiptInfo.reason);
    } else {
      setSelectedReason("Lý do khác");
      setCustomReason(receiptInfo.reason);
    }
  }, [receiptInfo, reasons]);

  const handleReasonChange = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== "Lý do khác") {
      setCustomReason(""); // Clear custom reason if another option is selected
    }
  };

  useEffect(() => {
    if (receiptId) void loadReceipt();
  }, [receiptId, loadReceipt]);

  const handleBackToList = () => {
    navigate("/receipt-return/list");
  };

  return {
    loadReceipt,
    loadState,
    supplierList,
    rows,
    setRows,
    productListModal,
    productListModalToggle,
    receiptId,
    receiptInfo,
    validation,
    reasons,
    selectedReason,
    customReason,
    setCustomReason,
    handleReasonChange,
    handleLoadSupplier,
    handleCreateSupplier,
    handleBackToList,
    totalAmount,
    quantity,
  };
}
