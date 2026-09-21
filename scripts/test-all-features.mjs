import http from 'http';

function testEndpoint(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length, content: data }));
    }).on('error', (err) => resolve({ error: err.message, status: 500, content: '' }));
  });
}

function testPost(path, body) {
  return new Promise((resolve) => {
    const payload = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, content: data }));
    });
    req.on('error', (err) => resolve({ error: err.message, status: 500, content: '' }));
    req.write(payload);
    req.end();
  });
}

async function runAll() {
  console.log('=== STARTING AUTOMATED PORTFOLIO TESTS ===\n');
  const pages = [
    '/',
    '/about',
    '/projects',
    '/projects/hermes-autonomous-agent-azure',
    '/projects/healspace-self-check-platform',
    '/projects/sistem-informasi-parkir-pt-worthfind',
    '/projects/poliklinik-kampus-udinus',
    '/projects/denah-master',
    '/projects/vinty-coffee-and-space',
    '/learning',
    '/sitemap.xml',
    '/robots.txt',
    '/images/arinal-portrait.jpg',
    '/favicon.svg',
    '/favicon.ico',
    '/apple-icon.png'
  ];

  let passCount = 0;
  for (const p of pages) {
    const res = await testEndpoint(p);
    if (res.status === 200) {
      console.log(`[PASS] ${p.padEnd(46)} -> 200 OK (${res.length} bytes)`);
      passCount++;
    } else {
      console.error(`[FAIL] ${p.padEnd(46)} -> Status ${res.status} Error: ${res.error || 'Non-200'}`);
    }
  }

  console.log('\n=== TESTING GA4 & CONTENT VALIDATION ===');
  const home = await testEndpoint('/');
  const hasGA = home.content.includes('G-CR24ENK5Q4');
  console.log(`GA4 Script rendered in Home: ${hasGA ? '[PASS]' : '[FAIL]'}`);

  const about = await testEndpoint('/about');
  const hasSkills = about.content.includes('Web Analytics') || about.content.includes('Google Analytics 4');
  console.log(`Web Analytics skills rendered in /about: ${hasSkills ? '[PASS]' : '[FAIL]'}`);

  console.log('\n=== TESTING RAG CHATBOT API (/api/chat) ===');
  console.log('Testing greeting query: "halo"...');
  const chat1 = await testPost('/api/chat', { message: 'halo' });
  console.log(`Chat 1 Status: ${chat1.status} ${chat1.status === 200 ? '[PASS]' : '[FAIL]'}`);
  console.log('Chat 1 Response Snippet:\n' + chat1.content.slice(0, 180) + '...\n');

  console.log('Testing specific query: "apakah Arinal bisa kerja on-site?"...');
  const chat2 = await testPost('/api/chat', { message: 'apakah Arinal bisa kerja on-site?' });
  console.log(`Chat 2 Status: ${chat2.status} ${chat2.status === 200 ? '[PASS]' : '[FAIL]'}`);
  console.log('Chat 2 Response Snippet:\n' + chat2.content.slice(0, 180) + '...\n');

  console.log('=== SUMMARY ===');
  console.log(`Passed ${passCount}/${pages.length} pages & static assets.`);
  if (passCount === pages.length && hasGA && hasSkills && chat1.status === 200 && chat2.status === 200) {
    console.log('ALL TESTS PASSED 100% SUCCESSFULLY!');
  } else {
    process.exitCode = 1;
  }
}

runAll();
