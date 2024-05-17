import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header/Header';
import SearchBox from '../../components/SearchBox/SearchBox';
import Movies from '../../components/Movies/Movies';
import Favorites from '../../components/Favorites/Favorites';
import './MainPage.css';

const MainPage = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [title, setTitle] = useState('');
    const [savedLists, setSavedLists] = useState([]);

    const getId = async (ids) => {
        try {
            const movieId = ids.map(id => axios.get(`https://www.omdbapi.com/?i=${id}&apikey=aa01eba0`).then(response => response.data));
            const result = await Promise.all(movieId);
            setMovies(result.filter(movie => movie.Response === 'True'));
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    };

    useEffect(() => {
        getId(['tt1092018', 'tt1092014', 'tt1092016','tt1092017']);
    }, []);

    const handleSearch = async (searchPart) => {
        try {
            let sectionID = `https://www.omdbapi.com/?i=${searchPart}&apikey=aa01eba0`;
            let sectionTitle = `https://www.omdbapi.com/?s=${searchPart}&apikey=aa01eba0`;   
            let response = await axios.get(sectionID);
            let data = response.data;
            if (data.Response === 'True') {
                setMovies([data]);
            } else {
                response = await axios.get(sectionTitle);
                data = response.data;
                if (data.Response === 'True') {
                    setMovies(data.Search);
                } else {
                    setMovies([]);
                }
            }
        } catch (error) {
            console.error('Error searching for movies:', error);
        }
    };

    const listaddToFavorites = (movie) => {
        if (!favorites.find(favorite => favorite.imdbID === movie.imdbID)) {
            setFavorites([...favorites, movie]);
        }
    };

    const listremoveToFavorites = (imdbID) => {
        setFavorites(favorites.filter(movie => movie.imdbID !== imdbID));
    };

    const saveList = async (listTitle) => {
        try {
            const response = await axios.post('https://acb-api.algoritmika.org/api/movies/list', {
                title: listTitle,
                movies: favorites.map(movie => ({ imdbID: movie.imdbID }))
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = response.data;
            setSavedLists([...savedLists, { name: listTitle, link: `http://localhost:5173/list/${data.id}` }]);
            setFavorites([]);
        } catch (error) {
            console.error('Error saving the list:', error);
        }
    };

    return (
        <div className="main-page">
            <Header />
            <main className="main-page__content">
                <section className="main-page__main-section">
                    <div className="main-page__search-box">
                        <SearchBox search={handleSearch} />
                    </div>
                    <div className="main-page__movies">
                        <Movies movies={movies} favorites={listaddToFavorites} />
                    </div>
                </section>
                <aside className="main-page__favorites">
                    <Favorites 
                        movies={favorites} 
                        removeFromlist={listremoveToFavorites} 
                        saveList={saveList} 
                        setName={setTitle} 
                        savedLists={savedLists} 
                    />
                </aside>
            </main>
        </div>
    );
};

export default MainPage;
