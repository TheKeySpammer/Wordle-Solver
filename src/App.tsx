import React from "react";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Container } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import {
    ButtonGroup,
    FormControl,
    Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
} from "@mui/material";
import { solveWordle, GuessType } from "./helper/wordle";

const colorToThemeColor = (color: number, theme: Theme) => {
    if (color === 0) {
        return theme.palette.success.light;
    } else if (color === 1) {
        return theme.palette.warning.light;
    } else {
        return "#bbb";
    }
};

const theme = createTheme({
    spacing: 8,
});

/**
 * 0 -> success
 * 1 -> warning
 * 2 -> gray
 */


const App: React.FC = () => {
    const [badLetters, setBadLetters] = React.useState("");
    const [wordLength, setWordLength] = React.useState(5);
    const [currentGuess, setCurrentGuess] = React.useState<GuessType[]>(
        Array(5).fill({ guess: "", color: 2 })
    );

    const [loading, setLoading] = React.useState(true);
    const [solution, setSolution] = React.useState<string[]>([]);

    React.useEffect(() => {
        setLoading(true);
        let shouldUpdate = true;
        solveWordle(badLetters, currentGuess).then((solution) => {
            if (shouldUpdate) {
                setSolution(solution);
                setLoading(false);
            }
        });
        return () => { shouldUpdate = false; }
    }, [badLetters, currentGuess]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Box className='mt-8'>
                        <Stack spacing={4}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    textAlign="center"
                                    component="div"
                                    gutterBottom
                                >
                                    Wordle Solver
                                </Typography>
                                <Typography
                                    variant="body1"
                                    textAlign={"center"}
                                    component="div"
                                    gutterBottom
                                >
                                    Solve wordle puzzles using this simple tool.
                                </Typography>
                            </Box>
                            <Box sx={{ width: 150 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="word-length-label">
                                        Word Length
                                    </InputLabel>
                                    <Select
                                        size='small'
                                        labelId="word-length-label"
                                        id="word-length-select"
                                        label="Word Length"
                                        value={wordLength}
                                        onChange={(e) => {
                                            setWordLength(
                                                e.target.value as number
                                            );
                                            setCurrentGuess(
                                                Array(
                                                    e.target.value as number
                                                ).fill({ guess: "", color: 2 })
                                            );
                                        }}
                                    >
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={6}>6</MenuItem>
                                        <MenuItem value={7}>7</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box>
                                <Typography variant="h6">
                                    Current Guess
                                </Typography>
                                <Typography variant="body1">
                                    Select guess type (Green, Gray, Yellow)
                                </Typography>
                                <ButtonGroup>
                                    {currentGuess.map((guess, index) => (
                                        <Box
                                            key={index}
                                            className="flex flex-col justify-center items-center"
                                        >
                                            <TextField
                                                focused={guess.color !== 2}
                                                color={
                                                    guess.color === 2
                                                        ? "info"
                                                        : guess.color === 0
                                                        ? "success"
                                                        : "warning"
                                                }
                                                value={guess.guess}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    if (value.length > 1) {
                                                        value = value.slice(
                                                            0,
                                                            1
                                                        );
                                                    }
                                                    setCurrentGuess((prev) => {
                                                        let newGuess = [
                                                            ...prev,
                                                        ];
                                                        if (value.length === 0) {
                                                            newGuess[index] = {
                                                                color: 2,
                                                                guess: value,
                                                            };
                                                        } else {
                                                            newGuess[index] = {
                                                                color: guess.color,
                                                                guess: value,
                                                            };
                                                        }
                                                        return newGuess;
                                                    });
                                                }}
                                                inputProps={{
                                                    style: {
                                                        textAlign: "center",
                                                        fontSize: 20,
                                                        padding: "12px 4px",
                                                    },
                                                }}
                                            />
                                            <Box
                                                onClick={() => {
                                                    setCurrentGuess((prev) => {
                                                        let newGuess = [
                                                            ...prev,
                                                        ];
                                                        newGuess[index] = {
                                                            ...newGuess[index],
                                                            color:
                                                                (newGuess[index]
                                                                    .color +
                                                                    1) %
                                                                3,
                                                        };
                                                        return newGuess;
                                                    });
                                                }}
                                                sx={{
                                                    width:
                                                        wordLength === 5
                                                            ? 50
                                                            : 40,
                                                    height: 20,
                                                    backgroundColor:
                                                        colorToThemeColor(
                                                            guess.color,
                                                            theme
                                                        ),
                                                    marginTop: "3px",
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </ButtonGroup>
                            </Box>
                            <Box paddingTop={"8px"} paddingBottom={"8px"}>
                                <TextField
                                    size="small"
                                    color="secondary"
                                    value={badLetters}
                                    onChange={(event) => {
                                        setBadLetters(
                                            event.currentTarget.value
                                        );
                                    }}
                                    className="w-full"
                                    label="Enter Bad Letters"
                                    variant="outlined"
                                />
                                {badLetters.trim().length > 0 && (
                                    <Typography variant="h6">
                                        Bad Letters
                                    </Typography>
                                )}
                                <Box className="flex flex-wrap justify-center items-center">
                                    {badLetters
                                        .split("")
                                        .map((letter, index) => {
                                            if (
                                                letter.trim().length === 0 ||
                                                !isNaN(parseInt(letter))
                                            ) {
                                                return null;
                                            }
                                            return (
                                                <Typography
                                                    className="p-1"
                                                    key={index}
                                                    variant="body1"
                                                >
                                                    {letter.toUpperCase()}
                                                </Typography>
                                            );
                                        })}
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                    <Box>
                        <Stack spacing={4}>
                            <Box>
                                {badLetters.length === 0 ||
                                currentGuess.filter((g) => g.guess.length !== 0)
                                    .length > 0 ? (
                                    <Typography
                                        marginTop={1}
                                        marginBottom={1}
                                        variant="h6"
                                    >
                                        Good Starting Guess
                                    </Typography>
                                ) : (
                                    <Typography
                                        marginTop={1}
                                        marginBottom={1}
                                        variant="h6"
                                    >
                                        Solutions
                                    </Typography>
                                )}
                                {!loading && (
                                    <Grid
                                        container
                                        spacing={3}
                                        sx={{ overflow: "auto", marginTop: "2px", width: "95vw", maxWidth: "420px", overflowX: 'hidden' }}
                                    >
                                        <Grid item xs={3}>
                                            <Stack spacing={"5px"}>
                                                {solution.map((s, index) => {
                                                    if (
                                                        index <
                                                        solution.length / 4
                                                    ) {
                                                        return (
                                                            <Typography key={index}>
                                                                {s}
                                                            </Typography>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Stack spacing={"5px"}>
                                                {solution.map((s, index) => {
                                                    if (
                                                        index >=
                                                            solution.length / 4 &&
                                                        index <
                                                            (solution.length * 2) /
                                                                4
                                                    ) {
                                                        return (
                                                            <Typography key={index}>
                                                                {s}
                                                            </Typography>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Stack spacing={"5px"}>
                                                {solution.map((s, index) => {
                                                    if (
                                                        index >=
                                                            (solution.length * 2) /
                                                                4 &&
                                                        index <
                                                            (solution.length * 3) /
                                                                4
                                                    ) {
                                                        return (
                                                            <Typography key={index}>
                                                                {s}
                                                            </Typography>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Stack spacing={"5px"}>
                                                {solution.map((s, index) => {
                                                    if (
                                                        index >=
                                                            (solution.length * 3) /
                                                                4 &&
                                                        index < solution.length
                                                    ) {
                                                        return (
                                                            <Typography key={index}>
                                                                {s}
                                                            </Typography>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )}
                                {loading && <LinearProgress />}
                            </Box>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default App;
