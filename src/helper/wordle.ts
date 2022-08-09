import CommonWords from '../assets/common.json';
import AllWords from '../assets/words.json';
import _ from 'lodash';


export type GuessType = {
    guess: string;
    color: number;
};

const check_arrays_have_common_element = (arr1: string[], arr2: string[]) => {
    return _.intersection(arr1, arr2).length > 0;
}

const check_yellow_letter_not_same_position = (word:string, yellow: string[]) => {
    for (let i = 0; i < word.length; i++) {
        if (word[i] === yellow[i]) {
            return false;
        }
    }
    return true;
}


export const solveWordle = async (badLettersStr: string, guess: Array<GuessType>) => {
    const yellowLetters = guess
    .map((g) => {
        if (g.color === 1) {
            return g.guess.toLowerCase();
        } else {
            return '';
        }
    });


    const greenLetters = guess.map((g) => {
        if (g.color === 0) {
            return g.guess.toLowerCase();
        } else {
            return '';
        }
    });

    let badLetters = badLettersStr
        .split("")
        .map((l) => l.trim().toLowerCase())
        .filter((l) => l !== "" && isNaN(parseInt(l)) && !yellowLetters.includes(l.toLowerCase()) && !greenLetters.includes(l.toLowerCase()) )
        


    let words = CommonWords;
    const badLettersLength = badLetters.length;

    let pattern = '';
    for (let yellow of yellowLetters) {
        if (yellow.trim() !== '') {
            pattern +=  `(?=.*?${yellow})`;
        }
    }

    for (let green of greenLetters) {
        if (green === '') {
            pattern += "\\w";
        } else {
            pattern += green;
        }
    }

    pattern = `^${pattern}$`;
    const regex = new RegExp(pattern);

    const solution = [];

    for (let word of words) {
        if (badLettersLength > 0 && check_arrays_have_common_element(badLetters, word.split(''))) {
            continue;
        }
        if (regex.test(word) && check_yellow_letter_not_same_position(word, yellowLetters)) {
            solution.push(word);
        }
    }
    if (solution.length < 8) {
        words = AllWords;
        for (let word of words) {
            if (badLettersLength > 0 && check_arrays_have_common_element(badLetters, word.split(''))) {
                continue;
            }
            if (regex.test(word) && check_yellow_letter_not_same_position(word, yellowLetters)) {
                solution.push(word);
            }
        }
    }

    if (badLetters.length === 0 && greenLetters.filter(g => g !== '').length === 0 && yellowLetters.length === 0) {
        // shuffle solution
        return _.shuffle(solution);
    }

    return solution;
}