

    // formulário e seus elementos ---------------------------------------------

    // formulário
    const form = document.getElementById('form-transaction')

    // campos do formulário
    const transactionType = get('form-transaction-type')
    const transactionProduct = get('form-transaction-product')
    const transactionValue = get('form-transaction-value')

    function Mascara(e) {

        const value = e.target.value
          .replace(/\D/g, '')
          .replace(/^0*/, '')
          .padStart(3, '0')
          
        console.log(value);
        const p1 = value.slice(0, -2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
        const p2 = value.slice(-2)

        e.target.value = 'R$ ' + p1 + ',' + p2
    }

    transactionValue.onkeydown = function(e){Mascara(e)}

    // tratamento ao enviar o formulário
    form.onsubmit = function(e){

        e.preventDefault()

        let tipo = transactionType.value
        let mercadoria = transactionProduct.value
        let valor = transactionValue.value

        // verificando se os campos estão vazios
        if(!mercadoria){
            alert('Você deve fornecer o nome da mercadoria')
        } 
        else if(!isAlfaNumber(mercadoria)){
            alert('Nome de mercadoria inválido!')
        }  
        else if(!valor)
            alert('Você deve fornecer o valor da mercadoria')

        else if(!isMoneyFormat(valor))
            alert('Formato monetário inválido!')


        // criando um objeto transação
        const transaction = new Transaction(mercadoria, valor, tipo)
    }

    // tratamento ao digitar no campo produto
    transactionProduct.onkeydown = (e) => {
        if(!isAlfaNumber(e.key)) e.preventDefault()
    }

    transactionProduct.onpaste = e => {
        let dado = e.clipboardData.getData('text')
        if(!isAlfaNumber(dado)) e.preventDefault()
    }

    // tratamento ao digitar no campo valor
    /*transactionValue.onkeydown = function(e){

        let tecla = e.key
        let tamanho = this.value.length

        if(isNumber(tecla) || tecla.match(/[,.]/) || tecla == 'Backspace'){

            // se a tecla digitada for Backspace
            if(tecla == 'Backspace'){if(tamanho <= 3) e.preventDefault()}

            // se a tecla digitada for ponto ou vírgula
            if(tecla.match(/[,.]/)){

                e.preventDefault()

                // se o tamanho for maior que 4(R$ x) e não tiver nenhuma vírgula ou ponto ainda
                if(tamanho >= 4 && !this.value.match(/,/g)) this.value += ','
            }
            // lidando com números
            if(isNumber(tecla)){

                e.preventDefault()

                // caracteres inicias
                if(tamanho == 0 | tamanho == 1 || tamanho == 2) 
                    this.value = 'R$ '

                // inserindo a tecla manualmente
                this.value += e.key
            }

        }else{
            e.preventDefault()
        }
        
    }
*/
    // filtrando o paste e copy
    transactionValue.onpaste = function(e){
        let dado = e.clipboardData.getData('text')
        if(!isMoneyFormat(dado)) e.preventDefault()
    }
    
    // funções genéricas -------------------------------------------------------
    function isAlfaNumber(dado){

        const nonRegexAlfaNumber = /[^a-zA-Z \d\-\u00C0-\u00FF]+/gi
        return !nonRegexAlfaNumber.test(dado)
    }

    function isNumber(dado){

        const regexNubmer = /\d/
        return regexNubmer.test(dado)
    }

    function isMoneyFormat(dado){
        const regexMoney = /^([a-zA-Z]+\$ \d+[,\.]\d+)$|^([a-zA-Z]+\$ \d+)$/
        return regexMoney.test(dado)
    }

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

    // verifica se algo é ou não um array
    function isArray(dado){return dado instanceof Array}

    // insere um ou vários elementos dentro de outro
    function insert(parent, ...elementos){

        if(elementos.length == 1 && isArray(elementos)) elementos = elementos[0]

        for(let elemento of elementos) parent.appendChild(elemento)
        return parent
    }

    function moneyFormatToString(string){

        let numPontoVirgula = string.replace(/[^\d\.,]/g, '')

        let numPontos = string.match(/\./g)

        console.log(numPontos);

    }


    // classes -----------------------------------------------------------------

    // objeto representando cada transação do formulário
    class Transaction{

        constructor(name, value, type=0){

            const types = ['buy', 'sale']
            this.name = name
            this.value = value
            this.type = types[type]
        }
    }

    // lida com todas as transações
    class TransactionsManager{

        constructor(containerId, resultadoId, ...transactions){

            // elementos principais
            this.elementoContainer = get(containerId)
            this.elementoResultado = get(resultadoId)
            this.resultado = {total: 0, situação: ''}
            this.transactions = []

            // array de transactions
            if(transactions.length == 1 && isArray(transactions[0]))
            transactions = transactions[0]

            // configurações inicias
            this.insert(transactions)
        }

        // transforma um elemento transaction com um obj transaction
        createHtml(obj){

            const type = obj.type
            const name = obj.name
            const value = obj.value

            // elemento transaction
            const transaction = create('div', 'transaction')

            // partes do elemento transaction
            const transactionType = create('div', `transaction-type ${type}`)
            const productName = create('div', 'product-name', name)
            const productValue = create('div', 'product-value', `R$ ${value}`)

            let elementos = [transactionType, productName, productValue]
            insert(transaction, elementos)

            return transaction
        }

        // transaforma vários objs transaction em elementos transactions
        createHtmls(...objs){

            objs = objs.length == 1 ? objs[0] : objs

            let array = []
            for(let obj of objs) array.push(this.createHtml(obj))
            return array
        }

        // insere um ou vários elementos transaction no container
        insert(...objs){

            // limpando o container
            if(this.transactions.length == 0)
                this.elementoContainer.innerHTML = ''


            if(objs.length == 1 && isArray(objs[0])) objs = objs[0]
            let htmls = this.createHtmls(objs)
            insert(this.elementoContainer, htmls)

            this.updateTransactions(objs)
            this.updateResultado()
        }

        // atualiza o resultado geral das transações
        updateResultado(){


            // Calculando a total das transações
            this.resultado.total = 0

            for(let transaction of this.transactions){

                let value = transaction.value
                if(transaction.type == 'buy') 
                    this.resultado.total -= value
                else 
                    this.resultado.total += value
            }

            // determinando a situação
            const total = this.resultado.total
            if(total < 0) 
                this.resultado.situação = '[Prejuízo]'
            else 
                this.resultado.situação = '[Lucro]'

            // atualizando o elemento resultado
            this.elementoResultado.innerHTML = `
            R$ ${this.resultado.total} ${this.resultado.situação}`
        }

        // atualiza os objs dentro de this.transactions
        updateTransactions(...objs){
            if(objs.length == 1 && isArray(objs)) objs = objs[0]
            for(let obj of objs) this.transactions.push(obj)
        }

        clear(){

            // limpando transactions
            this.transactions = []

            // limpando os elementos do container
            while(this.elementoContainer.children.length > 0)
            this.elementoContainer.children[0].remove()

            // atualizando o objeto resultado
            this.resultado.total = 0
            this.resultado.situação = ''

            // atualizando o elemento resultado
            this.elementoResultado.innerHTML = `R$ 0`

            // inserindo mensagem no container
            this.elementoContainer.innerHTML = 'Nenhuma transação cadastrada'
            this.elementoContainer.style.textAlign = 'center'
        }

    }
   
    // testes de classes
    let t1 = new Transaction('cadeira Elétrica Gamer', 2000, 0)
    let t2 = new Transaction('Celular Rx879', 1000, 1)
    let t3 = new Transaction('Carro Hor Mi', 5000, 0)

    let array = [t1, t2, t3]

    let ts = new TransactionsManager('transactions', 'resultado', array)


    

    

    
    