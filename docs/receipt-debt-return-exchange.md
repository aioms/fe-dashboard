# Phiếu đổi/trả hàng phiếu thu v3

## Phạm vi

Màn hình cập nhật phiếu trả nhận refType/refId/accountingVersion. Phiếu debt v3 hiển thị DebtReturnReview: nguồn phiếu, hàng trả/nhận và chênh lệch. Không đưa phiếu v3 qua biểu mẫu sửa dòng legacy. Luồng tạo mới tại mobile; dashboard hiện chưa có màn hình chi tiết phiếu thu tương đương.

## Dữ liệu và trạng thái

Component dispatch updateDebtReturn thunk → apis/receipt-return → PUT backend. Trả thuần cho cập nhật trạng thái và ghi chú; khi đảo phiếu hoàn thành cần xác nhận. Đổi hàng hoàn thành chỉ đọc. Có pending, lỗi/thử lại và tải lại sau cập nhật. Văn bản mới qua i18next.

Tiền đã thu không đổi và không tạo giao dịch. Chênh lệch hiển thị là giá trị hàng nhận gồm VAT trừ giá trị hàng trả gốc, không phải số tiền tự thu/hoàn. Tổng phiếu áp ngưỡng 0; các điều chỉnh/VAT/chiết khấu do backend quản lý. Legacy order/supplier/debt giữ luồng cũ.

## Kiểm tra

Chạy yarn build. Contract đầy đủ: [nghiệp vụ backend v3](../../be-service/docs/business/debt-return.md). Chưa kiểm tra UI trình duyệt với dữ liệu thật; chưa triển khai backend/migration.
