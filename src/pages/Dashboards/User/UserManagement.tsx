import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import { Dropdown } from "Common/Components/Dropdown";
import TableContainer from "Common/TableContainer";
import Select from "react-select";

// Icons
import {
  Search,
  Trash2,
  Plus,
  MoreHorizontal,
  FileEdit,
  CheckCircle,
  Loader,
  X,
} from "lucide-react";
import Modal from "Common/Components/Modal";
import DeleteModal from "Common/DeleteModal";

// react-redux
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  getUserList as onGetUserList,
  addUserList as onAddUserList,
  updateUserList as onUpdateUserList,
  deleteUserList as onDeleteUserList,
} from "slices/thunk";
import filterDataBySearch from "Common/filterDataBySearch";
import { UserRole, UserStatus } from "Common/enums/user-enum";

const options = [
  { value: "status", label: "Trạng thái" },
  { value: UserStatus.ACTIVE, label: "Hoạt động" },
  { value: UserStatus.INACTIVE, label: "Không hoạt động" },
];

const UserManagement = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.Users,
    (user) => ({
      userList: user.userList || [],
      pagination: user.pagination || {},
    }),
  );

  const { userList } = useSelector(selectDataList);

  const [user, setUser] = useState<any>([]);
  const [eventData, setEventData] = useState<any>();

  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Get Data
  useEffect(() => {
    dispatch(onGetUserList({}));
  }, [dispatch]);

  useEffect(() => {
    if (!userList.length) return;
    setUser(userList);
  }, [userList]);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const deleteToggle = () => setDeleteModal(!deleteModal);

  // Delete Data
  const onClickDelete = (cell: any) => {
    setDeleteModal(true);

    if (cell.id) {
      setEventData(cell);
    }
  };

  const handleDelete = () => {
    if (eventData) {
      dispatch(onDeleteUserList(eventData.id));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleUpdateDataClick = (ele: any) => {
    setEventData({ ...ele });
    setIsEdit(true);
    setShow(true);
  };

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      fullname: (eventData && eventData.fullname) || "",
      phone: (eventData && eventData.phone) || "",
      username: (eventData && eventData.username) || "",
      storeCode: (eventData && eventData.storeCode) || "",
      status: (eventData && eventData.status) || UserStatus.ACTIVE,
      role: (eventData && eventData.role) || UserRole.EMPLOYEE
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Vui lòng nhập họ và tên"),
      phone: Yup.string().required("Vui lòng nhập số điện thoại"),
      username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
      storeCode: Yup.string().required("Vui lòng chọn chi nhánh"),
      status: Yup.string().required("Vui lòng chọn trạng thái"),
      role: Yup.string().required("Vui lòng chọn chức vụ"),
    }),

    onSubmit: (values) => {
      if (isEdit) {
        const updateUser = {
          id: eventData ? eventData.id : 0,
          ...values,
        };
        // update user
        dispatch(onUpdateUserList(updateUser));
      } else {
        const newUser = {
          ...values,
        };
        // save new user
        dispatch(onAddUserList(newUser));
      }
      toggle();
    },
  });

  // Image
  const [, setSelectedImage] = useState<any>();

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setEventData("");
      setIsEdit(false);
      setSelectedImage("");
    } else {
      setShow(true);
      setEventData("");
      setSelectedImage("");
      validation.resetForm();
    }
  }, [show, validation]);

  // Search Data
  const filterSearchData = (e: any) => {
    const search = e.target.value;
    const keysToSearch = ["username", "fullname", "phone", "status"];
    filterDataBySearch(userList, search, keysToSearch, setUser);
  };

  // columns
  const Status = ({ item }: any) => {
    switch (item) {
      case UserStatus.ACTIVE:
        return (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent inline-flex items-center status">
            <CheckCircle className="size-3 mr-1.5" />
            Đang hoạt động
          </span>
        );
      case UserStatus.INACTIVE:
        return (
          <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-slate-100 border-transparent text-slate-500 dark:bg-slate-500/20 dark:text-zink-200 dark:border-transparent status">
            <Loader className="size-3 mr-1.5" />
            Không hoạt động
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 inline-flex items-center text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent status">
            <X className="size-3 mr-1.5" />
            {item}
          </span>
        );
    }
  };

  const columns = useMemo(
    () => [
      // {
      //   header: (
      //     <div className="flex items-center h-full">
      //       <input
      //         id="CheckboxAll"
      //         className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800 cursor-pointer"
      //         type="checkbox"
      //       />
      //     </div>
      //   ),
      //   enableSorting: false,
      //   id: "checkAll",
      //   cell: (_cell: any) => {
      //     return (
      //       <div className="flex items-center h-full">
      //         <input
      //           id="Checkbox1"
      //           className="size-4 bg-white border border-slate-200 checked:bg-none dark:bg-zink-700 dark:border-zink-500 rounded-sm appearance-none arrow-none relative after:absolute after:content-['\eb7b'] after:top-0 after:left-0 after:font-remix after:leading-none after:opacity-0 checked:after:opacity-100 after:text-custom-500 checked:border-custom-500 dark:after:text-custom-500 dark:checked:border-custom-800 cursor-pointer"
      //           type="checkbox"
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        header: "ID",
        accessorKey: "code",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const data = cell.row.original;

          return (
            <Link
              to="#!"
              className="transition-all duration-150 ease-linear text-custom-500 hover:text-custom-600 user-id"
              onClick={() => handleUpdateDataClick(data)}
            >
              {cell.getValue()}
            </Link>
          );
        },
      },
      {
        header: "Tên đăng nhập",
        accessorKey: "username",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <div className="flex items-center gap-2">
            {/* <div className="flex items-center justify-center size-10 font-medium rounded-full shrink-0 bg-slate-200 text-slate-800 dark:text-zink-50 dark:bg-zink-600"> */}
            {/*   {cell.row.original.img ? ( */}
            {/*     <img */}
            {/*       src={cell.row.original.img} */}
            {/*       alt="" */}
            {/*       className="h-10 rounded-full" */}
            {/*     /> */}
            {/*   ) : ( */}
            {/*     cell */}
            {/*       .getValue() */}
            {/*       .split(" ") */}
            {/*       .map((word: any) => word.charAt(0)) */}
            {/*       .join("") */}
            {/*   )} */}
            {/* </div> */}
            <div className="grow">
              <h6 className="mb-1">
                <Link to="#!" className="name">
                  {cell.getValue()}
                </Link>
              </h6>
              {/* <p className="text-slate-500 dark:text-zink-200"> */}
              {/*   {cell.row.original.designation} */}
              {/* </p> */}
            </div>
          </div>
        ),
      },
      {
        header: "Họ và tên",
        accessorKey: "fullname",
        enableColumnFilter: false,
      },
      {
        header: "Số điện thoại",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: "Chi nhánh",
        accessorKey: "storeCode",
        enableColumnFilter: false,
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => <Status item={cell.getValue()} />,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell: any) => (
          <Dropdown className="relative">
            <Dropdown.Trigger
              className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20"
              id="usersAction1"
            >
              <MoreHorizontal className="size-3" />
            </Dropdown.Trigger>
            <Dropdown.Content
              placement="right-end"
              className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md min-w-[10rem] dark:bg-zink-600"
              aria-labelledby="usersAction1"
            >
              <li>
                <Link
                  data-modal-target="addUserModal"
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                  to="#!"
                  onClick={() => {
                    const data = cell.row.original;
                    handleUpdateDataClick(data);
                  }}
                >
                  <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                  <span className="align-middle">Cập nhật</span>
                </Link>
              </li>
              <li>
                <Link
                  className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
                  to="#!"
                  onClick={() => {
                    const orderData = cell.row.original;
                    onClickDelete(orderData);
                  }}
                >
                  <Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />{" "}
                  <span className="align-middle">Xóa</span>
                </Link>
              </li>
            </Dropdown.Content>
          </Dropdown>
        ),
      },
    ],
    [],
  );

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value === "status") {
      setUser(userList);
    } else {
      const filteredUsers = userList.filter(
        (data: any) => data.status === selectedOption.value,
      );
      setUser(filteredUsers);
    }
  };

  return (
    <React.Fragment>
      <BreadCrumb title="Quản lý người dùng" pageTitle="Users" />
      <DeleteModal
        show={deleteModal}
        onHide={deleteToggle}
        onDelete={handleDelete}
      />
      <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-12">
        <div className="xl:col-span-12">
          <div className="card" id="usersTable">
            {/* <div className="card-body">
              <div className="flex items-center">
                <h6 className="text-15 grow">Danh sách người dùng</h6>
                <div className="shrink-0">
                  <button
                    type="button"
                    className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                    onClick={toggle}
                  >
                    <Plus className="inline-block size-4" />{" "}
                    <span className="align-middle">Tạo mới</span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="!py-3.5 card-body border-y border-dashed border-slate-200 dark:border-zink-500">
              <form action="#!">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                  <div className="relative xl:col-span-3">
                    <input
                      type="text"
                      className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      placeholder="Tìm họ tên, số điện thoại,..."
                      autoComplete="off"
                      onChange={(e) => filterSearchData(e)}
                    />
                    <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                  </div>
                  <div className="xl:col-span-2">
                    <Select
                      className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                      options={options}
                      isSearchable={false}
                      defaultValue={options[0]}
                      onChange={(event: any) => handleChange(event)}
                      id="choices-single-default"
                    />
                  </div>
                  <div className="xl:col-span-2 xl:col-end-13">
                    <div className="xl:justify-end flex">
                      <button
                        type="button"
                        className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                        onClick={toggle}
                      >
                        <Plus className="inline-block size-4" />{" "}
                        <span className="align-middle">Tạo mới</span>
                      </button>
                    </div>
                  </div>
                  {/* <div className="xl:col-span-3 xl:col-start-10">
                    <div className="flex gap-2 xl:justify-end">
                      <div>
                        <button
                          type="button"
                          className="bg-white border-dashed text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                        >
                          <Download className="inline-block size-4" />{" "}
                          <span className="align-middle">Import</span>
                        </button>
                      </div>
                      <button className="flex items-center justify-center size-[37.5px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
                        <SlidersHorizontal className="size-4" />
                      </button>
                    </div>
                  </div> */}
                </div>
              </form>
            </div>
            <div className="card-body">
              {user && user.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns || []}
                  data={user || []}
                  customPageSize={10}
                  divclassName="-mx-5 -mb-5"
                  tableclassName="w-full border-separate table-custom border-spacing-y-1 whitespace-nowrap overflow-x-auto"
                  theadclassName="text-left relative rounded-md bg-slate-100 dark:bg-zink-600 after:absolute ltr:after:border-l-2 rtl:after:border-r-2 ltr:after:left-0 rtl:after:right-0 after:top-0 after:bottom-0 after:border-transparent [&.active]:after:border-custom-500 [&.active]:bg-slate-100 dark:[&.active]:bg-zink-600"
                  thclassName="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold"
                  tdclassName="px-3.5 py-2.5 first:pl-5 last:pr-5"
                  PaginationClassName="flex flex-col items-center mt-8 md:flex-row"
                />
              ) : (
                <div className="noresult">
                  <div className="py-6 text-center">
                    <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                    <h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
                    <p className="mb-0 text-slate-500 dark:text-zink-200">
                      We did not find any users for you search.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Modal  */}
      <Modal
        show={show}
        onHide={toggle}
        id="defaultModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600"
      >
        <Modal.Header
          className="flex items-center justify-between p-4 border-b dark:border-zink-300/20"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
        >
          <Modal.Title className="text-16">
            {!!isEdit ? "Cập nhật" : "Thêm mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <form
            action="#!"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            {/* <div className="mb-3">
                            <div className="relative size-24 mx-auto mb-4 rounded-full shadow-md bg-slate-100 profile-user dark:bg-zink-500">
                                <img src={selectedImage || validation.values.img || dummyImg} alt="" className="object-cover w-full h-full rounded-full user-profile-image" />
                                <div className="absolute bottom-0 flex items-center justify-center size-8 rounded-full ltr:right-0 rtl:left-0 profile-photo-edit">
                                    <input
                                        id="profile-img-file-input"
                                        name="profile-img-file-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden profile-img-file-input"
                                        onChange={handleImageChange} />
                                    <label htmlFor="profile-img-file-input" className="flex items-center justify-center size-8 bg-white rounded-full shadow-lg cursor-pointer dark:bg-zink-600 profile-photo-edit">
                                        <ImagePlus className="size-4 text-slate-500 fill-slate-200 dark:text-zink-200 dark:fill-zink-500" />
                                    </label>
                                </div>
                            </div>
                            {validation.touched.img && validation.errors.img ? (
                                <p className="text-red-400">{validation.errors.img}</p>
                            ) : null}
                        </div> */}

            {/* <div className="mb-3">
                            <label htmlFor="userId" className="inline-block mb-2 text-base font-medium">ID</label>
                            <input type="text" id="userId" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" disabled
                                value={validation.values.userId || '#TW1500004'}
                            />
                        </div> */}
            <div className="mb-3">
              <label
                htmlFor="fullnameInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="fullnameInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập họ và tên"
                name="fullname"
                onChange={validation.handleChange}
                value={validation.values.fullname || ""}
              />
              {validation.touched.fullname && validation.errors.fullname ? (
                <p className="text-red-400">{validation.errors.fullname}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label
                htmlFor="phoneInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="phoneInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập số điện thoại"
                name="phone"
                onChange={validation.handleChange}
                value={validation.values.phone || ""}
              />
              {validation.touched.phone && validation.errors.phone ? (
                <p className="text-red-400">{validation.errors.phone}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label
                htmlFor="storeCodeSelect"
                className="inline-block mb-2 text-base font-medium"
              >
                Chi nhánh
              </label>
              <select
                className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                data-choices
                data-choices-search-false
                id="storeCodeSelect"
                name="storeCode"
                onChange={validation.handleChange}
                value={validation.values.storeCode || ""}
              >
                <option value="">Chọn chi nhánh</option>
                <option value="KS1">KS1</option>
                <option value="KS2">KS2</option>
                <option value="KH">KH</option>
              </select>
              {validation.touched.storeCode && validation.errors.storeCode ? (
                <p className="text-red-400">{validation.errors.storeCode}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label
                htmlFor="usernameInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="usernameInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Nhập tên đăng nhập"
                name="username"
                onChange={validation.handleChange}
                value={validation.values.username || ""}
              />
              {validation.touched.username && validation.errors.username ? (
                <p className="text-red-400">{validation.errors.username}</p>
              ) : null}
            </div>
            {/* <div className="mb-3">
              <label
                htmlFor="passwordInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="passwordInput"
                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="***********"
                name="password"
                onChange={validation.handleChange}
                value={validation.values.password || ""}
              />
              {validation.touched.password && validation.errors.password ? (
                <p className="text-red-400">{validation.errors.password}</p>
              ) : null}
            </div> */}
            <div className="mb-3">
              <label
                htmlFor="statusSelect"
                className="inline-block mb-2 text-base font-medium"
              >
                Trạng thái
              </label>
              <select
                className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                data-choices
                data-choices-search-false
                id="statusSelect"
                name="status"
                onChange={validation.handleChange}
                value={validation.values.status || ""}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              {validation.touched.status && validation.errors.status ? (
                <p className="text-red-400">{validation.errors.status}</p>
              ) : null}
            </div>
            <div className="mb-3">
              <label
                htmlFor="roleInput"
                className="inline-block mb-2 text-base font-medium"
              >
                Chức vụ
              </label>
              <select
                className="form-input border-slate-300 focus:outline-none focus:border-custom-500"
                data-choices
                data-choices-search-false
                id="roleInput"
                name="role"
                onChange={validation.handleChange}
                value={validation.values.role || ""}
                disabled={validation.values.role === "admin"}
              >
                <option value="">Chức vụ</option>
                {validation.values.role === "admin" && (
                  <option value="admin">Admin</option>
                )}
                <option value="manager">Quản lý</option>
                <option value="employee">Nhân viên</option>
              </select>
              {validation.touched.role && validation.errors.role ? (
                <p className="text-red-400">{validation.errors.role}</p>
              ) : null}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="reset"
                data-modal-close="addDocuments"
                className="text-red-500 transition-all duration-200 ease-linear bg-white border-white btn hover:text-red-600 focus:text-red-600 active:text-red-600 dark:bg-zink-500 dark:border-zink-500"
                onClick={toggle}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="text-white transition-all duration-200 ease-linear btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
              >
                {!!isEdit ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;
