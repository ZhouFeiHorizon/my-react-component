import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import Button from "./components/Button/button";
import Table from "./components/Table/index";
import { createElement } from "react";
import { css } from "../styled-system/css";
import { styled } from "../styled-system/jsx";
import Button from "./components/TButton";
import TablePro from "./components/TablePro/index";
import TableProDemo from "./pages/TableProDemo";

import "../styled-system/styles.css";

css({});

// document.body.parentElement!.style.fontSize = "16px";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TableProDemo />
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <h3>size</h3>

      <Table
        dataSource={(["small", "medium", "large"] as const).map((size) => {
          const buttonProps = {
            // size,
            // color: "primary" as const,
          };
          return {
            size: size,
            default: (
              <Button colorPalette={"blue"} variant="solid" {...buttonProps}>
                solid
              </Button>
            ),
            hover: <Button {...buttonProps}>确定</Button>,
            active: <Button {...buttonProps}>确定</Button>,
            disable: (
              <Button {...buttonProps} disabled>
                确定
              </Button>
            ),
            loading: (
              <Button {...buttonProps} loading>
                确定
              </Button>
            ),
          };
        })}
        columns={[
          "size",
          "default",
          "hover",
          "active",
          "disable",
          "loading",
        ].map((key) => ({
          title: key,
          dataIndex: key,
        }))}
      />

      <Button size="small">主要按钮</Button>

      <Button size="small">测试按钮</Button>
      <Button size="medium">测试按钮</Button>
      <Button size="large">测试按钮</Button> */}
    </>
  );
}

export default App;
