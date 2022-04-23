
    
    // funcções para DOM -------------------------------------------------------
    
    // pega um elemento por ID
    function get(id){return document.getElementById(id)}
    
    // pega um elemento por seletor CSS
    function selector(selector, all=false){
        if(all) return document.querySelector(selector)
        return document.querySelector(selector)
    }

    // cria um elemento html com determinada classe e innerrHTML
    function create(tag, classe, html){

        const elemento = document.createElement(tag)
        if(classe) elemento.className = classe
        if(html) elemento.innerHTML = html
        return elemento
    }

    // insere um ou vários elementos dentro de outro
    function insert(parent, ...elementos){

        if(elementos.length == 1 && isArray(elementos)) elementos = elementos[0]
        for(let elemento of elementos) parent.appendChild(elemento)
        return parent
    }


    // funcões de verificação --------------------------------------------------

    function isArray(dado){return dado instanceof Array}
    function isObj(dado){return dado instanceof Object}

    function isNumber(dado){
        const regexNubmer = /\d/
        return regexNubmer.test(dado)
    }

    function isMoneyFormat(dado){
        const regexMoney = /([a-zA-Z]+\$ \d+[,\.]\d+)|([a-zA-Z]+\$ \d+)/
        return regexMoney.test(dado)
    }

    