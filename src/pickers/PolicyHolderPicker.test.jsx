/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// The fe-core barrel cannot be loaded on its own from a test. SelectInput keeps
// fe-core's contract: the option whose JSON equals the value is shown, anything
// else is empty; read-only, it prints the matching option's label.
vi.mock('@openimis/fe-core', () => ({
  FormattedMessage: ({ id }) => id,
  // fe-core's decodeId: a relay global id is base64("Type:id").
  decodeId: (id) => (/^\d+$/.test(id) ? id : atob(id).split(':')[1]),
  SelectInput: ({ options, value, readOnly }) => {
    const current = value === null || value === undefined ? '' : JSON.stringify(value);
    const match = options.find((o) => o.value !== null && JSON.stringify(o.value) === current);
    return <output data-testid="picker" data-readonly={String(!!readOnly)}>{match?.label ?? ''}</output>;
  },
}));

const { PolicyHolderPicker } = await import('./PolicyHolderPicker');

const UUID = '6e9d5a3c-2f5b-4c39-9f0e-3b8f1c2d4a71';
// The picker's own list, as mapStateToProps hands it over: decoded id, picker projection.
const LISTED = { id: UUID, code: 'PH001', tradeName: 'Fairbrook Ltd' };
// A saved policy holder user's policyHolder: relay id and the full projection.
const SAVED = {
  id: btoa(`PolicyHolderGQLType:${UUID}`),
  code: 'PH001',
  tradeName: 'Fairbrook Ltd',
  version: 1,
  dateValidFrom: '2026-01-01',
};

const renderPicker = (props) => render(
  <PolicyHolderPicker
    policyHolders={[LISTED, { id: 'a1b2c3d4-0000-4000-8000-000000000000', code: 'PH002', tradeName: 'Other' }]}
    fetchPickerPolicyHolders={() => {}}
    onChange={() => {}}
    {...props}
  />,
);

describe('PolicyHolderPicker', () => {
  // OP-3262: editing a policy holder user showed the field blank, because the saved
  // object (relay id, full projection) is not JSON-equal to any listed option.
  it('shows a saved policy holder passed with its relay id and full projection', () => {
    renderPicker({ value: SAVED });

    expect(screen.getByTestId('picker')).toHaveTextContent('PH001 - Fairbrook Ltd');
  });

  it('shows it read-only too, as when the dialog opens from a policy holder page', () => {
    renderPicker({ value: SAVED, readOnly: true });

    expect(screen.getByTestId('picker')).toHaveTextContent('PH001 - Fairbrook Ltd');
  });

  it('still shows a value taken from its own list', () => {
    renderPicker({ value: LISTED });

    expect(screen.getByTestId('picker')).toHaveTextContent('PH001 - Fairbrook Ltd');
  });

  it('shows nothing when there is no value', () => {
    renderPicker({ value: null });

    expect(screen.getByTestId('picker')).toHaveTextContent('');
  });
});
