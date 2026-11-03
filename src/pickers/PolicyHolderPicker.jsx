import React, { Component } from "react";
import { FormattedMessage, SelectInput, decodeId } from "@openimis/fe-core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchPickerPolicyHolders } from "../actions";

// Listed ids are decoded; a saved policy holder may still carry its relay id.
// decodeId cannot read an id that is already decoded (a UUID is not base64).
const plainId = (id) => {
    try {
        return decodeId(id);
    } catch (e) {
        return id;
    }
};

class PolicyHolderPicker extends Component {
    componentDidMount() {
        const { withDeleted = false } = this.props;
        this.props.fetchPickerPolicyHolders(withDeleted ? [] : ["isDeleted: false"]);
    }

    // SelectInput matches by exact JSON: hand it the listed policy holder with the
    // same id, not the caller's object (another projection, a relay id).
    selectedOption = (value, policyHolders) => {
        if (!value) return null;
        return policyHolders.find((p) => p.id === value.id || p.id === plainId(value.id)) ?? value;
    };

    render() {
        const { value, onChange, required = false, withNull = false, nullLabel = null,
            withLabel = true, readOnly = false, policyHolders } = this.props;
        let options = [
            ...policyHolders.map(v => ({
                value: v,
                label: `${v.code} - ${v.tradeName}`
            }))
        ];
        if (withNull) {
            options.unshift({
                value: null,
                label: nullLabel || <FormattedMessage module="policyHolder" id="policyHolder.emptyLabel" />
            })
        }
        return (
            <SelectInput
                module="policyHolder"
                label={withLabel ? "policyHolder" : null}
                required={required}
                options={options}
                value={this.selectedOption(value, policyHolders)}
                onChange={onChange}
                readOnly={readOnly}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    policyHolders: state.policyHolder.policyHolders.map(({ id: encodedId, ...other }) => ({
        id: decodeId(encodedId),
        ...other,
    })),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPickerPolicyHolders }, dispatch);
};

export { PolicyHolderPicker };
export default connect(mapStateToProps, mapDispatchToProps)(PolicyHolderPicker);
