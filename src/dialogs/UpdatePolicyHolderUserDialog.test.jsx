/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@openimis/fe-core/testing";

import messages from "../translations/en.json";

// The fe-core barrel cannot be loaded from a test. Messages are read from the module's
// own English translations, as the assembly does: a missing key shows as the bare id.
const translate = (module, id) => messages[`${module}.${id}`] ?? `${module}.${id}`;
vi.mock("@openimis/fe-core", async () => {
  const h = (await import("react")).createElement;
  return {
    GetIconComponent: (name) => () => h("span", null, name),
    FormattedMessage: ({ module, id }) => translate(module, id),
    formatMessage: (intl, module, id) => translate(module, id),
    formatMessageWithValues: (intl, module, id) => translate(module, id),
    PublishedComponent: () => null,
  };
});
vi.mock("../pickers/PolicyHolderPicker", () => ({ default: () => null }));
vi.mock("../actions", () => ({ updatePolicyHolderUser: vi.fn(), replacePolicyHolderUser: vi.fn() }));

const { default: UpdatePolicyHolderUserDialog } = await import("./UpdatePolicyHolderUserDialog");

const policyHolderUser = { id: "UEhVOjE=", user: { username: "clerk" }, policyHolder: { id: "ph-1" } };

describe("UpdatePolicyHolderUserDialog", () => {
  // UAT OCM-260: the edit dialog showed its message id instead of a title.
  it("titles the edit dialog", () => {
    renderWithProviders(<UpdatePolicyHolderUserDialog policyHolderUser={policyHolderUser} onSave={() => {}} />);

    fireEvent.click(screen.getByText("Edit").closest("button"));

    expect(screen.getByRole("dialog")).toHaveTextContent("Edit Policy Holder User");
  });

  it("titles the replace dialog", () => {
    renderWithProviders(
      <UpdatePolicyHolderUserDialog policyHolderUser={policyHolderUser} onSave={() => {}} isReplacing />,
    );

    fireEvent.click(screen.getByText("NoteAdd").closest("button"));

    expect(screen.getByRole("dialog")).toHaveTextContent("Add new version of Policy Holder User");
  });
});
