import * as Tools from '/SearchNY_Lottery/AnalysisTools1.js'
import * as Arch from '/SearchNY_Lottery/ReadArchive.js'


function Get_Dates(x, y){return x.filter((x) => x[Tools.Q_Size(y, 'evening_daily','evening_win_4')] !== undefined).map((x) => x[Tools.Q_Size(y, 'midday_daily','midday_win_4')] !== undefined? [[new Date(x['draw_date']), 'Evening'], [new Date(x['draw_date']), 'Midday']] : [[new Date(x['draw_date']), 'Evening']]).flat().map((x) => [x[0].toLocaleDateString(undefined, options), x[1]])
}

const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

const regex = /^(\w+),\s+(\w+)\s+(\d+),\s+(\d{4})$/;


function SetUp(){
    const game = document.getElementById("Select-Game"); const b_check = document.getElementById("Box"); const input = document.getElementById("input"); const table = document.getElementById('table'); const t_header = document.getElementById('T-Header');
    let results = [];

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const drawing = (game.value == '3' ? Arch.NY3_Drawings: Arch.NY4_Drawings)
            const date = (game.value == '3' ? Get_Dates(drawing[0], game.value) : Get_Dates(drawing[0], game.value));
            const data = drawing[1].map((x, i) => [date[i], x, Tools.Box_C(x)])
            let search = input.value.split('')
            console.log(search)
            
            b_check.checked === true? results = Tools.Box_BCode(data, 2, search) : results = data.filter((x) => Tools.Match_ArExact(x[1], search));
            console.log(results)

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
            
            results = results.map((x) => [x, x[0][0].split(regex).concat(x[0][1], x[1].join('')).filter((x) => x !== '')]);

            results.map((x) => 
                {const tr = document.createElement('tr'); 
                    tr.date = new Date(x[0][0][0]); tr.Weekday = tr.date.getDay(); tr.Month = tr.date.getMonth(); tr.Day = tr.date.getDate(); tr.Year = tr.date.getYear(); tr.Time = ['Midday', 'Evening'].indexOf(x[0][0][1]); tr.Result = Number(x[0][1].join(''))
                     x[1].map((y) => {const td = document.createElement('td'); td.className = 't-data';
                        ; td.textContent = y; tr.appendChild(td)}); table.appendChild(tr)})
                     }
        }})

         
        function Sort_By(column){
            const rows = Array.prototype.filter.call(table.children,(x) => x !== t_header);
            const up = String.fromCharCode(8593); const down = String.fromCharCode(8595)
            const sort_by = column.firstElementChild.innerHTML.trimEnd(); 
            const symbol = document.getElementById('sort');
            Array.prototype.map.call(t_header.children, (x) => x.style.color = 'antiquewhite')
           
            if(symbol.innerHTML === '' || column.lastElementChild.id !== 'sort'){
            symbol.innerHTML = up;  column.style.color = 'black'; column.appendChild(symbol);
       
            Array.prototype.sort.call(rows, (a, b) => a?.[sort_by] - b?.[sort_by])
            table.replaceChildren(t_header, ...rows)
            
           } else if(symbol.innerHTML === up){
            symbol.innerHTML = down; column.style.color = 'black'; column.appendChild(symbol);

            Array.prototype.sort.call(rows, (a, b) => b?.[sort_by] - a?.[sort_by])
            table.replaceChildren(t_header, ...rows)
            
            
           } else if(symbol.innerHTML === down){
            symbol.innerHTML = ''; column.style.color = 'antiquewhite'; column.appendChild(symbol);
          
            Array.prototype.sort.call(rows, (a, b) => b.date - a.date)
            table.replaceChildren(t_header, ...rows) 
           }  
            
        }
           
        Array.prototype.map.call(t_header.children, ((x) => x.onclick = () => Sort_By(x)))

}

window.onload = 
SetUp()
