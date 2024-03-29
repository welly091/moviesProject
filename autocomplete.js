//CSS from: https://bulma.io/documentation/components/dropdown/

const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) =>{

root.innerHTML = `
    <label><b>Search</b></label>
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
    const items = await fetchData(event.target.value);
    
    //If nothing is in input, then dropdown does not show up
    if(!items.length){
        dropdown.classList.remove('is-active');
        return;
    }
    //Found something, 'is-active' is added into first item of dropdown
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    //List all the movies with the key word
    for(let item of items){
        const option = document.createElement('a');

        //'dropdown-item is in .dropdown CSS from the website.
        option.classList.add('dropdown-item');
        option.innerHTML = renderOption(item);
        option.addEventListener('click', () =>{
            dropdown.classList.remove('is-active');
            input.value = inputValue(item);
            onOptionSelect(item);
        });

        resultsWrapper.appendChild(option);
    }
};


input.addEventListener('input' ,debounce(onInput, 500)); 


// 'event.target' => the event was dispatched
document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
});

}