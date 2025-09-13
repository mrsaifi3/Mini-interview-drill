-- Check if drills table has data, if not, seed it
DO $$
BEGIN
    -- Check if drills table is empty
    IF NOT EXISTS (SELECT 1 FROM drills LIMIT 1) THEN
        -- Insert seed data
        INSERT INTO drills (title, difficulty, tags, questions) VALUES
        (
            'JavaScript Fundamentals',
            'easy',
            ARRAY['javascript', 'basics', 'syntax'],
            '[
                {"id": 1, "prompt": "What is the difference between let, const, and var in JavaScript?", "keywords": ["block scope", "hoisting", "temporal dead zone", "reassignment", "redeclaration"]},
                {"id": 2, "prompt": "Explain how closures work in JavaScript with an example.", "keywords": ["closure", "lexical scope", "inner function", "outer function", "variable access"]},
                {"id": 3, "prompt": "What is the event loop in JavaScript and how does it work?", "keywords": ["event loop", "call stack", "callback queue", "microtask", "macrotask", "asynchronous"]},
                {"id": 4, "prompt": "Describe the difference between == and === operators.", "keywords": ["strict equality", "type coercion", "loose equality", "comparison", "type checking"]},
                {"id": 5, "prompt": "What are arrow functions and how do they differ from regular functions?", "keywords": ["arrow function", "this binding", "lexical this", "hoisting", "constructor"]}
            ]'::jsonb
        ),
        (
            'React Hooks Deep Dive',
            'medium',
            ARRAY['react', 'hooks', 'state management'],
            '[
                {"id": 1, "prompt": "Explain the useEffect hook and its dependency array.", "keywords": ["useEffect", "dependency array", "cleanup", "side effects", "lifecycle"]},
                {"id": 2, "prompt": "What is the difference between useState and useReducer?", "keywords": ["useState", "useReducer", "complex state", "state management", "dispatch"]},
                {"id": 3, "prompt": "How would you create a custom hook for data fetching?", "keywords": ["custom hook", "data fetching", "loading state", "error handling", "reusability"]},
                {"id": 4, "prompt": "Explain useMemo and useCallback with practical examples.", "keywords": ["useMemo", "useCallback", "memoization", "performance", "optimization", "dependencies"]},
                {"id": 5, "prompt": "What are the rules of hooks and why are they important?", "keywords": ["rules of hooks", "top level", "conditional", "loops", "nested functions"]}
            ]'::jsonb
        ),
        (
            'System Design Basics',
            'hard',
            ARRAY['system design', 'scalability', 'architecture'],
            '[
                {"id": 1, "prompt": "Design a URL shortening service like bit.ly. What are the key components?", "keywords": ["URL shortening", "database design", "caching", "load balancing", "base62 encoding"]},
                {"id": 2, "prompt": "How would you design a chat application to handle millions of users?", "keywords": ["websockets", "message queues", "database sharding", "real-time", "scalability"]},
                {"id": 3, "prompt": "Explain the CAP theorem and its implications for distributed systems.", "keywords": ["CAP theorem", "consistency", "availability", "partition tolerance", "distributed systems"]},
                {"id": 4, "prompt": "Design a caching strategy for a high-traffic e-commerce website.", "keywords": ["caching", "CDN", "Redis", "cache invalidation", "cache-aside", "write-through"]},
                {"id": 5, "prompt": "How would you handle rate limiting in a REST API?", "keywords": ["rate limiting", "token bucket", "sliding window", "API gateway", "throttling"]}
            ]'::jsonb
        ),
        (
            'Data Structures & Algorithms',
            'medium',
            ARRAY['algorithms', 'data structures', 'problem solving'],
            '[
                {"id": 1, "prompt": "Implement a function to reverse a linked list. Explain your approach.", "keywords": ["linked list", "reverse", "iterative", "recursive", "pointers"]},
                {"id": 2, "prompt": "Find the two numbers in an array that sum to a target value.", "keywords": ["two sum", "hash map", "array", "time complexity", "space complexity"]},
                {"id": 3, "prompt": "Explain the difference between BFS and DFS. When would you use each?", "keywords": ["BFS", "DFS", "breadth-first", "depth-first", "queue", "stack", "graph traversal"]},
                {"id": 4, "prompt": "Implement a function to check if a string is a valid palindrome.", "keywords": ["palindrome", "two pointers", "string manipulation", "case insensitive", "alphanumeric"]},
                {"id": 5, "prompt": "What is the time complexity of common sorting algorithms?", "keywords": ["time complexity", "bubble sort", "merge sort", "quick sort", "heap sort", "O(n log n)"]}
            ]'::jsonb
        ),
        (
            'Node.js Backend Development',
            'medium',
            ARRAY['nodejs', 'backend', 'express', 'api'],
            '[
                {"id": 1, "prompt": "Explain the Node.js event loop and how it handles asynchronous operations.", "keywords": ["event loop", "non-blocking", "asynchronous", "callback", "promise", "async/await"]},
                {"id": 2, "prompt": "How would you implement authentication and authorization in an Express.js API?", "keywords": ["authentication", "authorization", "JWT", "middleware", "bcrypt", "session"]},
                {"id": 3, "prompt": "What are streams in Node.js and when would you use them?", "keywords": ["streams", "readable", "writable", "pipe", "buffer", "memory efficient"]},
                {"id": 4, "prompt": "Explain error handling best practices in Node.js applications.", "keywords": ["error handling", "try-catch", "error middleware", "uncaught exception", "promise rejection"]},
                {"id": 5, "prompt": "How would you optimize a Node.js application for production?", "keywords": ["optimization", "clustering", "caching", "compression", "monitoring", "performance"]}
            ]'::jsonb
        ),
        (
            'Advanced JavaScript Concepts',
            'hard',
            ARRAY['javascript', 'advanced', 'performance'],
            '[
                {"id": 1, "prompt": "Explain prototypal inheritance and how it differs from classical inheritance.", "keywords": ["prototypal inheritance", "prototype chain", "__proto__", "Object.create", "classical inheritance"]},
                {"id": 2, "prompt": "What are generators and iterators in JavaScript? Provide examples.", "keywords": ["generators", "iterators", "yield", "next", "Symbol.iterator", "lazy evaluation"]},
                {"id": 3, "prompt": "Explain the concept of currying and partial application.", "keywords": ["currying", "partial application", "higher-order functions", "function composition", "closure"]},
                {"id": 4, "prompt": "What is the difference between microtasks and macrotasks?", "keywords": ["microtasks", "macrotasks", "promise", "setTimeout", "event loop", "task queue"]},
                {"id": 5, "prompt": "How does garbage collection work in JavaScript?", "keywords": ["garbage collection", "mark and sweep", "reference counting", "memory leaks", "weak references"]}
            ]'::jsonb
        );
        
        RAISE NOTICE 'Seed data inserted successfully!';
    ELSE
        RAISE NOTICE 'Drills table already contains data, skipping seed.';
    END IF;
END $$;
