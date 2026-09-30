import React from "react";
import { describe, expect, it, vi } from "vitest";

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => {
  const selectInput = await vi.importActual("@openimis/fe-core/components/inputs/SelectInput");
  const i18n = await vi.importActual("@openimis/fe-core/helpers/i18n");
  return { SelectInput: selectInput.default, formatMessage: i18n.formatMessage };
});

const { default: ConfigBasedPicker } = await import("./ConfigBasedPicker");
const {
  renderWithProviders, screen, userEvent,
} = await import("@openimis/fe-core/testing");

const OPTIONS = [
  { value: "1", label: { en: "Retail", fr: "Commerce" } },
  { value: "2", label: { en: "Industry", fr: "Industrie" } },
];

const messages = {
  "policyHolder.activityCode": "Activity code",
  "policyHolder.emptyLabel": "Any",
};

const renderPicker = (props = {}, options = {}) => renderWithProviders(
  <ConfigBasedPicker
    module="policyHolder"
    label="activityCode"
    configOptions={OPTIONS}
    onChange={() => {}}
    {...props}
  />,
  { messages, ...options },
);

const openOptions = async () => {
  await userEvent.click(screen.getByRole("combobox"));
  return screen.getAllByRole("option").map((option) => option.textContent);
};

describe("ConfigBasedPicker", () => {
  it("offers the configured options in the user's language", async () => {
    renderPicker();

    expect(await openOptions()).toEqual(["Retail", "Industry"]);
  });

  it("switches the option labels with the locale", async () => {
    renderPicker({}, { locale: "fr" });

    expect(await openOptions()).toEqual(["Commerce", "Industrie"]);
  });

  it("reports the chosen option as a number", async () => {
    const onChange = vi.fn();
    renderPicker({ onChange });

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Industry" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(2);
  });

  it("shows the current value by its label", () => {
    renderPicker({ value: 1 });

    expect(screen.getByRole("combobox")).toHaveTextContent("Retail");
  });

  it("labels itself from the module translations", () => {
    renderPicker();

    expect(screen.getByText("Activity code", { selector: "label" })).toBeInTheDocument();
  });

  it("drops the label when asked to render without one", () => {
    renderPicker({ withLabel: false });

    expect(screen.queryByText("Activity code", { selector: "label" })).not.toBeInTheDocument();
  });

  it("puts the caller's empty choice first when one is allowed", async () => {
    renderPicker({ withNull: true, nullLabel: "No activity" });

    expect(await openOptions()).toEqual(["No activity", "Retail", "Industry"]);
  });

  // Currently fails: the default empty label is read from the contract module's
  // translations, not this module's own policyHolder.emptyLabel, so without the
  // contract module installed the bare key "emptyLabel" is shown.
  it.fails("labels the default empty choice from its own translations", async () => {
    renderPicker({ withNull: true });

    expect((await openOptions())[0]).toBe("Any");
  });
});
