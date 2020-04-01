import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Header } from "native-base";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";

class HeaderGradient extends BaseView {
    constructor(props) {
        super(props);
    }

    render() {
        const { renderTabs } = this.props;
        return (
            <LinearGradient
                colors={[Colors.COLOR_PRIMARY_HIGH, Colors.COLOR_PRIMARY_LOW]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[commonStyles.shadowOffset]}>
                <Header noShadow style={{ backgroundColor: Colors.COLOR_TRANSPARENT }}>
                    {this.renderHeaderView({ ...this.props })}
                </Header>
                {renderTabs && renderTabs()}
            </LinearGradient>
        )
    }
}

export default HeaderGradient;