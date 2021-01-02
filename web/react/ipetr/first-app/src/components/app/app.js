import React from 'react';
import AppHeader from '../app-header/app-header';
import SearchPanel from '../search-panel/search-panel';
import PostStatusFilter from '../post-status-filter/post-status-filter';
import PostList from '../post-list/post-list';
import PostAddForm from '../post-add-form/post-add-form';

// import style from './app.module.css'
import styled from 'styled-components';

const AppBlock = styled.div`
  margin: 0 auto;
  max-width: 800px;
`

export default class App extends React.Component {
  
  state = {
    data : [
      { label: "Going to learn react", important: true, like: false, id: 1 },
      { label: "Thah is so dood" , important: false, like: false, id: 2 },
      { label: "I need a break...", important: false, like: false, id: 3 }
    ],
    term: '',
    filter: 'all'
  };

  maxId = 4;

  deleteItem = (id) => {
    this.setState(state => ({
      data: state.data.filter(el => el.id !== id)
    }));
  };

  addItem = body => {
    const newItem = {
      label: body,
      important: false,
      id: this.maxId++
    }

    this.setState(state => {
      const newData = [...state.data];
      newData.push(newItem);

      return { data: newData };
    });
  };

  onToggleImportant = id => {
    this.setState(state => {
      const index = state.data.findIndex(el => el.id === id);
      const old = state.data[index];
      const newItem = {...old, important: !old.important}

      const newArray =  [...state.data.slice(0, index), newItem, ...state.data.slice(index + 1)];

      return {
        data: newArray
      }
    });
  }

  onToggleLike = id => {
    this.setState(state => {
      const index = state.data.findIndex(el => el.id === id);
      const old = state.data[index];
      const newItem = {...old, like: !old.like}

      const newArray =  [...state.data.slice(0, index), newItem, ...state.data.slice(index + 1)];

      return {
        data: newArray
      }
    });
  }

  searchPost = (items, term) => {
    if(term.length === 0) {
      return items;
    }

    return items.filter( item => {
      return item.label.indexOf(term) > -1;
    });
  }

  onUpdateSearch = term => {
    this.setState({term});
  }

  filterPost = (items, filter) => {
    if(filter === 'like') {
      return items.filter(item => item.like);
    } else {
      return items;
    }
  }

  onFilterSelect = (filter) => {
    this.setState({filter})
  }

  render() {
    const {data, term, filter} = this.state;
    const liked = data.filter(item => item.like).length;
    const allPosts = data.length;

    const visiblePosts = this.filterPost(this.searchPost(data, term), filter);


    return (
      <AppBlock>
        <AppHeader allPosts={allPosts} liked={liked}/>
        <div className="s earch-panel d-flex">
          <SearchPanel
            onUpdateSearch={this.onUpdateSearch} />
          <PostStatusFilter 
            filter={filter}
            onFilterSelect={this.onFilterSelect}/>
        </div>
        <div className="post-list">
          <PostList 
            posts={ visiblePosts }
            onDelete={ id => this.deleteItem(id) }
            onToggleImportant={ id => this.onToggleImportant(id)}
            onToggleLike={ id => this.onToggleLike(id)}
          /> 
        </div>
        <div className="post-add-form">
          <PostAddForm 
            onAdd={ this.addItem } />
        </div>
      </AppBlock>
    );
  };
}