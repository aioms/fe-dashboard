// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AiConnectionReducer from "slices/ai-connection/reducer";
import type { IAiConnection } from "types/ai-connection";
import AiConnectionList from "./index";

const api = vi.hoisted(() => ({
  getAiConnections: vi.fn(),
  revokeAiConnection: vi.fn(),
}));
vi.mock("apis/aiConnection", () => api);
vi.mock("Common/BreadCrumb", () => ({ default: () => null }));
vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("react-toastify/dist/ReactToastify.css", () => ({}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue ?? _key,
  }),
}));

const connection: IAiConnection = {
  id: "11111111-1111-4111-8111-111111111111",
  clientName: "ChatGPT",
  clientHost: "chatgpt.com",
  scope: "aiom.read",
  createdAt: "2026-10-14T03:00:00.000Z",
  lastUsedAt: null,
};

let container: HTMLDivElement;
let root: Root;

async function mount() {
  const store = configureStore({ reducer: { AiConnection: AiConnectionReducer } });
  await act(async () => {
    root.render(
      <Provider store={store}>
        <AiConnectionList />
      </Provider>,
    );
  });
}

const flush = () => act(async () => { await Promise.resolve(); });
const buttonByText = (text: string) =>
  Array.from(container.querySelectorAll("button")).find((b) =>
    b.textContent?.includes(text)
  );

beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("AiConnection page", () => {
  it("shows loading before the request settles", async () => {
    api.getAiConnections.mockReturnValue(new Promise(() => {}));
    await mount();
    expect(container.textContent).toContain("Đang tải");
  });

  it("shows the error with a working retry", async () => {
    api.getAiConnections.mockRejectedValueOnce(new Error("Mất kết nối"));
    await mount();
    await flush();
    expect(container.textContent).toContain("Mất kết nối");

    api.getAiConnections.mockResolvedValueOnce([connection]);
    await act(async () => { buttonByText("Thử lại")!.click(); });
    await flush();
    expect(container.textContent).toContain("chatgpt.com");
  });

  it("shows the connect guide when empty", async () => {
    api.getAiConnections.mockResolvedValue([]);
    await mount();
    await flush();
    expect(container.querySelector("table")).toBeNull();
    expect(container.textContent).not.toContain("Đang tải");
  });

  it("lists connections and revokes only after confirmation", async () => {
    api.getAiConnections.mockResolvedValue([connection]);
    api.revokeAiConnection.mockResolvedValue(connection.id);
    await mount();
    await flush();
    expect(container.textContent).toContain("Chưa dùng");
    expect(container.textContent).toContain("14/10/2026 10:00");

    const modal = document.getElementById("deleteModal")!;
    expect(modal.className).toContain("hidden");

    await act(async () => {
      container.querySelector<HTMLButtonElement>("table button")!.click();
    });
    expect(modal.className).not.toContain("hidden");
    expect(api.revokeAiConnection).not.toHaveBeenCalled();

    await act(async () => { document.getElementById("deleteRecord")!.click(); });
    await flush();
    expect(api.revokeAiConnection).toHaveBeenCalledWith(connection.id);
    expect(container.querySelector("table")).toBeNull();
  });
});
