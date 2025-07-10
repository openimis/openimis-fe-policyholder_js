import React, { Component } from "react";
import { Typography, Box } from "@material-ui/core";

class TabPanel extends Component {
    render() {
        const { children, value, index, ...other } = this.props;
        return (
            <div
                hidden={value !== index}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography component={'span'}>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }
}

export default TabPanel;