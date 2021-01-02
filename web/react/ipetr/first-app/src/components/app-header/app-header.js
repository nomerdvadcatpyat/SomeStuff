import React from 'react';
import styled from 'styled-components';

const HeaderBlock = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  h1 {
    font-size: 26px;
    color: ${props => props.colored ? 'red' : 'black'};
    :hover {
      color: blue;
    }
  }
  h2 {
    font-size: 1.2rem;
    color: grey;
  }
`

export default class AppHeader extends React.Component {

  render() {
    return (
      <HeaderBlock as='a'>
        <h1> FirstName LastName </h1>
        <h2> {this.props.allPosts} записей. {this.props.liked} понарвилось </h2>
      </HeaderBlock>
    );
  }
}