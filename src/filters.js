var app = angular.module('wt.apps');

/**
 * Converte um valor numérico para uma string.
 * 
 *  * 1 => Sim
 *  * 0 ou outro => Não 
 * 
 * @filter  simnao
 * 
 * @param valor Número inteiro (exemplo 0 ou 1).
 */
app.filter('simnao', function () {
    return function SimNaoFilter(valor) {
        return valor == 1 ? "Sim" : "Não";
    };
});
