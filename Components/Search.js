import React from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native'
import FilmItem from './FilmItems'
import { getFilmsSearchedText } from '../API/TMDBApi'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0 // Counter to know the current page
    this.totalPages = 0
    this.state = { 
      films : [],
      isLoading : false
    }
  }

  _searchTextInputChanged(text) {
    this.searchedText = text
  }

  _loadFilms() {
      if (this.searchedText.length > 0) {
        this.setState({ isLoading: true })
        getFilmsSearchedText(this.searchedText, this.page+1).then(data => { // concatenation of film pages
          this.page = data.page
          this.totalPages = data.total_pages
          this.setState({ films: this.state.films.concat(data.results), isLoading: false})
      })
    }
  }

  _displayLoading() { // Displays a load indicator
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _searchFilms() { // Reset the films of our state
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: [],
    }, () => { // Asynchronous function function that runs in the background and does not block the execution of your code. While resetting the state, we are already calling the _loadFilms() function. 
        this._loadFilms() 
    })
}

_displayDetailForFilm = (idFilm) => {
  this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
}

  render() {
    return (
      <View style={styles.main_container}>
        <TextInput 
          style={styles.textinput} 
          placeholder='Titre du film' 
          onChangeText={(text) => this._searchTextInputChanged(text)} 
          onSubmitEditing={() => this._searchFilms()}
        />
        <Button 
          style={{ height: 50 }} title='Rechercher' 
          onPress={() => this._searchFilms()}
        />
        <FlatList
            data={this.state.films}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => <FilmItem film={item} displayDetailForFilm={this._displayDetailForFilm}/>}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (this.page < this.totalPages) { // We check that we have not reached the end of pagination (totalPages) before loading more elements.
              this._loadFilms()
              }
            }}
        />
        { this.state.isLoading ? // Verifies that a load is in progress
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' /> 
          </View>
          : null
      }
      </View>
    )
  }
}

const styles = StyleSheet.create ({
    main_container: {
        flex : 1,
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5, 
        height: 50, 
        borderColor: '#000000', 
        borderWidth: 1, 
        paddingLeft: 5
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
})

export default Search