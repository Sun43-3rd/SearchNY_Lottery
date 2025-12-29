
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

export async function Translate(text){
   
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(text)}`;
            
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log("API Response:", data);

            // Extract translated text
            if (Array.isArray(data) && data[0] && Array.isArray(data[0][0])) {
                return data[0].map(sentence => sentence[0]).join(" ");
            } 
            else {
                throw new Error("Unexpected response format");
            }

        } 
        catch (error) {

            console.error("Translation failed:", error.message);
            return "Error during translation.";
        }
        
}

