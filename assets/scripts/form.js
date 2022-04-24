

    import {get, isAlfaNumber, moneyFormat,isMoneyFormat, isNumber} from './functions.js'
    
    import {key, Transaction, TransactionsManager, objsConfig, LSConfig} from './classes.js'

    // verificando se já existe alguma transação feita no lcoal storage
    if(localStorage.keyExists(key)) 
        var transactions = localStorage.getObjs(key)
    else
        var transactions = []

    const ts = new TransactionsManager(transactions)

    // botão de limpar ---------------------------------------------------------
    const btnClear = get('btnClear')
    btnClear.onclick = (e)=> {

        e.preventDefault()
        let rsp = confirm('Deseja apagar todos os dados?')
        if(rsp) ts.clear()
    }

    // formulário e seus elementos ---------------------------------------------

    // formulário
    const form = document.getElementById('form-transaction')

    // campos do formulário
    const transactionType = get('form-transaction-type')
    const transactionProduct = get('form-transaction-product')
    const transactionValue = get('form-transaction-value')

    // tratamento do formulário ------------------------------------------------

    // tratamento ao enviar o formulário
    form.onsubmit = function(e){

        e.preventDefault()

        let tipo = transactionType.value
        let produto = transactionProduct.value
        let valor = transactionValue.value

        // verificando se o campo produto está vazio
        if(!produto){
            return alert('Você deve fornecer o nome da mercadoria')
        } 
        // verificando se o campo produto é alfanumérico
        else if(!isAlfaNumber(produto)){
            return alert('Nome de mercadoria inválido!')
        }  
        // verificando se o campo valor está vazio
        else if(!valor)
            return alert('Você deve fornecer o valor da mercadoria')

        // verificando se campo valor está no formato monetário
        else if(!isMoneyFormat(valor))
            return alert('Formato monetário inválido!')

        // criando um objeto transação
        const transaction = new Transaction(produto, valor.toNumber(), tipo)
        ts.insert(true, transaction)
    }

    // tratamento do campo produto ---------------------------------------------

    // tratamendo ao digitar
    transactionProduct.onkeydown = (e) => {
        if(!isAlfaNumber(e.key)) e.preventDefault()
    }

    // tratamento ao colar
    transactionProduct.onpaste = e => {
        let dado = e.clipboardData.getData('text')
        if(!isAlfaNumber(dado)) e.preventDefault()
    }

   
    transactionValue.onkeypress = (e)=> {

        e.preventDefault()

        if(isNumber(e.key)){
            e.target.value = moneyFormat(e.target.value + e.key)
        }
       
    }

    
    // tratamento do campo valor -----------------------------------------------
    /*transactionValue.onkeypress = function(e){

        let tecla = e.key

        if(tecla.match(/\d/)){

            let valor = e.target.value.replace(/\D/g, '')
            let valorMonetario = (valor / 100).toLocaleString('pt-BR', 
            {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
            })
           
            e.target.value = valorMonetario
        
        }else{
            e.preventDefault()
        }  
    }*/

    // tratamento ao colar
    transactionValue.onpaste = function(e){
        let dado = e.clipboardData.getData('text')
        if(!isMoneyFormat(dado)) e.preventDefault()
    }
