const { configured, sendMail } = require('./mailer');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const frontendUrl = () => String(process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '');
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const orderNumber = (order) => order._id.toString().slice(-8).toUpperCase();
const frame = (title, body) => `<div style="max-width:650px;margin:auto;padding:28px;font-family:Arial,sans-serif;color:#2a211b;line-height:1.65"><h1 style="color:#9b6d25">${escapeHtml(title)}</h1>${body}<hr style="border:0;border-top:1px solid #e8e0d5;margin:28px 0"><p style="color:#777;font-size:12px">Women’s Styles</p></div>`;

const sendPasswordResetEmail = ({ user, token }) => {
  const resetUrl = `${frontendUrl()}/reset-password/${encodeURIComponent(token)}`;
  return sendMail({ to: user.email, subject: "Reset your Women's Styles password", text: `Reset your password using this link (valid for 15 minutes): ${resetUrl}`, html: frame('Reset your password', `<p>Hi ${escapeHtml(user.name || 'Customer')},</p><p>This secure link is valid for 15 minutes.</p><p><a href="${escapeHtml(resetUrl)}" style="display:inline-block;background:#a91d4b;color:#fff;padding:12px 18px;text-decoration:none">Set new password</a></p><p>If you did not request this, you can safely ignore this email.</p>`) });
};

const sendOrderConfirmationEmail = ({ order, user }) => {
  const rows = order.items.map((item) => `<tr><td style="padding:10px;border-bottom:1px solid #eee">${escapeHtml(item.name)}${item.size ? `<br><small>Size: ${escapeHtml(item.size)}</small>` : ''}${item.color ? `<br><small>Colour: ${escapeHtml(item.color)}</small>` : ''}</td><td style="padding:10px;text-align:center;border-bottom:1px solid #eee">${Number(item.quantity)}</td><td style="padding:10px;text-align:right;border-bottom:1px solid #eee">${money(item.price * item.quantity)}</td></tr>`).join('');
  return sendMail({ to: user.email, subject: `Order confirmed #${orderNumber(order)} | Women's Styles`, text: `Thank you for your order. Order #${orderNumber(order)}. Total: ${money(order.amount)}. Payment: ${order.paymentMethod} (${order.paymentStatus}).`, html: frame('Thank you for your order!', `<p>Hi ${escapeHtml(user.name || order.address?.fullName || 'Customer')}, your order <b>#${orderNumber(order)}</b> has been placed successfully.</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:10px;text-align:left;background:#f5f1ea">Item</th><th style="padding:10px;background:#f5f1ea">Qty</th><th style="padding:10px;text-align:right;background:#f5f1ea">Amount</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="2" style="padding:14px;text-align:right"><b>Total</b></td><td style="padding:14px;text-align:right"><b>${money(order.amount)}</b></td></tr></tfoot></table><p><b>Payment:</b> ${escapeHtml(order.paymentMethod)} — ${escapeHtml(order.paymentStatus)}</p><p><b>Delivery address:</b><br>${escapeHtml(order.address?.fullName)}<br>${escapeHtml(order.address?.address)}, ${escapeHtml(order.address?.city)}, ${escapeHtml(order.address?.district)}<br>${escapeHtml(order.address?.state)} - ${escapeHtml(order.address?.pincode)}</p><p style="color:#777;font-size:12px">This email is your order bill and confirmation.</p>`) });
};

const sendCancellationEmail = ({ order, user }) => {
  const refund = order.paymentStatus === 'Paid' ? `Your refund of ${money(order.amount)} will be credited to your original payment method within 7 working days.` : 'No online payment was collected for this order, so no refund is required.';
  return sendMail({ to: user.email, subject: `Cancellation confirmed #${orderNumber(order)} | Women's Styles`, text: `Your order #${orderNumber(order)} cancellation has been accepted. ${refund}`, html: frame('Cancellation confirmed', `<p>Hi ${escapeHtml(user.name || 'Customer')}, your cancellation for order <b>#${orderNumber(order)}</b> has been accepted by Women’s Styles.</p><div style="background:#f5f1ea;padding:18px;border-left:4px solid #9b6d25"><b>${escapeHtml(refund)}</b></div><p><b>Cancellation reason:</b> ${escapeHtml(order.cancelReason || 'Order cancelled')}</p><p>If you need help, please reply to this email.</p>`) });
};

const sendOfferEmail = ({ email, subject, message }) => {
  const shopUrl = frontendUrl();
  return sendMail({ to: email, subject, text: `${message}\n\nShop now: ${shopUrl}`, html: frame(subject, `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p><p><a href="${escapeHtml(shopUrl)}" style="display:inline-block;background:#211914;color:white;padding:12px 20px;text-decoration:none">Shop Now</a></p><p style="color:#777;font-size:12px">You received this because you subscribed to Women’s Styles.</p>`) });
};

module.exports = { configured, sendCancellationEmail, sendOfferEmail, sendOrderConfirmationEmail, sendPasswordResetEmail };
