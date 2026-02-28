export const getSandpackFiles = (code: string) => {
  return {
    "/App.js": {
      code,
    },
    "/styles.css": {
      code: `
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
  min-height: 100vh; 
  background: #0a0a0f; 
  color: #fff; 
}
`,
    },
    "/public/index.html": {
      code: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
      `,
    },
  };
};
