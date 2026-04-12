# Stock Selector App - PRD v1

תאריך: 2026-04-11
Owner: Nova + Netanel

## מטרת המוצר
לבנות אפליקציה פרקטית לבחירת מניות על בסיס משמעת, טרנד, וסטאפ, במקום החלטות רגשיות או "סיפורים".

המוצר לא אמור לחזות את השוק.
המוצר אמור לייצר תהליך החלטה עקבי:
- איזה מניות בכלל ראויות לבדיקה
- איזו מניה נמצאת בסטאפ איכותי עכשיו
- איפה הכניסה נראית סבירה
- איפה התזה נשברת
- מה לא לגעת בו כרגע

## הבעיה
רוב המשקיעים והסוחרים:
- קונים נגד טרנד
- נכנסים בלי סטאפ ברור
- לא יודעים איפה לצאת
- מחזיקים מפסידות יותר מדי זמן
- מוכרים מנצחות מוקדם מדי
- לא מפתחים שיטה עקבית

## הפתרון
מנוע scoring + ממשק דירוג שמסנן מניות ומציג לכל מניה:
- Score
- מצב טרנד
- איכות סטאפ
- אזור כניסה
- invalidation / stop
- הסבר פשוט למה כן / למה לא

## קהל יעד ראשוני
- משקיע פרטי רציני
- סוחר swing
- משתמשים שרוצים תהליך חצי-שיטתי לבחירת מניות
- בהמשך: portfolio managers קטנים / communities / trading rooms

## עקרונות מוצר
- פשוט לפני חכם
- explainable לפני magical
- scanner לפני trading platform
- decision support לפני execution
- איכות סטאפ לפני כמות אינדיקטורים

## MVP v1
### Input
- ticker אחד או watchlist
- OHLCV יומי
- optionally weekly aggregation

### Core outputs
לכל מניה:
- Total score: 0-100
- Verdict:
  - Strong Candidate
  - Watchlist
  - Avoid
  - Broken Trend
  - Needs Confirmation
- Trend state
- MA150 state
- Setup type
- Entry zone
- Invalidation level
- Risk note
- One-paragraph explanation

### MVP screens
1. Home / Scanner
   - top ranked stocks
   - filters
   - score table
2. Stock Detail
   - chart
   - MA150
   - setup summary
   - entry / invalidation / verdict
3. Watchlist
   - saved tickers
   - alerts status
4. Journal (lightweight)
   - thesis
   - setup chosen
   - result
   - follow-up notes

## Data model
### StockSnapshot
- ticker
- currentPrice
- ma50
- ma150
- ma150Slope
- weeklyTrend
- dailyTrend
- relativeStrength
- atr
- volumeTrend
- distanceFromMa150
- setupType
- setupQuality
- breakoutLevel
- invalidationLevel
- score
- verdict
- explanation

### JournalEntry
- ticker
- date
- setupType
- thesis
- entryPlanned
- stopPlanned
- outcome
- notes
- followedRules (boolean / checklist)

## Core jobs
- fetch price history
- compute indicators
- classify setup
- calculate score
- assign verdict
- render explanation
- store watchlists and journal

## Alerts v1.5
- reclaim of MA150
- breakout above range
- pullback into support zone
- trend break / invalidation

## What MVP does NOT do
- automatic trading
- broker execution
- options flow
- prediction engine
- social feed
- huge factor model

## Success criteria for MVP
- המשתמש יכול להכניס 20-100 מניות ולקבל shortlist אמין
- אפשר להבין ב-10 שניות למה מניה קיבלה את הציון
- יש עקביות בין החוקים לבין ההמלצה
- אפשר לנהל watchlist ו-journal בסיסי

## Suggested stack
### Fastest path
- Next.js frontend
- simple Node/TS backend routes
- price data from Yahoo Finance or direct market data source
- SQLite / Postgres lightweight storage
- charting via TradingView lightweight charts

### AI layer later
- explanation generation
- journal review summaries
- setup clustering
- pattern recall from past trades

## Development phases
### Phase 1
- scoring engine
- scanner table
- stock detail page

### Phase 2
- watchlist
- alerts
- journal

### Phase 3
- AI explanations
- portfolio-aware ranking
- personalized rules

## Bottom line
המוצר האמיתי הוא לא "אתר מניות".
המוצר הוא מערכת החלטה משמעתית לבחירת מניות, עם MA150 + trend + setup quality בלב המנוע.
