import { render, screen, act } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './AuthContext';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

import axios from 'axios';

describe("App Component", () => {
  describe("When authenticated", () => {

    test("Renders Articles heading and Add Article button", async () => {
      const mockArticles = [
        { id: 1, title: "Test Article", content: "Test content" }
      ];
      
      axios.get.mockResolvedValue({ data: mockArticles });
      
      await act(async () => {
        render(
            <App />
        );
      });
      
      const articlesHeading = screen.getByText(/Articles/i);
      const addButton = screen.getByText(/Add Article/i);
      
      expect(articlesHeading).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledWith("/api/articles/");
    });

    test("Renders article list when data is loaded", async () => {
      const mockArticles = [
        { id: 1, title: "Test Article", content: "Test content" },
        { id: 2, title: "Another Article", content: "More content" }
      ];
      
      axios.get.mockResolvedValue({ data: mockArticles });
      
      await act(async () => {
        render(
          <App />
        );
      });
      
      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
      expect(screen.getByText("Another Article")).toBeInTheDocument();
      expect(screen.getByText("More content")).toBeInTheDocument();
    });

    test("Handles empty article list", async () => {
      axios.get.mockResolvedValue({ data: [] });
      
      await act(async () => {
        render(
          <App />
        );
      });
      
      const articlesHeading = screen.getByText(/Articles/i);
      const addButton = screen.getByText(/Add Article/i);
      
      expect(articlesHeading).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
      // Should not show any article cards
      expect(screen.queryByText("Test Article")).not.toBeInTheDocument();
    });
  });

  describe("When not authenticated", () => {
    test("Shows login form instead of articles", async () => {
      await act(async () => {
        render(
          <AuthProvider>
            <App />
          </AuthProvider>
        );
      });
      
      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.queryByText(/Articles/i)).not.toBeInTheDocument();
    });
  });
});
