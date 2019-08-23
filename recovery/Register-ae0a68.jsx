import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextInput from '../inputs/TextInput';

export default class Register extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: null,
      password: '',
      passwordError: null,
      buttonMessage: 'Click Me',
    };
  }

  handleTextChange = event => {
    if (this.state[event.target.id] !== undefined) {
      this.setState({ [event.target.id]: event.target.value });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ buttonMessage: 'Oh yeah!' });
  };

  render() {
    const {
      email,
      emailError,
      password,
      passwordError,
      buttonMessage,
    } = this.state;
    return (
      <div className="login-form">
        <form>
          <TextInput
            htmlId="email"
            name="email"
            label="email"
            type="text"
            required
            onChange={this.handleTextChange}
            placeholder="Email address"
            value={email}
            // readOnly={true}
            error={emailError}
            // props="readOnly"
            // children={<div>Hey!</div>}
          />
          {/* password button */}
          <TextInput
            htmlId="password"
            name="password"
            label="password"
            type="text"
            required
            onChange={this.handleTextChange}
            placeholder="Password"
            value={password}
            // readOnly={true}
            error={passwordError}
            // props="readOnly"
            // children
          />
          <button
            type="submit"
            className="login-button"
            onClick={() => this.props.setComplex('code')}
          >
            {buttonMessage}
          </button>
        </form>
      </div>
    );
  }
}
