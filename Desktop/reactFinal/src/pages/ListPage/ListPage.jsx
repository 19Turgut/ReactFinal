import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ListPage.css';

const ListPage = () => {
    const { id } = useParams();
    const [state, setState] = useState({ title: '', movies: [] });

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`https://acb-api.algoritmika.org/api/movies/list/${id}`);
                const data = response.data;
                const aboutMovie = await Promise.all(
                    data.movies.map(movie =>
                        axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=aa01eba0`)
                        .then(response => response.data)
                    )
                );
                setState({ title: data.title, movies: aboutMovie });
            } catch (error) {
                console.error('Error  data:', error);
            }
        };

        fetchList();
    }, [id]);

    return (
        <div className="list-page">
            <h1 className="list-page__title">{state.title}</h1>
            <ul>
                {state.movies.map((item) => (
                    <li key={item.imdbID}>
                        <a href={`https://www.imdb.com/title/${item.imdbID}/`} target="_blank" rel="noopener noreferrer">
                            {item.Title} ({item.Year})
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListPage;
