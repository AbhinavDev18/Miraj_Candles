
import { User } from '../types';

// Mock users for demo purposes
const DEMO_USERS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
    password: 'password123'
  }
];

export const mockAuth = {
  currentUser: null as User | null,
  
  signIn: async (email: string, password: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    mockAuth.currentUser = userWithoutPassword;
    localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },
  
  signOut: async (): Promise<void> => {
    mockAuth.currentUser = null;
    localStorage.removeItem('mockUser');
  },
  
  getCurrentUser: (): User | null => {
    if (mockAuth.currentUser) return mockAuth.currentUser;
    
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      mockAuth.currentUser = JSON.parse(stored);
      return mockAuth.currentUser;
    }
    
    return null;
  }
};
