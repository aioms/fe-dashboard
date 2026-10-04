# Theo dõi lỗi dashboard

Axios giữ response.data contract. Mỗi HTTP attempt thêm X-Correlation-ID riêng;
X-Request-ID nghiệp vụ không thay đổi. Lỗi network/5xx được gửi PostHog bằng
Error đã bỏ message/payload/header/URL; 4xx và cancellation không tạo exception.
Response X-Trace-ID giúp nối lỗi API với trace backend. Global error và promise
rejection listeners được đăng ký một lần sau khi PostHog load.

Release production đặt REACT_APP_RELEASE theo commit. `yarn build` chạy CRA,
upload source maps private khi có POSTHOG_API_KEY/POSTHOG_PROJECT_ID và xóa maps
trước deploy. Private API key là env của CI, tuyệt đối không dùng REACT_APP_
cho secret. POSTHOG_HOST theo project. Nếu thiếu credentials: vẫn build và xóa
maps, stack trace minified không có symbolication. Nếu đã cấu hình upload mà
upload thất bại: build fail, không deploy. Upload thật chưa được kiểm chứng.

PostHog analytics/session identification hiện có vẫn hoạt động theo cấu hình
riêng; error helper không bảo đảm privacy cho toàn bộ analytics. Không hiển thị
raw error cho người dùng hay thay đổi toast/flow hiện có.

Backend nhận webhook issue đã mapping, không nhận trực tiếp payload PostHog
mặc định. Xem [runbook chung](../../be-service/docs/operations/observability.md).
Telegram/database/host do stack backend xử lý. Không có native crash trong web.

Source: src/helpers/api-telemetry.ts, src/helpers/axios/index.ts, src/index.tsx,
source-maps.ts. Kiểm bằng yarn build; browser/PostHog production delivery và
source map upload còn cần credentials/runtime thực tế.

Public env: `.env.example` ở root project. Private PostHog upload variables
phải được inject vào process environment của CI/build; không chỉ điền vào
file public dotenv. Chưa có credentials thì upload được bỏ qua có chủ đích.
