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

## Hosted email setup

`backend/.env` is ignored by Git, so its values must be added in the backend hosting dashboard. Gmail SMTP works locally and on paid Render services with `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, and `SMTP_SECURE=true`. Render Free services block outbound SMTP ports 25, 465, and 587, so Gmail SMTP cannot work on that instance type even with valid credentials.

For Render Free, create a Brevo transactional-email API key and verified sender, then configure `MAIL_PROVIDER=brevo`, `BREVO_API_KEY`, `MAIL_FROM`, and `MAIL_FROM_EMAIL`. This uses HTTPS port 443. Keep `FRONTEND_URL` set to the Vercel URL for password-reset links.

After redeployment, open `https://YOUR-BACKEND/api/version`. The `mail.configured` value must be `true`, and the startup log must contain `[mail] verify:success`. Failures include the provider, host, port, SMTP error code, command, and response without exposing credentials. Set `MAIL_DEBUG=true` only temporarily if the standard diagnostics are insufficient.

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
