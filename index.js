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
    
    dropdown.classList.add('is-active');

    for(let movie of movies){
        const div = document.createElement('div');

        div.innerHTML = `
            <img src="${movie.Poster}" />
            <h1>${movie.Title}</h1>
        `;

        resultWrapper.appendChild(div);
    }
};
input.addEventListener('input' ,debounce(onInput));




