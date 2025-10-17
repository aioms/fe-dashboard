1. ##  **Header thông tin Phiếu**

**Vị trí:** Phía trên cùng giao diện

**Thành phần:**

* **Mã phiếu thu:** PT000123 (nổi bật – heading)

* **Trạng thái phiếu:** Tag màu (Đang thu, Đã thu xong, Quá hạn)

* **Ngày tạo / Ngày cập nhật**

* **Khách hàng:**

  * Tên KH

  * SĐT

  * Email

  * Địa chỉ (nếu có)

* **Ghi chú phiếu thu** (nếu có)

✅ **UX đề xuất:**

* Dạng Card 2 cột

* Tag màu sắc phân biệt trạng thái

* Tooltip hoặc modal mở rộng để xem đầy đủ thông tin khách

---

2. ##  **Chi tiết công nợ Phiếu**

**Hiển thị số liệu tài chính tóm tắt dạng card lớn hoặc hàng ngang:**

* **🧾Tổng công nợ:** 10.000.000đ  
* **✅Đã thanh toán:** 6.000.000đ  
* **💰Còn lại:** 4.000.000đ


✅ Màu sắc nhấn mạnh để phân biệt  
 ✅ Update realtime khi có thanh toán mới  
---

## **Tab phụ 1: Chi tiết các đợt mua hàng**

**Mục tiêu:** Cho biết công nợ phát sinh từ các đợt mua

**Hiển thị dạng accordion hoặc bảng có thể mở rộng:**

* **Chi tiết trong đợt:** (expandable)

| Đợt  | Tên SP- Mã | Số lượng | Đơn giá | Thành tiền | Trạng thái |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 15/04/25 | Asaki máy \-NK00..1 | **1** | 4.000.000đ | 4.450.000đ | Công nợ |
|  | Kềm cắt \- NK….. | **3** | 150.000đ |  |  |

✅ Tính năng:

* Có thể sắp xếp theo ngày

---

## **Tab phụ 2: Chi tiết các đợt thanh toán phiếu**

**Mục đích:** Theo dõi lịch sử thanh toán công nợ

**Hiển thị dạng bảng:**

| STT | Ngày thanh toán | Số tiền | Phương thức | Nhân viên xử lý | Ghi chú |
| ----- | ----- | ----- | ----- | ----- | ----- |
| 1 | 25/06/2025 | 3.000.000đ | Tiền mặt | Nguyễn Văn B | ... |

✅ Tính năng:

* Có nút “Thêm đợt thanh toán” nếu trạng thái chưa thu xong

* Chỉnh sửa / xoá đợt thanh toán

---

## **5️⃣ Thanh tác vụ (Action Bar)**

**Vị trí:** Trên cùng hoặc cố định bên cạnh giao diện

**Nút chức năng chính:**

* ✏️ **Cập nhật** – mở modal hoặc form inline để chỉnh sửa phiếu

* 🖨️ **In** – Xuất PDF chi tiết phiếu thu

* 🗑️ **Xoá** – Xác nhận trước khi xoá phiếu

* ↩️ **Trả hàng** – Tạo/Link sang đơn trả hàng liên quan

✅ Tooltip giải thích chức năng từng nút

---

## **6️⃣ Gợi ý các tính năng tiện lợi bổ sung**

✅ **Lịch sử thay đổi phiếu:** Timeline audit log (ai chỉnh sửa, khi nào)  
 ✅ **Thông báo quá hạn:** Banner đỏ nếu còn nợ và đã quá hạn thu dự kiến  
 ✅ **Chia sẻ/link nhanh:** Copy link phiếu để gửi khách hoặc nhân viên khác  
 ✅ **Upload chứng từ:** Lưu ảnh biên lai thanh toán (JPG/PDF) đính kèm phiếu  
 ✅ **Gửi email khách:** Tích hợp nút gửi email nhắc thanh toán công nợ  
 ✅ **In hóa đơn/phiếu thu:** Xuất mẫu in đẹp, kèm logo công ty

