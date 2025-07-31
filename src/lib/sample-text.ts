// src/lib/sample-text.ts

export const SAMPLE_TEXTS = [
  // Basic sentences for beginners
  "The quick brown fox jumps over the lazy dog.",

  "Programming is the art of telling another human what one wants the computer to do.",

  "Good code is its own best documentation. As you're about to add a comment, ask yourself if you can make the code clearer instead.",

  // Short code snippets
  `const greeting = "Hello, World!";
console.log(greeting);`,

  `function add(a: number, b: number): number {
  return a + b;
}`,

  `const users = data.filter(user => user.active)
  .map(user => user.name)
  .sort();`,

  // Medium complexity code
  `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

const createUser = (userData: Partial<User>): User => {
  return {
    id: Math.random(),
    isActive: true,
    ...userData
  } as User;
};`,

  // React component
  `export function Button({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}`,

  // API function
  `async function fetchUserData(userId: string) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}`,

  // CSS styles
  `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}`,

  // JSON configuration
  `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0"
  }
}`,

  // Algorithm implementation
  `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,

  // Database query
  `SELECT u.name, u.email, p.title, p.created_at
FROM users u
INNER JOIN posts p ON u.id = p.user_id
WHERE u.active = true
  AND p.published = true
  AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY p.created_at DESC
LIMIT 10;`,

  // Advanced React hook
  `import { useState, useEffect, useCallback } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,

  // Express.js route
  `app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }
  
  try {
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});`,

  // Terminal commands
  `# Git workflow commands
git status
git add .
git commit -m "feat: add user authentication"
git push origin feature/auth

# Docker commands
docker build -t my-app .
docker run -p 3000:3000 my-app
docker-compose up -d

# npm/yarn commands
npm install
npm run dev
npm run build
yarn add react @types/react`,

  // Configuration files
  `// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}`,
];

// Helper function to get random sample text
export function getRandomSample(): string {
  return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

// Helper function to get samples by category
export function getSamplesByComplexity(
  level: "beginner" | "intermediate" | "advanced"
): string[] {
  switch (level) {
    case "beginner":
      return SAMPLE_TEXTS.slice(0, 6);
    case "intermediate":
      return SAMPLE_TEXTS.slice(6, 12);
    case "advanced":
      return SAMPLE_TEXTS.slice(12);
    default:
      return SAMPLE_TEXTS;
  }
}
