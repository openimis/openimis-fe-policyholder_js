import React from "react";
import {
  describe, expect, it, vi,
} from "vitest";

const core = vi.hoisted(() => ({
  graphql: vi.fn((payload, type) => ({ type: `TEST_${type}`, payload })),
}));

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => {
  const autocomplete = await vi.importActual("@openimis/fe-core/components/inputs/Autocomplete");
  const modules = await vi.importActual("@openimis/fe-core/helpers/modules");
  return {
    ...(await vi.importActual("@openimis/fe-core/helpers/api")),
    ...(await vi.importActual("@openimis/fe-core/helpers/useLocalStorage")),
    Autocomplete: autocomplete.default,
    useModulesManager: modules.useModulesManager,
    ...core,
  };
});

const { default: EconomicUnitPicker } = await import("./EconomicUnitPicker");
const { default: reducer } = await import("../reducer");
const {
  makeStore, renderWithProviders, screen, userEvent,
} = await import("@openimis/fe-core/testing");

const ACME = { id: "ph-1", code: "PH1", tradeName: "Acme" };
const GLOBEX = { id: "ph-2", code: "PH2", tradeName: "Globex" };

const renderPicker = ({ units = [], ...props } = {}) => {
  const store = makeStore({
    reducers: { policyHolder: reducer },
    preloadedState: {
      core: { user: { id: "user-1" } },
      policyHolder: {
        ...reducer(undefined, { type: "@@INIT" }),
        policyHolderUsers: units.map((policyHolder, i) => ({ id: `phu-${i}`, policyHolder })),
      },
    },
  });
  return renderWithProviders(
    <EconomicUnitPicker label="Economic unit" onChange={() => {}} value={null} {...props} />,
    { store },
  );
};

describe("EconomicUnitPicker", () => {
  it("asks for the undeleted economic units of the signed-in user", () => {
    renderPicker();

    expect(core.graphql).toHaveBeenCalledOnce();
    const [payload, type] = core.graphql.mock.calls[0];
    expect(type).toBe("POLICYHOLDER_POLICYHOLDERUSERS");
    expect(payload.replace(/\s+/g, " ")).toContain('policyHolderUser(isDeleted: false,user_Id: "user-1")');
  });

  it("offers each economic unit by code and trade name", async () => {
    renderPicker({ units: [ACME, GLOBEX] });

    await userEvent.click(screen.getByRole("combobox", { name: "Economic unit" }));

    expect(screen.getAllByRole("option").map((option) => option.textContent))
      .toEqual(["PH1 - Acme", "PH2 - Globex"]);
  });

  it("reports the economic unit that was picked", async () => {
    const onChange = vi.fn();
    renderPicker({ units: [ACME, GLOBEX], onChange });

    await userEvent.click(screen.getByRole("combobox", { name: "Economic unit" }));
    await userEvent.click(screen.getByRole("option", { name: "PH2 - Globex" }));

    expect(onChange).toHaveBeenLastCalledWith(GLOBEX);
  });

  it("picks the only economic unit without asking", () => {
    const onChange = vi.fn();
    renderPicker({ units: [ACME], onChange });

    expect(onChange).toHaveBeenCalledWith(ACME);
  });

  it("leaves the choice to the user when there are several", () => {
    const onChange = vi.fn();
    renderPicker({ units: [ACME, GLOBEX], onChange });

    expect(onChange).not.toHaveBeenCalled();
  });
});
