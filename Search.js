import * as Tools from '/SearchNY_Lottery/Tools.js'
import * as Arch from '/SearchNY_Lottery/ReadArchive.js'

function SetUp(){
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    function Get_Dates(x, y){return x.filter((x) => x[(y == 3 ? 'evening_daily':'evening_win_4')] !== undefined).map((x) => x[(y == 3 ? 'midday_daily':'midday_win_4')] !== undefined? [[new Date(x['draw_date']), 'Evening'], [new Date(x['draw_date']), 'Midday']] : [[new Date(x['draw_date']), 'Evening']]).flat().map((x) => [x[0].toLocaleDateString('en-US', options), x[1]])
    }

    const game = document.getElementById("Select-Game"); const b_check = document.getElementById("Box"); const input = document.getElementById("input"); const submit = document.getElementById("Submit"); 
    const result_table = document.getElementById('result-table'); 
    const result_t_header = document.getElementById('result-table-Header');
    const saved_table = document.getElementById('saved-table');
    const saved_table_header = document.getElementById('saved-table-Header');
    const symbol = document.getElementById('sort'); let results = [];

    

    function Search_NY(){
        // Disable input and Submit button for now
        input.disabled = true; submit.disabled = true; 
        
        // Change Hash in Url 
        location.hash = input.value.toString().trim();

        // Start Search 
        let search = input.value.toString().trim().toLowerCase();
        const drawing = (game.value == '3' ? Arch.NY3_Drawings: game.value == '4' ? Arch.NY4_Drawings : isNaN())
        const date = (game.value == '3' || game.value == '4' ? Get_Dates(drawing[0], game.value) : isNaN());
        const data = (game.value == '3' || game.value == '4' ? drawing[1].map((x, i) => [date[i], x, Tools.Box_C(x)]) : isNaN())
        
        //console.log(data), console.log(date), console.log(drawing);
        // If Search isn't a searchable value, default to This Years Drawings 
        search = (search.search(/[A-Za-z]/) === -1 && search.search(/[0-9]/) === -1) ? 'date 2025' : search 
        
        // Search By Speach clean up 

        search = search.replaceAll('search', '').replace('for', '')

        //show actual search value

        input.value = search

            // CATCH Search as if Spoken and Filter
            if ( search.includes('past') || search.includes('last') || search.includes('ago') || search.includes('yesterday') ) {
                search.filter = search
                search.filter_keywords.map((x) => search.replace(x, ''));
            } 

            if( // Do a Date Search if search contains alphabetical Characters or includes the string 'date' in any order or capitalization 
                ( search.search(/[A-Za-z]/) !== -1) || search.includes('date') ){

                    const new_search = search.replaceAll('date', '').replaceAll(',', '').split(' ')
                    results = data.filter((x) => new_search.every((y) =>
                        {
                            const e_date = x[0].join(',').toLowerCase().split(',').map((z) => z.split(' ')).flat(2); 
                            return e_date.includes(y)
                        }
                    )); 
            }
                
            else{ // Result Column Search
                search = search.split('');
                b_check.checked === true? results = Tools.Box_BCode(data, 2, search) : results = (search.length < game.value ? data.filter((x) => x[1].join('').includes(search.join(''))) : data.filter((x) => Tools.Match_ArExact(x[1], search)))
            };


            // Check Filter & Filter Results
            if(search.filter !== undefined){
            
            
            }

        
        // Erase Table // No Results Available
        Array.prototype.filter.call(result_table.children, (x) => x.id !== 'result-table-Header' && x.id !== 'NA').map((x) => x.remove())
        
            
            if(results.length === 0){
                
                result_t_header.classList.remove('body-row')

                const span = document.createElement('span'); span.id ='NA'; span.innerHTML = 'No Results Available'; span.style.fontSize = '24pt'; 
                
                if(Array.prototype.find.call(result_table.children, (x) => x.id === 'NA') !== undefined){  
                    document.getElementById('NA').toggleAttribute('hidden')
                    setTimeout(() => {document.getElementById('NA').toggleAttribute('hidden');}, 500);
                    }
                    else{result_table.appendChild(span)}
                }

           else{
            // Header Table Checkbox Revealed
            if(!result_t_header.classList.contains('body-row')){
                result_t_header.classList.add('body-row')
                const checkbox_td = document.createElement('td'); result_t_header.prepend(checkbox_td);
                const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; result_t_header.firstElementChild.append(checkbox);
            }
            else{
                Array(...result_t_header.children)[0].firstElementChild.checked = false;
                Array(...result_t_header.children)[0].firstElementChild.indeterminate = false;
            }
            
            // Add Results to Table
               Array.prototype.filter.call(result_table.children, (x) => x.id !== 'result-table-Header').map((x) => x.remove());
               
                results.map((x) => 
                    {
                        const tr = document.createElement('tr'); tr.copy = '';
                       
                        // Create and Add Save Checkbox
                        const option = document.createElement('td'); const save_checkbox = document.createElement('input'); save_checkbox.type = 'checkbox';
                        option.appendChild(save_checkbox); tr.appendChild(option);

                        save_checkbox.addEventListener('click', () => {
                            
                            // Add Copy when Checked and remove Copy when checked is false
                            if(save_checkbox.checked){

                                // Found Repeat 
                                if(Array(...saved_table.children).slice(1).find((x) => [tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result].every((y) => [x.Weekday, x.Month, x.Day, x.Year, x.Time, x.Result].map((z) => z[0]).includes(y[0]) ))){
                                    save_checkbox.checked = true;
                                }
                                else{

                                    // Create Copy 
                                    let copy_tr = tr.cloneNode(true); copy_tr.removeChild(copy_tr.firstChild); copy_tr.className = 'copy';
                                    Object.assign(copy_tr, tr)
                                
                                    tr.copy = copy_tr; 
                                    saved_table.appendChild(copy_tr)
                                    Array.prototype.map.call(tr.children, (x) => {x.style.color = 'grey'})
                                }
                            }
                            if(!save_checkbox.checked){
                                Array.prototype.map.call(tr.children, (x) => {x.style.color = 'white'})
                                if(tr.copy === ''){
                                    console.log([tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result])
                                    console.log(Array(...saved_table.children).slice(1))
                                    console.log(Array(...saved_table.children).slice(1).map((x) => [x.Weekday, x.Month, x.Day, x.Year, x.Time, x.Result]))
                                    Array(...saved_table.children).slice(1).find((x) => [tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result].every((y) => [x.Weekday, x.Month, x.Day, x.Year, x.Time, x.Result].map((z) => z[0]).includes(y[0]) )).remove()
                                } else{
                                    tr.copy.remove()}

                                
                            }

                            // Intermidiate checkbox

                                if(Array.prototype.filter.call(result_table.children, (x) => x.id !== 'result-table-Header').map((x) => 
                                        Array(...x.children)[0].firstElementChild
                                ).filter((x) => x.checked === true).length !== 0 ){ 
                                Array(...result_t_header.children)[0].firstElementChild.indeterminate = true
                                
                                } 
                                else{
                                    Array(...result_t_header.children)[0].firstElementChild.indeterminate = false
                                    Array(...result_t_header.children)[0].firstElementChild.disabled = false
                                }

                            
                        })

                        // Get and Add Data to Rows
                        tr.date = new Date(x[0][0]); 
                        tr.Weekday = [tr.date.getDay(), Intl.DateTimeFormat('en-US', {'weekday': 'long'}).format(tr.date)]; tr.Month = [tr.date.getMonth(), Intl.DateTimeFormat('en-US', {'month': 'long'}).format(tr.date)]; tr.Day = [tr.date.getDate(), Intl.DateTimeFormat('en-US', {'day': 'numeric'}).format(tr.date)]; tr.Year = [tr.date.getYear(), Intl.DateTimeFormat('en-US', {'year': 'numeric'}).format(tr.date)]; tr.Time = [['Midday', 'Evening'].indexOf(x[0][1]), x[0][1]]; tr.Result = [Number(x[1].join('')), x[1].join('')];
                     
                        [tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result].map((x) => x[1]).map((y) => {
                            const td = document.createElement('td'); td.className = 't-data';
                            td.textContent = y; tr.appendChild(td)
                            }); 

                        result_table.appendChild(tr)

                        // Saved Table Same Results Removeable

                        if(Array(...saved_table.children).slice(1).find((x) => [tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result].every((y) => [x.Weekday, x.Month, x.Day, x.Year, x.Time, x.Result].map((z) => z[0]).includes(y[0]) ))){
                            console.log(Array(...saved_table.children).slice(1))
                            Array(...result_t_header.children)[0].firstElementChild.indeterminate = true;
                            Array.prototype.map.call(tr.children, (x) => {x.style.color = 'grey'});
                            save_checkbox.checked = true;
                        }
                    })
               }

        // Clear CheckBoxes and Select All
        console.log(Array(...saved_table.children).slice(1))
        Array(...result_t_header.children)[0].firstElementChild.addEventListener('click', () => {
           
            if(Array(...result_t_header.children)[0].firstElementChild.checked){
                Array(...result_table.children).slice(1).map((x) => 
                    {
                        Array(...x.children)[0].firstElementChild.checked = false;
                        Array(...x.children)[0].firstElementChild.click()
                    }
                )

                Array(...result_t_header.children)[0].firstElementChild.indeterminate = false;
                Array(...result_t_header.children)[0].firstElementChild.disabled = false;

            } else {
                Array(...result_table.children).slice(1).map((x) => 
                    {
                        Array(...x.children)[0].firstElementChild.checked = true;
                        Array(...x.children)[0].firstElementChild.click()
                    }
                )

            }
        })

        // Erase Sort 
        symbol.innerHTML === '' 
        Array.prototype.map.call(result_t_header.children, (x) => x.style.color = 'white')
        
        // Enable Input and Submit Button
        input.disabled = false; submit.disabled = false;
        result_table.focus()
    }

    // Timed Search

    Search_NY.Timed = (sec) => {
        let timer = {}
        timer.current = 0
        timer.cancel = () => { clearTimeout(timer.session); clearInterval(timer.argument); }
        timer.start = () => {
            timer.session = setTimeout(() => {
                Search_NY()
            }, sec * 1000)
            timer.argument()
        }
    
        timer.argument = () => setInterval(() => {
            // if session is finished
            if( timer.current > (sec * 1000)){ timer.cancel()}
            if( document.activeElement !== input ){
                timer.cancel()
            }
            timer.current++
        }, 1)

        timer.start()
    }
    
    function Sort_By(column){
        
        const rows = Array.prototype.filter.call(column.parentElement.parentElement.children,(x) => x !== column.parentElement);
        const up = String.fromCharCode(8593); const down = String.fromCharCode(8595)
        const sort_by = column.firstElementChild.innerHTML.trim(); 
      
        Array.prototype.map.call(column.parentElement.children, (x) => x.style.color = 'white')
           
        if(symbol.innerHTML === '' || column.lastElementChild.id !== 'sort'){
            symbol.innerHTML = up;  column.style.color = 'silver'; column.appendChild(symbol);
       
            Array.prototype.sort.call(rows, (a, b) => a?.[sort_by][0] - b?.[sort_by][0])
            column.parentElement.parentElement.replaceChildren(column.parentElement, ...rows)
            
        } 

        else if(symbol.innerHTML === up){
            symbol.innerHTML = down; column.style.color = 'silver'; column.appendChild(symbol);

            Array.prototype.sort.call(rows, (a, b) => b?.[sort_by][0] - a?.[sort_by][0])
            column.parentElement.parentElement.replaceChildren(column.parentElement, ...rows)
                
        } 

        else if(symbol.innerHTML === down){
            symbol.innerHTML = ''; column.style.color = 'white'; column.appendChild(symbol);
          
            Array.prototype.sort.call(rows, (a, b) => b.date - a.date)
            column.parentElement.parentElement.replaceChildren(column.parentElement, ...rows) 
          
        }  
            
    }


    // Download Saved Data 





        // Event Listeners Throughout
        input.addEventListener('keydown', (event) => {if(event.key === 'Enter'){
                Search_NY()                                       
            }
        })
    
        submit.addEventListener('click', (event) => { Search_NY() })
        // input focus automatic Search
        input.addEventListener('focus', (event) => { Search_NY.Timed(15) })
        window.addEventListener('click', (event) => { Array.prototype.map.call(document.querySelector('.Wrapper-0-Infos').children, (x) => {x.classList.contains('show') ? x.classList.remove('show') : x}) })
        Array.prototype.map.call(result_t_header.children, ((x) => x.onclick = () => { Sort_By(x) }))
        Array.prototype.map.call(saved_table_header.children, ((x) => x.onclick = () => { Sort_By(x) }))
        input.focus()

        
}

window.onload = SetUp()



