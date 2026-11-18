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
vi.mock('../actions', () => ({ fetchPickerPolicyHolderInsurees: vi.fn() }));

const { PolicyHolderInsureePicker } = await import('./PolicyHolderInsureePicker');

const ASSIGNED = { id: 'SW5zOjE=', chfId: '100', lastName: 'Fairbrook', otherNames: 'Ada' };
// An insuree the policy holder no longer has: the picker lists the current
// (not deleted) policy holder insurees only.
const DROPPED = { id: 'SW5zOjI=', chfId: '200', lastName: 'Brightwater', otherNames: 'Alden' };

const renderPicker = (props) => render(
  <PolicyHolderInsureePicker
    policyHolderId="ph-1"
    pickerPolicyHolderInsurees={[{ insuree: ASSIGNED }]}
    fetchPickerPolicyHolderInsurees={() => {}}
    modulesManager={{}}
    withLabel={false}
    readOnly
    {...props}
  />,
);

describe('PolicyHolderInsureePicker', () => {
  it('shows an insuree of its list', () => {
    renderPicker({ value: ASSIGNED });

    expect(screen.getByTestId('picker')).toHaveTextContent('Fairbrook Ada');
  });

  // UAT OCM-257: with "Show Deleted", the deleted policy holder insuree's row showed no name.
  it('shows an insuree that is no longer in its list', () => {
    renderPicker({ value: DROPPED });

    expect(screen.getByTestId('picker')).toHaveTextContent('Brightwater Alden');
  });

  it('shows nothing when there is no value', () => {
    renderPicker({ value: null });

    expect(screen.getByTestId('picker')).toHaveTextContent('');
  });
});
