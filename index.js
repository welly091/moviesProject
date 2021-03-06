const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'b73304f0',
            s: searchTerm
        }
    });

    //If can't find the moving, then return nothing.
    if(response.data.Error){
        return [];
    }

    return response.data.Search;
};

createAutoComplete({
    root: document.querySelector('.autocomplete'),
    renderOption(movie){
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster; 
        return `
        <img src="${imgSRC}" />
        ${movie.Title} (${movie.Year})
    `;
    }
    
})


const onMovieSelect = async movie =>{
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'b73304f0',
            i: movie.imdbID
        }
    });
    
    //The class '#summary' will show the selected result.
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}<p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}<p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}<p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}<p>
            <p class="subtitle">imdbRating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}<p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}