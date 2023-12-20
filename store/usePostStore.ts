// Importing create function from the Zustand library
import { Post } from "@/types/post";
import { create } from "zustand";

// Defining an interface for the store's state
interface PostStoreInterface {
	postsInProcess: Post[];
	setPostsInProcess: (val: Post[]) => void;
}

// create our store
export const usePostStore = create<PostStoreInterface>((set) => ({
	postsInProcess: [], // initial value of authenticated property
	setPostsInProcess: (val: any) => set((state) => ({ postsInProcess: val })), // function to set the authentication status
}));
