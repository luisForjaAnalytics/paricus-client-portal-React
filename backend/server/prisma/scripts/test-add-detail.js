import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';

async function testAddDetail() {
  try {
    console.log('🧪 Testing add ticket detail functionality\n');

    // 1. Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@paricus.com',
        password: 'admin123!',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${await loginResponse.text()}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // 2. Get first ticket
    console.log('2️⃣ Getting tickets...');
    const ticketsResponse = await fetch(`${API_URL}/tickets`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!ticketsResponse.ok) {
      throw new Error(`Get tickets failed: ${ticketsResponse.status} ${await ticketsResponse.text()}`);
    }

    const ticketsData = await ticketsResponse.json();
    const firstTicket = ticketsData.data[0];

    if (!firstTicket) {
      throw new Error('No tickets found. Please run seed-tickets.js first.');
    }

    console.log(`✅ Found ticket: ${firstTicket.subject} (ID: ${firstTicket.id})\n`);

    // 3. Add detail to ticket
    console.log('3️⃣ Adding detail to ticket...');
    const detailData = '<p>Test detail added via test script</p>';

    const addDetailResponse = await fetch(`${API_URL}/tickets/${firstTicket.id}/details`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ detail: detailData }),
    });

    console.log('Response status:', addDetailResponse.status);
    const responseText = await addDetailResponse.text();
    console.log('Response body:', responseText);

    if (!addDetailResponse.ok) {
      throw new Error(`Add detail failed: ${addDetailResponse.status} ${responseText}`);
    }

    const addDetailData = JSON.parse(responseText);
    console.log('✅ Detail added successfully!');
    console.log('Updated ticket has', addDetailData.data.details.length, 'details\n');

    // 4. Verify detail was added
    console.log('4️⃣ Verifying detail in database...');
    const ticket = await prisma.ticket.findUnique({
      where: { id: firstTicket.id },
      include: { details: true },
    });

    const lastDetail = ticket.details[ticket.details.length - 1];
    console.log('✅ Last detail:', {
      id: lastDetail.id,
      data: lastDetail.detailData.substring(0, 50) + '...',
      timestamp: lastDetail.timestamp,
    });

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testAddDetail();
