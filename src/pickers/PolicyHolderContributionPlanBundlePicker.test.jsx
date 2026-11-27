/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// The fe-core barrel cannot be loaded on its own from a test. SelectInput keeps
// fe-core's contract: the option whose JSON equals the value is shown, anything
// else is empty; read-only, it prints the matching option's label.
vi.mock('@openimis/fe-core', () => ({
  withModulesManager: (C) => C,
  FormattedMessage: ({ id }) => id,
  SelectInput: ({ options, value }) => {
    const current = value === null || value === undefined ? '' : JSON.stringify(value);
    const match = options.find((o) => o.value !== null && JSON.stringify(o.value) === current);
    return <output data-testid="picker">{match?.label ?? ''}</output>;
  },
}));
vi.mock('../actions', () => ({ fetchPickerPolicyHolderContributionPlanBundles: vi.fn() }));

const { PolicyHolderContributionPlanBundlePicker } = await import('./PolicyHolderContributionPlanBundlePicker');

const ASSIGNED = { id: 'Q2I6MQ==', code: 'CB001', name: 'Assigned bundle' };
// A bundle the policy holder no longer has: its assignment was deleted or replaced,
// so the picker's list (the policy holder's current bundles) does not hold it.
const DROPPED = { id: 'Q2I6Mg==', code: 'CB002', name: 'Dropped bundle' };

const renderPicker = (props) => render(
  <PolicyHolderContributionPlanBundlePicker
    policyHolderId="ph-1"
    pickerPolicyHolderContributionPlanBundles={[{ contributionPlanBundle: ASSIGNED }]}
    fetchPickerPolicyHolderContributionPlanBundles={() => {}}
    modulesManager={{}}
    withLabel={false}
    readOnly
    {...props}
  />,
);

describe('PolicyHolderContributionPlanBundlePicker', () => {
  it('shows a bundle of its list', () => {
    renderPicker({ value: ASSIGNED });

    expect(screen.getByTestId('picker')).toHaveTextContent('CB001 - Assigned bundle');
  });

  // UAT OCM-253: with "Show Deleted", the deleted assignment's row showed no bundle.
  it('shows a bundle that is no longer in its list', () => {
    renderPicker({ value: DROPPED });

    expect(screen.getByTestId('picker')).toHaveTextContent('CB002 - Dropped bundle');
  });

  it('shows nothing when there is no value', () => {
    renderPicker({ value: null });

    expect(screen.getByTestId('picker')).toHaveTextContent('');
  });
});
