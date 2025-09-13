-- Insert sample drills for testing
INSERT INTO drills (title, difficulty, tags, questions) VALUES 
(
  'JavaScript Fundamentals',
  'easy',
  ARRAY['javascript', 'frontend', 'basics'],
  '[
    {
      "id": 1,
      "prompt": "What is the difference between let, const, and var in JavaScript?",
      "keywords": ["scope", "hoisting", "block", "function", "reassignment", "temporal dead zone"]
    },
    {
      "id": 2,
      "prompt": "Explain what closures are in JavaScript and provide an example.",
      "keywords": ["closure", "lexical scope", "inner function", "outer function", "variable access"]
    },
    {
      "id": 3,
      "prompt": "What is the event loop in JavaScript and how does it work?",
      "keywords": ["event loop", "call stack", "callback queue", "asynchronous", "non-blocking"]
    },
    {
      "id": 4,
      "prompt": "Describe the difference between == and === in JavaScript.",
      "keywords": ["equality", "strict equality", "type coercion", "comparison", "triple equals"]
    },
    {
      "id": 5,
      "prompt": "What are promises in JavaScript and how do they help with asynchronous programming?",
      "keywords": ["promise", "asynchronous", "then", "catch", "resolve", "reject", "callback hell"]
    }
  ]'::jsonb
),
(
  'React Core Concepts',
  'medium',
  ARRAY['react', 'frontend', 'components'],
  '[
    {
      "id": 1,
      "prompt": "Explain the difference between functional and class components in React.",
      "keywords": ["functional component", "class component", "hooks", "lifecycle", "state", "props"]
    },
    {
      "id": 2,
      "prompt": "What is the virtual DOM and how does React use it for performance optimization?",
      "keywords": ["virtual DOM", "reconciliation", "diffing", "performance", "real DOM", "optimization"]
    },
    {
      "id": 3,
      "prompt": "Describe the useState and useEffect hooks and when to use them.",
      "keywords": ["useState", "useEffect", "state management", "side effects", "lifecycle", "dependencies"]
    },
    {
      "id": 4,
      "prompt": "What is prop drilling and how can you avoid it?",
      "keywords": ["prop drilling", "context", "state management", "component tree", "props", "redux"]
    },
    {
      "id": 5,
      "prompt": "Explain the concept of keys in React lists and why they are important.",
      "keywords": ["keys", "list rendering", "reconciliation", "performance", "unique identifier", "index"]
    }
  ]'::jsonb
),
(
  'System Design Basics',
  'hard',
  ARRAY['system-design', 'architecture', 'scalability'],
  '[
    {
      "id": 1,
      "prompt": "How would you design a URL shortening service like bit.ly?",
      "keywords": ["URL shortening", "database design", "caching", "load balancing", "scalability", "base62"]
    },
    {
      "id": 2,
      "prompt": "Explain the CAP theorem and its implications for distributed systems.",
      "keywords": ["CAP theorem", "consistency", "availability", "partition tolerance", "distributed systems"]
    },
    {
      "id": 3,
      "prompt": "What are the trade-offs between SQL and NoSQL databases?",
      "keywords": ["SQL", "NoSQL", "ACID", "scalability", "consistency", "schema", "relationships"]
    },
    {
      "id": 4,
      "prompt": "How would you handle rate limiting in a web API?",
      "keywords": ["rate limiting", "throttling", "token bucket", "sliding window", "API", "DDoS protection"]
    },
    {
      "id": 5,
      "prompt": "Describe different caching strategies and when to use each one.",
      "keywords": ["caching", "cache-aside", "write-through", "write-behind", "TTL", "invalidation", "CDN"]
    }
  ]'::jsonb
),
(
  'Data Structures & Algorithms',
  'medium',
  ARRAY['algorithms', 'data-structures', 'coding'],
  '[
    {
      "id": 1,
      "prompt": "Explain the time and space complexity of common sorting algorithms.",
      "keywords": ["time complexity", "space complexity", "bubble sort", "merge sort", "quick sort", "big O"]
    },
    {
      "id": 2,
      "prompt": "What is the difference between a stack and a queue? Provide use cases for each.",
      "keywords": ["stack", "queue", "LIFO", "FIFO", "push", "pop", "enqueue", "dequeue", "use cases"]
    },
    {
      "id": 3,
      "prompt": "Describe how hash tables work and their average time complexity for operations.",
      "keywords": ["hash table", "hash function", "collision", "chaining", "open addressing", "O(1)", "load factor"]
    },
    {
      "id": 4,
      "prompt": "Explain the difference between breadth-first search (BFS) and depth-first search (DFS).",
      "keywords": ["BFS", "DFS", "graph traversal", "queue", "stack", "shortest path", "tree traversal"]
    },
    {
      "id": 5,
      "prompt": "What are the characteristics of a binary search tree and its time complexities?",
      "keywords": ["binary search tree", "BST", "balanced", "unbalanced", "search", "insert", "delete", "O(log n)"]
    }
  ]'::jsonb
),
(
  'Node.js & Backend',
  'medium',
  ARRAY['nodejs', 'backend', 'server'],
  '[
    {
      "id": 1,
      "prompt": "Explain the Node.js event loop and how it handles asynchronous operations.",
      "keywords": ["event loop", "non-blocking", "asynchronous", "callback", "libuv", "single-threaded"]
    },
    {
      "id": 2,
      "prompt": "What are middleware functions in Express.js and how do they work?",
      "keywords": ["middleware", "express", "request", "response", "next", "pipeline", "error handling"]
    },
    {
      "id": 3,
      "prompt": "Describe different authentication strategies for web applications.",
      "keywords": ["authentication", "JWT", "session", "OAuth", "cookies", "token", "security"]
    },
    {
      "id": 4,
      "prompt": "How would you handle errors in a Node.js application?",
      "keywords": ["error handling", "try-catch", "promises", "async-await", "error middleware", "logging"]
    },
    {
      "id": 5,
      "prompt": "Explain the difference between SQL injection and how to prevent it.",
      "keywords": ["SQL injection", "prepared statements", "parameterized queries", "sanitization", "security"]
    }
  ]'::jsonb
);
