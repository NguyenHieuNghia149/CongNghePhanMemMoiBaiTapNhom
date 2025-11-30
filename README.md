Bài Tập Nhóm

Đề tài: Hệ thống luyện tập và thi thử lập trình

Thành viên:

Nguyễn Hiếu Nghĩa – 22110189

Hồ Kim Trí – 22110252

Tuần 1

Nhiệm vụ:

1. API: Login, Login Google, Register, Forgot Password, Profile

2. UI: Giao diện các trang Login, Register, Forgot Password, Profile

Tuần 2

Nhiệm vụ:

1.  Đăng nhập & lưu trữ phiên

        Sau khi user đăng nhập → chuyển vào trang chủ

        Lưu thông tin đăng nhập bằng Realm (hoặc tương đương)

        Hiển thị tên user, có menu: Profile, Đơn hàng của tôi, Logout

        Profile: chỉnh sửa họ tên, email, số điện thoại, avatar

        Logout: xoá dữ liệu user và quay về trang chủ

2.  Thử thách & bài học

        API + UI hiển thị thử thách theo chủ đề

        Hiển thị bài học theo chủ đề

        Lọc thử thách theo cấp độ, thể loại

3.  Chi tiết thử thách & bài học

        Hiển thị mô tả, ràng buộc

        Editor viết code

        Hiển thị phương pháp giải (nếu có)

        Testcase mẫu

        Hiển chi tiết bài học bao gồm: video( nếu có), code mẫu,..

Tuần 3, 4

Nhiệm vụ:

1.  Áp dụng lazy loading cho trang Challenge Page

        Lazy load API cho trang challenge page:
                - Sử dụng Intersection Observer API để phát hiện khi người dùng scroll đến cuối trang
                - Triển khai cursor-based pagination với custom hook `useInfiniteChallenges`
                - Tự động load thêm challenges khi người dùng scroll đến phần tử quan sát (observer element)
                - Mỗi lần load thêm 8 challenges, sử dụng cursor để phân trang hiệu quả
                - Hiển thị trạng thái loading khi đang fetch dữ liệu
                - Hỗ trợ filter theo tags, difficulty, search query mà không cần reload lại toàn bộ danh sách

2.  Chức năng Run và Submit code

        Chức năng Run Code:
                - Người dùng có thể test code trước khi submit chính thức
                - Gọi API `/api/submissions/run` với source code, language, và problemId
                - Service lấy testcases từ database và gửi đến sandbox service để thực thi
                - Sandbox service chạy code trong Docker container cách ly với các ràng buộc:
                        + Giới hạn thời gian (timeLimit) theo từng bài toán
                        + Giới hạn bộ nhớ (memoryLimit) theo từng bài toán
                        + Kiểm tra bảo mật code (validateCodeSecurity) để ngăn chặn các lệnh nguy hiểm
                - So sánh output của code với expected output từ testcases
                - Trả về kết quả ngay lập tức cho người dùng với thông tin:
                        + Số testcase đã pass/tổng số testcase
                        + Chi tiết từng testcase (chỉ hiển thị public testcases)
                        + Thông báo lỗi nếu có (compilation error, runtime error, time limit exceeded, etc.)

        Chức năng Submit Code:
                - Người dùng submit code chính thức để được chấm điểm
                - Tạo submission record trong database với status PENDING
                - Đưa job vào queue để xử lý bất đồng bộ bởi worker service
                - Worker service xử lý từng submission:
                        + Cập nhật status thành RUNNING
                        + Gọi sandbox service để thực thi code với tất cả testcases (bao gồm cả private testcases)
                        + So sánh kết quả và tính điểm dựa trên số testcase pass
                        + Xác định status cuối cùng (ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, etc.)
                        + Cập nhật submission với kết quả chi tiết và score
                - Hỗ trợ polling hoặc WebSocket để cập nhật trạng thái real-time cho người dùng
                - Hiển thị queue position và estimated wait time khi submit

        Lưu trữ thông tin submission:
                - Lưu vào database với các thông tin:
                        + Source code của người dùng
                        + Ngôn ngữ lập trình sử dụng
                        + Status (PENDING, RUNNING, ACCEPTED, WRONG_ANSWER, etc.)
                        + Score đạt được
                        + Kết quả chi tiết từng testcase
                        + Thời gian submit
                        + User ID và Problem ID
                - Hỗ trợ query submissions theo problemId để hiển thị lịch sử

        Hiển thị thông tin submit ở trang Submissions:
                - Component SubmissionsTab hiển thị danh sách tất cả submissions của một bài toán
                - Hiển thị thông tin:
                        + Status với màu sắc tương ứng (accepted = xanh, wrong answer = đỏ, etc.)
                        + Ngày giờ submit
                        + Ngôn ngữ lập trình
                        + Số testcase pass/tổng số testcase
                - Cho phép xem chi tiết từng submission:
                        + Source code đã submit (read-only)
                        + Kết quả chi tiết từng testcase
                        + Thông báo lỗi nếu có
                - Lọc và sắp xếp submissions theo thời gian (mới nhất trước)
