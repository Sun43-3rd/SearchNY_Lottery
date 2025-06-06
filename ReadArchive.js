import * as DATANY3 from '/SearchNY_Lottery/NY3.js'
import * as DATANY4 from '/SearchNY_Lottery/NY4.js'

//Data-Collection
function Daily_Array(type, interger, raw){
    let result = [];
    (type == 3 || type == 4) ? result = Object.values(raw[interger]).filter((x, i) => i > 0).map((x) => x.split('')) : 
    type == 10 ? result = [raw[interger]['winning_numbers']]: "INVALID"
    return result;
}

function Seperate(drawings, length){
    let result = []
    for(let i = 0; i <= ((drawings.length - 1) / (length + 1)) ; i++){
        result.push(drawings.slice(i * (length + 1), i * (length + 1) + length))}
    return result}

function Extract_Data(type, size, raw, sheets = false){
    let holder = [];
    if(type == 3 || type == 4){
        for(let i = 0; i <= (size - 1); i++){
            if(sheets){}else{
            const result = Daily_Array(type, i, raw).map((x) =>
                 {return (x.length < type) ? ['0'].map((y) => y.repeat((type - x.length)).split('')).concat(x).flat() : x});
            holder.push(result)}
        }
    }
                
            else if(type == 10){for(let i = 0; i <= size; i++){holder.push(Seperate(Daily_Array(type, i, raw)[0], 2))}}
    return holder.flat();}

const Pick3_Raw = [[await DATANY3.NY3LIVE, false]].map((x) => Extract_Data(3, Object.values(x[0]).length - 1, x[0], x[1]))
const Pick4_Raw = [[await DATANY4.NY4LIVE, false]].map((x) => Extract_Data(4, Object.values(x[0]).length - 1, x[0], x[1]))

export const NY3_Drawings = [await DATANY3.NY3LIVE, Pick3_Raw[0]];
export const NY4_Drawings = [await DATANY4.NY4LIVE, Pick4_Raw[0]];

