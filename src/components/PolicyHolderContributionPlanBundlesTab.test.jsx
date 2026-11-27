import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "@openimis/fe-core/testing";
import {
    POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE,
    RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH,
} from "../constants";
import { PolicyHolderContributionPlanBundlesTabPanel } from "./PolicyHolderContributionPlanBundlesTab";

// A modules manager with fe-core's refs only: the tab must not depend on
// policyHolder.TabPanel, which other modules cannot rely on being installed.
const { refs } = vi.hoisted(() => ({ refs: {} }));

vi.mock("@openimis/fe-core", async () => {
    const ReactActual = (await import("react")).default;
    refs["core.TabPanel"] = ({ value, index, children }) =>
        value === index ? ReactActual.createElement("div", { "data-testid": "core-tab-panel" }, children) : null;
    return {
        formatMessage: (intl, module, id) => id,
        FormattedMessage: ({ id }) => id,
        PublishedComponent: ({ pubRef, ...props }) => {
            const Component = refs[pubRef];
            return Component ? ReactActual.createElement(Component, props) : null;
        },
    };
});

vi.mock("./PolicyHolderContributionPlanBundleSearcher", () => ({
    default: () => <div data-testid="bundle-searcher" />,
}));
vi.mock("../dialogs/CreatePolicyHolderContributionPlanBundleDialog", () => ({ default: () => null }));

describe("PolicyHolderContributionPlanBundlesTabPanel", () => {
    it("renders its content through core.TabPanel", () => {
        renderWithProviders(
            <PolicyHolderContributionPlanBundlesTabPanel
                value={POLICYHOLDERCONTRIBUTIONPLANBUNDLE_TAB_VALUE}
                rights={[RIGHT_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_SEARCH]}
                isTabsEnabled
                policyHolder={{ id: "ph-1" }}
            />,
        );

        expect(screen.getByTestId("bundle-searcher")).toBeInTheDocument();
    });
});
