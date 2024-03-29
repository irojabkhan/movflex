
import React, { useState, useEffect} from 'react';
import { Button, Tab, Tabs, TextField } from '@mui/material';
import PageHeader from '../../components/Pageheader/PageHeader';
import SearchIcon from '@mui/icons-material/Search';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
import axios from 'axios';
import SingleItem from '../../components/Singleitem/SingleItem';
import CustomPagination from '../../components/Pagination/Pagination';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
    >
        {value === index && (
        <div>
            <div>{children}</div>
        </div>
        )}
    </div>
    );
}

const Search = () => {
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [content, setContent] = useState([]);
    const [numOfPages, setNumOfPages] = useState();
    const [isSearch, setIsSearch] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPage(1);
    }

    const fetchSearch = async(e) => {
        e?.preventDefault();
        if(searchText.length > 0) {
            const {data} = await axios.get(`https://api.themoviedb.org/3/search/${value ? 'tv' : 'movie'}?api_key=${process.env.REACT_APP_API_KEY}&query=${searchText}&page=${page}`)
            setContent(data.results);
            setNumOfPages(data.total_pages);
            setIsSearch(true);
        }
    }

    useEffect(() => {
        window.scroll(0, 0);
        fetchSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div>
            <PageHeader title='Search' />
            <div>
                <form onSubmit={fetchSearch} style={{display: 'flex', marginTop: 15, marginBottom: 15}}>
                    <TextField
                        style={{flex: 1}}
                        className="searchBox"
                        label="search"
                        variant="filled"
                        onChange={(e) => setSearchText(e.target.value)}
                        />
                    <Button 
                        type='submit'
                        variant="contained" 
                        style={{marginLeft: 20}}
                        >
                        <SearchIcon />
                    </Button>
                </form>
            </div>
            <div>
                <div className='mb20 bb'>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Movie" />
                        <Tab label="Tv Series" />
                    </Tabs>
                </div>
                <TabPanel value={value} index={0}>
                    <div className="item__wrap">
                        { content.length > 0 ? content.map((item) => (
                            <SingleItem 
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                poster={item.poster_path}
                                date={item.release_date}
                                overview={item.overview}
                                vote_average={item.vote_average}
                                media_type='movie'
                                />
                        )) : (isSearch > 0 && <h2 className='text-center w-100'>No Movie Found</h2>)}
                    </div>
                    {numOfPages > 1 && 
                        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
                    }
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className="item__wrap">
                        { content.length > 0 ? content.map((item) => (
                            <SingleItem 
                                key={item.id}
                                id={item.id}
                                title={item.name}
                                poster={item.poster_path}
                                date={item.first_air_date}
                                overview={item.overview}
                                vote_average={item.vote_average}
                                media_type='tv'
                                />
                        )) : (isSearch > 0 && <h2 className='text-center w-100'>No Series Found</h2>)}
                    </div>
                    {numOfPages > 1 && 
                        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
                    }
                </TabPanel>
                
            </div>
        </div>
    )
}

export default Search;