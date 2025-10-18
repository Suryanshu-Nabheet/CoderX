# 🎯 CoderX - How to Use Free Models

## ✅ **SOLUTION: Enable Free Models Filter**

### Step 1: Open CoderX
- Go to: **http://localhost:5173**

### Step 2: Enable Free Models Filter
1. Click on the **Model Selector** dropdown
2. Look for a **"Show Free Models Only"** toggle/checkbox
3. **Enable it** (check the box or toggle it on)

### Step 3: Select the Correct Model
1. With the free filter enabled, you should see only free models
2. Select: **`openai/gpt-oss-20b:free`** (NOT `openai/gpt-oss-20b`)
3. Make sure the provider is set to **`OpenRouter`**

### Step 4: Start Chatting
- Type your message and send it
- It should work without "Payment Required" errors

## 🔍 **Visual Guide**

**❌ Wrong Model (Paid):**
```
openai/gpt-oss-20b - in:$0.03 out:$0.14 - context 131k
```

**✅ Correct Model (Free):**
```
openai/gpt-oss-20b:free - in:$0.00 out:$0.00 - context 131k
```

## 🚨 **If You Still Get "Payment Required" Error:**

1. **Clear Browser Cache**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. **Check Model Name**: Make sure it ends with `:free`
3. **Check Pricing**: Should show `in:$0.00 out:$0.00`
4. **Restart Browser**: Close and reopen your browser

## 🎉 **Success!**

Once you select the correct free model, CoderX will work perfectly with your OpenRouter API key!
