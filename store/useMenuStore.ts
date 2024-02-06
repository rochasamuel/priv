// Importing create function from the Zustand library
import { create } from "zustand";

// Defining an interface for the store's state
interface MenuStoreInterface {
	pageTitle: string; // a boolean value indicating whether the user is authenticated or not
	setPageTitle: (val: string) => void; // a function to set the authentication status
}

// create our store
export const useMenuStore = create<MenuStoreInterface>((set) => ({
	pageTitle: "", // initial value of user property
	setPageTitle: (at) => set((state) => ({ pageTitle: at })), // function to set user information
}));
