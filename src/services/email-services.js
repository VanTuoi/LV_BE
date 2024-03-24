const nodemailer = require("nodemailer");

// Hàm gửi email
export default async function sendEmail(email, name, url) {
    try {
        // Khởi tạo transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Host của máy chủ SMTP của Gmail
            port: 465, // Port của máy chủ SMTP (SSL)
            secure: true, // Sử dụng kết nối bảo mật SSL
            auth: {
                user: "tablereservationsystem@gmail.com",
                pass: "xrfl chpb pzun yroj",
            },
        });

        // Gửi mail
        const info = await transporter.sendMail({
            from: '"Table Reservation System" <tablereservationsystem@gmail.com>', // Địa chỉ người gửi
            to: email, // Danh sách người nhận
            subject: "Change your password", // Chủ đề
            text: "", // Nội dung văn bản
            html: ` <p>Xin chào, ${name}</p></br>
                    <p> chúng tôi nhận được yêu cầu thay đổi mật khẩu tàin khoản của bạn.</p></br>
                    <p>Để thay đổi mật khẩu vui lòng truy cập liên kết sau ${url}</p></br>
                    <em> Lưu ý, liên kết chỉ có hiệu lực trong 5 phút</em>
                    `,
        });

        console.log("Message sent: %s", info.messageId);
        // Thông báo gửi thành công
        console.log("Email sent successfully!");
    } catch (error) {
        // Bắt lỗi nếu có
        console.error("Error sending email:", error);
    }
}

// Gọi hàm gửi email
