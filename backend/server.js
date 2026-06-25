const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// ── Order endpoint ──
app.post('/api/order', (req, res) => {
  const { customer, items, total, method, notes } = req.body;
  
  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const order = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    received: new Date().toISOString(),
    customer,
    items,
    total,
    method: method || 'pickup',
    notes: notes || '',
    status: 'new',
  };

  // Log order (in production, save to DB or email)
  console.log('\n═══════════════════════════════════');
  console.log(`📦 NEW ORDER #${order.id}`);
  console.log(`👤 ${customer.name} — ${customer.phone}`);
  console.log(`📧 ${customer.email}`);
  console.log(`📍 ${method.toUpperCase()}${customer.address ? ' — ' + customer.address : ''}`);
  console.log('─────────────────────────────────────');
  items.forEach(i => console.log(`  ${i.qty}x ${i.name} — $${(i.price * i.qty).toFixed(2)}`));
  console.log('─────────────────────────────────────');
  console.log(`💰 TOTAL: $${total.toFixed(2)}`);
  if (notes) console.log(`📝 Notes: ${notes}`);
  console.log('═══════════════════════════════════\n');

  res.json({ success: true, orderId: order.id, message: 'Order received! We\'ll call you shortly.' });
});

// ── Health check ──
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'eden-groceries' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛒 Eden Groceries backend running on port ${PORT}`);
});
