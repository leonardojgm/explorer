let language = "en";
let score_text = score_en;
let end_game_text = end_game_en;
let clossing_in_text = clossing_in_en;

document.getElementById('flag-br').addEventListener('click', () => {
    language = 'pt';

    document.getElementById('menu-play').innerHTML = play_pt_br;
    score_text = score_pt_br;
    end_game_text = end_game_pt_br;
    clossing_in_text = clossing_in_pt_br;
});

document.getElementById('flag-us').addEventListener('click', () => {
    language = 'en';

    document.getElementById('menu-play').innerHTML = play_en;
    score_text = score_en;
    end_game_text = end_game_en;
    clossing_in_text = clossing_in_en;
});