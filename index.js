const autoCompleteConfig ={
    
    //Show individual item
    //If there is no poster image for a movie
    //.. we return 'N/A', shoing no image   
    renderOption(movie){
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster; 
        return `
        <img src="${imgSRC}" />
        ${movie.Title} (${movie.Year})
    `;
    },
    // //When someone clicks on one selection
    // onOptionSelect (movie){
    //     document.querySelector('.tutorial').classList.add('is-hidden');
    //     onMovieSelect(movie);
    // },
    inputValue(movie){
        return movie.Title;
    },

    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params:{
                apikey: 'eaf123cf',
                s: searchTerm
            }
        });
    
        //If can't find the movie, then return nothing.
        if(response.data.Error){
            return [];
        }
    
        return response.data.Search;
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect (movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect (movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'),'right');
    }
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) =>{
    const response = await axios.get('https://www.omdbapi.com/', {
        params:{
            apikey: 'eaf123cf',
            i: movie.imdbID
        }
    });
    
    //The class '#summary' will show the selected result.
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
        leftMovie = response.data;
    }
    if(side === 'right'){
        rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
        runComparision();
    }
}

const runComparision = () =>{
    const leftSideStats= document.querySelectorAll('#left-summary .notification');
    const rightSideStats= document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) =>{
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);
        
        if(rightSideValue > leftSideValue){
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }else if(rightSideValue < leftSideValue){
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })

}

const movieTemplate = (movieDetail) => {
    //Parse those numbers for comparison.
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g,''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseFloat(movieDetail.imdbVotes.replace(/,/g,''));
    
    //Here, I use .reduce() function to do the sum of numbers in awards.
    // ** array.reduce(function(total, currentValue, currentIndex, arr), initialValue) **
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    }, 0);

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
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}<p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}<p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}<p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}<p>
            <p class="subtitle">imdbRating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}<p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}