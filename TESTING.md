# SafeDoc Workspace - Testing Guide

## Manual Testing Procedures

### Phase 1: Forensic Fraud Detection Tests

#### Test 1.1: Metadata Time-Warp Forensic

**Objective**: Verify timestamp anomaly detection

**Steps**:
1. Upload a PDF with modified metadata
2. Check if creation date predates document date claim
3. Verify risk factor appears in analysis

**Expected**: Risk factor flagged if mismatch > 48 hours

#### Test 1.2: Font Anomaly Detection

**Objective**: Detect font manipulation

**Steps**:
1. Analyze document with mixed font sizes
2. Check kerning anomaly detection
3. Review evidence in risk factors

**Expected**: Flags detected when font size varies > 0.1pt

#### Test 1.3: Shell Company Verification

**Objective**: Identify recently registered entities

**Steps**:
1. Submit invoice from entity registered < 48 hours
2. Check entity validation results
3. Verify shell company flag

**Expected**: CRITICAL risk if < 48 hours old

#### Test 1.4: Behavioral Profiling

**Objective**: Detect anomalous patterns

**Steps**:
1. Submit invoice 3x historical average
2. Check behavioral deviation metrics
3. Review urgency flags

**Expected**: HIGH risk if deviation > 200%

#### Test 1.5: Account Validation

**Objective**: Verify account ownership

**Steps**:
1. Submit invoice with mismatched account holder
2. Check account validation results
3. Verify CRITICAL risk assigned

**Expected**: CRITICAL risk on mismatch

### Phase 2: Document Generation Tests

#### Test 2.1: Email-to-Invoice

**Objective**: Transform emails into invoices

**Command**: `/invoice $2,500 for consulting services`

**Expected**:
- Structured invoice generated
- Line items present
- Total calculated correctly
- Professional formatting

#### Test 2.2: Self-Destructing NDA

**Objective**: Generate time-locked NDA

**Input**:
```javascript
{
  type: 'NDA',
  expirationWindow: 24
}
```

**Expected**:
- NDA with expiration clause
- Cryptographic token included
- Expiration date set to 24 hours

#### Test 2.3: DPA Rider

**Objective**: Generate AI protection clause

**Expected**:
- Prohibited AI uses listed
- Data segregation requirements
- Audit rights included
- Breach consequences defined

### Phase 3: Threat Intelligence Tests

#### Test 3.1: Fraud Consortium

**Objective**: Match against known fraud patterns

**Steps**:
1. Generate document hash
2. Check against consortium database
3. Verify pattern matching

**Expected**: Alert if >= 3 reports

#### Test 3.2: Deepfake Detection

**Objective**: Identify synthetic signatures

**Steps**:
1. Upload document with logo/signature
2. Run deepfake analysis
3. Check confidence score

**Expected**: Flag if confidence > 0.7

#### Test 3.3: Currency Volatility

**Objective**: Detect FX exposure

**Input**: Invoice with USD->TRY conversion

**Expected**: HIGH risk if volatility > 15%

#### Test 3.4: Compliance Drift

**Objective**: Verify tax rate accuracy

**Input**: Invoice with 8% tax in 10% jurisdiction

**Expected**: Compliance violation flagged

#### Test 3.5: Intent Analysis

**Objective**: Detect hidden clauses

**Test Phrases**:
- "reasonable efforts"
- "sole discretion"
- "perpetual license"
- "waive all rights"

**Expected**: Risk factors for each detected phrase

### Phase 4: Workflow Tests

#### Test 4.1: Milestone Escrow

**Objective**: Lock payment to deliverables

**Steps**:
1. Create SOW with milestones
2. Lock escrow payment
3. Verify release conditions

**Expected**: Payment status = 'locked'

#### Test 4.2: Dark Pattern Detection

**Objective**: Track pricing changes

**Input**: Historical pricing data showing 15% increase

**Expected**: HIGH risk alert generated

#### Test 4.3: Zen Mode Commands

**Commands to Test**:
```
/invoice $1,000 to Client Corp
/nda between Party A and Party B
/contract for software development
/sow Project Alpha with 3 milestones
```

**Expected**: Each generates appropriate document

### Real-Time Sync Tests

#### Test 5.1: Extension ↔ Web App Sync

**Steps**:
1. Detect document in extension
2. Verify appears in web app history
3. Check risk score syncs

**Expected**: < 1 second sync delay

#### Test 5.2: Multi-Client Sync

**Steps**:
1. Open web app in 2 browser tabs
2. Generate document in Tab 1
3. Verify appears in Tab 2

**Expected**: Instant state synchronization

### UI/UX Tests

#### Test 6.1: Design Tokens

**Verify**:
- Background: #09090B ✓
- Text: #FAFAFA ✓
- Border: #27272A ✓
- Accent: #EAB308 ✓

#### Test 6.2: Responsive Layout

**Test Resolutions**:
- 1920x1080 (Full HD)
- 1366x768 (Laptop)
- Extension panel (320px width)

**Expected**: No layout breaks

#### Test 6.3: Accessibility

**Checks**:
- Keyboard navigation
- Screen reader compatibility
- High contrast mode
- Focus indicators

### Performance Tests

#### Test 7.1: Analysis Speed

**Metric**: Document analysis completion time

**Target**: < 2 seconds for standard invoice

**Test**: Analyze 10 documents, measure average

#### Test 7.2: Generation Speed

**Metric**: Document generation time

**Target**: < 500ms for simple documents

**Test**: Generate 20 invoices, measure average

#### Test 7.3: WebSocket Latency

**Metric**: Message round-trip time

**Target**: < 100ms on localhost

**Test**: Ping/pong 100 times, measure average

### Security Tests

#### Test 8.1: Cryptographic Signatures

**Steps**:
1. Generate document with signature
2. Modify content
3. Verify signature invalid

**Expected**: Signature verification fails

#### Test 8.2: Expiration Tokens

**Steps**:
1. Create self-destructing approval (1 hour)
2. Wait 1 hour
3. Attempt access

**Expected**: Access denied after expiration

#### Test 8.3: Input Sanitization

**Malicious Inputs**:
```
<script>alert('xss')</script>
'; DROP TABLE documents;--
javascript:alert(1)
```

**Expected**: All sanitized, no execution

### Load Tests

#### Test 9.1: Concurrent Connections

**Test**: 100 simultaneous WebSocket connections

**Target**: All connected successfully

**Tool**: Artillery, K6, or custom script

#### Test 9.2: Document Processing

**Test**: 1000 documents analyzed sequentially

**Target**: No memory leaks, stable performance

**Monitor**: CPU, memory, response times

## Automated Testing (Future Enhancement)

### Unit Tests

```bash
# Backend services
npm test --workspace=backend

# React components
npm test --workspace=web-app

# Shared utilities
npm test --workspace=shared
```

### Integration Tests

```javascript
// Example: Document analysis flow
describe('Document Analysis', () => {
  it('should detect metadata anomalies', async () => {
    const result = await analyzer.analyze(mockDocument, ['metadata']);
    expect(result.riskScore.level).toBe(RiskLevel.HIGH);
  });
});
```

### E2E Tests

```javascript
// Example: Playwright test
test('generate invoice via web app', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('textarea', '/invoice $1000');
  await page.keyboard.press('Enter');
  await expect(page.locator('.document-title')).toContainText('INVOICE');
});
```

## Test Checklist

Before deployment, verify:

- [ ] All 5 Phase 1 forensic checks working
- [ ] All 20 document types generate correctly
- [ ] Extension detects documents on supported sites
- [ ] WebSocket real-time sync functions
- [ ] Risk visualizer displays correctly
- [ ] History panel updates
- [ ] Command parsing works
- [ ] Cryptographic signatures valid
- [ ] No console errors
- [ ] Performance within targets
- [ ] Security measures effective
- [ ] Accessibility standards met

## Bug Reporting Template

```markdown
**Bug Description**: 
Brief description of the issue

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Environment**:
- OS: Windows 11
- Browser: Chrome 120
- Node: 18.17.0

**Screenshots**:
[Attach if applicable]

**Console Errors**:
```
[Paste any error messages]
```
```

## Performance Benchmarks

### Target Metrics

| Operation | Target | Acceptable | Critical |
|-----------|--------|------------|----------|
| Document Analysis | < 2s | < 5s | > 10s |
| Document Generation | < 500ms | < 2s | > 5s |
| WebSocket Latency | < 100ms | < 500ms | > 1s |
| UI Render | < 100ms | < 300ms | > 1s |
| Memory Usage | < 200MB | < 500MB | > 1GB |

### Monitoring Commands

```bash
# Check memory usage
node --inspect backend/dist/index.js

# Profile React components
# Add ?profiler=true to URL

# WebSocket connection monitoring
# Check Chrome DevTools > Network > WS
```

---

**Testing Status**: All manual tests should pass before production deployment.
