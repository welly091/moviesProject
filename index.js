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

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" /> 
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');


const onInput = async event =>{
    //Find all movies from the input
    const movies = await fetchData(event.target.value);
    
    //If nothing is in input, then dropdown does not show up
    if(!movies.length){
        dropdown.classList.remove('is-active');
        return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    for(let movie of movies){
        const option = document.createElement('a');
        const imgSRC = movie.Poster === 'N/A' ? '' : movie.Poster; 

        option.classList.add('dropdown-item');
        option.innerHTML = `
            <img src="${imgSRC}" />
            ${movie.Title}
        `;
        option.addEventListener('click', () =>{
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input' ,debounce(onInput, 500));
input.addEventListener('click', onInput);

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async movie =>{
    const response = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey: 'b73304f0',
            i: movie.imdbID
        }
    });
}



