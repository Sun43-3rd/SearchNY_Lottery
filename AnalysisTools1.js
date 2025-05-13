
export function Get_Outcomes(start, end, text_true){
    const outcomes = [];
    for(let i = start; i <= end; i++){outcomes.push((text_true === true ? (i < 10 ? `0${i}` : JSON.stringify(i)) : JSON.stringify(i)))}
    return outcomes;
}

export function R_Duplicate(subject){
    const result = subject.filter((x, index) => subject.indexOf(x) === index)
    return result;
}

export function Get_Duplicate(subject){
const result = subject.filter((x, index) => subject.indexOf(x) !== index)
return result;
}

export function Match_ArExact(x, y){
    return (x.every((a, b) => a === y[b]))
}

export function Q_Size(size, y1, y2){
    return (size == 3 ? y1 : size == 4 ? y2: undefined)
}

export function Box_S2(subject, pos_1, end_pos, select){
    const result = subject.filter((x) => x.slice(pos_1, end_pos).sort((a, b) => a - b).join('') === select.sort((a, b) => a - b).join(''));
return result;
}

export function Box_BCode(subject, boxcode_pos = 0, select){
    const result = subject.filter((x) => x[boxcode_pos] === select.sort((a, b) => a - b).join(''));
return result;
}

export function Box_C(array){
    return array.toSorted((a, b) => a - b).join('')
}



 
