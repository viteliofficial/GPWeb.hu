
var hónapja = "3";
var napja = "3";

var most_date = new Date();
var most_hónap = most_date.getMonth() + 1;
var most_nap = most_date.getDate();

var ma = document.getElementById("ma");
var id = document.getElementById("szuletesnap");

if(most_hónap == hónapja){
    if(most_nap == napja)
    ma.style.display = 'block';
}