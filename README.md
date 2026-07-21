# Women’s Styles MERN Project

## Run Backend
```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=womens_styles_secret_key
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=Admin123
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-16-character-google-app-password
MAIL_FROM=Women's Styles
```

## Email providers

Local development uses Nodemailer SMTP. Keep `MAIL_PROVIDER=smtp` and configure `MAIL_USER` plus a Google App Password in `MAIL_PASS`.

Production hosting uses the Resend API. Configure these values in the hosting dashboard (never commit the real key):

```env
NODE_ENV=production
MAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

`onboarding@resend.dev` is intended for Resend testing. To email arbitrary customers in production, verify your own domain in Resend and set `RESEND_FROM_EMAIL` to an address on that domain.

## Local email setup

Email is sent only through Nodemailer SMTP. Use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`, and a Google App Password in `MAIL_PASS`. The startup log must contain `[mail] verify:success`. Set `MAIL_DEBUG=true` only temporarily for SMTP diagnostics.

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env` if needed:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_demo_key
```

## Admin Login
Frontend URL:
```txt
http://localhost:5173/admin/login
```

Credentials from backend `.env`:
```txt
Admin / Admin123
```

## Product Bulk Add API
```txt
POST http://localhost:5000/api/products/bulk
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

## Notes
- UI redesigned with Tailwind CSS.
- Navbar/footer logo added from uploaded logo.
- Checkout has product image preview, quantity controls and Razorpay UI integration.
- Product filters simplified to search and category only.
- Backend API endpoints are preserved.
