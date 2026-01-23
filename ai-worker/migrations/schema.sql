CREATE TABLE chat_logs (   
    id INTEGER PRIMARY KEY AUTOINCREMENT,   
    user_clerk_id TEXT NOT NULL,   
    workflow_id TEXT NOT NULL,   
    original_query TEXT NOT NULL,   
    refined_query TEXT,   
    final_url TEXT,   
    final_answer TEXT NOT NULL,   
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    graph TEXT
); 