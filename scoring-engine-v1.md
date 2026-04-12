# Stock Selector - Scoring Engine v1

תאריך: 2026-04-11
מטרה: לתת ציון 0-100 לכל מניה לפי איכות הטרנד, הסטאפ, והסיכון.

## Design principles
- הציון חייב להיות explainable
- פחות פקטורים, יותר ברורים
- MA150 הוא regime filter מרכזי
- trend + setup חשובים יותר מ"cheap valuation"
- אין ציון גבוה למניה בלי invalidation ברור

## Score structure
Total Score = 100

### 1) Regime / MA150 - 25 points
- Price above MA150: +10
- MA150 rising over last N days: +10
- Clean reclaim of MA150 after weakness: +5

Penalties:
- Price below MA150: -10
- MA150 falling: -10

Interpretation:
- מעל MA150 עם שיפוע עולה = מניה בכלל ראויה לדיון
- מתחת MA150 = ברירת מחדל שלילית, אלא אם turnaround מיוחד

### 2) Trend quality - 25 points
- Higher highs / higher lows on daily: +10
- Weekly trend aligned with daily: +10
- Relative strength vs benchmark positive: +5

Penalties:
- broken structure: -10
- weekly and daily conflict: -5

### 3) Setup quality - 25 points
Score one dominant setup:
- breakout from base / consolidation: up to +25
- pullback to support in uptrend: up to +22
- reclaim after shakeout: up to +18
- early reversal below MA150: up to +8 only

Setup quality checklist:
- clear level
- contraction / tightness
- supportive volume
- not extended too far from support
- clean invalidation nearby

### 4) Risk / position quality - 15 points
- invalidation level is clear: +5
- attractive reward/risk (>= 2:1 estimated): +5
- distance from ideal entry not too stretched: +5

Penalties:
- too extended from breakout / support: -5 to -10
- stop too wide / unclear: -5

### 5) Confirmation / volume / momentum - 10 points
- breakout volume confirmation: +4
- momentum confirmation: +3
- no obvious exhaustion signal: +3

## Verdict mapping
- 80-100: Strong Candidate
- 65-79: Watchlist / Near-entry
- 50-64: Needs Confirmation
- 35-49: Weak / Avoid for now
- <35: Avoid / Broken Trend

## Hard rules / overrides
גם אם score גבוה, להפעיל overrides:

### Reject / downgrade cases
- earnings event very near and setup fragile
- major trend break below invalidation
- price far too extended from support
- liquidity too low
- spread / execution quality poor

### Auto-avoid cases
- price below MA150 and MA150 falling
- no valid setup and no clear invalidation
- obvious distribution / failed breakout

## Output format per stock
### Example
- Score: 84
- Verdict: Strong Candidate
- Trend: bullish
- MA150: above and rising
- Setup: pullback to support
- Entry zone: 184-188
- Invalidation: close below 176
- Risk note: acceptable, not extended
- Why: price remains above rising MA150, daily and weekly trend aligned, current pullback is controlled and near support with favorable risk/reward.

## Pseudocode
```ts
score = 0
score += regimeScore(stock)
score += trendScore(stock)
score += setupScore(stock)
score += riskScore(stock)
score += confirmationScore(stock)
score = clamp(score, 0, 100)
verdict = mapScoreToVerdict(score, overrides)
```

## MVP indicator set
לא צריך 40 אינדיקטורים.
מספיק להתחיל עם:
- Close price
- MA50
- MA150
- MA150 slope
- Weekly trend
- Daily structure
- Volume vs average
- ATR
- Relative strength vs SPY / QQQ / RSP

## First supported setups
1. Breakout from base
2. Pullback in uptrend
3. MA150 reclaim
4. Failed breakout / avoid

## What to add later, not now
- earnings quality overlay
- sector leadership score
- analyst target context
- fundamentals layer
- portfolio-aware ranking
- personal style presets

## Practical recommendation
הגרסה הראשונה צריכה להיות דטרמיניסטית, לא AI-first.
AI יוסיף הסבר וניתוח אחר כך.
הציון עצמו צריך להתחיל מחוקים ברורים וניתנים לבדיקה.
