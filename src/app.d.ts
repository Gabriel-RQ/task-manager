// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  interface Task {
    id: number;
    user_id: number;
    title: string;
    description: string;
    completed: boolean;
    date: string;
    created_at: string;
  }

  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        username: string;
        isAuthenticated: boolean;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
