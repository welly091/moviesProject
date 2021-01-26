const createAutoComplete = ({root, renderOption}) =>{
//root is a class
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" /> 
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');


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

    //List all the movies with the key word
    for(let movie of movies){
        const option = document.createElement('a');

        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(movie);
        option.addEventListener('click', () =>{
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input' ,debounce(onInput, 500)); 
//input.addEventListener('click', onInput);

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});

}