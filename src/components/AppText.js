import React, {Component} from 'react';
import {Text, View} from 'react-native';

import {connect} from 'react-redux';
import I18n from '../utils/i18n';

class AppText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      i18n: I18n,
    };
  }

  componentDidMount() {
    const {language} = this.props;
    if (language) this.setMainLocaleLanguage(language);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.language !== prevState.language) {
      return {language: nextProps.language};
    } else return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.language !== this.state.language) {
      const {language} = this.state;
      this.setMainLocaleLanguage(language);
    }
  }

  setMainLocaleLanguage = language => {
    let i18n = this.state.i18n;
    i18n.locale = language;
    this.setState({i18n});
  };

  render() {
    const {i18nKey, style} = this.props;
    const {i18n} = this.state;
    return (
      <Text style={style}>
        {i18nKey ? i18n.t(i18nKey) : this.props.children}
      </Text>
    );
  }
}

const mapStateToProps = state => {
  return {
    language: state.languageReducer.language,
  };
};

export default connect(
  mapStateToProps,
  null,
)(AppText);
