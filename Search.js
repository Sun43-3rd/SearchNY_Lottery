import * as Tools from '/SearchNY_Lottery/Tools.js'
import * as Arch from '/SearchNY_Lottery/ReadArchive.js'

function SetUp(){
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    function Get_Dates(x, y){return x.filter((x) => x[(y == 3 ? 'evening_daily':'evening_win_4')] !== undefined).map((x) => x[(y == 3 ? 'midday_daily':'midday_win_4')] !== undefined? [[new Date(x['draw_date']), 'Evening'], [new Date(x['draw_date']), 'Midday']] : [[new Date(x['draw_date']), 'Evening']]).flat().map((x) => [x[0].toLocaleDateString('en-US', options), x[1]])
    }

    const game = document.getElementById("Select-Game"); const b_check = document.getElementById("Box"); const input = document.getElementById("input"); const submit = document.getElementById("Submit"); const table = document.getElementById('table'); const t_header = document.getElementById('T-Header');
    const symbol = document.getElementById('sort'); let results = [];

    function Search_NY(){
        
        let search = input.value;
        location.hash = input.value;

        const drawing = (game.value == '3' ? Arch.NY3_Drawings: game.value == '4' ? Arch.NY4_Drawings : isNaN())
        const date = (game.value == '3' || game.value == '4' ? Get_Dates(drawing[0], game.value) : isNaN());
        const data = (game.value == '3' || game.value == '4' ? drawing[1].map((x, i) => [date[i], x, Tools.Box_C(x)]) : isNaN())
        


        
            if((search.search(/[A-Za-z]/) !== '!' && search.search(/[A-Za-z]/) !== -1) || search.toLowerCase().includes('date'))
                {const new_search = (!search.toLowerCase().includes('date') ? search.toLowerCase() : (search.toLowerCase().replaceAll(" ", "").replace('date', "").length <= 2 ? " " + search.toLowerCase().replaceAll(" ", "").replace('date', "") + "," : search.toLowerCase().replaceAll(" ", "").replace('date', "")))
                    results = data.filter((x) => x[0].join(' ').toLowerCase().includes(new_search)); 
            }

            else{
                search = search.split('')
                b_check.checked === true? results = Tools.Box_BCode(data, 2, search) : results = (search.length < game.value ? data.filter((x) => x[1].join('').includes(search.join(''))) : data.filter((x) => Tools.Match_ArExact(x[1], search)))
            };
            
           Array.prototype.filter.call(table.children, (x) => x.id !== 'T-Header' && x.id !== 'NA').map((x) => x.remove())
            
            if(results.length === 0){
                const span = document.createElement('span'); span.id ='NA'; span.innerHTML = 'N/A'; span.style.fontSize = '24pt'; 
                
                if(Array.prototype.find.call(table.children, (x) => x.id === 'NA') !== undefined){  
                    document.getElementById('NA').toggleAttribute('hidden')
                    setTimeout(() => {document.getElementById('NA').toggleAttribute('hidden');}, 500);
                    }
                    else{table.appendChild(span)}
                }

           else{
               Array.prototype.filter.call(table.children, (x) => x.id !== 'T-Header').map((x) => x.remove());
               
               results.map((x) => 
                {const tr = document.createElement('tr'); 
                    tr.date = new Date(x[0][0]); 
                    tr.Weekday = [tr.date.getDay(), Intl.DateTimeFormat('en-US', {'weekday': 'long'}).format(tr.date)]; tr.Month = [tr.date.getMonth(), Intl.DateTimeFormat('en-US', {'month': 'long'}).format(tr.date)]; tr.Day = [tr.date.getDate(), Intl.DateTimeFormat('en-US', {'day': 'numeric'}).format(tr.date)]; tr.Year = [tr.date.getYear(), Intl.DateTimeFormat('en-US', {'year': 'numeric'}).format(tr.date)]; tr.Time = [['Midday', 'Evening'].indexOf(x[0][1]), x[0][1]]; tr.Result = [Number(x[1].join('')), x[1].join('')];
                     [tr.Weekday, tr.Month, tr.Day, tr.Year, tr.Time, tr.Result].map((x) => x[1]).map((y) => {const td = document.createElement('td'); td.className = 't-data';
                    td.textContent = y; tr.appendChild(td)}); table.appendChild(tr)})
               }
                     // Erase Sort // 
                symbol.innerHTML === '' 
                Array.prototype.map.call(t_header.children, (x) => x.style.color = 'antiquewhite')
            
    }
         
    function Sort_By(column){
        const rows = Array.prototype.filter.call(table.children,(x) => x !== t_header);
        const up = String.fromCharCode(8593); const down = String.fromCharCode(8595)
        const sort_by = column.firstElementChild.innerHTML.trimEnd(); 
            
        Array.prototype.map.call(t_header.children, (x) => x.style.color = 'white')
           
        if(symbol.innerHTML === '' || column.lastElementChild.id !== 'sort'){
            symbol.innerHTML = up;  column.style.color = 'silver'; column.appendChild(symbol);
       
            Array.prototype.sort.call(rows, (a, b) => a?.[sort_by][0] - b?.[sort_by][0])
            table.replaceChildren(t_header, ...rows)
            
        } 

        else if(symbol.innerHTML === up){
            symbol.innerHTML = down; column.style.color = 'silver'; column.appendChild(symbol);

            Array.prototype.sort.call(rows, (a, b) => b?.[sort_by][0] - a?.[sort_by][0])
            table.replaceChildren(t_header, ...rows)
                
        } 

        else if(symbol.innerHTML === down){
            symbol.innerHTML = ''; column.style.color = 'white'; column.appendChild(symbol);
          
            Array.prototype.sort.call(rows, (a, b) => b.date - a.date)
            table.replaceChildren(t_header, ...rows) 
          
        }  
            
    }
        
        input.addEventListener('keydown', (event) => {if(event.key === 'Enter'){Search_NY()}})
        submit.addEventListener('click', (event) => {Search_NY()})
        window.addEventListener('click', (event) => {Array.prototype.map.call(document.querySelector('.Wrapper-0-Infos').children, (x) => {x.classList.contains('show') ? x.classList.remove('show') : x})})
        Array.prototype.map.call(t_header.children, ((x) => x.onclick = () => {Sort_By(x)}))
        input.focus()
       
}

 
window.onload = SetUp()
