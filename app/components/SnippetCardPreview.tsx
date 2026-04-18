"use client";

import { useMemo } from "react";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { getSandpackFiles } from "../util/sandpack";

interface Props {
  code: string;
}

const SnippetCardPreview = ({ code }: Props) => {
  const files = useMemo(() => getSandpackFiles(code), [code]);

  return (
    <SandpackProvider
      template="react"
      theme="dark"
      files={files}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
    >
      <SandpackLayout>
        <SandpackPreview
          showOpenInCodeSandbox={false}
          showNavigator={false}
          showRefreshButton={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SnippetCardPreview;
