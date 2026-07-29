# 🧪 SafeDoc AI - API Testing Guide

Quick reference for testing all Phase 1 killer features.

---

## 🔐 Authentication

First, register and login to get a JWT token:

### Register
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token** from the response for authenticated requests.

---

## 💰 Feature 1: Payment Links

### Create Payment Link
```bash
curl -X POST http://localhost:8081/api/payment-links/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 1500,
    "description": "Consulting Services Invoice",
    "invoiceId": "INV-12345",
    "customerEmail": "client@example.com"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "paymentUrl": "https://pay.stripe.com/..."
}
```

---

## 🔗 Feature 2: Document Chain Suggestions

### Get Suggestions
```bash
curl -X POST http://localhost:8081/api/document-chain/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "documentType": "invoice",
    "content": "Invoice for $5000 consulting services to Acme Corp",
    "metadata": {
      "client": "Acme Corp",
      "amount": 5000,
      "date": "2025-01-29"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "suggestions": [
    {
      "id": "suggestion_123",
      "type": "receipt",
      "title": "Payment Receipt",
      "description": "Generate payment receipt after invoice is paid",
      "confidence": 0.9,
      "prefilledData": {
        "clientName": "Acme Corp",
        "amount": 5000
      },
      "reason": "Typical next step after payment is received",
      "urgency": "high"
    }
  ]
}
```

### Learn from Behavior
```bash
curl -X POST http://localhost:8081/api/document-chain/learn \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "sourceDoc": "invoice",
    "targetDoc": "receipt"
  }'
```

---

## 🌍 Feature 3: Translation

### Get Supported Languages
```bash
curl http://localhost:8081/api/translate/languages
```

### Translate Document
```bash
curl -X POST http://localhost:8081/api/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "INVOICE\n\nTotal Amount: $1,500\nDue Date: January 30, 2025\n\nThank you for your business!",
    "targetLanguage": "es",
    "sourceLanguage": "en",
    "documentType": "invoice"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "translatedText": "FACTURA\n\nCantidad Total: $1,500\nFecha de Vencimiento: 30 de enero de 2025\n\n¡Gracias por su negocio!",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "confidence": 0.95,
  "warnings": ["Currency amounts remain in original format - convert if needed"]
}
```

### Detect Language
```bash
curl -X POST http://localhost:8081/api/translate/detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "Bonjour, comment allez-vous?"
  }'
```

**Popular Languages to Test**:
- Spanish: `es`
- French: `fr`
- German: `de`
- Chinese: `zh`
- Japanese: `ja`
- Arabic: `ar`

---

## 📊 Feature 4: Analytics

### Get Dashboard Metrics
```bash
curl http://localhost:8081/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response**:
```json
{
  "success": true,
  "metrics": {
    "overview": {
      "totalDocuments": 42,
      "totalUsers": 1,
      "totalRevenue": 125.50,
      "documentsToday": 5,
      "documentsThisWeek": 18,
      "documentsThisMonth": 42,
      "growthRate": 45.2
    },
    "topDocumentTypes": [...],
    "recentActivity": [...],
    "revenueChart": [...],
    "userActivityHeatmap": [...],
    "performanceMetrics": {
      "avgGenerationTime": 12.5,
      "successRate": 99.8,
      "errorRate": 0.2
    }
  }
}
```

### Get User Analytics
```bash
curl http://localhost:8081/api/analytics/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Real-Time Stats
```bash
curl http://localhost:8081/api/analytics/realtime \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Export Analytics (CSV)
```bash
curl http://localhost:8081/api/analytics/export?format=csv \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o analytics.csv
```

### Export Analytics (JSON)
```bash
curl http://localhost:8081/api/analytics/export?format=json \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o analytics.json
```

---

## 🎤 Feature 5: Voice Enhancement

### Extract Intent from Voice Command
```bash
curl -X POST http://localhost:8081/api/voice/extract-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "voiceCommand": "Create an invoice for John Doe for $1500 for consulting services",
    "context": {}
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "intent": {
    "intent": "create_invoice",
    "confidence": 0.95,
    "entities": {
      "client": "John Doe",
      "amount": 1500,
      "service": "consulting services"
    },
    "suggestedDocumentType": "invoice",
    "prefilledFields": {
      "clientName": "John Doe",
      "amount": 1500
    }
  }
}
```

### Process Voice Command
```bash
curl -X POST http://localhost:8081/api/voice/process-command \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "command": "Generate a contract for web development services",
    "userHistory": []
  }'
```

### Analyze Meeting
```bash
curl -X POST http://localhost:8081/api/voice/analyze-meeting \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "transcript": "John: We need to discuss the Q1 budget. Sarah: I agree, we should allocate $50,000 for marketing. John: That sounds reasonable. Let'\''s draft a contract by next week. Sarah: I'\''ll handle that.",
    "detectSpeakers": true
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "analysis": {
    "summary": "Team discussed Q1 budget allocation and contract requirements",
    "keyPoints": [
      "Budget of $50,000 approved for marketing",
      "Contract drafting required by next week"
    ],
    "actionItems": [
      {
        "task": "Draft marketing contract",
        "assignedTo": "Sarah",
        "priority": "high"
      }
    ],
    "decisions": ["Approved $50,000 marketing budget"],
    "topics": ["Budget", "Marketing", "Contracts"],
    "sentiment": "positive",
    "suggestedDocuments": [...]
  },
  "speakers": [
    {
      "id": "speaker_1",
      "name": "John",
      "color": "#3B82F6",
      "segments": [...]
    }
  ]
}
```

### Generate Meeting Minutes
```bash
curl -X POST http://localhost:8081/api/voice/meeting-minutes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "transcript": "John: Welcome everyone. Today we need to finalize the Q1 marketing strategy. Sarah: I propose we focus on digital channels with a budget of $50,000. John: Agreed. Mike, can you prepare the campaign plan by Friday? Mike: Yes, I will have it ready.",
    "metadata": {
      "title": "Q1 Marketing Strategy Meeting",
      "date": "2025-01-29",
      "location": "Conference Room A",
      "attendees": ["John Smith", "Sarah Johnson", "Mike Wilson"]
    }
  }'
```

---

## 🧪 Complete Test Flow

Here's a complete test scenario:

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@safedoc.ai","password":"test123","name":"Test User"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@safedoc.ai","password":"test123"}' | jq -r '.token')

echo "Token: $TOKEN"
```

### 2. Generate a Document (triggers analytics)
```bash
curl -X POST http://localhost:8081/api/documents/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "documentType": "invoice",
    "context": {
      "clientName": "Acme Corp",
      "items": "Web Development\nUI Design",
      "quantities": "1\n1",
      "prices": "3000\n2000"
    }
  }'
```

### 3. Get Document Chain Suggestions
```bash
curl -X POST http://localhost:8081/api/document-chain/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "documentType": "invoice",
    "content": "Invoice for Acme Corp - $5000",
    "metadata": {"client": "Acme Corp", "amount": 5000}
  }'
```

### 4. Create Payment Link
```bash
curl -X POST http://localhost:8081/api/payment-links/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 5000,
    "description": "Invoice for Acme Corp",
    "invoiceId": "INV-001",
    "customerEmail": "client@acme.com"
  }'
```

### 5. Translate Invoice
```bash
curl -X POST http://localhost:8081/api/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "text": "Total Amount: $5,000",
    "targetLanguage": "es",
    "documentType": "invoice"
  }'
```

### 6. Check Analytics
```bash
curl http://localhost:8081/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized**
- Make sure you include the JWT token in Authorization header
- Token format: `Bearer YOUR_TOKEN_HERE`
- Token expires after 24 hours

**500 Internal Server Error**
- Check backend logs for details
- Ensure all environment variables are set
- Verify Gemini API key is valid

**503 Service Unavailable**
- Stripe not configured (payment links only)
- Check STRIPE_SECRET_KEY in .env

### Check Backend Status
```bash
curl http://localhost:8081/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": 1706544000000
}
```

---

## 📝 Notes

- All authenticated endpoints require JWT token
- Replace `YOUR_TOKEN_HERE` with actual token from login
- Backend must be running on http://localhost:8081
- Some features require API keys (Stripe, Gemini)

---

**Happy Testing! 🚀**
