
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

import './ItemDetails.css';

import {img_500, img_300, unavailable} from '../../config/config';
import { Link } from 'react-router-dom';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import PageHeader from '../../components/Pageheader/PageHeader';
import Cast from '../../components/Cast/Cast';
import SingleItem from '../../components/Singleitem/SingleItem';

import Carousel from 'react-elastic-carousel';

const ItemDetails = () => {
    const {id, media_type} = useParams();
    const [item, setItem] = useState(null);
    const [video, setVideo] = useState('');
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [showCast, setShowCast] = useState(false);
    const [relatedItem, setRelatedItem] = useState([]);

    const fetchItem = async () => {
        const { data } =  await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        setItem(data);
    };

    const fetchVideo = async () => {
        const { data: {results = []}} =  await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
            );
        const trailers = results.filter(trailer => trailer.type === 'Trailer');
        const singleVideoKey = trailers.length > 0 ? trailers[0].key : ''; 
        setVideo(singleVideoKey);
        
    };

    const fetchCast = async () => {
        const { data: {cast,crew = []} } = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
        const directors = crew && crew.length > 0 && crew.filter((cr) => cr.department === "Directing" && cr.job === "Director");
        setCrew(directors);
        setCast(cast);
    }


    const fetchRelatedItem = async () => {
        const { data } =  await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`);
        setRelatedItem(data.results);
        console.log(data);
    };

    useEffect(() => {
        window.scroll(0, 0);
        fetchItem();
        fetchVideo();
        fetchCast();
        fetchRelatedItem();

        // eslint-disable-next-line
    }, [media_type, id])

    const handleShowCast = (e) => {
        e.preventDefault();
        setShowCast(!showCast);
    }

    const breakPoints = [
        {width: 499, itemsToShow: 1},
        {width: 768, itemsToShow: 2},
        {width: 991, itemsToShow: 4},
        {width: 1200, itemsToShow: 4}
    ]

    return (
        item && (
            <>
                <div className='item__details'>
                    <div className="item__thumb">
                        <img src={item.poster_path? `${img_500}/${item.poster_path}` : unavailable} alt="" />
                    </div>
                    <div className="item__content">
                        <h1 className="title">{item.title || item.name}</h1>
                        <p className='item__genres'>{item.genres.map((genre, index) => (
                            <Link key={index} to={`/${media_type}`}>{genre.name}</Link>
                        ))}</p>
                        {
                            crew && crew.map((dir, index) => (
                                <p key={index}><strong>Director: {dir.name}</strong></p>
                            ))
                        }
                        <p className='overview'>{item.overview}</p>
                        <p><strong>Date</strong>: {item.first_air_date || item.release_date}</p>
                        <p><strong>Language</strong>: {item.spoken_languages[0].english_name}</p>
                        <p><strong>IMDB Rating</strong>: {item.vote_average}</p>
                        <p><strong>Media Type</strong>: {media_type === 'tv' ? 'Tv Series' : 'Movie'}</p>
                        <p><strong>Run Time</strong>: {item.runtime}</p>
                        {
                            video && (
                                <TrailerModal url={`https://www.youtube.com/embed/${video}`} />
                            )
                        }
                    </div>
                </div>

                <div className='pt30'>
                    <h2 className='pb20'>Cast</h2>
                    <div className="cast__list">
                        {
                            cast && showCast ? (
                                cast.map((item, index) => (
                                    <Cast
                                        key={index}
                                        path={item.profile_path? `${img_300}/${item.profile_path}` : unavailable}
                                        alt={item.name}
                                        name={item.name}
                                    />
                                ))
                            ) : (
                                cast.slice(0, 8).map((item, index) => (
                                    <Cast
                                        key={index}
                                        path={item.profile_path? `${img_300}/${item.profile_path}` : unavailable}
                                        alt={item.name}
                                        name={item.name}
                                    />
                                ))
                            )
                        }
                        <p className='show__handle'><span onClick={handleShowCast}>Show {showCast ? 'Less' : 'All'}</span></p>
                    </div>
                </div>

                <div className='pt50'>
                    <PageHeader title={media_type === "tv" ? "Related Tv Series" : "Related Movies"} />
                    <Carousel 
                        breakPoints={breakPoints}
                        showArrows= {false}
                        itemPadding={[0]}
                        outerSpacing={0}
                    >
                        { relatedItem && relatedItem.map((item) => (
                            <SingleItem 
                                key={item.id}
                                id={item.id}
                                title={item.title || item.name}
                                poster={item.poster_path}
                                date={item.first_air_date || item.release_date}
                                overview={item.overview}
                                // vote_average={item.vote_average}
                                media_type={media_type}
                                />
                            )) 
                        }
                    </Carousel>
                </div>
            </>
        )
    )
}

export default ItemDetails;
