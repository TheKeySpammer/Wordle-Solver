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


export const solveWordle = async (badLettersStr: string, guess: Array<GuessType>) => {
    const yellowLetters = guess
    .filter((g) => g.color === 1)
    .map((g) => g.guess);


    const greenLetters = guess.map((g) => {
        if (g.color === 0) {
            return g.guess;
        } else {
            return "";
        }
    });

    let badLetters = badLettersStr
        .split("")
        .filter((l) => l.trim() !== "" || !isNaN(parseInt(l)))
        .map((l) => l.trim().toLowerCase());



    let words = CommonWords;
    const badLettersLength = badLetters.length;

    let pattern = '';
    for (let yellow of yellowLetters) {
        if (yellow.trim() !== '') {
            pattern +=  `(?=.*?${yellow.toLowerCase()})`;
        }
    }

    for (let green of greenLetters) {
        if (green === '') {
            pattern += "\\w";
        } else {
            pattern += green.toLowerCase();
        }
    }

    pattern = `^${pattern}$`;
    const regex = new RegExp(pattern);

    const solution = [];

    for (let word of words) {
        if (badLettersLength > 0 && check_arrays_have_common_element(badLetters, word.split(''))) {
            continue;
        }
        if (regex.test(word)) {
            solution.push(word);
        }
    }
    if (solution.length < 8) {
        words = AllWords;
        for (let word of words) {
            if (badLettersLength > 0 && check_arrays_have_common_element(badLetters, word.split(''))) {
                continue;
            }
            if (regex.test(word)) {
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