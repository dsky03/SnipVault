import Header from "./components/header";
import Home from "./components/home";

const Page = () => {
  return (
    <div className="custom-scroll overflow-y-auto h-screen flex flex-col bg-black">
      <Header />
      <Home />
    </div>
  );
};

export default Page;
