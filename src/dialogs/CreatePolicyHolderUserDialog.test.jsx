import { describe, expect, it, vi } from "vitest";

// The fe-core barrel cannot be loaded from a test: only what the dialog reads when it loads.
vi.mock("@openimis/fe-core", () => ({
  GetIconComponent: () => () => null,
  FormattedMessage: () => null,
  formatMessage: () => "",
  formatMessageWithValues: () => "",
  PublishedComponent: () => null,
  decodeId: (id) => id,
}));
vi.mock("../pickers/PolicyHolderPicker", () => ({ default: () => null }));
vi.mock("../actions", () => ({ createPolicyHolderUser: vi.fn() }));

const { CreatePolicyHolderUserDialog } = await import("./CreatePolicyHolderUserDialog");

const ph1 = { id: "ph-1", code: "PH1", tradeName: "One" };
const ph2 = { id: "ph-2", code: "PH2", tradeName: "Two" };

// Runs the dialog's lifecycle on a plain instance: setState applies at once.
const dialog = (props) => {
  const component = new CreatePolicyHolderUserDialog(props);
  component.props = props;
  component.setState = (update) => {
    const patch = typeof update === "function" ? update(component.state, component.props) : update;
    component.state = { ...component.state, ...patch };
  };
  return component;
};

// The connected dialog maps state.policyHolder.policyHolders afresh on every store
// update, so its `policyHolders` prop is a new array after any dispatch.
const rerender = (component, props) => {
  const prevProps = component.props;
  component.props = { ...prevProps, ...props };
  component.componentDidUpdate(prevProps, component.state);
};

describe("CreatePolicyHolderUserDialog", () => {
  // UAT OCM-258: the policy holder picked in the dialog was cleared by the next store
  // update (the user picker's search answering, for instance).
  it("keeps the policy holder picked by the user on a store update", () => {
    const component = dialog({ policyHolders: [ph1, ph2] });
    component.updateAttribute("policyHolder", ph2);

    rerender(component, { policyHolders: [ph1, ph2] });

    expect(component.state.policyHolderUser.policyHolder).toEqual(ph2);
  });

  it("takes the predefined policy holder once the list holds it", () => {
    const component = dialog({ policyHolders: [], predefinedPolicyHolderId: "ph-1" });

    rerender(component, { policyHolders: [ph1, ph2] });

    expect(component.state.policyHolderUser.policyHolder).toEqual(ph1);
  });
});
