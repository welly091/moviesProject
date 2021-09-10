//Debouncing an input:
//After the last event to actually do something

const debounce = (func, delay = 1000) =>{
    let timeoutId;
    //return a new function

    //...args = take all arguments and pass through the function
    return (...args) =>{
        //If the user is still typing,
        // meaning timeoutId exsts and needs to be cleaned.        
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        //When the user stop typing,
        //let the setTimeout function run
        //... so the data will be inputed and search.
        timeoutId = setTimeout(() =>{
            //.apply() => take all elements(which is args here) 
            //... and pass them second time into original function.
            
            func.apply(null,args);
            
        }, delay);
    }; 
};