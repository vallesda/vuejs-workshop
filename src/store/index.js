import Vue from 'vue'
import Vuex from 'vuex'

import MovieService from '../services/MovieService'

Vue.use(Vuex)

const store = {
    state: {
        hello: 'world',
        movies: [],
        genres: [],
        selectedGenre: null,
        loading: false,
        movie: {}
    },

    actions: {
        async fetchMovies(context) {
            context.commit('setLoading', true)
            const moviesData = await MovieService.getMovies({
                page: 1,
                genre: context.state.selectedGenre
            });
            context.commit('setMovies', moviesData.data)
            context.commit('setLoading', false)
        },
        async fetchGenres (context) {
            const genreData = await MovieService.getGenres()
            context.commit('setGenres', genreData.data)
        },
        async fetchMovie (context, movieId) {
            const movieData = await MovieService.getMovieById(movieId)
            context.commit('setMovie', movieData.data)
        },
        filterMovies(context, genreId) {
            context.commit('setGenre', genreId)
            context.dispatch('fetchMovies')
        },
    },

    mutations: {
        setMovies(state, moviesData) {
            state.movies = moviesData.results
        },
        setGenres (state, genreData) {
            state.genres = genreData.genres
        },
        setGenre(state, genreId) {
            state.selectedGenre = genreId;
        },
        setLoading(state, value) {
            state.loading = value
        },
        setMovie(state, movieData) {
            state.movie = movieData
        }
    },

    getters: {
        movieCards(state) {
            const imageBasePath = 'http://image.tmdb.org/t/p/w370_and_h556_bestv2'
            return state.movies.map(movie => ({
               id: movie.id,
               image: `${imageBasePath}${movie.poster_path}`,
               title: movie.title,
               description: movie.overview,
               voteAverage: movie.vote_average
            }))
        },
        selectedGenreName(state) {
            const genre = state.genres.find(genre => genre.id === state.selectedGenre)
            return genre ? genre.name : null
        }
    },
}

export default new Vuex.Store(store);