# Đơn gộp ĐMSG

Dashboard bản đầu đọc ĐMSG trong danh sách/chi tiết và nhận báo cáo aggregate
đã bao gồm completed ĐMSG. Tạo/sửa/thu-chi/hủy dùng Mobile/PWA.

- Chi tiết ĐMSG có tổng hóa đơn, bóc VAT, doanh thu, tiền chuyển khách, vốn
  nhập tay chưa VAT, phí, lợi nhuận và actual receipts/payouts.
- Nháp đã xuất kho nhưng chưa tính báo cáo; completed ghi theo ngày hoàn thành.
- Không hiển thị đơn giá 0 như đơn bán lẻ hoặc xuất mẫu bán lẻ cho ĐMSG.
- Dữ liệu legacy sales/internal_transfer giữ giao diện và công thức hiện tại.
- Source: `src/pages/Dashboards/Order/OrderDetail/components/DmsgOrderDetail.tsx`.
- Tài liệu nghiệp vụ sở hữu: `be-service/docs/business/dmsg-orders.md`.

Đã chạy `yarn build`; cảnh báo bundle và source-map không có CI credentials
không phải bằng chứng triển khai production.

## Cập nhật 11/11/2026

Sản phẩm xuất kho không bắt buộc; [] ở nháp hoàn tồn đã xuất. Chứng từ ảnh giá vốn/PDF hóa đơn tùy chọn, 10 tệp mỗi nhóm, 10 MB/tệp; sửa ở nháp/hoàn thành, hủy chỉ xem. Biên lợi nhuận = profit/revenue; doanh thu 0 hiện —. Contract và vận hành: be-service/docs/business/reminders-and-dmsg-documents.md.
