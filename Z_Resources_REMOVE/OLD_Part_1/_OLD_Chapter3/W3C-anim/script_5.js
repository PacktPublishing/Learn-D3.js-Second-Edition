var x   = 0.0;
var fim = 400.0;
var barquinho;

function iniciarMovimento(evt) {
    barquinho = evt.target;
    mover();
}
function mover() {
    if (x >= fim) {
        return;
    }
    x = x + 1;
    
    barquinho.setAttributeNS(null, 'transform', "translate(" + x + ",0)");
    if (x > 50) {
        barquinho.setAttributeNS(null, 'opacity', (fim - x) / fim);
    }
    setTimeout("mover()", 30);
}