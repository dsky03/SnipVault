"use client";

import { getSandpackFiles } from "@/app/util/sandpack";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackLayout,
} from "@codesandbox/sandpack-react";

export default function SnippetPlayground({ code }: { code: string }) {
  const files = getSandpackFiles(code);

  return (
    <SandpackProvider
      template="react"
      files={files}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
    >
      <SandpackLayout className="flex! flex-col!">
        <SandpackPreview
          // showOpenInCodeSandbox={false}
          className="min-h-100 md:min-h-125 lg:min-h-150"
        />
        <SandpackCodeEditor showTabs className="min-h-100" />
      </SandpackLayout>
    </SandpackProvider>
  );
}
