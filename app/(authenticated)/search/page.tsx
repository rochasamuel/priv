import SearchPage from "@/components/pages/SearchPage";
import { FunctionComponent } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Busca",
};

const SearchComponent: FunctionComponent = () => {
	return <SearchPage />;
};

export default SearchComponent;
