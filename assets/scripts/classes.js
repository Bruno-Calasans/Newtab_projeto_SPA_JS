

    import {get, create, insert, isArray, isString} from './functions.js'

    const key = 'transactions'

    // representa uma transação
    class Transaction{

        constructor(name, value, type=0){

            const types = ['buy', 'sale']
            this.name = name
            this.value = value
            this.type = types[type]
        }
    }

    class TransactionsManager{

        constructor(...transactions){

            // elementos principais
            this.elementoContainer = get('transactions')
            this.elementoResultado = get('resultado')
            this.resultado = {total: 0, situação: ''}
            this.transactions = []

            // array de transactions
            if(transactions.length == 1 && isArray(transactions[0]))
            transactions = transactions[0]

            // configurações inicias
            if(transactions.length > 0) this.insert(transactions)
        }

        // transforma um elemento transaction com um obj transaction
        createHtml(obj){

            if(!obj) return null

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

            // verificando o localStorage
            if(localStorage.keyExists(key)){

                localStorage.objsExist(key, objs, 'name', (obj, existe) => {
                    if(!existe) localStorage.insertObjs(key, obj)
                })
            }
              
            else
              localStorage.saveObjs(key, objs)
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

            else if(total == 0) 
                this.resultado.situação = ''

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
            this.elementoResultado.innerHTML = ''

            // inserindo mensagem no container
            this.elementoContainer.innerHTML = 'Nenhuma transação cadastrada'

            // limpando o localstorage
            localStorage.clear()
        }
    }

    // adiciona novos métodos para todo objeto
    class ObjectManager{

        constructor(){this.config()}

        config(){

            // converte um objeto para array
            Object.prototype.toArray = function(){return Object.values(this)}

            Object.prototype.isEqual = function(obj2, key, caseSensitive=true, strict=true){

                let valor1 = this[key]
                let valor2 = obj2[key]

                // diferencia o tipo e o valor
                if(strict){
                
                    // caso sejam strings e não diferencia maiúsculas e minúsculas
                    if(isString(valor1) && isString(valor2) && !caseSensitive)
                        return valor1.toLowerCase() === valor2.toLowerCase()

                    // caso sejam qualquer tipo de dado
                    else
                        return valor1 === valor2
                    
                }

                // diferencia apenas o valor
                else{

                    // caso sejam strings e não diferencia maiúsculas e minúsculas
                    if(isString(valor1) && isString(valor2) && !caseSensitive)
                        return valor1.toLowerCase() == valor2.toLowerCase()
                
                    // caso sejam qualquer tipo de dado
                    else
                        return valor1 == valor2
                }

            }

            String.prototype.toNumber = function(){

                let num = this.replace(/[^\d\.,]/g, '')
        
                let antesVirgula = num.match(/[\d+\.]+(?=,)/g)[0].replace(/\.+/, '')
                let depoisVirgula = num.match(/,\d+/g)[0].replace(/,+/, '.') 
        
                return Number(antesVirgula + depoisVirgula)
            }
                
        }
    }

    // iniciando a classe
    const objsConfig = new ObjectManager()

    // adiciona novos métodos para o LocalStorage
    class LocalStorageManager{

        constructor(){
            // config incial
            this.config()
        }

        // adiciona novos métodos para o local storage
        config(){

            // salva um objeto na Local Storage
            Storage.prototype.saveObj = function (key, obj){

                if(!isObj(obj)) return false
                let json = [JSON.stringify(obj)]
                this.setItem(key, json)
            }

            // salva vários objetos na local storage em forma de array
            Storage.prototype.saveObjs = function(key, ...objs){

                if(objs.length == 1 && isArray(objs[0]))objs = objs[0]
                let array = JSON.stringify(objs)
                this.setItem(key, array)
            }

            // verifica se um objeto existe
            Storage.prototype.objExists = function(key, objComparado, objKey){

                // verificando se a chave existe
                if(!this.keyExists(key)) return null

                let objs = this.getObjs(key)

                for(let obj of objs){

                    let resultado = objComparado.isEqual(obj, objKey, false)
                    if(resultado) return true
                }

                return false
            }

            // verifica se vários objs existem

            Storage.prototype.objsExist = function(key, objs, objKey, cb){

                if(!this.keyExists(key)) return null

                // objetos que serão comparados
                for(let obj of objs){
                    let existe = this.objExists(key, obj, objKey)
                    cb(obj, existe)
                }

            }

            // pega todos os objetos da local storage de uma determinada key
            Storage.prototype.getObjs = function (key){

                // verificando se algum valor para essa chave
                let strObjArray = this.getItem(key)
                if(!strObjArray) return null

                // transformando cada string obj em array
                let objArray = JSON.parse(strObjArray)
                return objArray
            }

            Storage.prototype.keyExists = function (key){
                return this.getItem(key) ? true : false
            }

            // pega um obj a partir da sua chave e index no array de objetos
            Storage.prototype.getObj = function (key, index){

                // verificando se há alguma item com a key fornecida
                if(!this.keyExists(key)) return null

                let objs = this.getObjs(key) // array de objs

                // verificando se há algum número com este index no array
                if(index > objs.length - 1) return null

                return objs[index]
            }

            // atualizando array de objs
            Storage.prototype.insertObjs = function (key, ...objs){

                if(objs.length == 1 && isArray(objs[0])) objs = objs[0]

                // verificando se a key existe
                if(!this.keyExists(key)) return null

                let arrayObjs = this.getObjs(key)
                let novoArray = [...arrayObjs, ...objs]
                this.saveObjs(key, novoArray)
            }

            // remove um objeto do local storage
            Storage.prototype.removeObj = function(key, index){

                // verificando se a chave existe
                if(!this.keyExists(key)) return null

                let objs = this.getObjs(key)

                // verificando se o index existe
                if(index > objs.lenght - 1) return false

                objs.splice(index, 1)
                this.saveObjs(key, objs)
            }

            // altera um objeto
            Storage.prototype.updateObj = function (key, index, novoObj){

                // verificando se a chave existe
                if(!this.keyExists(key)) return null

                let objProcurado = this.getObj(key, index)

                // verificando se o objeto com aquele index existe
                if(!objProcurado) return null
                let objs = this.getObjs(key)

                objs.splice(index, 1, novoObj)
                
                this.saveObjs(key, ...objs)
            }

        }

    }

    // inciando a classe
    const LSConfig = new LocalStorageManager
    export {key, Transaction, TransactionsManager, objsConfig, LSConfig}
