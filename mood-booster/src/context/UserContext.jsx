import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  // Sign up new user
  const signup = (username, password, email) => {
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      moodEntries: [],
      journalEntries: [],
      questionnaireResponses: [],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return { success: true, message: 'Account created successfully' };
  };

  // Login user
  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (!foundUser) {
      return { success: false, message: 'Invalid credentials' };
    }

    const userData = { ...foundUser };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return { success: true, message: 'Logged in successfully' };
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Add mood entry
  const addMoodEntry = (mood, score) => {
    const entry = {
      id: Date.now().toString(),
      mood,
      score,
      timestamp: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      moodEntries: [entry, ...user.moodEntries],
    };

    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Add journal entry
  const addJournalEntry = (title, content, happinessScore) => {
    const entry = {
      id: Date.now().toString(),
      title,
      content,
      happinessScore,
      timestamp: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      journalEntries: [entry, ...user.journalEntries],
    };

    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // Save questionnaire response
  const saveQuestionnaireResponse = (response) => {
    const entry = {
      id: Date.now().toString(),
      ...response,
      timestamp: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      questionnaireResponses: [entry, ...user.questionnaireResponses],
    };

    setUser(updatedUser);
    
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{
      user,
      signup,
      login,
      logout,
      addMoodEntry,
      addJournalEntry,
      saveQuestionnaireResponse,
    }}>
      {children}
    </UserContext.Provider>
  );
};
