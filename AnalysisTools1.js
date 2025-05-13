
export function Get_Outcomes(start, end, text_true){
    const outcomes = [];
    for(let i = start; i <= end; i++){outcomes.push((text_true === true ? (i < 10 ? `0${i}` : JSON.stringify(i)) : JSON.stringify(i)))}
    return outcomes;
}

export function R_Duplicate(drawing){
    const result = drawing.filter((x, index) => drawing.indexOf(x) === index)
    return result;
}

export function Get_Duplicate(drawing){
const result = drawing.filter((x, index) => drawing.indexOf(x) !== index)
return result;
}

export function Match_ArExact(x, y){
    return (x.every((a, b) => a === y[b]))
}

export function Q_Size(size, option1, option2){
    return (size == 3 ? option1 : size == 4 ? option2: undefined)
}
export function Box_S2(drawing_history, pos_1, end_pos, select){
    const result = drawing_history.filter((x) => x.slice(pos_1, end_pos).sort((a, b) => a - b).join('') === select.sort((a, b) => a - b).join(''));
return result;
}

export function Box_BCode(drawing_history, boxcode_pos = 0, select){
    const result = drawing_history.filter((x) => x[boxcode_pos] === select.sort((a, b) => a - b).join(''));
return result;
}

export function Box_C(array){
    return array.toSorted((a, b) => a - b).join('')
}

export function Box_T(array, size){
    return Q_Size(size, [[0.01, 1], [0.27,  4 / 27], [0.72, 1 / 27]], [[0.001, 1], [0.036, 27 / 256], [0.027, 1 / 16], [0.432, 1 / 64], [0.5040, 1 / 256]]).find((z) => z.includes(array.map((y, id, arr) => RelFreq(y, arr)).reduce((a, b) => a * b)))[0]
}


export function CSV_Array(csv, remove = 1, remove_b = Infinity){
    const rows = csv.trim().split('\n');
    let result = [];
    for (const row of rows) {const values = row.split(',');
      result.push(values);
    }
    result = result.map((x) => x.slice(remove, Infinity)).slice(remove, Infinity)
    let res = result.map((x, i) => x.length === 0 ? i: false).filter((x) => x !== false)
    let result2 = []
    for(let i = 0; i <= res.length; i++){
        result2.push(result.slice((i === 0 ? 0 : (res[i - 1] + 1)), res[i]))

    }
    console.log(result2)
    return result2;
  }
  
 
