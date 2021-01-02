import React from 'react';
import './post-status-filter';
// import { Button } from 'reactstrap';

export default class PostStatusFilter extends React.Component {

  buttons = [
    {name: 'all', label: 'Все' },
    {name: 'like', label: 'Понарвилось' }
  ]

  render() {
    const buttons = this.buttons.map(({name, label}) => {
      const active = this.props.filter === name;
      const clazz = active ? 'btn-info' : 'btn-outline-secondary';
      return (
        <button 
          key={name} 
          color="info" 
          className={`btn ${clazz}`}
          onClick={() => this.props.onFilterSelect(name)}> 
            {label} 
        </button>
      )
    })

    return (
      <div className="btn-group">
        {buttons}
      </div>
    );
  }
}
