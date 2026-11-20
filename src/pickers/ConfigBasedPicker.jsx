import React, { Component } from "react";
import { SelectInput, injectIntl } from "@openimis/fe-core";
import { formatMessage } from "@openimis/fe-core";

class ConfigBasedPicker extends Component {
    render() {
        const { intl, value, onChange, module, label, configOptions, readOnly = false,
            withNull = false, nullLabel = null, withLabel = true } = this.props;
        const options = [
            ...configOptions.map(option => ({
                value: parseInt(option.value),
                label: option.label[intl.locale]
            }))
        ]
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || formatMessage(intl, "contract", "emptyLabel")
            })
        }
        return (
            <SelectInput
                module={module}
                label={withLabel ? label : null}
                options={options}
                value={value}
                onChange={onChange}
                readOnly={readOnly} />
        );
    }
}

export { ConfigBasedPicker };
export default injectIntl(ConfigBasedPicker);
