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

3.  Áp dụng lazy loading cho trang Lesson Detail Page

        Lazy loading cho nội dung bài học:
                - Sử dụng Intersection Observer API để phát hiện khi phần nội dung bài học (content section) xuất hiện trong viewport
                - Chỉ load và render nội dung HTML khi người dùng scroll đến phần đó
                - Hiển thị loading spinner trong khi đang fetch và render nội dung
                - Sử dụng rootMargin: '100px' để trigger load sớm hơn 100px trước khi phần tử vào viewport
                - Tối ưu hiệu suất bằng cách chỉ load một lần (unobserve sau khi đã load)

        Lazy loading cho phần bình luận:
                - Áp dụng tương tự cho phần Comments Section
                - Sử dụng rootMargin: '200px' để load comments sớm hơn khi người dùng sắp scroll đến
                - Tách biệt observer cho content và comments để tối ưu trải nghiệm người dùng
                - Component CommentsSection chỉ được render khi phần tử observer được trigger

        Tự động đánh dấu bài học đã hoàn thành:
                - Theo dõi sự kiện scroll của window để phát hiện khi người dùng đọc đến cuối bài học
                - Sử dụng throttling (500ms) để tối ưu hiệu suất scroll listener
                - Tự động mark lesson as completed khi:
                        + Người dùng scroll đến 80% chiều dài trang
                        + Hoặc còn cách đáy trang 200px
                - Hiển thị thông báo xác nhận khi bài học được đánh dấu hoàn thành
                - Tránh duplicate requests bằng cách sử dụng ref để track trạng thái đã mark

4.  Chức năng Comment (Bình luận)

        API Backend:
                - Endpoint POST `/api/comments`: Tạo comment mới cho lesson hoặc problem
                - Endpoint GET `/api/comments/lesson/:lessonId`: Lấy danh sách comments theo lesson
                - Endpoint GET `/api/comments/problem/:problemId`: Lấy danh sách comments theo problem
                - Endpoint PUT `/api/comments/:id`: Cập nhật comment (chỉ author mới được sửa)
                - Endpoint DELETE `/api/comments/:id`: Xóa comment (author hoặc admin/teacher)
                - Validation và authorization: Kiểm tra user đã đăng nhập, chỉ cho phép author sửa/xóa comment của mình
                - Join với bảng users để lấy thông tin user (tên, avatar, email) khi trả về comments

        UI Component CommentsSection:
                - Component tái sử dụng được, hỗ trợ cả lesson và problem
                - Hiển thị form nhập comment (chỉ hiển thị khi user đã đăng nhập)
                - Danh sách comments với thông tin:
                        + Avatar và tên người comment
                        + Thời gian comment (format: "MMM DD, YYYY, HH:MM")
                        + Nội dung comment
                - Chức năng Edit: Cho phép author chỉnh sửa comment của mình
                        + Click vào icon Edit để chuyển sang chế độ edit
                        + Hiển thị textarea với nội dung hiện tại
                        + Có nút Cancel và Save
                - Chức năng Delete: Cho phép author hoặc admin/teacher xóa comment
                        + Hiển thị confirmation dialog trước khi xóa
                        + Optimistic update: Xóa ngay khỏi UI, rollback nếu API fail
                - Loading states: Hiển thị spinner khi đang fetch comments
                - Empty state: Hiển thị message khi chưa có comment nào
                - Real-time update: Tự động refresh danh sách sau khi create/update/delete

5.  Chức năng Favorite (Yêu thích/Bookmark)

        API Backend:
                - Endpoint PUT `/api/favorites/:problemId/toggle`: Toggle favorite cho challenge/problem
                - Endpoint PUT `/api/favorites/lesson/:lessonId/toggle`: Toggle favorite cho lesson
                - Endpoint GET `/api/favorites`: Lấy danh sách favorite challenges của user
                - Endpoint GET `/api/favorites/lessons`: Lấy danh sách favorite lessons của user
                - Endpoint GET `/api/favorites/check/:problemId`: Kiểm tra challenge có được favorite chưa
                - Endpoint GET `/api/favorites/lesson/:lessonId/check`: Kiểm tra lesson có được favorite chưa
                - Xử lý race condition: Kiểm tra lại nếu có duplicate key error
                - Response trả về: isFavorite (boolean), message, và data (thông tin favorite nếu có)

        UI Integration:
                - Hiển thị icon favorite (bookmark) trên Lesson Card và Challenge Card
                - Optimistic update: Cập nhật UI ngay lập tức, rollback nếu API fail
                - Sync favorite status từ server khi load danh sách lessons/challenges
                - Hiển thị trạng thái favorite với màu sắc khác nhau (filled/unfilled icon)
                - Hỗ trợ filter "Show Favorites Only" trên trang Lessons

6.  Chức năng Learning Process (Theo dõi tiến trình học tập)

        API Backend - Learned Lessons:
                - Endpoint POST `/api/learned-lessons/mark-completed`: Đánh dấu lesson đã hoàn thành
                - Endpoint GET `/api/learned-lessons/check/:lessonId`: Kiểm tra lesson đã hoàn thành chưa
                - Endpoint GET `/api/learned-lessons/user/completed`: Lấy danh sách tất cả lessons đã hoàn thành của user
                - Tự động tạo record trong bảng `learned_lessons` khi user hoàn thành lesson
                - Tránh duplicate: Kiểm tra lesson đã completed chưa trước khi tạo mới
                - Lưu trữ thông tin: userId, lessonId, completedAt, createdAt, updatedAt

        API Backend - Learning Progress:
                - Endpoint GET `/api/learning-process/user/progress`: Lấy tiến trình học tập tổng thể của user
                        + Trả về danh sách topics với thông tin:
                                * topicId, topicName
                                * totalProblems, solvedProblems, solvedPercentage
                                * totalLessons, completedLessons, completionPercentage
                                * lastSubmittedAt, lastCompletedAt
                - Endpoint GET `/api/learning-process/topic/:topicId/progress`: Lấy tiến trình của một topic cụ thể
                - Endpoint GET `/api/learning-process/lesson/:lessonId/progress`: Lấy tiến trình của một lesson cụ thể
                        + Trả về: lessonId, lessonTitle, topicId, topicName
                        + totalLessons trong topic, completedLessons, completionPercentage
                        + lastCompletedAt
                - Endpoint GET `/api/learning-process/user/lesson-progress`: Lấy tiến trình lessons của user (tất cả topics)
                - Endpoint GET `/api/learning-process/recent-topic`: Lấy topic gần nhất có submission
                - Endpoint GET `/api/learning-process/recent-lesson`: Lấy lesson gần nhất đã hoàn thành

        UI Integration:
                - Tự động mark lesson as completed khi user scroll đến cuối bài học (80% hoặc cách đáy 200px)
                - Hiển thị thông báo "Lesson Completed! 🎉" khi lesson được đánh dấu hoàn thành
                - Thông báo tự động ẩn sau 3 giây
                - Tracking progress: Lưu trữ tiến trình học tập để hiển thị trên dashboard/profile
                - Hiển thị completion percentage cho từng topic và lesson

        Business Logic:
                - Một lesson chỉ được đánh dấu completed một lần cho mỗi user
                - Completion được tính dựa trên việc user đã scroll đến cuối bài học
                - Progress percentage được tính: (completedLessons / totalLessons) * 100
                - Hỗ trợ query progress theo user, topic, hoặc lesson cụ thể

Tuần 5

Nhiệm vụ:

1.  Chức năng Exam (Thi cử)

        Quản lý kỳ thi (Exam):
                - API tạo, sửa, xóa kỳ thi (Admin/Teacher)
                - API lấy danh sách kỳ thi: Đang diễn ra, Sắp tới, Đã kết thúc
                - Thiết lập cấu hình kỳ thi: Thời gian bắt đầu, Thời lượng, Danh sách câu hỏi
                - Đăng ký tham gia kỳ thi (Enrollment)

        Giao diện làm bài thi (Exam Interface):
                - Chế độ Fullscreen/Focus mode để giảm thiểu gian lận
                - Đồng hồ đếm ngược (Countdown Timer) sync với server
                - Danh sách câu hỏi trong đề thi & Trạng thái làm bài
                - Tự động nộp bài khi hết giờ (Auto-submit)
                - Chặn xem kết quả/testcase chi tiết trong khi thi (chỉ hiện pass/fail public testcases hoặc ẩn hoàn toàn)

2.  Xem tất cả submission của User

        API Backend:
                - Endpoint GET `/api/submissions/my-submissions`: Lấy lịch sử submit của bản thân
                - Endpoint GET `/api/submissions/user/:userId`: Xem lịch sử của user khác (nếu public)
                - Hỗ trợ filter: Problem, Status (AC, WA, TLE...), Language, Date
                - Thống kê tổng quan: Số bài đã giải, Tỷ lệ accepted, Biểu đồ activity (Heatmap)

        UI Integration:
                - Trang Submissions History cá nhân
                - Bảng danh sách submissions:
                        + Cột: Thời gian, Bài toán, Kết quả (màu sắc phân loại), Ngôn ngữ, Runtime, Memory
                        + Click vào row để xem chi tiết code và log
                - Biểu đồ thống kê hoạt động (Submission Heatmap) theo thời gian
                - Bộ lọc tìm kiếm submission nâng cao

3.  Chức năng Comment (Bình luận) - Cải tiến

        API Backend:
                - Endpoint POST `/api/comments`: Tạo comment mới cho lesson hoặc problem
                - Endpoint GET `/api/comments/lesson/:lessonId`: Lấy danh sách comments theo lesson (bao gồm replies)
                - Endpoint GET `/api/comments/problem/:problemId`: Lấy danh sách comments theo problem (bao gồm replies)
                - Endpoint GET `/api/comments/:commentId/replies`: Lấy danh sách replies của một comment
                - Endpoint PUT `/api/comments/:id`: Cập nhật comment (chỉ author mới được sửa)
                - Endpoint DELETE `/api/comments/:id`: Xóa comment (author hoặc admin/teacher)
                - Hỗ trợ nested comments: Comments có thể có parentCommentId để tạo cấu trúc reply
                - Validation và authorization: Kiểm tra user đã đăng nhập, chỉ cho phép author sửa/xóa comment của mình
                - Join với bảng users để lấy thông tin user (tên, avatar, email) khi trả về comments
                - Response trả về CommentWithReplies bao gồm cả replies của mỗi comment

        UI Component CommentsSection:
                - Component tái sử dụng được, hỗ trợ cả lesson và problem
                - Hiển thị form nhập comment (chỉ hiển thị khi user đã đăng nhập)
                - Danh sách comments với thông tin:
                        + Avatar và tên người comment
                        + Thời gian comment (format: "MMM DD, YYYY, HH:MM")
                        + Nội dung comment
                - Chức năng Reply: Cho phép reply comment của người khác
                        + Click vào nút Reply để hiển thị form reply
                        + Tạo nested comment với parentCommentId
                        + Hiển thị replies dưới dạng nested tree
                        + Expand/collapse replies
                - Chức năng Edit: Cho phép author chỉnh sửa comment của mình
                        + Click vào icon Edit để chuyển sang chế độ edit
                        + Hiển thị textarea với nội dung hiện tại
                        + Có nút Cancel và Save
                - Chức năng Delete: Cho phép author hoặc admin/teacher xóa comment
                        + Hiển thị confirmation dialog trước khi xóa
                        + Optimistic update: Xóa ngay khỏi UI, rollback nếu API fail
                - Loading states: Hiển thị spinner khi đang fetch comments
                - Empty state: Hiển thị message khi chưa có comment nào
                - Real-time update: Tự động refresh danh sách sau khi create/update/delete

4.  Chức năng Favorite (Yêu thích/Bookmark) - Cải tiến

        API Backend:
                - Endpoint PUT `/api/favorites/:problemId/toggle`: Toggle favorite cho challenge/problem
                - Endpoint PUT `/api/favorites/lesson/:lessonId/toggle`: Toggle favorite cho lesson
                - Endpoint GET `/api/favorites`: Lấy danh sách favorite challenges của user
                - Endpoint GET `/api/favorites/lessons`: Lấy danh sách favorite lessons của user
                - Endpoint GET `/api/favorites/check/:problemId`: Kiểm tra challenge có được favorite chưa
                - Endpoint GET `/api/favorites/lesson/:lessonId/check`: Kiểm tra lesson có được favorite chưa
                - Xử lý race condition: Kiểm tra lại nếu có duplicate key error khi toggle
                - Response trả về: isFavorite (boolean), message, và data (thông tin favorite nếu có)
                - Join với bảng problems và lessons để trả về thông tin đầy đủ

        UI Integration:
                - Hiển thị icon favorite (bookmark) trên Lesson Card và Challenge Card
                - Optimistic update: Cập nhật UI ngay lập tức, rollback nếu API fail
                - Sync favorite status từ server khi load danh sách lessons/challenges
                - Hiển thị trạng thái favorite với màu sắc khác nhau (filled/unfilled icon)
                - Hỗ trợ filter "Show Favorites Only" trên trang Lessons và Challenges
                - Loading state khi đang toggle favorite
                - Toast notification khi toggle thành công/thất bại

5.  Chức năng Manage User (Quản lý người dùng)

        API Backend:
                - Endpoint GET `/api/admin/users`: Lấy danh sách users với pagination và filters
                        + Query params: page, limit, search, role, status, email, firstName, lastName
                        + Sort: sortBy (createdAt, email, etc.), sortOrder (asc/desc)
                        + Filter theo role: user, teacher , owner
                        + Filter theo status: active, banned
                - Endpoint GET `/api/admin/users/:id`: Lấy thông tin chi tiết một user
                - Endpoint POST `/api/admin/users`: Tạo user mới
                        + Validation: email unique, password required, role mặc định là 'user'
                        + Hash password trước khi lưu vào database
                - Endpoint PUT `/api/admin/users/:id`: Cập nhật thông tin user
                        + Có thể cập nhật: firstName, lastName, email, password, status, gender, dateOfBirth
                        + Hash password mới nếu có
                - Endpoint DELETE `/api/admin/users/:id`: Xóa user
                - Endpoint GET `/api/admin/users/teachers`: Lấy danh sách teachers
                - Authorization: Chỉ Teacher hoặc Owner mới được truy cập
                - Response trả về PaginatedResult với data, total, page, limit

        UI Component ManageUser:
                - Trang quản lý users với table hiển thị danh sách
                - Các cột hiển thị:
                        + Name (firstName + lastName)
                        + Email
                        + Gender
                        + Date of Birth
                        + Status (active/banned với badge màu)
                        + Role (với tag màu sắc)
                        + Last Login
                        + Actions (Edit, Delete)
                - Chức năng Search: Tìm kiếm theo name, email, role
                - Chức năng Pagination: Phân trang với PAGE_SIZE = 10
                - Chức năng Create: Form tạo user mới
                        + Fields: firstName, lastName, email, password, status, gender, dateOfBirth
                        + Validation form
                - Chức năng Edit: Form chỉnh sửa user
                        + Pre-fill dữ liệu hiện tại
                        + Có thể cập nhật password (optional)
                - Chức năng Delete: Xóa user với confirmation dialog
                - Loading states: Hiển thị spinner khi đang fetch/update
                - Error handling: Hiển thị error message nếu có lỗi
                - Refresh button: Reload danh sách users

6.  Chức năng Manage Teacher (Quản lý giáo viên)

        API Backend:
                - Endpoint GET `/api/admin/teachers`: Lấy danh sách teachers với pagination
                        + Query params: page, limit, sortBy, sortOrder
                        + Chỉ trả về users có role = 'teacher'
                - Endpoint POST `/api/admin/teachers`: Tạo teacher mới
                        + Force role = 'teacher' khi tạo
                        + Validation: email unique, password required
                        + Hash password trước khi lưu
                - Endpoint PUT `/api/admin/teachers/:id`: Cập nhật thông tin teacher
                        + Force giữ role = 'teacher' khi update
                        + Có thể cập nhật: firstName, lastName, email, password, status, gender, dateOfBirth
                - Authorization: Chỉ Owner mới được truy cập (requireOwner middleware)
                - Sử dụng chung AdminUserService nhưng với role cố định là 'teacher'

        UI Component ManageTeacher:
                - Trang quản lý teachers với table hiển thị danh sách
                - Các cột hiển thị:
                        + Name (firstName + lastName)
                        + Email
                        + Gender
                        + Date of Birth
                        + Status (active/banned với badge màu)
                        + Last Login
                        + Actions (Edit, Delete)
                - Chức năng Search: Tìm kiếm theo name, email
                - Chức năng Pagination: Phân trang với PAGE_SIZE = 10
                - Chức năng Create: Form tạo teacher mới
                        + Fields: firstName, lastName, email, password, status, gender, dateOfBirth
                        + Role tự động set là 'teacher'
                - Chức năng Edit: Form chỉnh sửa teacher
                        + Pre-fill dữ liệu hiện tại
                        + Không cho phép thay đổi role
                - Chức năng Delete: Xóa teacher với confirmation dialog
                - Loading states: Hiển thị spinner khi đang fetch/update
                - Error handling: Hiển thị error message nếu có lỗi
                - Refresh button: Reload danh sách teachers
