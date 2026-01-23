# Okay so i dont forget

The idea here is that the workflow does

1. const sq = getSearchQuery()
2. bingSearch(sq)
3. duckDuckGo(sq)
4. MERGE bS+ddg
5. filterContent() //? AI to get which URL to use
6. call getHtml
7. Send to AI
8. get actual answer for initial question
9. return result

STEP 0 — Generate refined query (LLM)
STEP 1 — Brave (optional)
STEP 2 — DuckDuckGo (optional baseline)
STEP 3 — Google (optional)
STEP 4 — Normalize + merge
STEP 5 — (placeholder) AI choose best URL
STEP 6 — cleanURL
STEP 7 — if cleanURL fails, we retry.
STEP 8 — if sucess we reclean.
STEP 9 — we get the HTML code which was sanitized
STEP 10 — we get the HTML code which was sanitized
