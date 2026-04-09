import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMemo } from "react";
import { createActor } from "../backend";

export function useBackend() {
  const { identity, loginStatus } = useInternetIdentity();

  const backend = useMemo(() => {
    if (!identity || loginStatus !== "success") return null;
    const canisterId =
      (window as unknown as Record<string, string>).__CANISTER_ID_BACKEND__ ??
      "";
    return createActor(
      canisterId,
      async () => new Uint8Array(),
      async () =>
        ({
          directURL: "",
          getBytes: async () => new Uint8Array(),
          getDirectURL: () => "",
          withUploadProgress: () => ({}) as never,
        }) as never,
      { agentOptions: { identity } },
    );
  }, [identity, loginStatus]);

  return { backend, isReady: !!backend };
}
