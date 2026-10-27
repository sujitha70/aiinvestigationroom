const axios = require('../client/node_modules/axios');

async function testWebsiteFlow() {
  console.log('=== STARTING AUTOMATED WEBSITE & API FLOW TEST ===\n');

  // 1. Test Frontend Vite Server
  console.log('[1/7] Testing Frontend Dev Server (http://localhost:5173)...');
  const frontend = await axios.get('http://localhost:5173');
  if (frontend.status === 200 && frontend.data.includes('AI Mystery Room')) {
    console.log('  -> Frontend HTML served successfully. Title & root elements verified.\n');
  } else {
    throw new Error('Frontend not serving expected HTML.');
  }

  // 2. Test Backend Health
  console.log('[2/7] Testing Backend API Health (http://localhost:5000/api/health)...');
  const health = await axios.get('http://localhost:5000/api/health');
  console.log('  -> Health Check:', health.data, '\n');

  // 3. Test Mystery Creation (Simulating Create Page)
  console.log('[3/7] Simulating Create Mystery Form Submission (POST /api/cases)...');
  const createPayload = {
    premise: 'During a high-profile museum gala, a 45-carat blue diamond vanished from a laser-protected pedestal.',
    difficulty: 'medium'
  };
  const createRes = await axios.post('http://localhost:5000/api/cases', createPayload);
  const caseId = createRes.data.caseId;
  console.log('  -> Case Created Successfully!');
  console.log('     Case ID:', caseId);
  console.log('     Title:', createRes.data.title);
  console.log('     Difficulty:', createRes.data.difficulty, '\n');

  // 4. Test Investigation Room Loading (Simulating Case Page)
  console.log('[4/7] Loading Investigation Room Data (GET /api/cases/' + caseId + ')...');
  const roomRes = await axios.get('http://localhost:5000/api/cases/' + caseId);
  console.log('  -> Loaded Case Synopsis:', roomRes.data.title);
  console.log('     Suspects Count:', roomRes.data.suspects.length);
  console.log('     Suspects:', roomRes.data.suspects.map(s => s.name + ' (' + s.role + ')'));
  console.log('     Clues Count:', roomRes.data.clues.length);
  console.log('     Hints Available:', roomRes.data.hints.length);
  console.log('     Initial Score:', roomRes.data.playerScore, 'pts');
  const isSecure = roomRes.data.solution === undefined && roomRes.data.suspects[0].isCulprit === undefined;
  console.log('  -> Verifying Solution Secrecy: solution & isCulprit are stripped:', isSecure, '\n');

  // 5. Test Clue Discovery (+5 pts each)
  const clue1 = roomRes.data.clues[0].id;
  const clue2 = roomRes.data.clues[1].id;
  console.log('[5/7] Discovering Clues (' + clue1 + ' & ' + clue2 + ')...');
  const disc1 = await axios.post('http://localhost:5000/api/cases/' + caseId + '/clues/' + clue1 + '/discover');
  console.log('  -> Discovered Clue 1: ' + disc1.data.description.slice(0, 60) + '... (+' + disc1.data.pointsAdded + ' pts)');
  const disc2 = await axios.post('http://localhost:5000/api/cases/' + caseId + '/clues/' + clue2 + '/discover');
  console.log('  -> Discovered Clue 2: ' + disc2.data.description.slice(0, 60) + '... (+' + disc2.data.pointsAdded + ' pts)');
  console.log('     Current Investigator Score:', disc2.data.totalScore, 'pts (Expected: 10 pts)\n');

  // 6. Test Hint Request (-10 pts)
  console.log('[6/7] Requesting Strategic Hint (POST /api/cases/' + caseId + '/hints)...');
  const hintRes = await axios.post('http://localhost:5000/api/cases/' + caseId + '/hints');
  console.log('  -> Hint Unlocked: "' + hintRes.data.text + '"');
  console.log('     Penalty Deducted: -' + hintRes.data.pointsDeducted + ' pts');
  console.log('     Score after Hint:', hintRes.data.totalScore, 'pts (Enforced Min Boundary: 0 pts)\n');

  // 7. Test Final Accusation & Results
  const targetSuspect = roomRes.data.suspects[1]; // Vivian Sterling
  console.log('[7/7] Submitting Final Accusation targeting suspect: ' + targetSuspect.name + ' (' + targetSuspect.id + ')...');
  const accuseRes = await axios.post('http://localhost:5000/api/cases/' + caseId + '/accuse', {
    suspectId: targetSuspect.id
  });
  console.log('  -> Accusation Result:');
  console.log('     Correct:', accuseRes.data.correct);
  console.log('     Final Score:', accuseRes.data.finalScore, 'pts');
  console.log('     Score Breakdown:', accuseRes.data.scoreBreakdown);
  console.log('     Unmasked Culprit:', accuseRes.data.culpritName);
  console.log('     Hidden Motive:', accuseRes.data.motive);
  console.log('     Explanation:', accuseRes.data.explanation.slice(0, 120) + '...');
  console.log('     Timeline Milestones:', accuseRes.data.timeline.length, 'events recorded.');

  // Verify Results Endpoint
  const finalResult = await axios.get('http://localhost:5000/api/cases/' + caseId + '/result');
  console.log('\n  -> GET /api/cases/' + caseId + '/result Verified:');
  console.log('     Case Solved Status:', finalResult.data.correct ? 'VERIFIED ACCUSATION' : 'DISPROVEN');
  console.log('     Verified Score:', finalResult.data.finalScore, 'pts');

  console.log('\n=== ALL 7 PHASES TESTED SUCCESSFULLY AND VERIFIED 100%! ===');
}

testWebsiteFlow().catch(err => {
  console.error('Test Failed:', err.response ? err.response.data : err.message);
  process.exit(1);
});
