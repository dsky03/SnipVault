import SnippetDetail from "./SnippetDetail";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <SnippetDetail id={id} />;
};

export default Page;
