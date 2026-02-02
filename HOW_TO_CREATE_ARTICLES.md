# 📝 How to Create New Articles

## 🎯 Super Easy Method (Using Template)

### **Step 1: Copy the Template**

```bash
cd frontend/app/articles
cp ../../ARTICLE_TEMPLATE.tsx your-article-slug-2026/page.tsx
```

Or manually:
1. Open `ARTICLE_TEMPLATE.tsx` in the root
2. Copy everything
3. Create new folder: `app/articles/your-article-slug-2026/`
4. Create `page.tsx` inside and paste

### **Step 2: Find & Replace (5 things)**

Search for these in your new file and replace:

1. **YOUR_ARTICLE_TITLE** → Your actual title
2. **YOUR_ARTICLE_DESCRIPTION** → Description for Google
3. **2026-02-05** → Your publish date
4. **🚀** → Your emoji (🏦📱🚗🤖📈)
5. **AAPL, MSFT, GOOGL, NVDA** → Your related tickers

### **Step 3: Write Content**

Just edit between the comments:
```tsx
{/* START WRITING HERE */}
... your article content ...
{/* END WRITING HERE */}
```

### **Step 4: Deploy**

```bash
cd frontend
git add .
git commit -m "feat: Add [topic] article"
git push
```

✅ **Done! Sitemap updates automatically - Google will find it!**

---

### **Step 4: Change the Hero Image**

Update the emoji/icon and subtitle:

```tsx
<div className="text-8xl mb-4">🚀</div> {/* Change emoji */}
<p className="text-2xl font-bold text-white">Your Subtitle Here</p>
```

**Emoji suggestions:**
- 🚗 Tesla/Cars
- 🏦 Banking/Finance
- 📱 Apple/Tech
- 🤖 AI/Robotics
- 📈 Stocks/Markets

---

### **Step 5: Update the Title**

```tsx
<h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
  Your Article Title Goes Here
</h1>
```

---

### **Step 6: Update the Date**

```tsx
<span className="flex items-center gap-2">
  <Calendar className="w-4 h-4" />
  February 5, 2026 {/* Change this */}
</span>
```

---

### **Step 7: Write Your Content**

Replace the article text inside `<div className="prose prose-invert max-w-none text-slate-300">`:

**Available elements:**
```tsx
<p className="text-xl mb-6">
  <strong>Bold intro text</strong> and normal text.
</p>

<h2 className="text-3xl font-bold text-white mt-12 mb-4">🎯 Section Title</h2>

<h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">Subsection</h3>

<p>Regular paragraph text.</p>

<ul className="space-y-2">
  <li>Bullet point 1</li>
  <li>Bullet point 2</li>
</ul>

<blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-xl">
  Important quote or callout
</blockquote>
```

---

### **Step 8: Update Related Stocks**

Change the ticker symbols at the bottom:

```tsx
{['TSLA', 'AAPL', 'NVDA', 'MSFT'].map((ticker) => (
  // ... ticker buttons
))}
```

---

### **Step 9: Deploy**

```bash
cd frontend
git add .
git commit -m "feat: Add new article about [topic]"
git push
```

Wait 2 minutes → Your article is live!

---

## 🎨 Styling Tips

### **Make text bold:**
```tsx
<strong>This is bold</strong>
```

### **Make text italic:**
```tsx
<em>This is italic</em>
```

### **Add a colored callout box:**
```tsx
<p className="bg-slate-800/50 border-l-4 border-yellow-500 p-4 rounded-r italic">
  <strong>Pro tip:</strong> Your important insight here
</p>
```

### **Change hero gradient:**
```tsx
{/* Bitcoin: Orange/Blue */}
<div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-purple-500/20" />

{/* Gold: Yellow/Amber */}
<div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-amber-500/20 to-orange-500/20" />

{/* Tech: Emerald/Green */}
<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20" />

{/* Stocks: Blue/Purple */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
```

---

## 📊 SEO Best Practices

1. **Title:** Keep under 60 characters
2. **Description:** Keep under 160 characters
3. **Keywords:** Include stock tickers in the content
4. **Internal links:** Link to stock analyzer with `?ticker=SYMBOL`
5. **Publish date:** Always use current or future dates

---

## 🔥 Article Ideas

**Trending stocks:**
- Tesla Robotaxi Launch
- Apple Vision Pro Sales
- Meta AI Strategy
- Amazon AWS Dominance

**Market themes:**
- Magnificent 7 Stocks
- Fed Rate Cut Impact
- Recession Predictions
- Meme Stock Revival

**Sector deep dives:**
- EV Battery Wars
- Cloud Computing Leaders
- Pharmaceutical Breakthroughs
- Renewable Energy Boom

---

## ✅ Checklist Before Publishing

- [ ] Folder name is URL-friendly (lowercase, hyphens, year)
- [ ] Title is catchy and includes main topic
- [ ] Description is compelling (shows in Google)
- [ ] Hero emoji matches topic
- [ ] Date is correct
- [ ] Related tickers are relevant
- [ ] Article is 500+ words
- [ ] No typos (proofread!)
- [ ] Tested locally before pushing

---

**Created**: February 2, 2026  
**Last Updated**: February 2, 2026
