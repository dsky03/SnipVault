import Header from "./components/header";
import Home from "./components/home";
import { getCurrentUser } from "@/lib/auth";
import { getSnippetPage } from "@/lib/snippets";

const Page = async () => {
  const userId = await getCurrentUser();
  const initialPage = await getSnippetPage({
    category: "all",
    search: "",
    limit: 12,
    userId,
  });

  return (
    <div className="custom-scroll overflow-y-auto h-screen flex flex-col bg-black">
      <Header initialUserId={userId} />
      <Home initialPage={initialPage} initialUserId={userId} />
    </div>
  );
};

export default Page;
